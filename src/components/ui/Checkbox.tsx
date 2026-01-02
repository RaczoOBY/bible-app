'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center',
              checked
                ? 'bg-primary-teal border-primary-teal'
                : 'bg-white/80 border-neutral-medium-gray group-hover:border-primary-teal'
            )}
          >
            {checked && (
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
        {label && (
          <span className="text-base text-neutral-dark-gray">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
