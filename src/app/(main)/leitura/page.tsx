'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/Card';
import { ReadingCard } from '@/components/features/ReadingCard';
import { DayProgress } from '@/components/features/DayProgress';
import { MonthCalendar } from '@/components/features/MonthCalendar';
import { DatePickerModal } from '@/components/features/DatePickerModal';
import { Toast, ToastType } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkeletonLeituraPage } from '@/components/ui/Skeleton';
import type { LeituraDia } from '@/types/plano';

interface LeituraComStatus extends LeituraDia {
  completada: boolean;
  leituraId?: string;
}

interface ProgressoMes {
  mes: number;
  nome: string;
  diasCompletados: number;
  diasCompletadosArray: number[];
  totalDias: number;
  percentual: number;
}

export default function LeituraPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hoje = new Date();
  const [mes, setMes] = useState(() => {
    const mesParam = searchParams.get('mes');
    return mesParam ? parseInt(mesParam) : hoje.getMonth() + 1;
  });
  const [dia, setDia] = useState(() => {
    const diaParam = searchParams.get('dia');
    return diaParam ? parseInt(diaParam) : hoje.getDate();
  });
  const [leituras, setLeituras] = useState<LeituraComStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [diasCompletados, setDiasCompletados] = useState<Map<number, Set<number>>>(new Map());
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    description?: string;
    visible: boolean;
  } | null>(null);

  // Carregar progresso para o date picker
  const carregarProgresso = useCallback(async () => {
    try {
      const response = await fetch('/api/progresso');
      const data = await response.json();

      if (data.progressoPorMes) {
        const novoMap = new Map<number, Set<number>>();
        data.progressoPorMes.forEach((m: ProgressoMes) => {
          novoMap.set(m.mes, new Set(m.diasCompletadosArray || []));
        });
        setDiasCompletados(novoMap);
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  }, []);

  useEffect(() => {
    carregarLeituras();
    carregarProgresso();
  }, [mes, dia, carregarProgresso]);

  const carregarLeituras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leituras/dia?mes=${mes}&dia=${dia}`);
      const data = await response.json();
      
      if (data.leituras) {
        setLeituras(data.leituras);
      }
    } catch (error) {
      console.error('Erro ao carregar leituras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLeitura = async (tipo: string, completada: boolean) => {
    try {
      const response = await fetch('/api/leituras/marcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mes,
          dia,
          tipo,
          completada: !completada,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar estado local
        setLeituras((prev) =>
          prev.map((l) =>
            l.tipo === tipo
              ? { ...l, completada: !completada }
              : l
          )
        );

        // Mostrar XP ganho
        if (data.xpGanho && !completada) {
          setToast({
            type: 'success',
            message: `+${data.xpGanho} XP ganho!`,
            visible: true,
          });
        }

        // Verificar se completou todas as leituras
        const novasLeituras = leituras.map((l) =>
          l.tipo === tipo ? { ...l, completada: !completada } : l
        );
        const todasCompletadas = novasLeituras.every((l) => l.completada);

        if (todasCompletadas && !completada) {
          // Confete!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          setToast({
            type: 'success',
            message: 'Dia completo! 🎉',
            description: `+${data.xpGanho} XP total ganho!`,
            visible: true,
          });
        }

        // Level up
        if (data.levelUp) {
          setTimeout(() => {
            setToast({
              type: 'info',
              message: 'Level Up! 🎊',
              description: 'Você subiu de nível!',
              visible: true,
            });
          }, 1500);
        }

        await carregarLeituras();
        await carregarProgresso();
      }
    } catch (error) {
      console.error('Erro ao marcar leitura:', error);
      setToast({
        type: 'error',
        message: 'Erro ao marcar leitura',
        visible: true,
      });
    }
  };

  const mudarDia = (direcao: 'anterior' | 'proximo') => {
    const novaData = new Date(2026, mes - 1, dia);

    if (direcao === 'anterior') {
      novaData.setDate(novaData.getDate() - 1);
    } else {
      novaData.setDate(novaData.getDate() + 1);
    }

    const novoMes = novaData.getMonth() + 1;
    const novoDia = novaData.getDate();

    setMes(novoMes);
    setDia(novoDia);

    // Atualizar URL sem reload
    router.push(`/leitura?mes=${novoMes}&dia=${novoDia}`, { scroll: false });
  };

  const handleDateSelect = (novoDia: number, novoMes: number) => {
    setMes(novoMes);
    setDia(novoDia);
    router.push(`/leitura?mes=${novoMes}&dia=${novoDia}`, { scroll: false });
  };

  const irParaHoje = () => {
    const hojeDate = new Date();
    const novoMes = hojeDate.getMonth() + 1;
    const novoDia = hojeDate.getDate();
    setMes(novoMes);
    setDia(novoDia);
    router.push(`/leitura?mes=${novoMes}&dia=${novoDia}`, { scroll: false });
  };

  const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() + 1;

  const completadas = leituras.filter((l) => l.completada).length;

  if (loading) {
    return <SkeletonLeituraPage />;
  }

  const diasCompletadosDoMes = diasCompletados.get(mes) || new Set<number>();

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-dark-gray">
              Leitura do Dia
            </h1>
            <p className="text-sm text-neutral-medium-gray mt-1">
              {format(new Date(2026, mes - 1, dia), "EEEE, d 'de' MMMM", { locale: ptBR })}
              {isHoje && (
                <span className="ml-2 px-2 py-0.5 bg-primary-mint text-primary-teal text-xs rounded-full font-medium">
                  Hoje
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Controles de navegação */}
        <div className="flex items-center justify-between gap-2 mb-6 p-3 bg-white/40 rounded-xl">
          <button
            onClick={() => mudarDia('anterior')}
            disabled={mes === 1 && dia === 1}
            title="Dia anterior"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#2D3440' }} />
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setDatePickerOpen(true)}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" style={{ color: '#2D3440' }} />
              <span className="font-medium">
                {format(new Date(2026, mes - 1, dia), 'dd/MM', { locale: ptBR })}
              </span>
            </Button>

            {!isHoje && (
              <Button
                variant="secondary"
                onClick={irParaHoje}
                className="gap-2"
                title="Ir para hoje"
              >
                <Home className="w-4 h-4" style={{ color: '#2D3440' }} />
                <span className="hidden sm:inline">Hoje</span>
              </Button>
            )}
          </div>

          <button
            onClick={() => mudarDia('proximo')}
            disabled={mes === 12 && dia === 25}
            title="Próximo dia"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" style={{ color: '#2D3440' }} />
          </button>
        </div>

        <DayProgress total={4} completadas={completadas} className="mb-6" />

        <div className="space-y-3">
          {leituras.map((leitura) => (
            <ReadingCard
              key={leitura.tipo}
              leitura={leitura}
              completada={leitura.completada}
              onToggle={() => handleToggleLeitura(leitura.tipo, leitura.completada)}
            />
          ))}
        </div>
      </Card>

      {/* Mini calendário do mês atual */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-dark-gray">
            📅 Calendário do Mês
          </h2>
          <Button
            variant="secondary"
            onClick={() => setDatePickerOpen(true)}
            className="text-sm"
          >
            Ver todos os meses
          </Button>
        </div>
        <MonthCalendar
          mes={mes}
          diasCompletados={diasCompletadosDoMes}
          diaAtual={isHoje ? dia : undefined}
          onDiaClick={handleDateSelect}
          interactive={true}
        />
        <p className="text-xs text-neutral-medium-gray text-center mt-3">
          Toque em um dia para navegar
        </p>
      </Card>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        onSelectDate={handleDateSelect}
        mesAtual={mes}
        diaAtual={dia}
        diasCompletados={diasCompletados}
      />

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          description={toast.description}
          isVisible={toast.visible}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </div>
  );
}
