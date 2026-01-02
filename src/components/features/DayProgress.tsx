'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface DayProgressProps {
  total: number;
  completadas: number;
  className?: string;
}

export function DayProgress({ total, completadas, className }: DayProgressProps) {
  const progresso = useMemo(() => (completadas / total) * 100, [completadas, total]);
  const todasCompletadas = completadas === total;

  return (
    <Card className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-neutral-dark-gray">
          Progresso do dia
        </p>
        <p className="text-sm font-semibold text-neutral-dark-gray">
          {completadas}/{total}
        </p>
      </div>
      <div className="h-2 rounded-full bg-black/8 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            todasCompletadas
              ? 'bg-gradient-to-r from-primary-teal to-primary-sage'
              : 'bg-primary-mint'
          )}
          style={{ width: `${progresso}%` }}
        />
      </div>
      {todasCompletadas && (
        <p className="mt-2 text-xs text-center text-primary-teal font-semibold">
          +50 XP bônus! 🎉
        </p>
      )}
    </Card>
  );
}
