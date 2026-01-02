'use client';

import { calcularNivel } from '@/lib/utils/gamificacao';
import { cn } from '@/lib/utils/cn';

interface LevelBadgeProps {
  xp: number;
  className?: string;
  showLabel?: boolean;
}

export function LevelBadge({ xp, className, showLabel = true }: LevelBadgeProps) {
  const nivel = calcularNivel(xp);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-teal to-primary-sage flex items-center justify-center text-xl shadow-soft">
        {nivel.icone}
      </div>
      {showLabel && (
        <div>
          <p className="text-xs text-neutral-medium-gray">Nível {nivel.nivel}</p>
          <p className="text-sm font-semibold text-neutral-dark-gray">{nivel.nome}</p>
        </div>
      )}
    </div>
  );
}
