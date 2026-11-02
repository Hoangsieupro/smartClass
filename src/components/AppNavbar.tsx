import React, { useState } from 'react';
import {
  School,
  Calendar,
  GraduationCap,
  Building2,
  Cloud,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { MainNavSection } from '../types/questionBank';
import { AppUserProfile } from '../types/auth';

interface AppNavbarProps {
  activeSection: MainNavSection;
  onSectionChange: (section: MainNavSection) => void;
  activeTeachingSubLabel?: string;
  onOpenBuildingLayout?: () => void;
  currentUser?: AppUserProfile | null;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
  isCloudSynced?: boolean;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  activeSection,
  onSectionChange,
  activeTeachingSubLabel,
  onOpenBuildingLayout,
  currentUser,
  onOpenAuthModal,
  onLogout,
  isCloudSynced = true,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="bg-[#091020] border-b border-cyan-500/30 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                <span>Quản lý lớp học thông minh</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Modules: "Dạy và Học" & "Thời khóa biểu" */}
          <div className="flex items-center gap-1 p-1 bg-[#0c1424] border border-cyan-500/20 rounded-xl">
            {/* DẠY VÀ HỌC */}
            <button
              onClick={() => onSectionChange('teaching')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeSection === 'teaching'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>DẠY VÀ HỌC</span>
              {activeSection === 'teaching' && activeTeachingSubLabel && (
                <span className="hidden lg:inline text-[11px] bg-slate-900/30 px-1.5 py-0.2 rounded font-semibold text-slate-950">
                  {activeTeachingSubLabel}
                </span>
              )}
            </button>

            {/* THỜI KHÓA BIỂU */}
            <button
              onClick={() => onSectionChange('timetable')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeSection === 'timetable'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Thời khóa biểu</span>
            </button>
          </div>

          {/* Right Action: Sơ đồ nhà, Cloud Badge, Đăng nhập / Đăng ký / User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Firebase Cloud Sync Badge */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium"
              title="Đã kết nối Firebase Firestore Cloud Database"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Firebase Cloud</span>
            </div>

            {/* Sơ đồ căn nhà 4 tầng */}
            {onOpenBuildingLayout && (
              <button
                onClick={onOpenBuildingLayout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#112038] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/70 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Xem sơ đồ công năng căn nhà 4 tầng"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Mặt bằng căn nhà</span>
              </button>
            )}

            {/* AUTH SECTION */}
            {currentUser ? (
              /* User is logged in: show Avatar, Name, Role and Logout */
              <div className="relative">
                <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 border-l border-slate-800">
                  <button
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-400 object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                        {currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'GV'}
                      </div>
                    )}
                    <div className="hidden lg:block">
                      <div className="text-xs font-bold text-white truncate max-w-[130px] leading-tight">
                        {currentUser.displayName || 'Giáo viên'}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-medium">
                        {currentUser.role === 'admin' ? '🛡️ Quản trị viên' : currentUser.role === 'student' ? '👨‍🎓 Học sinh' : '🎓 Giáo viên'}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                  </button>

                  {/* Easy 1-click Logout Button directly in Navbar */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/60 hover:text-white transition-all cursor-pointer"
                      title="Đăng xuất khỏi tài khoản"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                  )}
                </div>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0c1424] border border-cyan-500/40 rounded-xl shadow-2xl p-4 text-xs z-50 animate-in fade-in">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-cyan-600/30 border border-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-sm">
                        {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate text-sm">
                          {currentUser.displayName}
                        </div>
                        <div className="text-slate-400 truncate text-[11px]">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    <div className="py-2.5 space-y-1.5 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vai trò:</span>
                        <span className="font-semibold text-cyan-300">
                          {currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.role === 'student' ? 'Học sinh' : 'Giáo viên bộ môn'}
                        </span>
                      </div>
                      {currentUser.school && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Trường:</span>
                          <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                            {currentUser.school}
                          </span>
                        </div>
                      )}
                      {currentUser.subject && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bộ môn:</span>
                          <span className="font-semibold text-slate-200">
                            {currentUser.subject}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User is not logged in: Show both "Đăng nhập" and "Đăng ký" buttons */
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Đăng ký */}
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0d1c33] border border-cyan-500/40 text-cyan-200 hover:bg-[#132c52] hover:text-white transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  title="Tạo tài khoản giáo viên mới"
                >
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Đăng ký</span>
                </button>

                {/* Đăng nhập */}
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition-all cursor-pointer whitespace-nowrap"
                  title="Đăng nhập tài khoản"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
