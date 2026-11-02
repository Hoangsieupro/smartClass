import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  FileText,
  Table,
} from 'lucide-react';
import {
  QuestionItem,
  QuestionLevel,
  QuestionType,
  QuestionOption,
  TrueFalseStatement,
  MatchingPair,
  OrderingItem,
  FillBlankItem,
  ShortAnswerConfig,
  RubricCriterion,
} from '../../types/questionBank';
import {
  QUESTION_TYPES,
  SUBJECT_OPTIONS,
  GRADE_OPTIONS,
  LEVEL_OPTIONS,
} from '../../utils/questionBankDefaults';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: QuestionItem) => void;
  initialQuestion?: QuestionItem | null;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<QuestionType>(
    initialQuestion?.type || 'single_choice'
  );
  const [level, setLevel] = useState<QuestionLevel>(
    initialQuestion?.level || 'nhan_biet'
  );
  const [subject, setSubject] = useState(initialQuestion?.subject || 'Toán học');
  const [grade, setGrade] = useState(initialQuestion?.grade || 'Khối 9');
  const [topic, setTopic] = useState(initialQuestion?.topic || '');
  const [points, setPoints] = useState(initialQuestion?.points || 1);
  const [content, setContent] = useState(initialQuestion?.content || '');
  const [explanation, setExplanation] = useState(initialQuestion?.explanation || '');

  // Type 1 & 2 Options
  const [options, setOptions] = useState<QuestionOption[]>(
    initialQuestion?.options || [
      { id: 'A', content: '', isCorrect: true },
      { id: 'B', content: '', isCorrect: false },
      { id: 'C', content: '', isCorrect: false },
      { id: 'D', content: '', isCorrect: false },
    ]
  );

  // Type 3 True/False
  const [trueFalseItems, setTrueFalseItems] = useState<TrueFalseStatement[]>(
    initialQuestion?.trueFalseItems || [
      { id: 'a', statement: '', isTrue: true },
      { id: 'b', statement: '', isTrue: false },
      { id: 'c', statement: '', isTrue: true },
      { id: 'd', statement: '', isTrue: false },
    ]
  );

  // Type 4 Matching
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>(
    initialQuestion?.matchingPairs || [
      { id: 'm1', leftPrompt: '', rightTarget: '', correctMatchId: 'A' },
      { id: 'm2', leftPrompt: '', rightTarget: '', correctMatchId: 'B' },
    ]
  );

  // Type 5 Ordering
  const [orderingItems, setOrderingItems] = useState<OrderingItem[]>(
    initialQuestion?.orderingItems || [
      { id: 'o1', text: '', correctOrder: 1 },
      { id: 'o2', text: '', correctOrder: 2 },
      { id: 'o3', text: '', correctOrder: 3 },
    ]
  );

  // Type 6 Fill Blank
  const [fillBlanks, setFillBlanks] = useState<FillBlankItem[]>(
    initialQuestion?.fillBlanks || [
      { blankIndex: 1, acceptableAnswers: [''] },
      { blankIndex: 2, acceptableAnswers: [''] },
    ]
  );

  // Type 7 Short Answer
  const [shortAnswers, setShortAnswers] = useState<string>(
    initialQuestion?.shortAnswerConfig?.correctAnswers.join(', ') || ''
  );
  const [shortUnit, setShortUnit] = useState<string>(
    initialQuestion?.shortAnswerConfig?.unit || ''
  );

  // Type 8 Essay Rubric
  const [rubric, setRubric] = useState<RubricCriterion[]>(
    initialQuestion?.rubric || [
      { id: 'r1', name: 'Độ chính xác kiến thức', maxPoints: 1.0, description: 'Trình bày đúng định lý và công thức' },
      { id: 'r2', name: 'Kỹ năng lập luận', maxPoints: 1.0, description: 'Lập luận logic, các bước chặt chẽ' },
    ]
  );

  // Type 9 Passage
  const [passageText, setPassageText] = useState<string>(
    initialQuestion?.passageText || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    const currentTypeConfig = QUESTION_TYPES.find((t) => t.value === type);

    const questionToSave: QuestionItem = {
      id: initialQuestion ? initialQuestion.id : `q_${Date.now()}`,
      code: initialQuestion ? initialQuestion.code : `${subject.substring(0, 4).toUpperCase()}9-00${Math.floor(Math.random() * 900 + 100)}`,
      type,
      typeLabel: currentTypeConfig ? currentTypeConfig.label : 'Câu hỏi',
      status: initialQuestion ? initialQuestion.status : 'approved',
      level,
      subject,
      grade,
      topic: topic || 'Kiến thức trọng tâm',
      points: Number(points) || 1,
      content,
      explanation,
      options: type === 'single_choice' || type === 'multiple_choice' ? options : undefined,
      trueFalseItems: type === 'true_false' ? trueFalseItems : undefined,
      matchingPairs: type === 'matching' ? matchingPairs : undefined,
      orderingItems: type === 'ordering' ? orderingItems : undefined,
      fillBlanks: type === 'fill_blank' ? fillBlanks : undefined,
      shortAnswerConfig:
        type === 'short_answer'
          ? {
              correctAnswers: shortAnswers
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
              unit: shortUnit,
            }
          : undefined,
      rubric: type === 'essay' ? rubric : undefined,
      passageText: type === 'passage_based' ? passageText : undefined,
      author: 'Thầy Nguyễn Văn Nam',
      authorId: 'teacher_nam',
      createdAt: initialQuestion ? initialQuestion.createdAt : new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      version: initialQuestion ? (initialQuestion.version || 1) + 1 : 1,
      usageCount: initialQuestion ? initialQuestion.usageCount : 0,
    };

    onSave(questionToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0c1424] border border-cyan-500/40 rounded-xl shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới Vào Ngân Hàng'}
              </h3>
              <p className="text-xs text-slate-400">
                Hỗ trợ đầy đủ 9 dạng câu hỏi chuẩn Bộ GD&ĐT GDPT 2018
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 py-4 space-y-4 text-xs sm:text-sm">
          {/* Metadata selectors row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080f1e] p-3 rounded-lg border border-slate-800">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Môn học
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0a1426] border border-slate-700 rounded-md p-2 text-cyan-200 text-xs focus:border-cyan-400"
              >
                {SUBJECT_OPTIONS.filter((s) => s !== 'Tất cả môn học').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Khối lớp
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-[#0a1426] border border-slate-700 rounded-md p-2 text-cyan-200 text-xs focus:border-cyan-400"
              >
                {GRADE_OPTIONS.filter((g) => g !== 'Tất cả khối lớp').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Mức độ nhận thức
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as QuestionLevel)}
                className="w-full bg-[#0a1426] border border-cyan-500/50 rounded-md p-2 text-cyan-300 font-semibold text-xs focus:border-cyan-400"
              >
                {LEVEL_OPTIONS.filter((l) => l.value !== 'all').map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">
                Thang điểm
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="10"
                value={points}
                onChange={(e) => setPoints(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#0a1426] border border-slate-700 rounded-md p-2 text-amber-300 font-bold text-xs focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Dạng câu hỏi selector (9 types) */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Dạng câu hỏi (9 dạng chuẩn)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUESTION_TYPES.filter((t) => t.value !== 'all').map((t) => {
                const isSelected = type === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setType(t.value as QuestionType)}
                    className={`px-2.5 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400 shadow-sm shadow-cyan-950'
                        : 'bg-[#080f1e] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chủ đề bài học */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Chủ đề / Yêu cầu cần đạt
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Căn thức bậc hai, Định lý Thales, ..."
              className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs sm:text-sm focus:border-cyan-400"
              required
            />
          </div>

          {/* If Passage-based, provide passage input */}
          {type === 'passage_based' && (
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
              <label className="block text-cyan-300 font-bold mb-1 text-xs">
                Ngữ liệu / Đoạn văn bản / Tình huống thực tiễn
              </label>
              <textarea
                rows={3}
                value={passageText}
                onChange={(e) => setPassageText(e.target.value)}
                placeholder="Nhập nội dung đoạn văn, bối cảnh bài toán thực tế..."
                className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2.5 text-cyan-100 text-xs focus:border-cyan-400"
              />
            </div>
          )}

          {/* Question Content */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Nội dung câu hỏi (Hỗ trợ ký hiệu toán học căn bậc hai, phân số, công thức)
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung câu hỏi..."
              className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2.5 text-white text-xs sm:text-sm focus:border-cyan-400"
              required
            />
          </div>

          {/* Dynamic Editor based on Selected Type */}
          {(type === 'single_choice' || type === 'multiple_choice') && (
            <div className="space-y-2 bg-[#080f1e] p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span className="font-semibold">
                  Các lựa chọn đáp án ({type === 'single_choice' ? '1 đáp án đúng' : 'Nhiều đáp án đúng'}):
                </span>
                <span className="text-slate-500 text-[11px]">
                  Tích chọn ô tròn để chỉ định đáp án đúng
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      opt.isCorrect
                        ? 'bg-[#08281d] border-emerald-500/70 text-emerald-200'
                        : 'bg-[#0b1424] border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type={type === 'single_choice' ? 'radio' : 'checkbox'}
                      name="correct_option"
                      checked={opt.isCorrect}
                      onChange={() => {
                        if (type === 'single_choice') {
                          setOptions((prev) =>
                            prev.map((o) => ({ ...o, isCorrect: o.id === opt.id }))
                          );
                        } else {
                          setOptions((prev) =>
                            prev.map((o) =>
                              o.id === opt.id ? { ...o, isCorrect: !o.isCorrect } : o
                            )
                          );
                        }
                      }}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-xs">{opt.id}.</span>
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptions((prev) =>
                          prev.map((o) => (o.id === opt.id ? { ...o, content: val } : o))
                        );
                      }}
                      placeholder={`Nội dung lựa chọn ${opt.id}`}
                      className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type 3: True / False */}
          {type === 'true_false' && (
            <div className="space-y-2 bg-[#080f1e] p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-xs text-slate-300 block mb-1">
                Các mệnh đề khẳng định (Ý a, b, c, d):
              </span>
              <div className="space-y-2">
                {trueFalseItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-[#0b1424] border border-slate-700 rounded-lg text-xs"
                  >
                    <span className="font-bold text-cyan-400 w-5 text-center">
                      {item.id})
                    </span>
                    <input
                      type="text"
                      value={item.statement}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTrueFalseItems((prev) =>
                          prev.map((it) => (it.id === item.id ? { ...it, statement: val } : it))
                        );
                      }}
                      placeholder={`Nhập mệnh đề ${item.id}...`}
                      className="flex-1 bg-transparent border-none text-white focus:outline-none"
                      required
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setTrueFalseItems((prev) =>
                            prev.map((it) => (it.id === item.id ? { ...it, isTrue: true } : it))
                          )
                        }
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          item.isTrue
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Đúng
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTrueFalseItems((prev) =>
                            prev.map((it) => (it.id === item.id ? { ...it, isTrue: false } : it))
                          )
                        }
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          !item.isTrue
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Sai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type 7: Short Answer */}
          {type === 'short_answer' && (
            <div className="space-y-2 bg-[#080f1e] p-3 rounded-lg border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Các đáp án chấp nhận (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={shortAnswers}
                onChange={(e) => setShortAnswers(e.target.value)}
                placeholder="VD: 6, 6 cm, 6cm"
                className="w-full bg-[#0b1424] border border-slate-700 rounded-md p-2 text-emerald-300 font-mono text-xs focus:border-cyan-400"
                required
              />
              <div className="flex items-center gap-2 mt-2">
                <label className="text-xs text-slate-400">Đơn vị (tùy chọn):</label>
                <input
                  type="text"
                  value={shortUnit}
                  onChange={(e) => setShortUnit(e.target.value)}
                  placeholder="cm, m/s, kg"
                  className="w-24 bg-[#0b1424] border border-slate-700 rounded-md p-1.5 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Type 8: Essay Rubric */}
          {type === 'essay' && (
            <div className="space-y-2 bg-[#080f1e] p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
                <span>Tiêu chí chấm điểm Rubric ({rubric.length} tiêu chí)</span>
                <button
                  type="button"
                  onClick={() =>
                    setRubric((prev) => [
                      ...prev,
                      {
                        id: `r_${Date.now()}`,
                        name: 'Tiêu chí mới',
                        maxPoints: 0.5,
                        description: 'Mô tả mức đạt',
                      },
                    ])
                  }
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm tiêu chí
                </button>
              </div>
              <div className="space-y-2">
                {rubric.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-[#0b1424] border border-slate-700 rounded-lg text-xs"
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRubric((prev) =>
                          prev.map((r) => (r.id === item.id ? { ...r, name: val } : r))
                        );
                      }}
                      placeholder="Tên tiêu chí"
                      className="w-1/3 bg-transparent border-b border-slate-700 text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRubric((prev) =>
                          prev.map((r) => (r.id === item.id ? { ...r, description: val } : r))
                        );
                      }}
                      placeholder="Mô tả mức đạt"
                      className="flex-1 bg-transparent border-b border-slate-700 text-slate-300 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.25"
                      value={item.maxPoints}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0.5;
                        setRubric((prev) =>
                          prev.map((r) => (r.id === item.id ? { ...r, maxPoints: val } : r))
                        );
                      }}
                      className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-amber-300 text-center font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setRubric((prev) => prev.filter((r) => r.id !== item.id))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Lời giải chi tiết & Hướng dẫn chấm
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Nhập hướng dẫn giải, các bước biến đổi chi tiết..."
              className="w-full bg-[#080f1e] border border-slate-700 rounded-lg p-2.5 text-cyan-100 text-xs sm:text-sm focus:border-cyan-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialQuestion ? 'Lưu cập nhật' : 'Thêm vào ngân hàng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
