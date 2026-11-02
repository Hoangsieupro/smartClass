import React from 'react';
import { HelpCircle, Send, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { TeachingTab } from '../../types/questionBank';

interface TeachingNavigationProps {
  activeTab: TeachingTab;
  onTabChange: (tab: TeachingTab) => void;
}

export const TEACHING_MENU_ITEMS: {
  id: TeachingTab;
  position: number;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: 'question_bank',
    position: 1,
    label: 'Ngân hàng câu hỏi',
    badge: '10',
    icon: HelpCircle,
    description: 'Quản lý, phân loại 9 dạng câu hỏi và ngân hàng đề',
  },
  {
    id: 'homework',
    position: 2,
    label: 'Giao bài tập',
    badge: '3 đang mở',
    icon: Send,
    description: 'Giao bài tập về nhà và bài kiểm tra cho các lớp',
  },
  {
    id: 'auto_grading',
    position: 3,
    label: 'Chấm bài tự động',
    badge: 'AI Scan',
    icon: CheckCircle2,
    description: 'Chấm trắc nghiệm và chấm tự luận thông minh',
  },
  {
    id: 'digital_docs',
    position: 4,
    label: 'Tài liệu số',
    badge: 'Kho bài giảng',
    icon: FileText,
    description: 'Giáo án điện tử, tài liệu học tập, chuyên đề',
  },
  {
    id: 'ai_assistant',
    position: 5,
    label: 'AI HỖ TRỢ',
    badge: 'Gemini',
    icon: Sparkles,
    description: 'Trợ lý giáo viên soạn đề, phân tích học lực',
  },
];

export const TeachingNavigation: React.FC<TeachingNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full bg-[#0c1424] border-b border-cyan-500/20 px-4 sm:px-6 lg:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max py-1">
          {TEACHING_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-sm shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
                title={`${item.position}. ${item.label} - ${item.description}`}
              >
                {/* Position Index Number */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                    isActive
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700'
                  }`}
                >
                  {item.position}
                </span>

                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />

                <span className={item.id === 'ai_assistant' ? 'font-bold uppercase tracking-wider text-amber-300' : ''}>
                  {item.label}
                </span>

                {/* Subtle active underline indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
