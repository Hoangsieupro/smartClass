import React from 'react';
import { Info, AlertOctagon, Sparkles, X } from 'lucide-react';

interface InstructionBannerProps {
  isEditing: boolean;
  isDeleteMode: boolean;
  onExitDeleteMode?: () => void;
}

export const InstructionBanner: React.FC<InstructionBannerProps> = ({
  isEditing,
  isDeleteMode,
  onExitDeleteMode,
}) => {
  // If delete mode is active, display the red/pink banner (Hình 3)
  if (isEditing && isDeleteMode) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#2a0e19] border border-rose-500/60 rounded-xl text-rose-200 shadow-md shadow-rose-950/40 animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-xs sm:text-sm font-medium leading-relaxed">
            <span className="font-bold text-rose-100">Chế độ xóa ô đang bật!</span> Nhấp vào bất kỳ ô thời khóa biểu nào để xóa nội dung về <span className="font-mono text-rose-300 font-semibold bg-rose-950/60 px-1 py-0.5 rounded">"-trống-"</span>. Nhấp lại nút Xóa để thoát.
          </div>
        </div>
        {onExitDeleteMode && (
          <button
            onClick={onExitDeleteMode}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-600/60 hover:bg-rose-600 text-white transition-colors shrink-0 flex items-center gap-1"
          >
            <span>Thoát xóa</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // If edit mode is active (and not in delete mode), display the cyan banner (Hình 2)
  if (isEditing && !isDeleteMode) {
    return (
      <div className="flex items-start sm:items-center justify-between gap-3 px-4 py-3 bg-[#081a2e] border border-cyan-500/40 rounded-xl text-cyan-200 shadow-md shadow-cyan-950/30 animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm font-medium leading-relaxed">
            <span className="font-bold text-cyan-100">Chế độ chỉnh sửa đang bật:</span> Nhấp trực tiếp vào bất kỳ ô nào để nhập/sửa nội dung. Nhấn <kbd className="px-1.5 py-0.5 bg-[#0e2744] border border-cyan-500/40 rounded text-cyan-300 font-mono text-[11px]">Enter</kbd> để xuống dòng, <kbd className="px-1.5 py-0.5 bg-[#0e2744] border border-cyan-500/40 rounded text-cyan-300 font-mono text-[11px]">Tab</kbd> để chuyển ô tiếp theo. Dùng icon <span className="text-cyan-300 font-bold">"+"</span> và <span className="text-rose-400 font-bold">"×"</span> trên tiêu đề cột để thêm/xóa ngày, icon thùng rác để xóa tiết.
          </div>
        </div>
      </div>
    );
  }

  // View mode notice (quiet, unboxed)
  return null;
};
