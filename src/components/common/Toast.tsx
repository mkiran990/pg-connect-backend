import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-soft-lg border backdrop-blur-lg animate-fade-in transition-all ${
        isSuccess
          ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/80'
          : isError
          ? 'bg-rose-950/90 text-rose-100 border-rose-800/80'
          : 'bg-slate-900/90 text-slate-100 border-slate-700/80'
      }`}
    >
      <div className="flex items-center space-x-3">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
        {!isSuccess && !isError && <AlertCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />}
        <span className="text-sm font-medium">{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-4"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
