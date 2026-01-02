'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { AchievementBadge } from '@/components/features/AchievementBadge';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { getConquistasPorTipo } from '@/lib/constants/conquistas';

type TipoFiltro = 'todas' | 'sequencia' | 'livro' | 'mensal' | 'especial';

interface ConquistaComStatus {
  id: string;
  nome: string;
  desc: string;
  xp: number;
  icone: string;
  desbloqueada: boolean;
  desbloqueadaEm: string | null;
  vezesObtida: number;
}

export default function ConquistasPage() {
  const [conquistas, setConquistas] = useState<ConquistaComStatus[]>([]);
  const [filtro, setFiltro] = useState<TipoFiltro>('todas');
  const [conquistaSelecionada, setConquistaSelecionada] = useState<ConquistaComStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarConquistas();
  }, []);

  const carregarConquistas = async () => {
    try {
      const response = await fetch('/api/conquistas');
      const data = await response.json();
      
      if (data.conquistas) {
        setConquistas(data.conquistas);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const conquistasFiltradas = () => {
    if (filtro === 'todas') {
      return conquistas;
    }

    const tipoMap: Record<TipoFiltro, 'sequencia' | 'livro' | 'mensal' | 'especial'> = {
      todas: 'sequencia',
      sequencia: 'sequencia',
      livro: 'livro',
      mensal: 'mensal',
      especial: 'especial',
    };

    const conquistasPorTipo = getConquistasPorTipo(tipoMap[filtro]);
    return conquistas.filter((c) =>
      conquistasPorTipo.some((ct) => ct.id === c.id)
    );
  };

  const totalDesbloqueadas = conquistas.filter((c) => c.desbloqueada).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-medium-gray">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-dark-gray">Conquistas</h1>
        <p className="text-sm text-neutral-medium-gray">
          {totalDesbloqueadas}/{conquistas.length} desbloqueadas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {(['todas', 'sequencia', 'livro', 'mensal', 'especial'] as TipoFiltro[]).map((tipo) => (
          <Badge
            key={tipo}
            variant={filtro === tipo ? 'active' : 'default'}
            onClick={() => setFiltro(tipo)}
            className="cursor-pointer capitalize"
          >
            {tipo === 'todas' ? 'Todas' : tipo}
          </Badge>
        ))}
      </div>

      {/* Grid de conquistas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {conquistasFiltradas().map((conquista) => (
          <AchievementBadge
            key={conquista.id}
            icone={conquista.icone}
            nome={conquista.nome}
            desbloqueada={conquista.desbloqueada}
            onClick={() => setConquistaSelecionada(conquista)}
          />
        ))}
      </div>

      {/* Modal de detalhes */}
      <Modal
        isOpen={!!conquistaSelecionada}
        onClose={() => setConquistaSelecionada(null)}
        title={conquistaSelecionada?.nome}
      >
        {conquistaSelecionada && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">{conquistaSelecionada.icone}</div>
              <p className="text-neutral-medium-gray">{conquistaSelecionada.desc}</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
              <span className="text-sm text-neutral-medium-gray">XP</span>
              <span className="text-lg font-bold text-neutral-dark-gray">
                +{conquistaSelecionada.xp}
              </span>
            </div>

            {conquistaSelecionada.desbloqueada && conquistaSelecionada.desbloqueadaEm && (
              <div className="text-sm text-neutral-medium-gray text-center">
                Desbloqueada em{' '}
                {new Date(conquistaSelecionada.desbloqueadaEm).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
