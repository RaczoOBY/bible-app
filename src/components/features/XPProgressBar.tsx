'use client';

import { useMemo } from 'react';
import { calcularNivel, calcularProgressoNivel } from '@/lib/utils/gamificacao';
import { cn } from '@/lib/utils/cn';

interface XPProgressBarProps {
  xp: number;
  className?: string;
}

export function XPProgressBar({ xp, className }: XPProgressBarProps) {
  const nivel = useMemo(() => calcularNivel(xp), [xp]);
  const progresso = useMemo(() => calcularProgressoNivel(xp), [xp]);
  const xpNoNivel = xp - nivel.xpMin;
  const xpNecessario = nivel.xpMax - nivel.xpMin;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{nivel.icone}</span>
          <div>
            <p className="text-sm font-semibold text-neutral-dark-gray">
              Nível {nivel.nivel} - {nivel.nome}
            </p>
            <p className="text-xs text-neutral-medium-gray">
              {xpNoNivel.toLocaleString()} / {xpNecessario.toLocaleString()} XP
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-neutral-dark-gray">
          {xp.toLocaleString()} XP
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-black/8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-teal to-primary-sage transition-all duration-500 ease-out"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  );
}
