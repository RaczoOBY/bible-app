import planoData from '@/data/plano-leitura.json';
import type { PlanoLeitura } from '@/types/plano';

const plano = planoData as PlanoLeitura;

export const CONQUISTAS = plano.conquistas;

export interface ConquistaInfo {
  id: string;
  nome: string;
  desc: string;
  xp: number;
  icone: string;
}

export function getConquistaPorId(id: string): ConquistaInfo | undefined {
  return CONQUISTAS.find(c => c.id === id);
}

export function getConquistasPorTipo(tipo: 'sequencia' | 'livro' | 'mensal' | 'especial'): ConquistaInfo[] {
  const sequenciaIds = ['seq_3', 'seq_7', 'seq_14', 'seq_30', 'seq_100'];
  const livroIds = ['evangelhos', 'nt', 'biblia'];
  const mensalIds = ['mes_perfeito'];
  const especialIds = ['primeiro_dia'];

  switch (tipo) {
    case 'sequencia':
      return CONQUISTAS.filter(c => sequenciaIds.includes(c.id));
    case 'livro':
      return CONQUISTAS.filter(c => livroIds.includes(c.id));
    case 'mensal':
      return CONQUISTAS.filter(c => mensalIds.includes(c.id));
    case 'especial':
      return CONQUISTAS.filter(c => especialIds.includes(c.id));
    default:
      return CONQUISTAS;
  }
}
