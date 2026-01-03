'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MonthCalendar } from './MonthCalendar';
import { cn } from '@/lib/utils/cn';
import { getPlanoCompleto } from '@/lib/utils/plano';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dia: number, mes: number) => void;
  mesAtual: number;
  diaAtual: number;
  diasCompletados?: Map<number, Set<number>>; // Map de mes -> Set de dias
}

export function DatePickerModal({
  isOpen,
  onClose,
  onSelectDate,
  mesAtual,
  diaAtual,
  diasCompletados = new Map(),
}: DatePickerModalProps) {
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);

  const plano = useMemo(() => getPlanoCompleto(), []);
  const meses = plano.meses;

  const mesData = meses.find(m => m.id === mesSelecionado);
  const diasCompletadosDoMes = diasCompletados.get(mesSelecionado) || new Set<number>();

  const handleMesAnterior = () => {
    if (mesSelecionado > 1) {
      setMesSelecionado(mesSelecionado - 1);
    }
  };

  const handleMesProximo = () => {
    if (mesSelecionado < 12) {
      setMesSelecionado(mesSelecionado + 1);
    }
  };

  const handleDiaClick = (dia: number, mes: number) => {
    onSelectDate(dia, mes);
    onClose();
  };

  const handleIrParaHoje = () => {
    const hoje = new Date();
    onSelectDate(hoje.getDate(), hoje.getMonth() + 1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Data" size="md">
      <div className="space-y-4">
        {/* Navegação do mês */}
        <div className="flex items-center justify-between">
          <Button
            variant="icon"
            onClick={handleMesAnterior}
            disabled={mesSelecionado === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-neutral-dark-gray">
              {mesData?.nome || 'Mês'}
            </h3>
            <p className="text-sm text-neutral-medium-gray">
              Toque em um dia para ver as leituras
            </p>
          </div>

          <Button
            variant="icon"
            onClick={handleMesProximo}
            disabled={mesSelecionado === 12}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Indicador de meses */}
        <div className="flex justify-center gap-1 py-2">
          {meses.map((mes) => (
            <button
              key={mes.id}
              onClick={() => setMesSelecionado(mes.id)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                mes.id === mesSelecionado
                  ? 'bg-primary-teal w-4'
                  : 'bg-neutral-medium-gray/30 hover:bg-neutral-medium-gray/50'
              )}
              title={mes.nome}
            />
          ))}
        </div>

        {/* Calendário */}
        <MonthCalendar
          mes={mesSelecionado}
          diasCompletados={diasCompletadosDoMes}
          diaAtual={mesSelecionado === mesAtual ? diaAtual : undefined}
          onDiaClick={handleDiaClick}
          interactive={true}
        />

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 pt-2 border-t border-black/8">
          <div className="flex items-center gap-2 text-xs text-neutral-medium-gray">
            <div className="w-4 h-4 rounded bg-primary-teal" />
            <span>Completado</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-medium-gray">
            <div className="w-4 h-4 rounded bg-primary-mint ring-2 ring-primary-teal" />
            <span>Hoje</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-medium-gray">
            <div className="w-4 h-4 rounded bg-white/60" />
            <span>Pendente</span>
          </div>
        </div>

        {/* Botão ir para hoje */}
        <Button
          variant="secondary"
          onClick={handleIrParaHoje}
          className="w-full mt-2"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Ir para Hoje
        </Button>
      </div>
    </Modal>
  );
}
