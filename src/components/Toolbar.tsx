import React from 'react';
import {
  Pencil,
  CheckCircle,
  Eraser,
  Undo2,
  Redo2,
  FileSpreadsheet,
  Download,
  Save,
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';

interface ToolbarProps {
  isEditing: boolean;
  isDeleteMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  onToggleEdit: () => void;
  onToggleDeleteMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenImport: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isEditing,
  isDeleteMode,
  canUndo,
  canRedo,
  hasUnsavedChanges,
  onToggleEdit,
  onToggleDeleteMode,
  onUndo,
  onRedo,
  onSave,
  onCancel,
  onOpenImport,
  onExportExcel,
  onPrint,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0c1424] border border-cyan-500/25 rounded-xl shadow-lg shadow-black/30">
      {/* Left Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Chỉnh sửa Button (Cyan) */}
        <button
          onClick={onToggleEdit}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm ${
            isEditing
              ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20 ring-2 ring-cyan-400/50'
              : 'bg-cyan-600/90 text-white hover:bg-cyan-500 shadow-cyan-950 border border-cyan-400/30'
          }`}
          title={isEditing ? 'Đang trong chế độ chỉnh sửa' : 'Bật chế độ chỉnh sửa'}
        >
          {isEditing ? (
            <>
              <CheckCircle className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Đang chỉnh sửa</span>
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </>
          )}
        </button>

        {/* Xóa Button (Red/Pink/Rose) */}
        <button
          onClick={onToggleDeleteMode}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm ${
            isDeleteMode
              ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-900/50 animate-pulse'
              : 'bg-rose-700/80 text-rose-100 hover:bg-rose-600 hover:text-white border border-rose-500/30'
          }`}
          title={
            isDeleteMode
              ? 'Nhấp lại để tắt chế độ xóa nhanh'
              : 'Bật chế độ xóa nhanh (xóa trực tiếp nội dung ô khi click)'
          }
        >
          <Eraser className="w-4 h-4" />
          <span>{isDeleteMode ? 'Chế độ xóa: BẬT' : 'Xóa'}</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-cyan-500/20 mx-1 hidden sm:block" />

        {/* Hoàn tác (Undo) */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium border transition-all ${
            canUndo
              ? 'bg-[#111d33] border-cyan-500/30 text-cyan-200 hover:bg-[#162542] hover:text-white cursor-pointer'
              : 'bg-[#0a1120] border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Hoàn tác thao tác gần nhất (Ctrl + Z)"
        >
          <Undo2 className="w-4 h-4" />
          <span className="hidden sm:inline">Hoàn tác</span>
        </button>

        {/* Làm lại (Redo) */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium border transition-all ${
            canRedo
              ? 'bg-[#111d33] border-cyan-500/30 text-cyan-200 hover:bg-[#162542] hover:text-white cursor-pointer'
              : 'bg-[#0a1120] border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Làm lại thao tác vừa hoàn tác (Ctrl + Y)"
        >
          <Redo2 className="w-4 h-4" />
          <span className="hidden sm:inline">Làm lại</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-cyan-500/20 mx-1 hidden sm:block" />

        {/* Import Excel */}
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium bg-[#111d33] border border-cyan-500/30 text-cyan-200 hover:bg-[#162542] hover:text-white transition-all shadow-sm"
          title="Nhập dữ liệu thời khóa biểu từ file Excel hoặc CSV"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Import Excel</span>
          <span className="md:hidden">Import</span>
        </button>

        {/* Xuất thời khóa biểu */}
        <button
          onClick={onExportExcel}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium bg-[#111d33] border border-cyan-500/30 text-cyan-200 hover:bg-[#162542] hover:text-white transition-all shadow-sm"
          title="Tải về file Excel (.xlsx)"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Xuất thời khóa biểu</span>
          <span className="md:hidden">Xuất Excel</span>
        </button>

        {/* In thời khóa biểu */}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs md:text-sm font-medium bg-[#111d33] border border-cyan-500/30 text-slate-300 hover:bg-[#162542] hover:text-white transition-all shadow-sm"
          title="In thời khóa biểu hoặc lưu thành PDF"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span className="hidden lg:inline">In / PDF</span>
        </button>
      </div>

      {/* Right Action: Save and Cancel buttons when editing */}
      {isEditing && (
        <div className="flex items-center gap-2 ml-auto">
          {hasUnsavedChanges && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium bg-[#1e293b]/80 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              title="Hủy các thay đổi trong bản nháp"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hủy thay đổi</span>
            </button>
          )}

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all ring-1 ring-emerald-400/50"
            title="Lưu thời khóa biểu chính thức"
          >
            <Save className="w-4 h-4" />
            <span>Lưu</span>
          </button>
        </div>
      )}
    </div>
  );
};
