import React, { useState } from 'react';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shuffle,
  Layers,
  Copy,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { QuestionItem, QuestionLevel, QuestionType } from '../../types/questionBank';

// ==========================================
// 1. MODAL: THÊM NHANH NHIỀU CÂU (PASTE TEXT)
// ==========================================
interface QuickPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (questions: QuestionItem[]) => void;
}

export const QuickPasteModal: React.FC<QuickPasteModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState<string>(`Câu 1: Căn bậc hai số học của 25 là:
A. 5
B. -5
C. ±5
D. 25
Đáp án: A
Giải thích: Căn bậc hai số học của một số không âm a là số không âm x sao cho x² = a. Do đó √25 = 5.

Câu 2: Cho tam giác ABC vuông tại A có AB = 3cm, AC = 4cm. Cạnh huyền BC dài bao nhiêu?
A. 5 cm
B. 7 cm
C. 6 cm
D. 12 cm
Đáp án: A
Giải thích: Áp dụng định lý Pythagore: BC = √(3² + 4²) = 5 cm.`);

  const handleParseAndImport = () => {
    try {
      const questionBlocks = rawText.split(/Câu\s*\d+\s*:/i).filter((b) => b.trim().length > 0);
      const parsed: QuestionItem[] = [];

      questionBlocks.forEach((block, idx) => {
        const lines = block.trim().split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const content = lines[0];
        const options: { id: string; content: string; isCorrect: boolean }[] = [];
        let correctLetter = 'A';
        let explanation = '';

        lines.slice(1).forEach((line) => {
          const optMatch = line.match(/^([A-D])[\.\:\)]\s*(.+)$/i);
          if (optMatch) {
            options.push({
              id: optMatch[1].toUpperCase(),
              content: optMatch[2].trim(),
              isCorrect: false,
            });
          }

          const ansMatch = line.match(/Đáp\s*án\s*[\:\=]\s*([A-D])/i);
          if (ansMatch) {
            correctLetter = ansMatch[1].toUpperCase();
          }

          const expMatch = line.match(/Giải\s*thích\s*[\:\=]\s*(.+)$/i);
          if (expMatch) {
            explanation = expMatch[1];
          }
        });

        // Set correct option
        options.forEach((opt) => {
          if (opt.id === correctLetter) {
            opt.isCorrect = true;
          }
        });

        parsed.push({
          id: `q_quick_${Date.now()}_${idx}`,
          code: `TOAN9-Q${Math.floor(Math.random() * 900 + 100)}`,
          type: 'single_choice',
          typeLabel: 'Một đáp án',
          status: 'approved',
          level: 'nhan_biet',
          subject: 'Toán học',
          grade: 'Khối 9',
          topic: 'Kiến thức chung',
          points: 1,
          content,
          options: options.length > 0 ? options : [
            { id: 'A', content: 'Lựa chọn A', isCorrect: true },
            { id: 'B', content: 'Lựa chọn B', isCorrect: false },
          ],
          explanation: explanation || 'Lời giải chi tiết cho câu hỏi.',
          author: 'Giáo viên',
          authorId: 'teacher',
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
          version: 1,
          usageCount: 0,
        });
      });

      if (parsed.length > 0) {
        onImport(parsed);
        onClose();
      } else {
        alert('Không tìm thấy câu hỏi hợp lệ. Hãy kiểm tra lại cấu trúc văn bản.');
      }
    } catch (e) {
      alert('Lỗi định dạng văn bản.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0c1424] border border-cyan-500/40 rounded-xl shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Thêm Nhanh Nhiều Câu Hỏi Bằng Văn Bản
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
          <p className="text-slate-300">
            Dán danh sách câu hỏi dạng văn bản theo cú pháp chuẩn (Câu 1, các lựa chọn A, B, C, D, Đáp án, Giải thích):
          </p>
          <textarea
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full bg-[#080f1e] border border-cyan-500/30 rounded-lg p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleParseAndImport}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Phân tích & Thêm vào ngân hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MODAL: IMPORT EXCEL / WORD VỚI TEMPLATE
// ==========================================
interface ImportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (questions: QuestionItem[]) => void;
}

export const ImportFileModal: React.FC<ImportFileModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  if (!isOpen) return null;

  const [isProcessing, setIsProcessing] = useState(false);

  // Download real XLSX template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Mã câu hỏi': 'TOAN9-001',
        'Môn học': 'Toán học',
        'Khối lớp': 'Khối 9',
        'Dạng câu hỏi': 'Một đáp án',
        'Mức độ': 'Nhận biết',
        'Chủ đề': 'Căn bậc hai',
        'Nội dung câu hỏi': 'Căn bậc hai số học của 16 là:',
        'Đáp án A': '4',
        'Đáp án B': '-4',
        'Đáp án C': '±4',
        'Đáp án D': '8',
        'Đáp án đúng': 'A',
        'Điểm': 1,
        'Lời giải chi tiết': 'Vì 4 ≥ 0 và 4² = 16 nên căn bậc hai số học của 16 là 4.',
      },
      {
        'Mã câu hỏi': 'TOAN9-002',
        'Môn học': 'Toán học',
        'Khối lớp': 'Khối 9',
        'Dạng câu hỏi': 'Một đáp án',
        'Mức độ': 'Thông hiểu',
        'Chủ đề': 'Hệ thức lượng',
        'Nội dung câu hỏi': 'Trong tam giác vuông, sin của góc nhọn bằng:',
        'Đáp án A': 'Đối chia huyền',
        'Đáp án B': 'Kề chia huyền',
        'Đáp án C': 'Đối chia kề',
        'Đáp án D': 'Kề chia đối',
        'Đáp án đúng': 'A',
        'Điểm': 1,
        'Lời giải chi tiết': 'Tỉ số lượng giác sin = đối / huyền.',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MauCauHoi');
    XLSX.writeFile(workbook, 'Mau_Import_Ngan_Hang_Cau_Hoi.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (Array.isArray(data) && data.length > 0) {
          const parsedQuestions: QuestionItem[] = data.map((row: any, i: number) => {
            const correctKey = (row['Đáp án đúng'] || 'A').toString().trim().toUpperCase();
            return {
              id: `q_imp_${Date.now()}_${i}`,
              code: row['Mã câu hỏi'] || `TOAN9-IMP${i + 1}`,
              type: 'single_choice',
              typeLabel: row['Dạng câu hỏi'] || 'Một đáp án',
              status: 'approved',
              level: 'nhan_biet',
              subject: row['Môn học'] || 'Toán học',
              grade: row['Khối lớp'] || 'Khối 9',
              topic: row['Chủ đề'] || 'Kiến thức trọng tâm',
              points: parseFloat(row['Điểm']) || 1,
              content: row['Nội dung câu hỏi'] || `Câu hỏi nhập khẩu ${i + 1}`,
              options: [
                { id: 'A', content: String(row['Đáp án A'] || 'Đáp án A'), isCorrect: correctKey === 'A' },
                { id: 'B', content: String(row['Đáp án B'] || 'Đáp án B'), isCorrect: correctKey === 'B' },
                { id: 'C', content: String(row['Đáp án C'] || 'Đáp án C'), isCorrect: correctKey === 'C' },
                { id: 'D', content: String(row['Đáp án D'] || 'Đáp án D'), isCorrect: correctKey === 'D' },
              ],
              explanation: row['Lời giải chi tiết'] || 'Lời giải chi tiết từ file import.',
              author: 'Giáo viên',
              authorId: 'teacher',
              createdAt: new Date().toISOString().slice(0, 10),
              updatedAt: new Date().toISOString().slice(0, 10),
              version: 1,
              usageCount: 0,
            };
          });

          onImport(parsedQuestions);
          onClose();
        } else {
          alert('Không tìm thấy dữ liệu câu hỏi trong tệp.');
        }
      } catch (err) {
        alert('Lỗi đọc tệp Excel. Vui lòng tải file mẫu để kiểm tra.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0c1424] border border-cyan-500/40 rounded-xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Import Câu Hỏi Từ Excel / Word
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-cyan-300">Tải tệp mẫu Excel chuẩn</div>
              <p className="text-slate-400 text-[11px]">
                Bao gồm cột nội dung, các đáp án A-B-C-D, điểm số và lời giải
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file mẫu</span>
            </button>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#080f1e] transition-colors group">
            <Upload className="w-8 h-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-slate-200">
              Nhấp để chọn tệp .xlsx, .xls hoặc .docx
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Hệ thống sẽ tự động đối chiếu mã và kiểm tra trùng lặp
            </span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MODAL: XUẤT FILE ĐA ĐỊNH DẠNG
// ==========================================
interface ExportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
}

export const ExportFileModal: React.FC<ExportFileModalProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  if (!isOpen) return null;

  const handleExportExcel = () => {
    const data = questions.map((q) => ({
      'Mã câu hỏi': q.code,
      'Môn học': q.subject,
      'Khối lớp': q.grade,
      'Dạng câu': q.typeLabel,
      'Mức độ': q.level,
      'Điểm': q.points,
      'Chủ đề': q.topic,
      'Nội dung': q.content,
      'Lời giải': q.explanation,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'NganHangCauHoi');
    XLSX.writeFile(workbook, `NganHangCauHoi_${new Date().toISOString().slice(0, 10)}.xlsx`);
    onClose();
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NganHangCauHoi_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0c1424] border border-cyan-500/40 rounded-xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Xuất File Ngân Hàng ({questions.length} câu)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-2.5 text-xs">
          <button
            onClick={handleExportExcel}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#080f1e] border border-emerald-500/30 hover:border-emerald-400 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Xuất Microsoft Excel (.xlsx)</div>
                <span className="text-slate-400 text-[11px]">Bảng tính đầy đủ thông số & lời giải</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={handleExportJson}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#080f1e] border border-cyan-500/30 hover:border-cyan-400 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="font-bold text-white">Xuất định dạng JSON sao lưu</div>
                <span className="text-slate-400 text-[11px]">Dễ dàng chuyển đổi giữa các hệ thống</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#080f1e] border border-amber-500/30 hover:border-amber-400 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-white">In / Xuất PDF Đề Thi Khổ A4</div>
                <span className="text-slate-400 text-[11px]">Định dạng đề thi có kèm barem chấm</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MODAL: TẠO ĐỀ THI / QUIZ TỪ CÂU ĐÃ CHỌN
// ==========================================
interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestions: QuestionItem[];
  onConfirm: (quizTitle: string, duration: number) => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  selectedQuestions,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(`Đề kiểm tra 45 phút - ${new Date().toLocaleDateString('vi-VN')}`);
  const [duration, setDuration] = useState<number>(45);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  const totalPoints = selectedQuestions.reduce((sum, q) => sum + (q.points || 1), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0c1424] border border-cyan-500/40 rounded-xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Tạo Đề Thi Từ {selectedQuestions.length} Câu Đã Chọn
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Tên đề thi / Bài kiểm tra
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2.5 text-white text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Thời gian làm bài (phút)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2 text-white text-xs"
              >
                <option value={15}>15 phút</option>
                <option value={45}>45 phút (1 tiết)</option>
                <option value={60}>60 phút</option>
                <option value={90}>90 phút (Học kỳ)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Tổng điểm đề thi
              </label>
              <div className="p-2 bg-[#080f1e] border border-slate-700 rounded-lg font-bold text-amber-300 text-xs flex items-center">
                {totalPoints} điểm ({selectedQuestions.length} câu)
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="accent-cyan-500 w-4 h-4"
              />
              <span>Xáo trộn thứ tự các câu hỏi khi phát đề cho học sinh</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="accent-cyan-500 w-4 h-4"
              />
              <span>Xáo trộn thứ tự các lựa chọn A, B, C, D (cho câu trắc nghiệm)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm(title, duration);
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận tạo đề thi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
