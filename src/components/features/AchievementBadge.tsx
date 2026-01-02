'use client';

import { cn } from '@/lib/utils/cn';

interface AchievementBadgeProps {
  icone: string;
  nome: string;
  desbloqueada: boolean;
  onClick?: () => void;
  className?: string;
}

export function AchievementBadge({
  icone,
  nome,
  desbloqueada,
  onClick,
  className,
}: AchievementBadgeProps) {
  return (
    <button
      onClick={onClick}
      disabled={!desbloqueada && !onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300',
        desbloqueada
          ? 'bg-white/80 hover:bg-white cursor-pointer shadow-soft'
          : 'bg-white/40 cursor-not-allowed opacity-50 grayscale',
        className
      )}
    >
      <div className="text-4xl">{icone}</div>
      <p
        className={cn(
          'text-sm font-medium text-center',
          desbloqueada ? 'text-neutral-dark-gray' : 'text-neutral-medium-gray'
        )}
      >
        {nome}
      </p>
    </button>
  );
}
