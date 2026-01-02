'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    // Se checked é fornecido mas não há onChange, usar defaultChecked (uncontrolled)
    // Caso contrário, usar checked com onChange (controlled)
    const isControlled = checked !== undefined && onChange !== undefined;
    
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            {...(isControlled 
              ? { checked, onChange }
              : checked !== undefined 
                ? { defaultChecked: checked }
                : {}
            )}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center',
              checked
                ? 'bg-[var(--primary-teal)] border-[var(--primary-teal)]'
                : 'bg-white/80 border-[var(--neutral-medium-gray)] group-hover:border-[var(--primary-teal)]'
            )}
          >
            {checked && (
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
        {label && (
          <span className="text-base text-[var(--neutral-dark-gray)]">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
