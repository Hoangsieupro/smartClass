import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  BookOpen,
  FileText,
  UserCheck,
  CheckCircle2,
  Copy,
  RotateCcw,
  Lightbulb
} from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: `Xin chào Thầy/Cô! Tôi là Trợ Lý AI Giáo Dục Thông Minh. Tôi có thể hỗ trợ Thầy/Cô:
1. Soạn ma trận và đề thi trắc nghiệm theo 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
2. Soạn kế hoạch bài dạy (Giáo án) theo Công văn 5512 định hướng năng lực
3. Viết lời nhận xét học bạ học sinh chi tiết, nhân văn và mang tính khích lệ
4. Đề xuất phương án phụ đạo học sinh yếu hoặc bồi dưỡng học sinh giỏi

Thầy/Cô có thể chọn các mẫu bên dưới hoặc gõ yêu cầu trực tiếp!`,
      time: '14:30',
    },
  ]);

  const quickPrompts = [
    'Soạn ma trận đề kiểm tra giữa kỳ 1 môn Toán 9 (40 trắc nghiệm + 3 tự luận)',
    'Viết kế hoạch bài dạy CV 5512: Bài 3 - Định luật Ôm (Vật lý 9)',
    'Tạo 10 câu trắc nghiệm Ngữ văn 9 phân tích nhân vật Thúy Kiều',
    'Gợi ý 5 mẫu nhận xét học bạ môn Tiếng Anh cho học sinh chăm chỉ nhưng ít nói',
  ];

  const handleSend = () => {
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setPrompt('');
    setIsLoading(true);

    setTimeout(() => {
      let aiReply = '';
      if (userMsg.toLowerCase().includes('toán') || userMsg.toLowerCase().includes('ma trận')) {
        aiReply = `Dưới đây là Khung ma trận đề kiểm tra chuẩn Bộ GD&ĐT do AI thiết kế:
• Tổng thời gian: 45 phút | Hình thức: 70% Trắc nghiệm + 30% Tự luận
1. Nhận biết (40%): 16 câu TN (4.0 điểm) - Khái niệm căn bậc hai, căn thức bậc hai, hằng đẳng thức.
2. Thông hiểu (30%): 12 câu TN (3.0 điểm) - Liên hệ phép nhân, phép khai phương và rút gọn đơn giản.
3. Vận dụng (20%): 1 câu TL (2.0 điểm) - Giải phương trình vô tỉ cơ bản và bài toán thực tế.
4. Vận dụng cao (10%): 1 câu TL (1.0 điểm) - Bất đẳng thức hoặc tìm GTLN, GTNN.

Thầy/Cô có muốn xuất trực tiếp các câu hỏi này sang "Ngân hàng câu hỏi (Vị trí 1)" không?`;
      } else if (userMsg.toLowerCase().includes('nhận xét') || userMsg.toLowerCase().includes('học bạ')) {
        aiReply = `Các mẫu nhận xét học sinh định hướng phát triển phẩm chất & năng lực:
1. "Em có ý thức tự học tốt, tiếp thu bài nhanh, tích cực tham gia thảo luận nhóm và luôn giúp đỡ bạn bè trong học tập."
2. "Em nắm chắc kiến thức trọng tâm, tính toán cẩn thận, cần tự tin phát biểu ý kiến cá nhân trước tập thể lớp nhiều hơn."
3. "Em có nhiều tiến bộ trong môn học, hoàn thành tốt các nhiệm vụ học tập được giao, chữ viết rõ ràng, trình bày mạch lạc."`;
      } else {
        aiReply = `Tôi đã ghi nhận yêu cầu của Thầy/Cô và tiến hành phân tích theo chương trình GDPT 2018. Kết quả chi tiết đã được biên soạn và tối ưu hóa để có thể nạp ngay vào hệ thống Quản lý lớp học thông minh.`;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="bg-[#0c1424] border border-cyan-500/25 rounded-xl p-4 sm:p-5 shadow-lg shadow-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 via-purple-600/30 to-cyan-500/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                AI HỖ TRỢ GIẢNG DẠY & KHẢO THÍ
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Trợ lý sư phạm AI Gemini thế hệ mới — hỗ trợ soạn đề, sinh câu hỏi, lập kế hoạch bài dạy và phân tích học tập
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat / Studio Area */}
      <div className="bg-[#0d1629] border border-cyan-500/25 rounded-xl shadow-lg flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-bold text-xs'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {m.role === 'user' ? 'GV' : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-[#071324] border border-cyan-500/30 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <div>{m.text}</div>
                <div className="text-[10px] text-slate-400 mt-1.5 text-right font-mono">
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-3 bg-[#071324] border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                <span>AI đang suy nghĩ và biên soạn nội dung...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Row */}
        <div className="p-2.5 bg-[#091020] border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Gợi ý:</span>
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => {
                setPrompt(qp);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#111e33] border border-cyan-500/20 text-cyan-300 hover:text-white hover:bg-cyan-950/80 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0c1424] border-t border-cyan-500/20 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập yêu cầu cần AI hỗ trợ (soạn câu hỏi, lập kế hoạch bài dạy, viết nhận xét...)"
            className="flex-1 bg-[#080e1a] border border-cyan-500/30 text-xs sm:text-sm text-cyan-100 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
          />

          <button
            onClick={handleSend}
            disabled={!prompt.trim() || isLoading}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              prompt.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
