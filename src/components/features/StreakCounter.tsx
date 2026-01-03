'use client';

import { Flame, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface StreakCounterProps {
  streak: number;
  maiorStreak?: number;
  diasPendentes?: number;
  diasMargemRestante?: number;
  hojeCompleto?: boolean;
  className?: string;
}

export function StreakCounter({
  streak,
  maiorStreak,
  diasPendentes = 0,
  diasMargemRestante = 0,
  hojeCompleto = false,
  className,
}: StreakCounterProps) {
  const hasActiveStreak = streak > 0;
  const streakEmRisco = diasPendentes > 0 && !hojeCompleto;
  const streakProtegido = diasPendentes > 0 && diasMargemRestante > 0;

  // Determina o status visual
  const getStreakStatus = () => {
    if (hojeCompleto) {
      return {
        bgClass: 'bg-gradient-to-br from-green-500 to-emerald-500',
        textClass: 'text-green-600',
        label: 'Dia completo!',
      };
    }
    if (streakEmRisco && diasMargemRestante === 0) {
      return {
        bgClass: 'bg-gradient-to-br from-orange-400 to-red-400',
        textClass: 'text-orange-600',
        label: 'Complete hoje!',
      };
    }
    if (streakEmRisco && streakProtegido) {
      return {
        bgClass: 'bg-gradient-to-br from-amber-400 to-orange-400',
        textClass: 'text-amber-600',
        label: `${diasMargemRestante} dias de margem`,
      };
    }
    if (hasActiveStreak) {
      return {
        bgClass: 'bg-gradient-to-br from-accent-coral to-accent-salmon',
        textClass: 'text-accent-coral',
        label: null,
      };
    }
    return {
      bgClass: 'bg-white/60',
      textClass: 'text-neutral-medium-gray',
      label: 'Comece sua sequência!',
    };
  };

  const status = getStreakStatus();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.div
        animate={
          hasActiveStreak && !streakEmRisco
            ? { scale: [1, 1.1, 1] }
            : streakEmRisco
            ? { scale: [1, 1.05, 1], rotate: [-2, 2, -2] }
            : {}
        }
        transition={{
          duration: streakEmRisco ? 0.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
          status.bgClass
        )}
      >
        <Flame
          className={cn(
            'w-6 h-6',
            hasActiveStreak || hojeCompleto ? 'text-white' : 'text-neutral-medium-gray'
          )}
          fill={hasActiveStreak || hojeCompleto ? 'currentColor' : 'none'}
        />
      </motion.div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-neutral-medium-gray">Sequência</p>
          {streakProtegido && (
            <Shield className="w-3.5 h-3.5 text-amber-500" />
          )}
          {streakEmRisco && diasMargemRestante === 0 && (
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
          )}
        </div>

        <p className="text-2xl font-bold text-neutral-dark-gray">
          {streak} {streak === 1 ? 'dia' : 'dias'}
        </p>

        {/* Status do streak */}
        {status.label && (
          <p className={cn('text-xs font-medium', status.textClass)}>
            {status.label}
          </p>
        )}

        {/* Maior streak */}
        {!status.label && maiorStreak && maiorStreak > streak && (
          <p className="text-xs text-neutral-medium-gray flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Maior: {maiorStreak} dias
          </p>
        )}
      </div>

      {/* Badge de dias pendentes */}
      {diasPendentes > 0 && !hojeCompleto && (
        <div
          className={cn(
            'px-2 py-1 rounded-lg text-center',
            diasMargemRestante > 0 ? 'bg-amber-100' : 'bg-orange-100'
          )}
        >
          <p
            className={cn(
              'text-xs',
              diasMargemRestante > 0 ? 'text-amber-600' : 'text-orange-600'
            )}
          >
            Pendente
          </p>
          <p
            className={cn(
              'text-lg font-bold',
              diasMargemRestante > 0 ? 'text-amber-700' : 'text-orange-700'
            )}
          >
            {diasPendentes}
          </p>
        </div>
      )}
    </div>
  );
}
