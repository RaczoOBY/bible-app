'use client';

import { AlertCircle, CheckCircle, Clock, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import type { StatusLeituraMes } from '@/lib/utils/plano';

interface PendingReadingsAlertProps {
  status: StatusLeituraMes;
  mesNome: string;
  onNavigateToDay?: (dia: number) => void;
  className?: string;
}

export function PendingReadingsAlert({
  status,
  mesNome,
  onNavigateToDay,
  className,
}: PendingReadingsAlertProps) {
  // Se estiver em dia, mostra mensagem positiva
  if (status.emDia) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-xl p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-green-800">Você está em dia!</p>
            <p className="text-sm text-green-600">
              {status.diasCompletados.length} de {status.diaPlanoProgramado} leituras feitas
            </p>
          </div>
          {status.diasMargemRestante > 0 && (
            <div className="text-right">
              <p className="text-xs text-green-600">Margem disponível</p>
              <p className="font-bold text-green-700">+{status.diasMargemRestante} dias</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Se há dias pendentes
  const isUrgent = status.diasMargemRestante === 0;
  const isWarning = status.diasAtrasados > 0 && status.diasMargemRestante > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl p-4 border',
        isUrgent
          ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
          : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            isUrgent ? 'bg-orange-100' : 'bg-amber-100'
          )}
        >
          {isUrgent ? (
            <AlertCircle className="w-5 h-5 text-orange-600" />
          ) : (
            <Clock className="w-5 h-5 text-amber-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('font-medium', isUrgent ? 'text-orange-800' : 'text-amber-800')}>
            {status.diasAtrasados === 1
              ? '1 dia pendente'
              : `${status.diasAtrasados} dias pendentes`}
          </p>

          <p className={cn('text-sm mt-0.5', isUrgent ? 'text-orange-600' : 'text-amber-600')}>
            {isUrgent
              ? 'Faça as leituras para não ficar ainda mais atrasado'
              : `Você ainda tem ${status.diasMargemRestante} dias de margem`}
          </p>

          {/* Dias pendentes em chips */}
          {status.diasPendentes.length <= 5 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {status.diasPendentes.map((dia) => (
                <button
                  key={dia}
                  onClick={() => onNavigateToDay?.(dia)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium transition-colors',
                    isUrgent
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  )}
                >
                  Dia {dia}
                </button>
              ))}
            </div>
          )}

          {/* Botão de ação principal */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToDay?.(status.proximoDiaRecomendado)}
            className={cn(
              'mt-3 gap-2',
              isUrgent
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
            )}
          >
            <Calendar className="w-4 h-4" />
            Fazer dia {status.proximoDiaRecomendado}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Info de margem */}
        {status.diasMargemRestante > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-amber-600">Margem restante</p>
            <p className="font-bold text-amber-700">{status.diasMargemRestante} dias</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
