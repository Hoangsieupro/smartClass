import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/timetable';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => {
        let bgStyle = 'bg-slate-900 border-cyan-500/50 text-cyan-200';
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-[#062419] border-emerald-500/60 text-emerald-200';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-[#290c14] border-rose-500/60 text-rose-200';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-[#291e0a] border-amber-500/60 text-amber-200';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl shadow-black/40 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${bgStyle}`}
          >
            {icon}
            <div className="text-xs md:text-sm font-medium leading-relaxed flex-1">
              {toast.message}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
