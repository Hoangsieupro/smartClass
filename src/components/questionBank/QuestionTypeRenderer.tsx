import React from 'react';
import {
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ListOrdered,
  FileText,
  HelpCircle,
  Split,
  Table,
} from 'lucide-react';
import { QuestionItem } from '../../types/questionBank';

interface QuestionTypeRendererProps {
  question: QuestionItem;
}

export const QuestionTypeRenderer: React.FC<QuestionTypeRendererProps> = ({ question }) => {
  const { type } = question;

  // (1) Single Choice & (2) Multiple Choice
  if (type === 'single_choice' || type === 'multiple_choice') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
        {question.options?.map((opt) => {
          return (
            <div
              key={opt.id}
              className={`flex items-center justify-between p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                opt.isCorrect
                  ? 'bg-[#08281d] border-emerald-500/80 text-emerald-100 shadow-sm shadow-emerald-950'
                  : 'bg-[#080f1e] border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    opt.isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {opt.id}
                </span>
                <span>{opt.content}</span>
              </div>

              {opt.isCorrect && (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // (3) True / False per item (Đúng / Sai theo từng ý)
  if (type === 'true_false') {
    return (
      <div className="mt-3.5 overflow-hidden rounded-lg border border-slate-800 bg-[#080f1e]">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#0f172a] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-semibold w-12 text-center">Ý</th>
              <th className="py-2.5 px-3 font-semibold">Mệnh đề khẳng định</th>
              <th className="py-2.5 px-3 font-semibold w-24 text-center">Kết luận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {question.trueFalseItems?.map((item) => (
              <tr key={item.id} className="hover:bg-slate-900/40">
                <td className="py-2 px-3 text-center font-bold text-cyan-400">
                  {item.id}
                </td>
                <td className="py-2 px-3 text-slate-200">{item.statement}</td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                      item.isTrue
                        ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950 border border-rose-500/50 text-rose-300'
                    }`}
                  >
                    {item.isTrue ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đúng
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-rose-400" /> Sai
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // (4) Matching (Ghép đôi hai cột)
  if (type === 'matching') {
    return (
      <div className="mt-3.5 space-y-2">
        <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
          <Split className="w-3.5 h-3.5" />
          <span>Cặp ghép tương ứng chuẩn xác:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.matchingPairs?.map((pair, idx) => (
            <div
              key={pair.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#080f1e] border border-cyan-500/20 text-xs text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-cyan-900/60 text-cyan-300 font-bold flex items-center justify-center text-[11px]">
                  {idx + 1}
                </span>
                <span>{pair.leftPrompt}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mx-2" />
              <div className="font-semibold text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                {pair.rightTarget}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // (5) Ordering (Sắp xếp theo thứ tự)
  if (type === 'ordering') {
    return (
      <div className="mt-3.5 space-y-2">
        <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Trình tự các bước thực hiện chuẩn:</span>
        </div>
        <div className="space-y-1.5">
          {question.orderingItems
            ?.sort((a, b) => a.correctOrder - b.correctOrder)
            .map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#080f1e] border border-slate-800 text-xs sm:text-sm text-slate-200"
              >
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm shadow-cyan-950">
                  {item.correctOrder}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // (6) Fill-in-the-blank (Điền khuyết)
  if (type === 'fill_blank') {
    return (
      <div className="mt-3.5 p-3 rounded-lg bg-[#080f1e] border border-cyan-500/20 text-xs sm:text-sm">
        <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Từ khóa / Cụm từ cần điền vào các vị trí trống:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {question.fillBlanks?.map((b) => (
            <div
              key={b.blankIndex}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#071728] border border-cyan-500/30 text-xs"
            >
              <span className="font-bold text-cyan-400 font-mono">
                [{b.blankIndex}]
              </span>
              <span className="font-semibold text-emerald-300">
                {b.acceptableAnswers.join(' hoặc ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // (7) Short answer (Trả lời ngắn / điền số)
  if (type === 'short_answer') {
    return (
      <div className="mt-3.5 p-3 rounded-lg bg-[#080f1e] border border-cyan-500/20 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Đáp án chấp nhận:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {question.shortAnswerConfig?.correctAnswers.map((ans, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs"
              >
                {ans}
              </span>
            ))}
          </div>
        </div>
        {question.shortAnswerConfig?.unit && (
          <span className="text-xs text-slate-400">
            Đơn vị tính: <strong className="text-white">{question.shortAnswerConfig.unit}</strong>
          </span>
        )}
      </div>
    );
  }

  // (8) Essay with Rubric (Tự luận kèm bảng Rubric)
  if (type === 'essay') {
    return (
      <div className="mt-3.5 space-y-2.5">
        {question.sampleAnswer && (
          <div className="p-3 rounded-lg bg-[#080f1e] border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-cyan-400 block mb-1">
              Gợi ý dàn ý / Bài làm mẫu:
            </span>
            <p className="whitespace-pre-line leading-relaxed">{question.sampleAnswer}</p>
          </div>
        )}

        {question.rubric && question.rubric.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#080f1e]">
            <div className="px-3 py-2 bg-[#0f172a] text-xs font-semibold text-amber-300 flex items-center gap-1.5 border-b border-slate-800">
              <Table className="w-3.5 h-3.5" />
              <span>Bảng tiêu chí chấm điểm (Rubric)</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800/80 bg-slate-900/50">
                <tr>
                  <th className="py-1.5 px-3 font-medium">Tiêu chí đánh giá</th>
                  <th className="py-1.5 px-3 font-medium">Mô tả mức đạt</th>
                  <th className="py-1.5 px-3 font-medium w-20 text-right">Điểm tối đa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {question.rubric.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 font-semibold text-slate-200">{r.name}</td>
                    <td className="py-2 px-3 text-slate-400">{r.description}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-300">
                      {r.maxPoints} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // (9) Passage / Stimulus Based (Tình huống / Đoạn văn)
  if (type === 'passage_based') {
    return (
      <div className="mt-3.5 space-y-3">
        {question.passageText && (
          <div className="p-3.5 rounded-lg bg-[#071324] border-l-4 border-cyan-400 text-xs sm:text-sm text-cyan-100 leading-relaxed italic">
            <div className="font-bold text-cyan-300 not-italic mb-1 text-xs">
              Đoạn văn bản / Ngữ liệu nguồn:
            </div>
            {question.passageText}
          </div>
        )}

        {question.subQuestions && question.subQuestions.length > 0 && (
          <div className="space-y-2.5 pl-2 border-l border-slate-800">
            <div className="text-xs font-bold text-slate-400">
              Các câu hỏi thành phần ({question.subQuestions.length} ý):
            </div>
            {question.subQuestions.map((sub, i) => (
              <div
                key={sub.id}
                className="p-2.5 rounded-lg bg-[#080f1e] border border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between text-slate-200 font-semibold mb-1.5">
                  <span>
                    Ý {i + 1}: {sub.content}
                  </span>
                  <span className="text-amber-300 font-mono text-[11px]">
                    {sub.points} đ
                  </span>
                </div>
                {sub.options && (
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    {sub.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`px-2 py-1 rounded text-[11px] ${
                          opt.isCorrect
                            ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {opt.id}. {opt.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};
