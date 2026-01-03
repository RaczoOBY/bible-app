'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';
import { formatarReferencia } from '@/lib/utils/plano';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';
import type { LeituraDia } from '@/types/plano';

interface ReadingCardProps {
  leitura: LeituraDia;
  completada: boolean;
  loading?: boolean;
  onToggle: () => void;
  className?: string;
}

export function ReadingCard({
  leitura,
  completada,
  loading = false,
  onToggle,
  className,
}: ReadingCardProps) {
  const referencia = formatarReferencia(leitura.abrev, leitura.referencia);

  return (
    <Card
      variant={completada ? 'mint' : 'default'}
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-medium',
        completada && 'ring-2 ring-[var(--primary-teal)]/30',
        loading && 'pointer-events-none',
        className
      )}
      onClick={loading ? undefined : onToggle}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox ou Loading Spinner */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: 'var(--primary-teal)' }}
              />
            </div>
          ) : (
            <div className={cn(
              'transition-transform duration-200',
              completada && 'scale-110'
            )}>
              <Checkbox checked={completada} onChange={onToggle} />
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className={cn(
          'flex-1 transition-opacity duration-200',
          loading && 'opacity-70'
        )}>
          <p className={cn(
            'font-semibold transition-all duration-300',
            completada
              ? 'text-[var(--primary-teal)]'
              : 'text-[var(--neutral-dark-gray)]'
          )}>
            {leitura.livro}
          </p>
          <p className="text-sm text-[var(--neutral-medium-gray)]">{referencia}</p>
        </div>

        {/* XP Badge com animação */}
        <div className={cn(
          'transition-all duration-300 transform',
          completada
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-4 scale-75'
        )}>
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-bold',
            'bg-[var(--primary-teal)]/10 text-[var(--primary-teal)]'
          )}>
            +10 XP
          </div>
        </div>
      </div>
    </Card>
  );
}
