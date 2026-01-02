import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium';
    
    const variants = {
      default: 'bg-white/85 rounded-full px-3.5 py-2 text-sm',
      active: 'bg-neutral-black text-white rounded-full px-3.5 py-2 text-sm',
    };
    
    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
