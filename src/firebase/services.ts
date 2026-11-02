import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { TimetableSchedule } from '../types/timetable';
import { QuestionItem } from '../types/questionBank';
import { AppUserProfile, UserRole } from '../types/auth';

const LOCAL_REGISTERED_USERS_KEY = 'smart_classroom_local_users';
const LOCAL_ACTIVE_USER_KEY = 'smart_classroom_active_user';

// Helper to manage local registered users fallback
function getLocalUsers(): Record<string, { password: string; profile: AppUserProfile }> {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUser(email: string, password: string, profile: AppUserProfile) {
  try {
    const current = getLocalUsers();
    current[email.toLowerCase()] = { password, profile };
    localStorage.setItem(LOCAL_REGISTERED_USERS_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Could not save local user fallback:', e);
  }
}

// Get cached active user
export function getSavedActiveUser(): AppUserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSavedActiveUser(profile: AppUserProfile | null) {
  try {
    if (profile) {
      localStorage.setItem(LOCAL_ACTIVE_USER_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_ACTIVE_USER_KEY);
    }
  } catch (e) {
    console.warn('Could not set saved active user:', e);
  }
}

// ================= AUTHENTICATION SERVICES =================

/**
 * Register a new user with Email, Password, Name, Role and School
 */
export async function registerWithEmailPassword(
  email: string,
  pass: string,
  displayName: string,
  role: UserRole = 'teacher',
  school: string = 'THCS Chu Văn An',
  subject: string = 'Toán học'
): Promise<AppUserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Attempt Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
    const fbUser = userCredential.user;

    // Update display name on Firebase Auth
    await updateProfile(fbUser, { displayName });

    const profile: AppUserProfile = {
      uid: fbUser.uid,
      email: normalizedEmail,
      displayName,
      role,
      school,
      subject,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Save profile to Firestore users collection
    await saveUserProfileToCloud(profile);
    saveLocalUser(normalizedEmail, pass, profile);
    setSavedActiveUser(profile);

    return profile;
  } catch (error: any) {
    console.warn('Firebase email registration error:', error?.code, error?.message);

    // If Firebase auth throws operation-not-allowed or similar configuration issue,
    // support local registration fallback so the user is never blocked
    if (
      error?.code === 'auth/operation-not-allowed' ||
      error?.code === 'auth/configuration-not-found' ||
      error?.code === 'auth/network-request-failed' ||
      error?.message?.includes('operation-not-allowed')
    ) {
      const localUsers = getLocalUsers();
      if (localUsers[normalizedEmail]) {
        throw new Error('Email này đã được đăng ký. Vui lòng chọn Đăng nhập.');
      }

      const fallbackUid = `user_${Date.now()}`;
      const profile: AppUserProfile = {
        uid: fallbackUid,
        email: normalizedEmail,
        displayName,
        role,
        school,
        subject,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      saveLocalUser(normalizedEmail, pass, profile);
      setSavedActiveUser(profile);
      return profile;
    }

    if (error?.code === 'auth/email-already-in-use') {
      throw new Error('Địa chỉ email này đã được sử dụng bởi tài khoản khác.');
    }
    if (error?.code === 'auth/weak-password') {
      throw new Error('Mật khẩu quá yếu. Vui lòng nhập ít nhất 6 ký tự.');
    }
    if (error?.code === 'auth/invalid-email') {
      throw new Error('Địa chỉ email không đúng định dạng.');
    }

    throw new Error(error?.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
  }
}

/**
 * Login with Email and Password
 */
export async function loginWithEmailPassword(
  email: string,
  pass: string
): Promise<AppUserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Attempt Firebase sign in
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    const fbUser = userCredential.user;

    // Fetch existing profile from Cloud
    let profile = await getUserProfileFromCloud(fbUser.uid);
    if (!profile) {
      profile = {
        uid: fbUser.uid,
        email: normalizedEmail,
        displayName: fbUser.displayName || 'Giáo viên',
        role: 'teacher',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      await saveUserProfileToCloud(profile);
    }

    setSavedActiveUser(profile);
    return profile;
  } catch (error: any) {
    console.warn('Firebase email login error:', error?.code, error?.message);

    // Fallback: Check local registered accounts
    const localUsers = getLocalUsers();
    const localUser = localUsers[normalizedEmail];
    if (localUser) {
      if (localUser.password === pass) {
        const updated = {
          ...localUser.profile,
          lastLoginAt: new Date().toISOString(),
        };
        setSavedActiveUser(updated);
        return updated;
      } else {
        throw new Error('Mật khẩu không chính xác.');
      }
    }

    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }
    if (error?.code === 'auth/wrong-password') {
      throw new Error('Mật khẩu không chính xác.');
    }
    if (error?.code === 'auth/invalid-email') {
      throw new Error('Định dạng email không hợp lệ.');
    }

    throw new Error(error?.message || 'Đăng nhập thất bại.');
  }
}

/**
 * Login with Google OAuth popup
 */
export async function loginWithGoogle(): Promise<AppUserProfile> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const profile: AppUserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Giáo viên',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: 'teacher',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await saveUserProfileToCloud(profile).catch((err) =>
      console.warn('Could not save user profile to firestore:', err)
    );
    setSavedActiveUser(profile);
    return profile;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Logout User
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('SignOut error:', e);
  } finally {
    setSavedActiveUser(null);
  }
}

/**
 * Save user profile to Firestore
 */
export async function saveUserProfileToCloud(profile: AppUserProfile): Promise<void> {
  const docPath = `users/${profile.uid}`;
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, profile, { merge: true });
  } catch (error) {
    console.warn('Firestore user profile save error:', error);
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfileFromCloud(uid: string): Promise<AppUserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as AppUserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from cloud:', error);
    return null;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ================= TIMETABLE FIRESTORE SERVICES =================
const TIMETABLES_COLLECTION = 'timetables';

export async function fetchAllTimetablesFromCloud(): Promise<Record<string, TimetableSchedule>> {
  try {
    const querySnapshot = await getDocs(collection(db, TIMETABLES_COLLECTION));
    const result: Record<string, TimetableSchedule> = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as TimetableSchedule;
      if (data && data.targetId) {
        result[data.targetId] = data;
      }
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, TIMETABLES_COLLECTION);
  }
}

export async function saveTimetableToCloud(schedule: TimetableSchedule): Promise<void> {
  const docPath = `${TIMETABLES_COLLECTION}/${schedule.targetId}`;
  try {
    const docRef = doc(db, TIMETABLES_COLLECTION, schedule.targetId);
    await setDoc(docRef, {
      ...schedule,
      updatedAt: new Date().toISOString(),
      authorId: auth.currentUser?.uid || 'anonymous',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// ================= QUESTION BANK FIRESTORE SERVICES =================
const QUESTIONS_COLLECTION = 'questions';

export async function fetchAllQuestionsFromCloud(): Promise<QuestionItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, QUESTIONS_COLLECTION));
    const list: QuestionItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as QuestionItem;
      if (data) {
        list.push(data);
      }
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, QUESTIONS_COLLECTION);
  }
}

export async function saveQuestionToCloud(question: QuestionItem): Promise<void> {
  const docPath = `${QUESTIONS_COLLECTION}/${question.id}`;
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, question.id);
    await setDoc(docRef, {
      ...question,
      authorId: auth.currentUser?.uid || 'anonymous',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteQuestionFromCloud(questionId: string): Promise<void> {
  const docPath = `${QUESTIONS_COLLECTION}/${questionId}`;
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
