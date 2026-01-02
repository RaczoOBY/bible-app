'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/Card';
import { ReadingCard } from '@/components/features/ReadingCard';
import { DayProgress } from '@/components/features/DayProgress';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LeituraDia } from '@/types/plano';

interface LeituraComStatus extends LeituraDia {
  completada: boolean;
  leituraId?: string;
}

export default function LeituraPage() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [dia, setDia] = useState(hoje.getDate());
  const [leituras, setLeituras] = useState<LeituraComStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLeituras();
  }, [mes, dia]);

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
        setLeituras((prev) =>
          prev.map((l) =>
            l.tipo === tipo
              ? { ...l, completada: !completada }
              : l
          )
        );
        await carregarLeituras();
      }
    } catch (error) {
      console.error('Erro ao marcar leitura:', error);
    }
  };

  const mudarDia = (direcao: 'anterior' | 'proximo') => {
    const novaData = new Date(2026, mes - 1, dia);
    
    if (direcao === 'anterior') {
      novaData.setDate(novaData.getDate() - 1);
    } else {
      novaData.setDate(novaData.getDate() + 1);
    }

    setMes(novaData.getMonth() + 1);
    setDia(novaData.getDate());
  };

  const completadas = leituras.filter((l) => l.completada).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-medium-gray">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-neutral-dark-gray">
            Leitura do Dia
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              onClick={() => mudarDia('anterior')}
              disabled={mes === 1 && dia === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-medium text-neutral-dark-gray min-w-[100px] text-center">
              {format(new Date(2026, mes - 1, dia), 'dd/MM', { locale: ptBR })}
            </span>
            <Button
              variant="icon"
              onClick={() => mudarDia('proximo')}
              disabled={mes === 12 && dia === 25}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
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
    </div>
  );
}
