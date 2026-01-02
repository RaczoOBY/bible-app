import planoData from '@/data/plano-leitura.json';
import type { PlanoLeitura, LeituraDia, DiaLeitura } from '@/types/plano';

const plano = planoData as PlanoLeitura;

export function getLeiturasDoDia(mes: number, dia: number): DiaLeitura | null {
  const mesData = plano.meses.find(m => m.id === mes);
  if (!mesData) return null;

  const diaData = mesData.dias.find(d => d.d === dia);
  if (!diaData) return null;

  const leituras: LeituraDia[] = [
    {
      tipo: 'nt1',
      livro: mesData.livros.nt1,
      abrev: mesData.abrev.nt1,
      referencia: diaData.nt1,
    },
    {
      tipo: 'nt2',
      livro: mesData.livros.nt2,
      abrev: mesData.abrev.nt2,
      referencia: diaData.nt2,
    },
    {
      tipo: 'at1',
      livro: mesData.livros.at1,
      abrev: mesData.abrev.at1,
      referencia: diaData.at1,
    },
    {
      tipo: 'at2',
      livro: mesData.livros.at2,
      abrev: mesData.abrev.at2,
      referencia: diaData.at2,
    },
  ];

  return {
    dia: diaData.d,
    leituras,
  };
}

export function getMesData(mes: number) {
  return plano.meses.find(m => m.id === mes);
}

export function getTotalDias() {
  return plano.metadata.totalDias;
}

export function getDiasPorMes() {
  return plano.metadata.diasPorMes;
}

export function getPlanoCompleto() {
  return plano;
}

export function formatarReferencia(abrev: string, referencia: string): string {
  return `${abrev} ${referencia}`;
}
