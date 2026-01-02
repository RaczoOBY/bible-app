import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'mint' | 'lavender' | 'peach' | 'stat';
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl';
    
    const variants = {
      default: 'glass-medium',
      mint: 'card-mint rounded-xl',
      lavender: 'card-lavender rounded-xl',
      peach: 'card-peach rounded-xl',
      stat: 'bg-white/50 rounded-2xl min-w-[140px]',
    };
    
    const paddings = {
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };
    
    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
