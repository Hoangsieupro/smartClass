import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Trash2, Clock, PlusCircle, Eraser } from 'lucide-react';
import { ALL_DAYS_ORDERED, DayKey, Period } from '../types/timetable';

interface TimetableGridProps {
  activeDays: DayKey[];
  periods: Period[];
  grid: Record<string, Partial<Record<DayKey, string>>>;
  isEditing: boolean;
  isDeleteMode: boolean;
  onCellChange: (periodId: string, dayKey: DayKey, value: string) => void;
  onDeleteCellContent: (periodId: string, dayKey: DayKey) => void;
  onAddColumn: (referenceDayKey?: DayKey) => void;
  onRequestDeleteColumn: (dayKey: DayKey) => void;
  onRequestDeletePeriod: (periodId: string) => void;
  onOpenAddPeriodModal: () => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  activeDays,
  periods,
  grid,
  isEditing,
  isDeleteMode,
  onCellChange,
  onDeleteCellContent,
  onAddColumn,
  onRequestDeleteColumn,
  onRequestDeletePeriod,
  onOpenAddPeriodModal,
}) => {
  // Tracking which cell is being edited inline: { periodId, dayKey }
  const [activeCell, setActiveCell] = useState<{ periodId: string; dayKey: DayKey } | null>(null);
  const [cellDraftText, setCellDraftText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus textarea when active cell changes
  useEffect(() => {
    if (activeCell && textareaRef.current) {
      textareaRef.current.focus();
      // Position cursor at end of text
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
      // Auto adjust height
      adjustTextareaHeight(textareaRef.current);
    }
  }, [activeCell]);

  const adjustTextareaHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 60)}px`;
  };

  const handleStartEditingCell = (periodId: string, dayKey: DayKey, currentValue: string) => {
    if (!isEditing || isDeleteMode) return;
    setActiveCell({ periodId, dayKey });
    setCellDraftText(currentValue || '');
  };

  const commitCellDraft = () => {
    if (activeCell) {
      onCellChange(activeCell.periodId, activeCell.dayKey, cellDraftText);
      setActiveCell(null);
      setCellDraftText('');
    }
  };

  const handleCellClick = (periodId: string, dayKey: DayKey, currentVal: string) => {
    if (!isEditing) return;

    if (isDeleteMode) {
      // Quick Delete Mode (Hình 3): Clear only this cell immediately
      if (currentVal && currentVal.trim() !== '') {
        onDeleteCellContent(periodId, dayKey);
      }
      // Ensure we do not open editor
      return;
    }

    // Normal Edit Mode: Open inline editor
    handleStartEditingCell(periodId, dayKey, currentVal);
  };

  // Handle Tab navigation between cells
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      commitCellDraft();

      if (!activeCell) return;

      const currentPeriodIndex = periods.findIndex(p => p.id === activeCell.periodId);
      const currentDayIndex = activeDays.indexOf(activeCell.dayKey);

      let nextPeriodIndex = currentPeriodIndex;
      let nextDayIndex = currentDayIndex;

      if (!e.shiftKey) {
        // Tab forward
        if (currentDayIndex < activeDays.length - 1) {
          nextDayIndex = currentDayIndex + 1;
        } else if (currentPeriodIndex < periods.length - 1) {
          nextDayIndex = 0;
          nextPeriodIndex = currentPeriodIndex + 1;
        }
      } else {
        // Shift + Tab backward
        if (currentDayIndex > 0) {
          nextDayIndex = currentDayIndex - 1;
        } else if (currentPeriodIndex > 0) {
          nextDayIndex = activeDays.length - 1;
          nextPeriodIndex = currentPeriodIndex - 1;
        }
      }

      const nextPeriod = periods[nextPeriodIndex];
      const nextDay = activeDays[nextDayIndex];

      if (nextPeriod && nextDay) {
        const nextVal = grid[nextPeriod.id]?.[nextDay] || '';
        setActiveCell({ periodId: nextPeriod.id, dayKey: nextDay });
        setCellDraftText(nextVal);
      }
    } else if (e.key === 'Escape') {
      commitCellDraft();
    }
  };

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-[#0d1527] shadow-2xl shadow-cyan-950/20 overflow-hidden flex flex-col">
      {/* Scrollable Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left min-w-[760px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-cyan-500/30 bg-[#0a1120]">
              {/* Column 1: Tiết / Giờ */}
              <th className="py-3.5 px-4 text-xs md:text-sm font-bold uppercase tracking-wider text-cyan-400 w-44 md:w-52 border-r border-cyan-500/20 sticky left-0 bg-[#0a1120] z-10 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Tiết / Giờ</span>
                </div>
              </th>

              {/* Day Columns */}
              {activeDays.map((dayKey) => {
                const dayInfo = ALL_DAYS_ORDERED.find((d) => d.key === dayKey);
                const dayLabel = dayInfo ? dayInfo.label : dayKey;

                return (
                  <th
                    key={dayKey}
                    className="py-3 px-3 text-xs md:text-sm font-bold text-center text-slate-100 border-r border-cyan-500/20 relative group min-w-[140px] md:min-w-[160px]"
                  >
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {/* Delete Column button in Edit Mode (Hình 2: '×' icon pink) */}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestDeleteColumn(dayKey);
                          }}
                          className="w-5 h-5 rounded flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-600/70 transition-colors"
                          title={`Xóa cột ${dayLabel}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="text-cyan-300 font-semibold tracking-wide">
                        {dayLabel}
                      </span>

                      {/* Add Column button in Edit Mode (Hình 2: '+' icon cyan) */}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddColumn(dayKey);
                          }}
                          className="w-5 h-5 rounded flex items-center justify-center text-cyan-400 hover:text-white hover:bg-cyan-600/70 transition-colors"
                          title="Thêm cột ngày mới theo thứ tự"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}

              {/* Action Column for Period Delete in Edit Mode */}
              {isEditing && (
                <th className="py-3 px-3 text-center text-xs font-semibold text-rose-400/80 w-16 border-l border-cyan-500/20">
                  <span>Xóa</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-cyan-500/15">
            {periods.map((period, pIdx) => {
              const isMorning = period.session === 'morning' || period.periodNumber <= 5;

              return (
                <tr
                  key={period.id}
                  className={`transition-colors hover:bg-cyan-950/20 ${
                    pIdx % 2 === 0 ? 'bg-[#0d1527]' : 'bg-[#0b1222]'
                  }`}
                >
                  {/* Period Name & Time Column */}
                  <td className="py-3.5 px-4 text-xs md:text-sm font-medium border-r border-cyan-500/20 sticky left-0 bg-inherit z-10">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          Tiết {period.periodNumber}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20">
                          {isMorning ? 'Sáng' : 'Chiều'}
                        </span>
                      </div>
                      <span className="text-xs text-cyan-400/80 font-mono tracking-tight">
                        {period.startTime} - {period.endTime}
                      </span>
                    </div>
                  </td>

                  {/* Day Cells */}
                  {activeDays.map((dayKey) => {
                    const cellContent = grid[period.id]?.[dayKey] ?? '';
                    const isEmpty = !cellContent || cellContent.trim() === '';
                    const isCellActive =
                      activeCell?.periodId === period.id && activeCell?.dayKey === dayKey;

                    return (
                      <td
                        key={dayKey}
                        onClick={() => handleCellClick(period.id, dayKey, cellContent)}
                        className={`p-2.5 text-xs md:text-sm border-r border-cyan-500/15 align-top transition-all ${
                          isDeleteMode
                            ? 'cursor-pointer hover:bg-rose-950/40 hover:border-rose-500/60 relative group'
                            : isEditing
                            ? 'cursor-pointer hover:bg-cyan-950/30'
                            : ''
                        } ${isCellActive ? 'bg-[#081224] ring-2 ring-cyan-400' : ''}`}
                      >
                        {/* Inline Editor Textarea */}
                        {isCellActive && !isDeleteMode ? (
                          <div className="w-full">
                            <textarea
                              ref={textareaRef}
                              value={cellDraftText}
                              onChange={(e) => {
                                setCellDraftText(e.target.value);
                                adjustTextareaHeight(e.target);
                              }}
                              onBlur={commitCellDraft}
                              onKeyDown={handleKeyDown}
                              placeholder="-trống-"
                              rows={2}
                              className="w-full p-2 bg-[#060c18] text-cyan-100 border border-cyan-400 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-300 text-xs md:text-sm font-medium resize-none shadow-inner leading-relaxed"
                            />
                            <div className="text-[10px] text-cyan-400/70 mt-1 flex justify-between">
                              <span>Enter: xuống dòng</span>
                              <span>Tab: ô tiếp theo</span>
                            </div>
                          </div>
                        ) : (
                          /* Render Cell Value */
                          <div className="min-h-[44px] flex flex-col justify-center">
                            {isEmpty ? (
                              <span className="italic text-slate-500 select-none text-xs">
                                -trống-
                              </span>
                            ) : (
                              <div className="text-slate-100 whitespace-pre-line leading-relaxed font-medium">
                                {cellContent}
                              </div>
                            )}

                            {/* Hover Badge in Delete Mode */}
                            {isDeleteMode && !isEmpty && (
                              <div className="hidden group-hover:flex items-center gap-1 text-[10px] font-bold text-rose-300 mt-1 bg-rose-950/90 border border-rose-500/50 px-1.5 py-0.5 rounded w-fit animate-in fade-in">
                                <Eraser className="w-3 h-3 text-rose-400" />
                                <span>Click để xóa</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Row Delete (Trash Icon) in Edit Mode */}
                  {isEditing && (
                    <td className="py-2.5 px-3 text-center align-middle border-l border-cyan-500/20">
                      <button
                        type="button"
                        onClick={() => onRequestDeletePeriod(period.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/80 transition-colors"
                        title={`Xóa Tiết ${period.periodNumber} trên tất cả các ngày`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Button in Edit Mode: "+ Thêm tiết học mới" */}
      {isEditing && (
        <div className="p-3 bg-[#0a1120] border-t border-cyan-500/25 flex items-center justify-center sm:justify-start">
          <button
            type="button"
            onClick={onOpenAddPeriodModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold bg-[#111e36] text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>+ Thêm tiết học mới</span>
          </button>
        </div>
      )}
    </div>
  );
};
