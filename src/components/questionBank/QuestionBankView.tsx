import React, { useState, useMemo, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  Plus,
  Layers,
  FileSpreadsheet,
  Download,
  Search,
  CheckCircle2,
  Copy,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Bot,
  X,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { QuestionItem, QuestionLevel, QuestionType } from '../../types/questionBank';
import {
  INITIAL_QUESTIONS,
  SUBJECT_OPTIONS,
  GRADE_OPTIONS,
  QUESTION_TYPES,
  LEVEL_OPTIONS,
} from '../../utils/questionBankDefaults';
import {
  fetchAllQuestionsFromCloud,
  saveQuestionToCloud,
  deleteQuestionFromCloud,
} from '../../firebase/services';
import { QuestionTypeRenderer } from './QuestionTypeRenderer';
import { QuestionEditorModal } from './QuestionEditorModal';
import { AiGenerationWizardModal } from './AiGenerationWizardModal';
import {
  QuickPasteModal,
  ImportFileModal,
  ExportFileModal,
  CreateQuizModal,
} from './ImportExportModals';

interface QuestionBankViewProps {
  onAssignToHomework?: (selectedQuestions: QuestionItem[]) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onAssignToHomework,
}) => {
  // Questions State
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);

  // Sync with Firestore on mount
  useEffect(() => {
    fetchAllQuestionsFromCloud()
      .then((cloudQuestions) => {
        if (cloudQuestions && cloudQuestions.length > 0) {
          setQuestions(cloudQuestions);
        } else {
          // Seed cloud database with initial questions
          INITIAL_QUESTIONS.forEach((q) => {
            saveQuestionToCloud(q).catch((e) => console.warn('Seeding question to cloud:', e));
          });
        }
      })
      .catch((err) => {
        console.warn('Could not fetch questions from cloud, using initial data:', err);
      });
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả môn học');
  const [selectedGrade, setSelectedGrade] = useState('Tất cả khối lớp');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Expanded explanations
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({
    q1: true, // Show explanation for q1 by default as in screenshot
  });

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isAiSuggestModalOpen, setIsAiSuggestModalOpen] = useState(false);
  const [isQuickPasteModalOpen, setIsQuickPasteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [isPromptGeminiOpen, setIsPromptGeminiOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesContent = q.content.toLowerCase().includes(query);
        const matchesCode = q.code.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesSubject = q.subject.toLowerCase().includes(query);
        if (!matchesContent && !matchesCode && !matchesTopic && !matchesSubject) {
          return false;
        }
      }

      // Subject
      if (selectedSubject !== 'Tất cả môn học' && q.subject !== selectedSubject) {
        return false;
      }

      // Grade
      if (selectedGrade !== 'Tất cả khối lớp' && q.grade !== selectedGrade) {
        return false;
      }

      // Type
      if (selectedType !== 'all' && q.type !== selectedType) {
        return false;
      }

      // Level
      if (selectedLevel !== 'all' && q.level !== selectedLevel) {
        return false;
      }

      return true;
    });
  }, [questions, searchQuery, selectedSubject, selectedGrade, selectedType, selectedLevel]);

  // Statistics calculation for the 6 KPI cards
  const stats = useMemo(() => {
    const total = questions.length;
    const nhanBiet = questions.filter((q) => q.level === 'nhan_biet').length;
    const thongHieu = questions.filter((q) => q.level === 'thong_hieu').length;
    const vanDung = questions.filter((q) => q.level === 'van_dung').length;
    const vanDungCao = questions.filter((q) => q.level === 'van_dung_cao').length;
    const uniqueTypes = new Set(questions.map((q) => q.type)).size;
    return { total, nhanBiet, thongHieu, vanDung, vanDungCao, uniqueTypes };
  }, [questions]);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Duplicate question
  const handleDuplicate = (q: QuestionItem) => {
    const newQ: QuestionItem = {
      ...q,
      id: `q_${Date.now()}`,
      code: `${q.code}-COPY`,
      content: `(Bản sao) ${q.content}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setQuestions((prev) => [newQ, ...prev]);
    saveQuestionToCloud(newQ).catch((err) => console.warn('Sync duplicated question to cloud:', err));
    showToast(`Đã nhân bản câu hỏi ${q.code}`);
  };

  // Delete single question
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này khỏi ngân hàng không?')) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      deleteQuestionFromCloud(id).catch((err) => console.warn('Delete question from cloud:', err));
      showToast('Đã xóa câu hỏi khỏi ngân hàng');
    }
  };

  // Delete batch
  const handleDeleteBatch = () => {
    if (
      window.confirm(
        `Xác nhận xóa ${selectedIds.length} câu hỏi đã chọn khỏi ngân hàng?`
      )
    ) {
      selectedIds.forEach((id) => {
        deleteQuestionFromCloud(id).catch((err) => console.warn('Delete batch question from cloud:', err));
      });
      setQuestions((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
      setSelectedIds([]);
      showToast(`Đã xóa ${selectedIds.length} câu hỏi`);
    }
  };

  // Handle Saving Question from Editor Modal
  const handleSaveQuestion = (q: QuestionItem) => {
    if (editingQuestion) {
      setQuestions((prev) => prev.map((item) => (item.id === q.id ? q : item)));
      saveQuestionToCloud(q).catch((err) => console.warn('Update question to cloud:', err));
      showToast(`Đã cập nhật câu hỏi ${q.code}`);
    } else {
      setQuestions((prev) => [q, ...prev]);
      saveQuestionToCloud(q).catch((err) => console.warn('Save new question to cloud:', err));
      showToast(`Đã thêm câu hỏi ${q.code} vào ngân hàng`);
    }
    setEditingQuestion(null);
  };

  // Handle Bulk Import from AI or Files
  const handleBulkImport = (newItems: QuestionItem[]) => {
    setQuestions((prev) => [...newItems, ...prev]);
    newItems.forEach((q) => {
      saveQuestionToCloud(q).catch((err) => console.warn('Cloud sync imported question:', err));
    });
    showToast(`Đã thêm thành công ${newItems.length} câu hỏi vào ngân hàng!`);
  };

  // Handle Create Quiz Confirmation
  const handleConfirmQuiz = (title: string, duration: number) => {
    showToast(`Đã khởi tạo thành công đề thi "${title}" (${duration} phút) từ ${selectedIds.length} câu hỏi!`);
    if (onAssignToHomework) {
      const chosen = questions.filter((q) => selectedIds.includes(q.id));
      onAssignToHomework(chosen);
    }
    setSelectedIds([]);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#0c1e33] border border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-lg shadow-xl text-xs md:text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Strictly 1 line title as requested "tiêu đề ko dc 2 dòng" */}
      <div className="bg-[#0c1424] border border-cyan-500/25 rounded-xl p-4 sm:p-5 shadow-lg shadow-black/40">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Title zone: No line wrap allowed */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/60 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              {/* Single Line Title */}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                Ngân Hàng Câu Hỏi Thông Minh
              </h2>
              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                Quản lý, phân loại 9 dạng câu hỏi, AI tạo tự động, import Excel/Word kiểm tra trùng lặp và xuất đa định dạng
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar (Exact button names from screenshot) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* AI Đề Xuất Câu Hỏi */}
            <button
              onClick={() => setIsAiSuggestModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-sm shadow-purple-950 transition-all whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>AI Đề Xuất Câu Hỏi</span>
            </button>

            {/* Thêm Nhanh Nhiều Câu */}
            <button
              onClick={() => setIsQuickPasteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#132238] border border-cyan-500/30 text-cyan-200 hover:bg-[#1a2e4c] hover:text-white transition-all whitespace-nowrap cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Thêm Nhanh Nhiều Câu</span>
            </button>

            {/* Import Excel / Word */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#132238] border border-cyan-500/30 text-cyan-200 hover:bg-[#1a2e4c] hover:text-white transition-all whitespace-nowrap cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Excel / Word</span>
            </button>

            {/* Xuất File */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#132238] border border-cyan-500/30 text-cyan-200 hover:bg-[#1a2e4c] hover:text-white transition-all whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Xuất File</span>
            </button>

            {/* Prompt Gemini */}
            <button
              onClick={() => setIsPromptGeminiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#132238] border border-purple-500/40 text-purple-200 hover:bg-purple-950/50 transition-all whitespace-nowrap cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Prompt Gemini</span>
            </button>

            {/* + Thêm Câu Mới */}
            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsAddEditModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition-all whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Câu Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 KPI CARDS STRIP: Connected dynamically to "Tất cả mức độ" filter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Card 1: TỔNG CÂU HỎI */}
        <button
          type="button"
          onClick={() => setSelectedLevel('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedLevel === 'all'
              ? 'bg-[#0f1d35] border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/50'
              : 'bg-[#0c1424] border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#0e192c]'
          }`}
        >
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            TỔNG CÂU HỎI
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {stats.total}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-0.5 truncate">
            Trong ngân hàng
          </div>
        </button>

        {/* Card 2: NHẬN BIẾT */}
        <button
          type="button"
          onClick={() => setSelectedLevel(selectedLevel === 'nhan_biet' ? 'all' : 'nhan_biet')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedLevel === 'nhan_biet'
              ? 'bg-[#072418] border-emerald-400 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400/50'
              : 'bg-[#0c1424] border-cyan-500/20 hover:border-emerald-500/40 hover:bg-[#081822]'
          }`}
        >
          <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
            NHẬN BIẾT
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {stats.nhanBiet}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Cơ bản trọng tâm
          </div>
        </button>

        {/* Card 3: THÔNG HIỂU */}
        <button
          type="button"
          onClick={() => setSelectedLevel(selectedLevel === 'thong_hieu' ? 'all' : 'thong_hieu')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedLevel === 'thong_hieu'
              ? 'bg-[#092238] border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/50'
              : 'bg-[#0c1424] border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#0e192c]'
          }`}
        >
          <div className="text-[10px] font-bold tracking-wider text-cyan-300 uppercase">
            THÔNG HIỂU
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {stats.thongHieu}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Hiểu bản chất
          </div>
        </button>

        {/* Card 4: VẬN DỤNG */}
        <button
          type="button"
          onClick={() => setSelectedLevel(selectedLevel === 'van_dung' ? 'all' : 'van_dung')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedLevel === 'van_dung'
              ? 'bg-[#291705] border-amber-400 shadow-md shadow-amber-950/50 ring-1 ring-amber-400/50'
              : 'bg-[#0c1424] border-cyan-500/20 hover:border-amber-500/40 hover:bg-[#161424]'
          }`}
        >
          <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
            VẬN DỤNG
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {stats.vanDung}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Giải quyết bài toán
          </div>
        </button>

        {/* Card 5: VẬN DỤNG CAO */}
        <button
          type="button"
          onClick={() => setSelectedLevel(selectedLevel === 'van_dung_cao' ? 'all' : 'van_dung_cao')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedLevel === 'van_dung_cao'
              ? 'bg-[#2b0c16] border-rose-400 shadow-md shadow-rose-950/50 ring-1 ring-rose-400/50'
              : 'bg-[#0c1424] border-cyan-500/20 hover:border-rose-500/40 hover:bg-[#181124]'
          }`}
        >
          <div className="text-[10px] font-bold tracking-wider text-rose-400 uppercase">
            VẬN DỤNG CAO
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {stats.vanDungCao}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Phân hóa & HSG
          </div>
        </button>

        {/* Card 6: DẠNG CÂU HỎI */}
        <button
          type="button"
          onClick={() => setSelectedType('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedType === 'all'
              ? 'bg-[#1b1233] border-purple-400 shadow-md shadow-purple-950/50'
              : 'bg-[#0c1424] border-cyan-500/20 hover:border-purple-500/40'
          }`}
        >
          <div className="text-[10px] font-bold tracking-wider text-purple-300 uppercase">
            DẠNG CÂU HỎI
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            9 / 9
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
            Hỗ trợ toàn diện
          </div>
        </button>
      </div>

      {/* FILTER CONTROLS BAR: Search + 4 Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 p-3 bg-[#0c1424] border border-cyan-500/20 rounded-xl">
        {/* 1. Search Query */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo nội dung câu hỏi, mã code, chủ đề, từ khóa..."
            className="w-full bg-[#080e1a] border border-cyan-500/30 text-xs md:text-sm text-cyan-100 rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Môn học */}
        <div className="lg:col-span-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-[#080e1a] border border-cyan-500/30 text-xs md:text-sm text-cyan-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub} className="bg-[#0f172a] text-slate-200">
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Khối lớp */}
        <div className="lg:col-span-2">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full bg-[#080e1a] border border-cyan-500/30 text-xs md:text-sm text-cyan-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {GRADE_OPTIONS.map((gr) => (
              <option key={gr} value={gr} className="bg-[#0f172a] text-slate-200">
                {gr}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Dạng câu hỏi (9 dạng) */}
        <div className="lg:col-span-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#080e1a] border border-cyan-500/30 text-xs md:text-sm text-cyan-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#0f172a] text-slate-200">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Mức độ (Synchronized with KPI cards!) */}
        <div className="lg:col-span-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full bg-[#080e1a] border border-cyan-400/80 text-xs md:text-sm text-cyan-200 font-semibold rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-300 cursor-pointer shadow-sm shadow-cyan-950"
          >
            {LEVEL_OPTIONS.map((lv) => (
              <option key={lv.value} value={lv.value} className="bg-[#0f172a] text-slate-200 font-medium">
                {lv.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUESTION LIST HEADER ROW: Checkbox, batch actions, count */}
      <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
            <input
              type="checkbox"
              checked={
                filteredQuestions.length > 0 &&
                selectedIds.length === filteredQuestions.length
              }
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-cyan-500 cursor-pointer"
            />
            <span>Chọn tất cả ({filteredQuestions.length} câu)</span>
          </label>

          {/* Batch Actions when items are selected */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 ml-2 animate-in fade-in flex-wrap">
              <span className="text-cyan-400 font-bold">
                (Đã chọn {selectedIds.length})
              </span>

              {/* Tạo đề thi / Quiz từ câu đã chọn */}
              <button
                onClick={() => setIsCreateQuizModalOpen(true)}
                className="text-white px-2.5 py-1 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 text-[11px] font-semibold flex items-center gap-1 shadow-sm shadow-cyan-950"
              >
                <ClipboardList className="w-3 h-3" />
                <span>Tạo Đề Thi ({selectedIds.length})</span>
              </button>

              {/* Giao bài tập */}
              {onAssignToHomework && (
                <button
                  onClick={() => {
                    const chosen = questions.filter((q) => selectedIds.includes(q.id));
                    onAssignToHomework(chosen);
                  }}
                  className="text-cyan-300 hover:text-white px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-medium"
                >
                  Giao bài tập
                </button>
              )}

              {/* Xóa đã chọn */}
              <button
                onClick={handleDeleteBatch}
                className="text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-[11px] font-medium"
              >
                Xóa đã chọn
              </button>
            </div>
          )}
        </div>

        <div className="font-mono text-slate-400">
          Hiển thị <strong>{filteredQuestions.length}</strong> / {questions.length} câu
        </div>
      </div>

      {/* QUESTION ITEMS LIST */}
      <div className="space-y-3.5">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-[#0c1424] border border-cyan-500/20 rounded-xl text-slate-400">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="font-semibold text-sm">Không tìm thấy câu hỏi phù hợp bộ lọc</div>
            <p className="text-xs text-slate-500 mt-1">
              Thử xóa từ khóa tìm kiếm hoặc đổi môn học, khối lớp, mức độ
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, index) => {
            const isSelected = selectedIds.includes(q.id);
            const isExpanded = !!expandedExplanations[q.id];

            // Level badge styles
            let levelBadgeStyle = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
            let levelText = 'Thông hiểu';
            if (q.level === 'nhan_biet') {
              levelBadgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
              levelText = 'Nhận biết';
            } else if (q.level === 'van_dung') {
              levelBadgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
              levelText = 'Vận dụng';
            } else if (q.level === 'van_dung_cao') {
              levelBadgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-500/40';
              levelText = 'Vận dụng cao';
            }

            return (
              <div
                key={q.id}
                className={`bg-[#0d1629] border rounded-xl p-4 sm:p-5 transition-all shadow-md ${
                  isSelected
                    ? 'border-cyan-400 ring-1 ring-cyan-400/50 bg-[#0f1b33]'
                    : 'border-cyan-500/25 hover:border-cyan-500/45'
                }`}
              >
                {/* Question Card Top Bar */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(q.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-cyan-500 cursor-pointer"
                    />

                    {/* Code Badge */}
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0a2540] text-cyan-300 border border-cyan-500/30">
                      {q.code}
                    </span>

                    {/* Type Badge */}
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1e293b] text-slate-300 border border-slate-700">
                      {q.typeLabel}
                    </span>

                    {/* Level Badge */}
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${levelBadgeStyle}`}>
                      {levelText}
                    </span>

                    {/* Subject • Grade */}
                    <span className="text-xs text-slate-400">
                      {q.subject} • {q.grade}
                    </span>
                  </div>

                  {/* Right side: Points, Copy, Edit, Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded">
                      {q.points} điểm
                    </span>

                    <button
                      onClick={() => handleDuplicate(q)}
                      className="text-slate-400 hover:text-cyan-300 p-1 rounded transition-colors cursor-pointer"
                      title="Nhân bản câu hỏi"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingQuestion(q);
                        setIsAddEditModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-cyan-300 p-1 rounded transition-colors cursor-pointer"
                      title="Chỉnh sửa câu hỏi"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <div className="mt-3.5">
                  <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    <span className="text-cyan-400 mr-1.5">Câu {index + 1}:</span>
                    <span>{q.content}</span>
                  </h3>

                  {/* Render dedicated question type visualization (All 9 types supported) */}
                  <QuestionTypeRenderer question={q} />
                </div>

                {/* Footer: Expand Explanation & Topic info */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer w-fit"
                  >
                    {isExpanded ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isExpanded
                        ? 'Ẩn lời giải & hướng dẫn chấm'
                        : 'Xem lời giải & hướng dẫn chấm'}
                    </span>
                  </button>

                  <div className="text-slate-400 italic">
                    Chủ đề: <span className="text-slate-300 font-normal">{q.topic}</span>
                  </div>
                </div>

                {/* Expandable Explanation Area */}
                {isExpanded && (
                  <div className="mt-3 p-3.5 rounded-lg bg-[#071324] border border-cyan-500/30 text-xs sm:text-sm text-cyan-100 leading-relaxed animate-in fade-in">
                    <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Hướng dẫn giải chi tiết & Thang điểm:</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-200">
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Add or Edit Question (Supports all 9 types) */}
      <QuestionEditorModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
      />

      {/* MODAL 2: AI Đề Xuất Câu Hỏi (Gemini Wizard) */}
      <AiGenerationWizardModal
        isOpen={isAiSuggestModalOpen}
        onClose={() => setIsAiSuggestModalOpen(false)}
        onImportQuestions={handleBulkImport}
      />

      {/* MODAL 3: Thêm Nhanh Nhiều Câu (Quick Paste) */}
      <QuickPasteModal
        isOpen={isQuickPasteModalOpen}
        onClose={() => setIsQuickPasteModalOpen(false)}
        onImport={handleBulkImport}
      />

      {/* MODAL 4: Import Excel / Word */}
      <ImportFileModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleBulkImport}
      />

      {/* MODAL 5: Xuất File */}
      <ExportFileModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        questions={filteredQuestions}
      />

      {/* MODAL 6: Tạo Đề Thi / Quiz từ câu đã chọn */}
      <CreateQuizModal
        isOpen={isCreateQuizModalOpen}
        onClose={() => setIsCreateQuizModalOpen(false)}
        selectedQuestions={questions.filter((q) => selectedIds.includes(q.id))}
        onConfirm={handleConfirmQuiz}
      />

      {/* MODAL 7: Prompt Gemini */}
      {isPromptGeminiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0c1424] border border-cyan-500/50 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base md:text-lg font-bold text-white">
                  Mẫu Prompt Gemini Soạn Câu Hỏi Chuẩn GDPT 2018
                </h3>
              </div>
              <button
                onClick={() => setIsPromptGeminiOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-300">
                Sao chép prompt chuẩn chuyên gia khảo thí dưới đây để dán vào Gemini hoặc AI Assistant:
              </p>
              <textarea
                readOnly
                rows={6}
                value={`Hãy đóng vai chuyên gia khảo thí và đo lường giáo dục Bộ GD&ĐT Việt Nam theo chương trình GDPT 2018.
Hãy biên soạn 5 câu hỏi môn Toán Khối 9 chủ đề "Hệ thức lượng trong tam giác vuông" gồm 4 mức độ nhận thức:
1 câu Nhận biết, 2 câu Thông hiểu, 1 câu Vận dụng, 1 câu Vận dụng cao.
Định dạng JSON có các trường: code, type, level, content, options, explanation.`}
                className="w-full bg-[#080f1e] border border-cyan-500/30 rounded-lg p-3 text-cyan-200 font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsPromptGeminiOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Hãy đóng vai chuyên gia khảo thí và đo lường giáo dục Bộ GD&ĐT Việt Nam theo chương trình GDPT 2018. Hãy biên soạn 5 câu hỏi môn Toán Khối 9 chủ đề "Hệ thức lượng trong tam giác vuông"...`
                  );
                  showToast('Đã sao chép Prompt Gemini vào bộ nhớ tạm!');
                  setIsPromptGeminiOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
              >
                Sao chép Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
