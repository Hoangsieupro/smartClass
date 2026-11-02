import React, { useState } from 'react';
import {
  Send,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart2,
  Bell,
  MoreVertical,
  BookOpen
} from 'lucide-react';

export const HomeworkView: React.FC = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 'hw1',
      title: 'Bài tập tuần 24: Căn bậc hai & Hằng đẳng thức',
      subject: 'Toán học',
      classTarget: 'Lớp 7A3',
      questionCount: 10,
      assignedDate: '16/10/2026',
      dueDate: '20/10/2026 - 23:59',
      submittedCount: 32,
      totalStudents: 38,
      status: 'active', // active, completed, grading
      avgScore: 8.4,
    },
    {
      id: 'hw2',
      title: 'Kiểm tra 15 phút: Hệ thức lượng tam giác vuông',
      subject: 'Toán học',
      classTarget: 'Lớp 9A4',
      questionCount: 15,
      assignedDate: '15/10/2026',
      dueDate: '19/10/2026 - 20:00',
      submittedCount: 40,
      totalStudents: 40,
      status: 'grading',
      avgScore: 7.8,
    },
    {
      id: 'hw3',
      title: 'Ôn tập chương 1: Đoạn trích Truyện Kiều',
      subject: 'Ngữ văn',
      classTarget: 'Lớp 9A4',
      questionCount: 8,
      assignedDate: '12/10/2026',
      dueDate: '16/10/2026 - 22:00',
      submittedCount: 38,
      totalStudents: 40,
      status: 'completed',
      avgScore: 8.1,
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="w-full space-y-4">
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-cyan-950 border border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-lg shadow-xl text-xs md:text-sm font-medium animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-[#0c1424] border border-cyan-500/25 rounded-xl p-4 sm:p-5 shadow-lg shadow-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Giao Bài Tập & Quản Lý Nhiệm Vụ Học Tập
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Giao bài tập về nhà, bài kiểm tra trắc nghiệm & tự luận, theo dõi tiến độ nộp bài của học sinh
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Giao bài tập mới</span>
        </button>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0c1424] border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Đang diễn ra</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">2 bài</div>
          </div>
          <Clock className="w-8 h-8 text-cyan-500/40" />
        </div>
        <div className="bg-[#0c1424] border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Tỷ lệ nộp bài trung bình</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">94.8%</div>
          </div>
          <Users className="w-8 h-8 text-emerald-500/40" />
        </div>
        <div className="bg-[#0c1424] border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Điểm số trung bình toàn khối</div>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">8.1 / 10</div>
          </div>
          <BarChart2 className="w-8 h-8 text-amber-500/40" />
        </div>
      </div>

      <div className="space-y-3">
        {assignments.map((item) => {
          const percent = Math.round((item.submittedCount / item.totalStudents) * 100);

          return (
            <div
              key={item.id}
              className="bg-[#0d1629] border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl p-4 sm:p-5 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#092238] text-cyan-300 border border-cyan-500/30">
                      {item.classTarget}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {item.subject}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {item.questionCount} câu hỏi từ Ngân hàng
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white hover:text-cyan-300 cursor-pointer">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-auto">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      item.status === 'active'
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                        : item.status === 'grading'
                        ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    {item.status === 'active' && 'Đang nhận bài'}
                    {item.status === 'grading' && 'Đang chấm điểm'}
                    {item.status === 'completed' && 'Đã hoàn thành'}
                  </span>

                  <button
                    onClick={() => showToast(`Đã gửi thông báo nhắc nộp bài tới ${item.classTarget}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111e36] text-cyan-300 border border-cyan-500/30 hover:bg-cyan-950/60 text-xs font-medium"
                    title="Gửi thông báo nhắc học sinh"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Nhắc nộp bài</span>
                  </button>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Hạn nộp: <strong className="text-slate-100">{item.dueDate}</strong></span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Tiến độ nộp:</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {item.submittedCount}/{item.totalStudents} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-slate-400">Điểm TB:</span>
                  <span className="font-mono text-sm font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                    {item.avgScore} / 10
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tạo bài tập */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0c1424] border border-cyan-500/40 rounded-xl p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Giao Bài Tập Cho Lớp</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Đã tạo và gửi bài tập thành công!');
                setIsCreateOpen(false);
              }}
              className="space-y-3.5 text-xs md:text-sm"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tiêu đề bài tập</label>
                <input
                  type="text"
                  required
                  defaultValue="Bài tập trắc nghiệm chương 2 - Hình học 9"
                  className="w-full bg-[#080f1e] border border-cyan-500/30 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lớp nhận bài</label>
                  <select className="w-full bg-[#080f1e] border border-cyan-500/30 rounded-lg p-2 text-white">
                    <option>Lớp 7A3</option>
                    <option>Lớp 7A1</option>
                    <option>Lớp 8B1</option>
                    <option>Lớp 9A4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hạn nộp bài</label>
                  <input
                    type="date"
                    defaultValue="2026-10-25"
                    className="w-full bg-[#080f1e] border border-cyan-500/30 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nguồn câu hỏi</label>
                <div className="p-3 bg-[#080f1e] border border-cyan-500/20 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                  <span>Lấy tự động 10 câu từ <strong>Ngân hàng câu hỏi (Vị trí 1)</strong></span>
                  <span className="text-cyan-400 font-bold">10 câu</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Xác nhận giao bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
