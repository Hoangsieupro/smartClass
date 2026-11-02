export type UserRole = 'teacher' | 'admin' | 'student';

export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  school?: string;
  subject?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: AppUserProfile | null;
  loading: boolean;
  error: string | null;
}
