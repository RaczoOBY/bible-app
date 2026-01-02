'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface StreakCounterProps {
  streak: number;
  maiorStreak?: number;
  className?: string;
}

export function StreakCounter({ streak, maiorStreak, className }: StreakCounterProps) {
  const hasActiveStreak = streak > 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.div
        animate={hasActiveStreak ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          hasActiveStreak
            ? 'bg-gradient-to-br from-accent-coral to-accent-salmon shadow-colored'
            : 'bg-white/60'
        )}
      >
        <Flame
          className={cn(
            'w-6 h-6',
            hasActiveStreak ? 'text-white' : 'text-neutral-medium-gray'
          )}
          fill={hasActiveStreak ? 'currentColor' : 'none'}
        />
      </motion.div>
      <div>
        <p className="text-sm text-neutral-medium-gray">Sequência</p>
        <p className="text-2xl font-bold text-neutral-dark-gray">
          {streak} {streak === 1 ? 'dia' : 'dias'}
        </p>
        {maiorStreak && maiorStreak > streak && (
          <p className="text-xs text-neutral-medium-gray">
            Maior: {maiorStreak} dias
          </p>
        )}
      </div>
    </div>
  );
}
