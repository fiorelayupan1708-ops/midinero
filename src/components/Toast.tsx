import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, ArrowDownLeft, ArrowUpRight, Info } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  variant?: 'income' | 'expense' | 'general';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isIncome = toast.variant === 'income';
  const isExpense = toast.variant === 'expense';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all duration-300 animate-in slide-in-from-top-4 fade-in">
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex items-start gap-3 backdrop-blur-md bg-slate-900/95 text-white ${
          isIncome
            ? 'border-emerald-500/60 shadow-emerald-950/30'
            : isExpense
            ? 'border-rose-500/60 shadow-rose-950/30'
            : isError
            ? 'border-rose-600/80 shadow-rose-950/30'
            : 'border-slate-700/60 shadow-slate-950/20'
        }`}
        role="alert"
      >
        {/* Icon container */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            isIncome
              ? 'bg-emerald-500/20 text-emerald-400'
              : isExpense
              ? 'bg-rose-500/20 text-rose-400'
              : isError
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-slate-700/40 text-slate-300'
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
          ) : isExpense ? (
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <Info className="w-5 h-5 stroke-[2.2]" />
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isIncome ? 'text-emerald-400' : isExpense ? 'text-rose-400' : 'text-slate-400'
              }`}
            />
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                isIncome
                  ? 'text-emerald-400'
                  : isExpense
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {toast.title}
            </p>
          </div>
          <p className="text-xs text-slate-200 mt-1 leading-snug break-words">
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
