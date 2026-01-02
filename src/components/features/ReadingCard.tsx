'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';
import { formatarReferencia } from '@/lib/utils/plano';
import { cn } from '@/lib/utils/cn';
import type { LeituraDia } from '@/types/plano';

interface ReadingCardProps {
  leitura: LeituraDia;
  completada: boolean;
  onToggle: () => void;
  className?: string;
}

export function ReadingCard({
  leitura,
  completada,
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
        className
      )}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <Checkbox checked={completada} onChange={onToggle} />
        <div className="flex-1">
          <p className="font-semibold text-[var(--neutral-dark-gray)]">{leitura.livro}</p>
          <p className="text-sm text-[var(--neutral-medium-gray)]">{referencia}</p>
        </div>
        {completada && (
          <div className="text-[var(--primary-teal)] font-bold text-sm">+10 XP</div>
        )}
      </div>
    </Card>
  );
}
