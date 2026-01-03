'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XPProgressBar } from '@/components/features/XPProgressBar';
import { StreakCounter } from '@/components/features/StreakCounter';
import { ReadingCard } from '@/components/features/ReadingCard';
import { MonthCalendar } from '@/components/features/MonthCalendar';
import { DayProgress } from '@/components/features/DayProgress';
import { DayPreviewModal } from '@/components/features/DayPreviewModal';
import { Toast, ToastType } from '@/components/ui/Toast';
import { ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
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

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [leituras, setLeituras] = useState<LeituraComStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maiorStreak, setMaiorStreak] = useState(0);
  const [diasCompletados, setDiasCompletados] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    description?: string;
    visible: boolean;
  } | null>(null);

  // Estado para modal de preview
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    dia: number;
    mes: number;
  }>({ isOpen: false, dia: 0, mes: 0 });

  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const dia = hoje.getDate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carregar leituras do dia
      const leiturasRes = await fetch(`/api/leituras/dia?mes=${mes}&dia=${dia}`);
      const leiturasData = await leiturasRes.json();

      if (leiturasData.leituras) {
        setLeituras(leiturasData.leituras);
      }

      // Carregar progresso (inclui dias completados por mês)
      const progressoRes = await fetch('/api/progresso');
      const progressoData = await progressoRes.json();

      setXp(progressoData.xp || 0);
      setStreak(progressoData.sequenciaAtual || 0);
      setMaiorStreak(progressoData.maiorSequencia || 0);

      // Buscar dias completados do mês atual
      if (progressoData.progressoPorMes) {
        const mesAtual = progressoData.progressoPorMes.find(
          (m: ProgressoMes) => m.mes === mes
        );
        if (mesAtual?.diasCompletadosArray) {
          setDiasCompletados(new Set(mesAtual.diasCompletadosArray));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarClick = (diaClicado: number, mesClicado: number) => {
    // Se for o dia de hoje, não abre modal - já está mostrando as leituras
    if (diaClicado === dia && mesClicado === mes) {
      return;
    }
    setPreviewModal({ isOpen: true, dia: diaClicado, mes: mesClicado });
  };

  const handleNavigateToDay = () => {
    const { dia: diaModal, mes: mesModal } = previewModal;
    setPreviewModal({ isOpen: false, dia: 0, mes: 0 });
    router.push(`/leitura?mes=${mesModal}&dia=${diaModal}`);
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

        // Atualizar XP
        if (data.xpGanho) {
          setXp((prev) => prev + data.xpGanho);
          
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
            description: `+${data.xpGanho} XP total ganho hoje!`,
            visible: true,
          });

          const novosDias = new Set(diasCompletados);
          novosDias.add(dia);
          setDiasCompletados(novosDias);
        }

        // Level up
        if (data.levelUp) {
          setToast({
            type: 'info',
            message: 'Level Up! 🎊',
            description: 'Você subiu de nível!',
            visible: true,
          });
        }

        // Conquistas
        if (data.conquistasDesbloqueadas?.length > 0) {
          data.conquistasDesbloqueadas.forEach((id: string) => {
            setTimeout(() => {
              setToast({
                type: 'success',
                message: 'Conquista desbloqueada! 🏆',
                description: 'Nova conquista conquistada!',
                visible: true,
              });
            }, 1000);
          });
        }

        // Recarregar dados
        await carregarDados();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-medium-gray">Carregando...</div>
      </div>
    );
  }

  const completadas = leituras.filter((l) => l.completada).length;

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-neutral-dark-gray mb-2">
          Olá, {session?.user?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-neutral-medium-gray">
          {format(hoje, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Streak e XP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="peach">
          <StreakCounter streak={streak} maiorStreak={maiorStreak} />
        </Card>
        <Card>
          <XPProgressBar xp={xp} />
        </Card>
      </div>

      {/* Leituras do dia */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-dark-gray mb-4">
          📖 Leituras de Hoje ({format(hoje, 'dd/MM')})
        </h2>
        
        <DayProgress total={4} completadas={completadas} className="mb-4" />
        
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

      {/* Calendário do mês - CLICÁVEL */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-dark-gray">
            📅 {format(hoje, 'MMMM', { locale: ptBR })}
          </h2>
          <Button
            variant="secondary"
            onClick={() => router.push('/leitura')}
            className="text-sm gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <MonthCalendar
          mes={mes}
          diasCompletados={diasCompletados}
          diaAtual={dia}
          onDiaClick={handleCalendarClick}
          interactive={true}
        />
        <p className="text-xs text-neutral-medium-gray text-center mt-3">
          Toque em um dia para ver as leituras
        </p>
      </Card>

      {/* Modal de preview de leituras */}
      <DayPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, dia: 0, mes: 0 })}
        dia={previewModal.dia}
        mes={previewModal.mes}
        onNavigate={handleNavigateToDay}
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
