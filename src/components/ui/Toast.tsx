'use client';

import { ReactNode, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const styles = {
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
};

export function Toast({
  type,
  message,
  description,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'glass-medium rounded-2xl p-4 shadow-floating',
        'border border-black/8 min-w-[300px] max-w-md',
        styles[type],
        'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-sm">{message}</p>
          {description && (
            <p className="text-xs mt-1 opacity-80">{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
