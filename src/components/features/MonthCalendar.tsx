'use client';

import { useMemo } from 'react';
import { getMesData, getDiasPorMes } from '@/lib/utils/plano';
import { cn } from '@/lib/utils/cn';

interface MonthCalendarProps {
  mes: number;
  diasCompletados: Set<number>;
  diaAtual?: number;
  className?: string;
}

export function MonthCalendar({
  mes,
  diasCompletados,
  diaAtual,
  className,
}: MonthCalendarProps) {
  const mesData = useMemo(() => getMesData(mes), [mes]);
  const diasPorMes = getDiasPorMes();

  if (!mesData) return null;

  const dias = Array.from({ length: diasPorMes }, (_, i) => i + 1);

  return (
    <div className={cn('grid grid-cols-5 gap-2', className)}>
      {dias.map((dia) => {
        const completado = diasCompletados.has(dia);
        const hoje = dia === diaAtual;

        return (
          <div
            key={dia}
            className={cn(
              'aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all',
              completado
                ? 'bg-primary-teal text-white shadow-soft'
                : hoje
                ? 'bg-primary-mint text-neutral-dark-gray ring-2 ring-primary-teal'
                : 'bg-white/60 text-neutral-medium-gray'
            )}
          >
            {dia}
          </div>
        );
      })}
    </div>
  );
}
