import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  School,
  BookOpen,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { AppUserProfile, UserRole } from '../../types/auth';
import {
  registerWithEmailPassword,
  loginWithEmailPassword,
  loginWithGoogle,
} from '../../firebase/services';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: AppUserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [school, setSchool] = useState('THCS Chu Văn An');
  const [subject, setSubject] = useState('Toán học');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Account Helper
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const demoProfile: AppUserProfile = {
        uid: 'teacher_demo_01',
        email: 'giaovien.toan@smartschool.edu.vn',
        displayName: 'Thầy Nguyễn Văn Nam (Tổ trưởng Toán)',
        role: 'teacher',
        school: 'THCS Chu Văn An',
        subject: 'Toán học',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      onAuthSuccess(demoProfile);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi đăng nhập nhanh');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await loginWithGoogle();
      onAuthSuccess(profile);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể đăng nhập bằng Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (mode === 'register') {
      if (!displayName.trim()) {
        setErrorMessage('Vui lòng nhập họ và tên của bạn.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const profile = await registerWithEmailPassword(
          email,
          password,
          displayName,
          role,
          school,
          subject
        );
        onAuthSuccess(profile);
        onClose();
      } else {
        const profile = await loginWithEmailPassword(email, password);
        onAuthSuccess(profile);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Thao tác không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0c1424] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-sm shadow-cyan-950">
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Hệ thống Quản lý lớp học & Thời khóa biểu thông minh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Đăng nhập vs Đăng ký */}
        <div className="flex p-1 bg-[#080f1e] border border-slate-800 rounded-xl mt-3.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 py-3.5 space-y-3 text-xs sm:text-sm">
          {/* Registration Extra Fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Họ và tên của bạn <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="VD: Thầy Nguyễn Văn Nam"
                    className="w-full bg-[#080f1e] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Vai trò trong hệ thống <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                        : 'bg-[#080f1e] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🎓 Giáo viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                        : 'bg-[#080f1e] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👨‍🎓 Học sinh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      role === 'admin'
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                        : 'bg-[#080f1e] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🛡️ Quản trị</span>
                  </button>
                </div>
              </div>

              {/* School and Subject */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">
                    Trường học
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="THCS Chu Văn An"
                    className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-xs">
                    Môn phụ trách
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Toán học"
                    className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email field */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Địa chỉ Email <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="giaovien@school.edu.vn"
                className="w-full bg-[#080f1e] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Mật khẩu <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full bg-[#080f1e] border border-slate-700 rounded-lg pl-9 pr-9 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password for Register */}
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Xác nhận lại mật khẩu <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu vừa nhập"
                  className="w-full bg-[#080f1e] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-950 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý tài khoản...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Ngay</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Tạo Tài Khoản Mới</span>
              </>
            )}
          </button>

          {/* Google OAuth Login Button */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-slate-500 text-[11px]">hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-xl bg-[#080f1e] border border-slate-700 hover:border-cyan-400/60 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập với Google</span>
            </button>
          </div>

          {/* 1-Click Demo Teacher Account */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
            >
              🚀 Trải nghiệm nhanh với tài khoản Giáo viên mẫu
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 text-center text-[11px] text-slate-500 shrink-0">
          Dữ liệu được lưu trữ và bảo mật trên Firebase Cloud
        </div>
      </div>
    </div>
  );
};
