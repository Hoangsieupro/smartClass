export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayInfo {
  key: DayKey;
  label: string; // e.g., "Thứ 2"
  shortLabel: string;
}

export const ALL_DAYS_ORDERED: DayInfo[] = [
  { key: 'monday', label: 'Thứ 2', shortLabel: 'T2' },
  { key: 'tuesday', label: 'Thứ 3', shortLabel: 'T3' },
  { key: 'wednesday', label: 'Thứ 4', shortLabel: 'T4' },
  { key: 'thursday', label: 'Thứ 5', shortLabel: 'T5' },
  { key: 'friday', label: 'Thứ 6', shortLabel: 'T6' },
  { key: 'saturday', label: 'Thứ 7', shortLabel: 'T7' },
  { key: 'sunday', label: 'Chủ nhật', shortLabel: 'CN' },
];

export interface Period {
  id: string;
  periodNumber: number; // 1, 2, 3...
  startTime: string; // "07:00"
  endTime: string; // "07:45"
  session?: 'morning' | 'afternoon'; // Buổi sáng / Buổi chiều
}

// Cell content: periodId -> dayKey -> text
export type TimetableGridData = Record<string, Partial<Record<DayKey, string>>>;

export interface TimetableSchedule {
  id: string;
  targetId: string; // e.g. "class_7A3"
  type: 'class' | 'teacher' | 'room';
  title: string;
  activeDays: DayKey[];
  periods: Period[];
  grid: TimetableGridData;
  lastUpdated?: string;
}

export type ViewTab = 'class' | 'teacher' | 'room';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
