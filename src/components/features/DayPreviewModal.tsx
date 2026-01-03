'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookOpen, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DayProgress } from './DayProgress';
import { cn } from '@/lib/utils/cn';
import type { LeituraDia } from '@/types/plano';

interface LeituraComStatus extends LeituraDia {
  completada: boolean;
  leituraId?: string;
}

interface DayPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dia: number;
  mes: number;
  onNavigate?: () => void;
}

export function DayPreviewModal({
  isOpen,
  onClose,
  dia,
  mes,
  onNavigate,
}: DayPreviewModalProps) {
  const router = useRouter();
  const [leituras, setLeituras] = useState<LeituraComStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && dia && mes) {
      carregarLeituras();
    }
  }, [isOpen, dia, mes]);

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

  const handleNavigateToDay = () => {
    onClose();
    if (onNavigate) {
      onNavigate();
    } else {
      router.push(`/leitura?mes=${mes}&dia=${dia}`);
    }
  };

  const completadas = leituras.filter((l) => l.completada).length;
  const dataFormatada = format(new Date(2026, mes - 1, dia), "d 'de' MMMM", { locale: ptBR });

  const hoje = new Date();
  const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() + 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center pb-2 border-b border-black/8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary-teal" />
            <h2 className="text-xl font-bold text-neutral-dark-gray">
              Leituras do Dia
            </h2>
          </div>
          <p className="text-neutral-medium-gray">
            {dataFormatada}
            {isHoje && (
              <span className="ml-2 px-2 py-0.5 bg-primary-mint text-primary-teal text-xs rounded-full font-medium">
                Hoje
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-neutral-medium-gray">
            Carregando...
          </div>
        ) : (
          <>
            {/* Progresso */}
            <DayProgress total={4} completadas={completadas} />

            {/* Lista de leituras */}
            <div className="space-y-2">
              {leituras.map((leitura) => (
                <div
                  key={leitura.tipo}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl transition-all',
                    leitura.completada
                      ? 'bg-primary-mint/50'
                      : 'bg-white/60'
                  )}
                >
                  {leitura.completada ? (
                    <CheckCircle className="w-5 h-5 text-primary-teal flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-medium-gray flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium truncate',
                      leitura.completada
                        ? 'text-primary-teal'
                        : 'text-neutral-dark-gray'
                    )}>
                      {leitura.livro}
                    </p>
                    <p className="text-sm text-neutral-medium-gray">
                      {leitura.abrev} {leitura.referencia}
                    </p>
                  </div>
                  {leitura.completada && (
                    <span className="text-xs text-primary-teal font-medium px-2 py-1 bg-primary-teal/10 rounded-full">
                      +10 XP
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Mensagem de status */}
            {completadas === 4 ? (
              <div className="text-center py-2 bg-primary-teal/10 rounded-xl">
                <span className="text-primary-teal font-medium">
                  🎉 Dia completo! +50 XP bônus
                </span>
              </div>
            ) : completadas > 0 ? (
              <div className="text-center py-2 text-neutral-medium-gray text-sm">
                Faltam {4 - completadas} leitura{4 - completadas > 1 ? 's' : ''} para completar o dia
              </div>
            ) : null}

            {/* Botão de ação */}
            <Button
              variant="primary"
              onClick={handleNavigateToDay}
              className="w-full"
            >
              <span>{completadas < 4 ? 'Continuar Leituras' : 'Ver Detalhes'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
