import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-dark-gray mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-2xl bg-white/80 border border-black/8',
            'focus:outline-none focus:ring-2 focus:ring-primary-teal focus:bg-white',
            'transition-all duration-200',
            error && 'border-warning',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-warning">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
