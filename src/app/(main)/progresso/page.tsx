'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { XPProgressBar } from '@/components/features/XPProgressBar';
import { StreakCounter } from '@/components/features/StreakCounter';
import { MonthCalendar } from '@/components/features/MonthCalendar';
import { DayPreviewModal } from '@/components/features/DayPreviewModal';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SkeletonProgressoPage } from '@/components/ui/Skeleton';

interface ProgressoMes {
  mes: number;
  nome: string;
  diasCompletados: number;
  diasCompletadosArray: number[];
  totalDias: number;
  percentual: number;
}

export default function ProgressoPage() {
  const router = useRouter();
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

  // Estado para modal de preview
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    dia: number;
    mes: number;
  }>({ isOpen: false, dia: 0, mes: 0 });

  const hoje = new Date();

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

  const handleCalendarClick = (dia: number, mes: number) => {
    setPreviewModal({ isOpen: true, dia, mes });
  };

  const handleNavigateToDay = () => {
    const { dia, mes } = previewModal;
    setPreviewModal({ isOpen: false, dia: 0, mes: 0 });
    router.push(`/leitura?mes=${mes}&dia=${dia}`);
  };

  if (loading || !progresso) {
    return <SkeletonProgressoPage />;
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
          {progresso.progressoPorMes.map((mesData) => {
            const expandido = mesExpandido === mesData.mes;
            const diasCompletadosSet = new Set<number>(mesData.diasCompletadosArray || []);
            const isCurrentMonth = mesData.mes === hoje.getMonth() + 1;

            return (
              <div key={mesData.mes} className="border border-black/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleMes(mesData.mes)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-neutral-dark-gray">{mesData.nome}</p>
                        {isCurrentMonth && (
                          <span className="px-2 py-0.5 bg-primary-mint text-primary-teal text-xs rounded-full font-medium">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-medium-gray">
                        {mesData.diasCompletados}/{mesData.totalDias} dias
                      </p>
                    </div>
                    <div className="h-2 rounded-full bg-black/8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-teal to-primary-sage transition-all"
                        style={{ width: `${mesData.percentual}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/60 border border-black/8">
                    {expandido ? (
                      <ChevronUp className="w-5 h-5 text-neutral-dark-gray" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-dark-gray" />
                    )}
                  </div>
                </button>

                {expandido && (
                  <div className="p-4 border-t border-black/8">
                    <MonthCalendar
                      mes={mesData.mes}
                      diasCompletados={diasCompletadosSet}
                      diaAtual={isCurrentMonth ? hoje.getDate() : undefined}
                      onDiaClick={handleCalendarClick}
                      interactive={true}
                    />
                    <p className="text-xs text-neutral-medium-gray text-center mt-3">
                      Toque em um dia para ver as leituras
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modal de preview */}
      <DayPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, dia: 0, mes: 0 })}
        dia={previewModal.dia}
        mes={previewModal.mes}
        onNavigate={handleNavigateToDay}
      />
    </div>
  );
}
