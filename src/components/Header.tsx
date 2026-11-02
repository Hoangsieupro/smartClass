import React from 'react';
import { Calendar, School, User, DoorOpen, Sparkles, BookOpen } from 'lucide-react';
import { ViewTab } from '../types/timetable';
import { TARGET_OPTIONS } from '../utils/timetableDefaults';

interface HeaderProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  currentTargetId: string;
  onTargetChange: (targetId: string) => void;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentTargetId,
  onTargetChange,
  isEditing,
  hasUnsavedChanges,
}) => {
  const currentOptions = TARGET_OPTIONS[activeTab] || [];

  return (
    <header className="border-b border-cyan-500/20 bg-[#0d1527]/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* Top Banner / Brand Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Quản lý lớp học thông minh
                </h1>
                {hasUnsavedChanges && (
                  <span className="text-[11px] font-medium text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    Chưa lưu
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-medium">Hệ thống thời khóa biểu chuẩn hóa</span>
                <span>·</span>
                <span>Năm học 2025 - 2026</span>
                <span>·</span>
                <span>Học kỳ II</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 self-end md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#091020] border border-cyan-500/20 text-cyan-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tuần học 24 (Áp dụng từ 11/10/2026)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs and Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-3 gap-3">
          {/* Main 3 Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#091020] border border-cyan-500/20 rounded-lg shrink-0">
            <button
              onClick={() => onTabChange('class')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                activeTab === 'class'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Lịch lớp học</span>
            </button>

            <button
              onClick={() => onTabChange('teacher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                activeTab === 'teacher'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Lịch giáo viên</span>
            </button>

            <button
              onClick={() => onTabChange('room')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                activeTab === 'room'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <DoorOpen className="w-4 h-4 text-cyan-400" />
              <span>Lịch phòng học</span>
            </button>
          </div>

          {/* Target Selector */}
          <div className="flex items-center gap-2.5">
            <label className="text-xs font-medium text-slate-300 whitespace-nowrap">
              {activeTab === 'class' && 'Chọn lớp:'}
              {activeTab === 'teacher' && 'Chọn giáo viên:'}
              {activeTab === 'room' && 'Chọn phòng:'}
            </label>
            <div className="relative min-w-[200px]">
              <select
                value={currentTargetId}
                onChange={(e) => onTargetChange(e.target.value)}
                className="w-full bg-[#091020] border border-cyan-500/30 text-cyan-200 text-xs md:text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer font-medium"
              >
                {currentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0f172a] text-slate-200 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
