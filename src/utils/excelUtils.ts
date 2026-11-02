import * as XLSX from 'xlsx';
import { ALL_DAYS_ORDERED, DayKey, Period, TimetableSchedule } from '../types/timetable';

export function exportScheduleToExcel(schedule: TimetableSchedule) {
  const wb = XLSX.utils.book_new();

  // Create header row: Tiết / Giờ, Thứ 2, Thứ 3, ...
  const headers = ['Tiết / Giờ', ...schedule.activeDays.map(dKey => {
    const day = ALL_DAYS_ORDERED.find(d => d.key === dKey);
    return day ? day.label : dKey;
  })];

  const rows: (string | number)[][] = [
    [schedule.title],
    [`Học kỳ II - Năm học 2025-2026 | Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`],
    [],
    headers
  ];

  schedule.periods.forEach(p => {
    const rowTitle = `Tiết ${p.periodNumber} (${p.startTime} - ${p.endTime})`;
    const rowData: string[] = [rowTitle];

    schedule.activeDays.forEach(dKey => {
      const cell = schedule.grid[p.id]?.[dKey] || '';
      rowData.push(cell.trim() === '' ? '-trống-' : cell);
    });

    rows.push(rowData);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 25 },
    ...schedule.activeDays.map(() => ({ wch: 22 }))
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Thời khóa biểu');

  const fileName = `ThoiKhoaBieu_${schedule.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportScheduleToCSV(schedule: TimetableSchedule) {
  const headers = ['Tiết / Giờ', ...schedule.activeDays.map(dKey => {
    const day = ALL_DAYS_ORDERED.find(d => d.key === dKey);
    return day ? day.label : dKey;
  })];

  const lines: string[] = [];
  lines.push(`"${schedule.title}"`);
  lines.push(headers.map(h => `"${h}"`).join(','));

  schedule.periods.forEach(p => {
    const rowTitle = `Tiết ${p.periodNumber} (${p.startTime} - ${p.endTime})`;
    const cells = [rowTitle];

    schedule.activeDays.forEach(dKey => {
      const cell = schedule.grid[p.id]?.[dKey] || '';
      // Escape inner quotes and line breaks for CSV
      cells.push(cell ? `"${cell.replace(/"/g, '""')}"` : '"-trống-"');
    });

    lines.push(cells.join(','));
  });

  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ThoiKhoaBieu_${schedule.title.replace(/\s+/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();
  const headers = ['Tiết / Giờ', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
  const sampleRows = [
    headers,
    ['Tiết 1 (07:00 - 07:45)', 'Chào cờ', 'Toán học', 'Ngữ văn', 'Tiếng Anh', 'Toán học'],
    ['Tiết 2 (07:50 - 08:35)', 'Toán học', 'Toán học', 'Ngữ văn', 'Tiếng Anh', 'Vật lý'],
    ['Tiết 3 (08:50 - 09:35)', 'Ngữ văn', 'Vật lý', 'Lịch sử', 'Toán học', 'Hóa học'],
    ['Tiết 4 (09:40 - 10:25)', 'Ngữ văn', 'Sinh học', 'Địa lý', 'Tin học', 'Tiếng Anh'],
    ['Tiết 5 (10:30 - 11:15)', 'GDCD', 'Âm nhạc', 'Mỹ thuật', 'Công nghệ', 'Sinh hoạt lớp'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleRows);
  ws['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws, 'MauThoiKhoaBieu');
  XLSX.writeFile(wb, 'Mau_Thoi_Khoa_Bieu.xlsx');
}

export async function parseExcelOrCsvFile(file: File): Promise<{
  activeDays: DayKey[];
  periods: Period[];
  grid: Record<string, Partial<Record<DayKey, string>>>;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Find header row that contains day names
        let headerRowIndex = -1;
        let dayColMap: { colIndex: number; dayKey: DayKey }[] = [];

        const dayNameLookup: Record<string, DayKey> = {
          'thứ 2': 'monday',
          'thu 2': 'monday',
          't2': 'monday',
          'thứ 3': 'tuesday',
          'thu 3': 'tuesday',
          't3': 'tuesday',
          'thứ 4': 'wednesday',
          'thu 4': 'wednesday',
          't4': 'wednesday',
          'thứ 5': 'thursday',
          'thu 5': 'thursday',
          't5': 'thursday',
          'thứ 6': 'friday',
          'thu 6': 'friday',
          't6': 'friday',
          'thứ 7': 'saturday',
          'thu 7': 'saturday',
          't7': 'saturday',
          'chủ nhật': 'sunday',
          'chu nhat': 'sunday',
          'cn': 'sunday',
        };

        for (let r = 0; r < Math.min(rows.length, 10); r++) {
          const row = rows[r];
          if (!Array.isArray(row)) continue;
          const foundDays: { colIndex: number; dayKey: DayKey }[] = [];

          row.forEach((cellVal, cIdx) => {
            if (typeof cellVal === 'string') {
              const normalized = cellVal.trim().toLowerCase();
              if (dayNameLookup[normalized]) {
                foundDays.push({ colIndex: cIdx, dayKey: dayNameLookup[normalized] });
              }
            }
          });

          if (foundDays.length >= 2) {
            headerRowIndex = r;
            dayColMap = foundDays;
            break;
          }
        }

        if (headerRowIndex === -1 || dayColMap.length === 0) {
          throw new Error('Không tìm thấy các cột ngày (Thứ 2, Thứ 3,...) trong file Excel. Vui lòng kiểm tra định dạng.');
        }

        // Active days ordered properly
        const activeDaysOrder = ALL_DAYS_ORDERED.map(d => d.key);
        const activeDays: DayKey[] = activeDaysOrder.filter(dKey => dayColMap.some(item => item.dayKey === dKey));

        const periods: Period[] = [];
        const grid: Record<string, Partial<Record<DayKey, string>>> = {};

        // Process period rows
        let periodCounter = 1;
        for (let r = headerRowIndex + 1; r < rows.length; r++) {
          const row = rows[r];
          if (!Array.isArray(row) || row.length === 0) continue;

          // Period info is usually in column 0
          const periodCell = row[0] ? String(row[0]).trim() : '';
          if (!periodCell && !row.some(cell => cell && String(cell).trim())) continue;

          // Parse time if present like "07:00 - 07:45"
          let startTime = '07:00';
          let endTime = '07:45';
          const timeMatch = periodCell.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
          if (timeMatch) {
            startTime = timeMatch[1].padStart(5, '0');
            endTime = timeMatch[2].padStart(5, '0');
          } else {
            // default times based on periodCounter
            const defaultStartHours = [7, 7, 8, 9, 10, 13, 14, 15];
            const defaultStartMins = [0, 50, 50, 40, 30, 30, 20, 10];
            const defaultEndHours = [7, 8, 9, 10, 11, 14, 15, 15];
            const defaultEndMins = [45, 35, 35, 25, 15, 15, 5, 55];
            const idx = Math.min(periodCounter - 1, 7);
            startTime = `${String(defaultStartHours[idx]).padStart(2, '0')}:${String(defaultStartMins[idx]).padStart(2, '0')}`;
            endTime = `${String(defaultEndHours[idx]).padStart(2, '0')}:${String(defaultEndMins[idx]).padStart(2, '0')}`;
          }

          const periodId = `p_${periodCounter}_${Date.now()}`;
          periods.push({
            id: periodId,
            periodNumber: periodCounter,
            startTime,
            endTime,
            session: periodCounter <= 5 ? 'morning' : 'afternoon',
          });

          grid[periodId] = {};

          dayColMap.forEach(({ colIndex, dayKey }) => {
            const val = row[colIndex];
            if (val !== undefined && val !== null) {
              const strVal = String(val).trim();
              if (strVal !== '-trống-' && strVal !== '-') {
                grid[periodId][dayKey] = strVal;
              } else {
                grid[periodId][dayKey] = '';
              }
            } else {
              grid[periodId][dayKey] = '';
            }
          });

          periodCounter++;
        }

        if (periods.length === 0) {
          throw new Error('Không tìm thấy dòng dữ liệu tiết học hợp lệ.');
        }

        resolve({
          activeDays,
          periods,
          grid,
        });
      } catch (err: any) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Lỗi đọc tập tin.'));
    reader.readAsBinaryString(file);
  });
}
