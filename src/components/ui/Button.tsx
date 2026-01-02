import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'pill';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-neutral-black text-white rounded-full px-6 py-3 hover:bg-neutral-dark-gray',
      secondary: 'bg-white/80 text-neutral-dark-gray rounded-full px-6 py-3 border border-black/8 hover:bg-white',
      icon: 'bg-white/80 rounded-full w-11 h-11 flex items-center justify-center shadow-soft hover:bg-white',
      pill: 'bg-white/90 rounded-full px-4 py-2.5 text-sm font-medium gap-1.5',
    };
    
    const sizes = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-6 py-3',
      lg: 'text-lg px-8 py-4',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
