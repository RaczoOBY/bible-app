'use client';

import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { getMesData, getDiasPorMes } from '@/lib/utils/plano';
import { cn } from '@/lib/utils/cn';

interface MonthCalendarProps {
  mes: number;
  diasCompletados: Set<number>;
  diaAtual?: number;
  className?: string;
  onDiaClick?: (dia: number, mes: number) => void;
  interactive?: boolean;
}

export function MonthCalendar({
  mes,
  diasCompletados,
  diaAtual,
  className,
  onDiaClick,
  interactive = true,
}: MonthCalendarProps) {
  const mesData = useMemo(() => getMesData(mes), [mes]);
  const diasPorMes = getDiasPorMes();

  if (!mesData) return null;

  const dias = Array.from({ length: diasPorMes }, (_, i) => i + 1);

  const handleClick = (dia: number) => {
    if (interactive && onDiaClick) {
      onDiaClick(dia, mes);
    }
  };

  return (
    <div className={cn('grid grid-cols-5 gap-2', className)}>
      {dias.map((dia) => {
        const completado = diasCompletados.has(dia);
        const hoje = dia === diaAtual;
        const isClickable = interactive && onDiaClick;

        return (
          <button
            key={dia}
            type="button"
            onClick={() => handleClick(dia)}
            disabled={!isClickable}
            className={cn(
              'aspect-square rounded-xl flex items-center justify-center text-sm font-medium',
              'transition-all duration-300 ease-out',
              completado
                ? 'bg-primary-teal text-white shadow-soft'
                : hoje
                ? 'bg-primary-mint text-neutral-dark-gray ring-2 ring-primary-teal'
                : 'bg-white/60 text-neutral-medium-gray',
              isClickable && [
                'cursor-pointer',
                'hover:scale-105 hover:shadow-md',
                completado
                  ? 'hover:bg-primary-teal/90'
                  : hoje
                  ? 'hover:bg-primary-mint/80'
                  : 'hover:bg-white/80 hover:text-neutral-dark-gray',
                'active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-offset-2',
              ],
              !isClickable && 'cursor-default'
            )}
          >
            {completado ? (
              <span className="flex items-center gap-0.5">
                <Check className="w-3 h-3" strokeWidth={3} />
                <span className="text-xs">{dia}</span>
              </span>
            ) : (
              dia
            )}
          </button>
        );
      })}
    </div>
  );
}
