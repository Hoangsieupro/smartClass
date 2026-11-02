import React, { useState, useRef } from 'react';
import {
  AlertTriangle,
  X,
  Plus,
  Clock,
  Trash2,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DayKey, Period, ALL_DAYS_ORDERED } from '../types/timetable';
import { downloadExcelTemplate, parseExcelOrCsvFile } from '../utils/excelUtils';

// 1. Confirm Delete Column Modal
export const ConfirmDeleteColumnModal: React.FC<{
  isOpen: boolean;
  dayKey: DayKey | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, dayKey, onConfirm, onCancel }) => {
  if (!isOpen || !dayKey) return null;

  const dayInfo = ALL_DAYS_ORDERED.find((d) => d.key === dayKey);
  const dayLabel = dayInfo ? dayInfo.label : dayKey;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0e172a] border border-rose-500/50 rounded-xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">
              Xác nhận xóa cột {dayLabel}?
            </h3>
            <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
              Toàn bộ nội dung các tiết học trong <strong className="text-rose-300">{dayLabel}</strong> sẽ bị xóa khỏi bản nháp. Bạn có thể sử dụng nút <span className="text-cyan-300 font-semibold">Hoàn tác</span> trước khi Lưu.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-950"
          >
            Xác nhận xóa cột
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Confirm Delete Period Modal
export const ConfirmDeletePeriodModal: React.FC<{
  isOpen: boolean;
  period: Period | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, period, onConfirm, onCancel }) => {
  if (!isOpen || !period) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0e172a] border border-rose-500/50 rounded-xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">
              Xác nhận xóa Tiết {period.periodNumber}?
            </h3>
            <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
              Môn học của <strong className="text-rose-300">Tiết {period.periodNumber} ({period.startTime} - {period.endTime})</strong> trên tất cả các ngày sẽ bị xóa khỏi bản nháp. Số thứ tự các tiết học tiếp theo sẽ tự động được đánh số lại.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-950"
          >
            Xóa tiết học
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Add Period Modal with rigorous time validation
export const AddPeriodModal: React.FC<{
  isOpen: boolean;
  nextPeriodNumber: number;
  existingPeriods: Period[];
  onAddPeriod: (newPeriod: { periodNumber: number; startTime: string; endTime: string; session: 'morning' | 'afternoon' }) => void;
  onCancel: () => void;
}> = ({ isOpen, nextPeriodNumber, existingPeriods, onAddPeriod, onCancel }) => {
  // Suggest sensible default time based on last period
  const lastPeriod = existingPeriods[existingPeriods.length - 1];
  let defaultStart = '15:10';
  let defaultEnd = '15:55';

  if (lastPeriod) {
    const [h, m] = lastPeriod.endTime.split(':').map(Number);
    const nextStartMin = m + 5;
    const startHour = h + Math.floor(nextStartMin / 60);
    const startM = nextStartMin % 60;

    const nextEndMin = startM + 45;
    const endHour = startHour + Math.floor(nextEndMin / 60);
    const endM = nextEndMin % 60;

    defaultStart = `${String(startHour).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    defaultEnd = `${String(endHour).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [session, setSession] = useState<'morning' | 'afternoon'>(nextPeriodNumber <= 5 ? 'morning' : 'afternoon');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!startTime || !endTime) {
      setErrorMsg('Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc.');
      return;
    }

    if (startTime >= endTime) {
      setErrorMsg('Lỗi: Giờ bắt đầu phải nhỏ hơn giờ kết thúc.');
      return;
    }

    // Check overlap with existing periods
    const isOverlapping = existingPeriods.some((p) => {
      return (
        (startTime >= p.startTime && startTime < p.endTime) ||
        (endTime > p.startTime && endTime <= p.endTime) ||
        (startTime <= p.startTime && endTime >= p.endTime)
      );
    });

    if (isOverlapping) {
      const confirmOverlap = window.confirm(
        'Cảnh báo: Khung giờ này bị trùng hoặc chồng lấn với một tiết học đã có. Bạn có chắc chắn muốn tiếp tục thêm không?'
      );
      if (!confirmOverlap) return;
    }

    onAddPeriod({
      periodNumber: nextPeriodNumber,
      startTime,
      endTime,
      session,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0e172a] border border-cyan-500/40 rounded-xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base md:text-lg font-bold text-white">
              Thêm tiết học mới
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-cyan-300 mb-1">
              Tên tiết
            </label>
            <input
              type="text"
              readOnly
              value={`Tiết ${nextPeriodNumber}`}
              className="w-full bg-[#091020] border border-slate-700 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-300 font-bold select-none cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-1">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#091020] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-1">
                Giờ kết thúc
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#091020] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cyan-300 mb-1">
              Buổi học
            </label>
            <div className="flex gap-4 mt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="session"
                  value="morning"
                  checked={session === 'morning'}
                  onChange={() => setSession('morning')}
                  className="accent-cyan-500"
                />
                <span>Buổi Sáng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="session"
                  value="afternoon"
                  checked={session === 'afternoon'}
                  onChange={() => setSession('afternoon')}
                  className="accent-cyan-500"
                />
                <span>Buổi Chiều</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md shadow-cyan-950 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tiết học</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Unsaved Changes Confirmation Modal
export const UnsavedChangesModal: React.FC<{
  isOpen: boolean;
  onStay: () => void;
  onDiscardAndLeave: () => void;
}> = ({ isOpen, onStay, onDiscardAndLeave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0e172a] border border-amber-500/50 rounded-xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">
              Cảnh báo thay đổi chưa lưu!
            </h3>
            <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
              Bạn đang có các thay đổi chưa được lưu trong bản nháp. Nếu rời khỏi trang hoặc chuyển lớp bây giờ, các chỉnh sửa này sẽ bị mất.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onDiscardAndLeave}
            className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 transition-colors"
          >
            Hủy thay đổi & Tiếp tục
          </button>
          <button
            type="button"
            onClick={onStay}
            className="px-4 py-2 text-xs md:text-sm font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-lg shadow-cyan-950"
          >
            Tiếp tục chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Import Excel / CSV Modal
export const ImportExcelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApplyImport: (importedData: { activeDays: DayKey[]; periods: Period[]; grid: any }) => void;
}> = ({ isOpen, onClose, onApplyImport }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<{
    activeDays: DayKey[];
    periods: Period[];
    grid: any;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);
    setParsedResult(null);

    try {
      const result = await parseExcelOrCsvFile(file);
      setParsedResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi đọc file Excel.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmApply = () => {
    if (parsedResult) {
      onApplyImport(parsedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0e172a] border border-cyan-500/40 rounded-xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base md:text-lg font-bold text-white">
              Import Thời khóa biểu từ Excel / CSV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Hỗ trợ định dạng file <strong>.xlsx, .xls, .csv</strong></span>
            <button
              type="button"
              onClick={downloadExcelTemplate}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold underline underline-offset-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file mẫu Excel</span>
            </button>
          </div>

          {/* File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-6 text-center bg-[#091020]/60 cursor-pointer transition-colors"
          >
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-xs md:text-sm font-semibold text-slate-200">
              Nhấp để chọn file hoặc kéo thả file Excel vào đây
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              File có các cột Thứ 2, Thứ 3,... và hàng Tiết 1, Tiết 2,...
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {isLoading && (
            <div className="text-center py-3 text-cyan-300 text-xs animate-pulse">
              Đang phân tích tập tin Excel...
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {parsedResult && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đọc file thành công!</span>
              </div>
              <div className="text-slate-300">
                Tìm thấy <strong>{parsedResult.activeDays.length} ngày</strong> (
                {parsedResult.activeDays
                  .map((d) => ALL_DAYS_ORDERED.find((x) => x.key === d)?.label)
                  .join(', ')}
                ) và <strong>{parsedResult.periods.length} tiết học</strong>.
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={!parsedResult}
            onClick={handleConfirmApply}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              parsedResult
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Áp dụng vào thời khóa biểu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
