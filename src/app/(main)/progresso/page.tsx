'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { XPProgressBar } from '@/components/features/XPProgressBar';
import { StreakCounter } from '@/components/features/StreakCounter';
import { MonthCalendar } from '@/components/features/MonthCalendar';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProgressoMes {
  mes: number;
  nome: string;
  diasCompletados: number;
  totalDias: number;
  percentual: number;
}

export default function ProgressoPage() {
  const [progresso, setProgresso] = useState<{
    totalDias: number;
    diasCompletados: number;
    progressoPercentual: number;
    progressoPorMes: ProgressoMes[];
    sequenciaAtual: number;
    maiorSequencia: number;
    xp: number;
    nivel: number;
  } | null>(null);
  const [mesExpandido, setMesExpandido] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProgresso();
  }, []);

  const carregarProgresso = async () => {
    try {
      const response = await fetch('/api/progresso');
      const data = await response.json();
      setProgresso(data);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMes = (mes: number) => {
    setMesExpandido(mesExpandido === mes ? null : mes);
  };

  if (loading || !progresso) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-medium-gray">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-dark-gray">Progresso</h1>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="mint">
          <div className="text-center">
            <p className="text-sm text-neutral-medium-gray mb-2">Progresso Geral</p>
            <p className="text-4xl font-bold text-neutral-dark-gray mb-2">
              {progresso.progressoPercentual.toFixed(1)}%
            </p>
            <p className="text-sm text-neutral-medium-gray">
              {progresso.diasCompletados} de {progresso.totalDias} dias
            </p>
          </div>
        </Card>

        <Card variant="lavender">
          <StreakCounter
            streak={progresso.sequenciaAtual}
            maiorStreak={progresso.maiorSequencia}
          />
        </Card>
      </div>

      {/* XP e Nível */}
      <Card>
        <XPProgressBar xp={progresso.xp} />
      </Card>

      {/* Progresso por mês */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-dark-gray mb-4">
          Progresso Mensal
        </h2>

        <div className="space-y-3">
          {progresso.progressoPorMes.map((mes) => {
            const expandido = mesExpandido === mes.mes;
            const diasCompletadosSet = new Set<number>();
            // Aqui você precisaria buscar os dias específicos completados
            // Por simplicidade, vamos mostrar apenas o progresso

            return (
              <div key={mes.mes} className="border border-black/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleMes(mes.mes)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-neutral-dark-gray">{mes.nome}</p>
                      <p className="text-sm text-neutral-medium-gray">
                        {mes.diasCompletados}/{mes.totalDias} dias
                      </p>
                    </div>
                    <div className="h-2 rounded-full bg-black/8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-teal to-primary-sage transition-all"
                        style={{ width: `${mes.percentual}%` }}
                      />
                    </div>
                  </div>
                  <Button variant="icon" className="ml-4">
                    {expandido ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </button>

                {expandido && (
                  <div className="p-4 border-t border-black/8">
                    <MonthCalendar
                      mes={mes.mes}
                      diasCompletados={diasCompletadosSet}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
