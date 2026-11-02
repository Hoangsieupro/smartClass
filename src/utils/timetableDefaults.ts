import { DayKey, Period, TimetableSchedule } from '../types/timetable';

export const DEFAULT_PERIODS: Period[] = [
  { id: 'p1', periodNumber: 1, startTime: '07:00', endTime: '07:45', session: 'morning' },
  { id: 'p2', periodNumber: 2, startTime: '07:50', endTime: '08:35', session: 'morning' },
  { id: 'p3', periodNumber: 3, startTime: '08:50', endTime: '09:35', session: 'morning' },
  { id: 'p4', periodNumber: 4, startTime: '09:40', endTime: '10:25', session: 'morning' },
  { id: 'p5', periodNumber: 5, startTime: '10:30', endTime: '11:15', session: 'morning' },
  { id: 'p6', periodNumber: 6, startTime: '13:30', endTime: '14:15', session: 'afternoon' },
  { id: 'p7', periodNumber: 7, startTime: '14:20', endTime: '15:05', session: 'afternoon' },
];

export const INITIAL_ACTIVE_DAYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const TARGET_OPTIONS = {
  class: [
    { id: 'class_7A3', label: 'Lớp 7A3' },
    { id: 'class_7A1', label: 'Lớp 7A1' },
    { id: 'class_7A2', label: 'Lớp 7A2' },
    { id: 'class_8B1', label: 'Lớp 8B1' },
    { id: 'class_9A4', label: 'Lớp 9A4' },
  ],
  teacher: [
    { id: 'teacher_nam', label: 'Thầy Nguyễn Văn Nam (Toán)' },
    { id: 'teacher_mai', label: 'Cô Trần Thị Mai (Ngữ Văn)' },
    { id: 'teacher_hoang', label: 'Thầy Lê Hoàng (Tiếng Anh)' },
    { id: 'teacher_lien', label: 'Cô Vũ Bích Liên (Vật Lý)' },
  ],
  room: [
    { id: 'room_204', label: 'Phòng 204 (Tầng 2)' },
    { id: 'room_lab1', label: 'Phòng Lab Tin học 1' },
    { id: 'room_stem', label: 'Phòng thực hành STEM' },
    { id: 'room_hall', label: 'Hội trường Đa năng' },
  ],
};

// Seed schedule for Lớp 7A3 matching school standards
export const DEFAULT_SCHEDULE_7A3: TimetableSchedule = {
  id: 'schedule_class_7A3',
  targetId: 'class_7A3',
  type: 'class',
  title: 'Thời khóa biểu - Lớp 7A3',
  activeDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  periods: DEFAULT_PERIODS,
  grid: {
    p1: {
      monday: 'Chào cờ\n(Toàn trường)',
      tuesday: 'Toán học\n(Thầy Nam)',
      wednesday: 'Ngữ văn\n(Cô Mai)',
      thursday: 'Tiếng Anh\n(Thầy Hoàng)',
      friday: 'Toán học\n(Thầy Nam)',
    },
    p2: {
      monday: 'Toán học\n(Thầy Nam)',
      tuesday: 'Toán học\n(Thầy Nam)',
      wednesday: 'Ngữ văn\n(Cô Mai)',
      thursday: 'Tiếng Anh\n(Thầy Hoàng)',
      friday: 'Vật lý\n(Cô Liên)',
    },
    p3: {
      monday: 'Ngữ văn\n(Cô Mai)',
      tuesday: 'Vật lý\n(Cô Liên)',
      wednesday: 'Lịch sử\n(Cô Hương)',
      thursday: 'Toán học\n(Thầy Nam)',
      friday: 'Hóa học\n(Thầy Tuấn)',
    },
    p4: {
      monday: 'Ngữ văn\n(Cô Mai)',
      tuesday: 'Sinh học\n(Cô Thảo)',
      wednesday: 'Địa lý\n(Thầy Bình)',
      thursday: 'Tin học\n(Phòng Lab 1)',
      friday: 'Tiếng Anh\n(Thầy Hoàng)',
    },
    p5: {
      monday: 'GDCD\n(Cô Hằng)',
      tuesday: 'Âm nhạc\n(Thầy Trí)',
      wednesday: 'Mỹ thuật\n(Cô Quyên)',
      thursday: 'Công nghệ\n(Thầy Quân)',
      friday: 'Sinh hoạt lớp\n(GVCN: Thầy Nam)',
    },
    p6: {
      monday: 'Thể dục\n(Sân bóng)',
      tuesday: '',
      wednesday: 'Bồi dưỡng Toán\n(Thầy Nam)',
      thursday: '',
      friday: 'CLB Tiếng Anh\n(Phòng 204)',
    },
    p7: {
      monday: 'Thể dục\n(Sân bóng)',
      tuesday: '',
      wednesday: 'Bồi dưỡng Toán\n(Thầy Nam)',
      thursday: '',
      friday: '',
    },
  },
  lastUpdated: '11/10/2026',
};

// Seed schedule for Teacher Nam (Toán)
export const DEFAULT_SCHEDULE_TEACHER_NAM: TimetableSchedule = {
  id: 'schedule_teacher_nam',
  targetId: 'teacher_nam',
  type: 'teacher',
  title: 'Thời khóa biểu - Thầy Nguyễn Văn Nam (Toán)',
  activeDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  periods: DEFAULT_PERIODS,
  grid: {
    p1: {
      monday: 'Chào cờ\n(Toàn trường)',
      tuesday: 'Toán 7A3\n(Phòng 204)',
      wednesday: 'Toán 8B1\n(Phòng 301)',
      thursday: 'Toán 7A1\n(Phòng 202)',
      friday: 'Toán 7A3\n(Phòng 204)',
    },
    p2: {
      monday: 'Toán 7A3\n(Phòng 204)',
      tuesday: 'Toán 7A3\n(Phòng 204)',
      wednesday: 'Toán 8B1\n(Phòng 301)',
      thursday: '',
      friday: 'Toán 7A2\n(Phòng 203)',
    },
    p3: {
      monday: 'Toán 7A1\n(Phòng 202)',
      tuesday: 'Toán 7A2\n(Phòng 203)',
      wednesday: 'Họp tổ Toán',
      thursday: 'Toán 7A3\n(Phòng 204)',
      friday: '',
    },
    p4: {
      monday: 'Toán 7A2\n(Phòng 203)',
      tuesday: '',
      wednesday: '',
      thursday: 'Toán 8B1\n(Phòng 301)',
      friday: 'Toán 8B1\n(Phòng 301)',
    },
    p5: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: 'Sinh hoạt 7A3\n(Phòng 204)',
    },
    p6: {
      monday: '',
      tuesday: '',
      wednesday: 'Bồi dưỡng Toán 7A3',
      thursday: '',
      friday: '',
    },
    p7: {
      monday: '',
      tuesday: '',
      wednesday: 'Bồi dưỡng Toán 7A3',
      thursday: '',
      friday: '',
    },
  },
  lastUpdated: '11/10/2026',
};

// Seed schedule for Room 204
export const DEFAULT_SCHEDULE_ROOM_204: TimetableSchedule = {
  id: 'schedule_room_204',
  targetId: 'room_204',
  type: 'room',
  title: 'Thời khóa biểu - Phòng 204 (Tầng 2)',
  activeDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  periods: DEFAULT_PERIODS,
  grid: {
    p1: {
      monday: 'Lớp 7A3',
      tuesday: 'Lớp 7A3',
      wednesday: 'Lớp 7A3',
      thursday: 'Lớp 7A3',
      friday: 'Lớp 7A3',
    },
    p2: {
      monday: 'Lớp 7A3',
      tuesday: 'Lớp 7A3',
      wednesday: 'Lớp 7A3',
      thursday: 'Lớp 7A3',
      friday: 'Lớp 7A3',
    },
    p3: {
      monday: 'Lớp 7A3',
      tuesday: 'Lớp 7A3',
      wednesday: 'Lớp 7A3',
      thursday: 'Lớp 7A3',
      friday: 'Lớp 7A3',
    },
    p4: {
      monday: 'Lớp 7A3',
      tuesday: 'Lớp 7A3',
      wednesday: 'Lớp 7A3',
      thursday: 'Trống (Tin học phòng Lab)',
      friday: 'Lớp 7A3',
    },
    p5: {
      monday: 'Lớp 7A3',
      tuesday: 'Lớp 7A3',
      wednesday: 'Lớp 7A3',
      thursday: 'Lớp 7A3',
      friday: 'Lớp 7A3',
    },
    p6: {
      monday: 'Trống (Thể dục)',
      tuesday: '',
      wednesday: 'Bồi dưỡng Toán',
      thursday: '',
      friday: 'CLB Tiếng Anh',
    },
    p7: {
      monday: 'Trống (Thể dục)',
      tuesday: '',
      wednesday: 'Bồi dưỡng Toán',
      thursday: '',
      friday: '',
    },
  },
  lastUpdated: '11/10/2026',
};

export const INITIAL_SCHEDULE_MAP: Record<string, TimetableSchedule> = {
  class_7A3: DEFAULT_SCHEDULE_7A3,
  teacher_nam: DEFAULT_SCHEDULE_TEACHER_NAM,
  room_204: DEFAULT_SCHEDULE_ROOM_204,
};

const STORAGE_KEY = 'smart_classroom_timetables_v1';

export function loadSchedulesFromStorage(): Record<string, TimetableSchedule> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Could not read from localStorage', err);
  }
  return INITIAL_SCHEDULE_MAP;
}

export function saveSchedulesToStorage(data: Record<string, TimetableSchedule>): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Error saving to localStorage', err);
    return false;
  }
}
