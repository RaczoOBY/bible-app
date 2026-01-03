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

/**
 * Calcula o dia do plano esperado com base na data atual
 * O plano tem 25 dias por mês, então mapeamos o dia do mês real para o dia do plano
 * Dias 1-25 do mês real = dias 1-25 do plano
 * Dias 26-31 = ainda é dia 25 do plano (margem para recuperação)
 */
export function getDiaPlanoPorData(data: Date): number {
  const diaDoMes = data.getDate();
  return Math.min(diaDoMes, plano.metadata.diasPorMes);
}

/**
 * Calcula a margem de dias disponível no mês
 * Ex: Mês com 31 dias - 25 dias do plano = 6 dias de margem
 */
export function getMargemMes(mes: number, ano?: number): number {
  const anoAtual = ano || new Date().getFullYear();
  const diasNoMes = new Date(anoAtual, mes, 0).getDate();
  return diasNoMes - plano.metadata.diasPorMes;
}

export interface StatusLeituraMes {
  mes: number;
  diaAtualDoMes: number;
  diaPlanoProgramado: number; // Até qual dia do plano "deveria" estar
  diasCompletados: number[];
  diasPendentes: number[];
  diasAtrasados: number; // Quantos dias ainda precisa fazer para estar "em dia"
  diasMargemRestante: number; // Quantos dias ainda pode "atrasar" sem perder o mês
  emDia: boolean;
  podeRecuperar: boolean;
  proximoDiaRecomendado: number; // Qual dia do plano fazer agora
}

/**
 * Calcula o status detalhado de leitura do mês
 * Leva em conta a margem do plano (25 dias em meses de 30-31 dias)
 */
export function calcularStatusLeituraMes(
  mes: number,
  diasCompletadosArray: number[],
  dataAtual?: Date
): StatusLeituraMes {
  const hoje = dataAtual || new Date();
  const diaAtualDoMes = hoje.getDate();
  const diasPorMes = plano.metadata.diasPorMes; // 25

  // Quantos dias do plano "deveriam" ter sido feitos até hoje
  // Se hoje é dia 10, deveria ter feito dias 1-10 do plano
  const diaPlanoProgramado = Math.min(diaAtualDoMes, diasPorMes);

  // Dias completados que são válidos (1-25)
  const diasCompletadosValidos = diasCompletadosArray.filter(d => d >= 1 && d <= diasPorMes);
  const diasCompletadosSet = new Set(diasCompletadosValidos);

  // Dias pendentes: todos os dias do plano até o dia programado que não foram feitos
  const diasPendentes: number[] = [];
  for (let d = 1; d <= diaPlanoProgramado; d++) {
    if (!diasCompletadosSet.has(d)) {
      diasPendentes.push(d);
    }
  }

  // Margem do mês
  const margemTotal = getMargemMes(mes);

  // Dias atrasados = quantos dias pendentes o usuário tem
  const diasAtrasados = diasPendentes.length;

  // Margem restante = margem total - dias que já usou (dias do mês que passaram - dias feitos)
  // Simplificando: se estamos no dia 10 e completou 8 dias, usou 2 dias de margem
  const diasMargemRestante = margemTotal - diasAtrasados;

  // Em dia = não há dias pendentes
  const emDia = diasAtrasados === 0;

  // Pode recuperar = ainda tem margem (mesmo negativa pode tentar até -6 considerando fins de semana)
  const podeRecuperar = diasMargemRestante >= -diasPorMes; // Sempre pode tentar recuperar

  // Próximo dia recomendado: o menor dia pendente, ou o próximo dia do plano
  let proximoDiaRecomendado: number;
  if (diasPendentes.length > 0) {
    proximoDiaRecomendado = Math.min(...diasPendentes);
  } else if (diaPlanoProgramado < diasPorMes) {
    proximoDiaRecomendado = diaPlanoProgramado + 1;
  } else {
    proximoDiaRecomendado = diasPorMes; // Já completou tudo
  }

  return {
    mes,
    diaAtualDoMes,
    diaPlanoProgramado,
    diasCompletados: diasCompletadosValidos,
    diasPendentes,
    diasAtrasados,
    diasMargemRestante: Math.max(0, diasMargemRestante),
    emDia,
    podeRecuperar,
    proximoDiaRecomendado,
  };
}

/**
 * Retorna uma mensagem amigável sobre o status de leitura
 */
export function getMensagemStatusLeitura(status: StatusLeituraMes): {
  titulo: string;
  mensagem: string;
  tipo: 'success' | 'warning' | 'danger' | 'info';
} {
  if (status.emDia) {
    if (status.diaPlanoProgramado === status.diasCompletados.length && status.diasCompletados.length === getDiasPorMes()) {
      return {
        titulo: 'Mês completo! 🎉',
        mensagem: 'Você completou todas as leituras deste mês!',
        tipo: 'success',
      };
    }
    return {
      titulo: 'Você está em dia! ✨',
      mensagem: 'Continue assim para manter sua sequência.',
      tipo: 'success',
    };
  }

  if (status.diasAtrasados === 1) {
    return {
      titulo: 'Você tem 1 dia pendente',
      mensagem: `Faça a leitura do dia ${status.proximoDiaRecomendado} para ficar em dia.`,
      tipo: 'warning',
    };
  }

  if (status.diasAtrasados <= status.diasMargemRestante + 3) {
    return {
      titulo: `${status.diasAtrasados} dias pendentes`,
      mensagem: `Você ainda tem margem para recuperar. Comece pelo dia ${status.proximoDiaRecomendado}.`,
      tipo: 'warning',
    };
  }

  return {
    titulo: `${status.diasAtrasados} dias pendentes`,
    mensagem: `Hora de colocar as leituras em dia! Comece pelo dia ${status.proximoDiaRecomendado}.`,
    tipo: 'danger',
  };
}
