export interface PlanoLeitura {
  metadata: {
    nome: string;
    versao: string;
    totalDias: number;
    diasPorMes: number;
    leiturasPorDia: number;
  };
  gamificacao: {
    xpPorLeitura: number;
    xpDiaCompleto: number;
    multiplicadores: {
      "3": number;
      "7": number;
      "14": number;
      "30": number;
    };
  };
  niveis: Array<{
    nivel: number;
    nome: string;
    xpMin: number;
    xpMax: number;
    icone: string;
  }>;
  conquistas: Array<{
    id: string;
    nome: string;
    desc: string;
    xp: number;
    icone: string;
  }>;
  meses: Array<{
    id: number;
    nome: string;
    livros: {
      nt1: string;
      nt2: string;
      at1: string;
      at2: string;
    };
    abrev: {
      nt1: string;
      nt2: string;
      at1: string;
      at2: string;
    };
    dias: Array<{
      d: number;
      nt1: string;
      nt2: string;
      at1: string;
      at2: string;
    }>;
  }>;
}

export interface LeituraDia {
  tipo: 'nt1' | 'nt2' | 'at1' | 'at2';
  livro: string;
  abrev: string;
  referencia: string;
}

export interface DiaLeitura {
  dia: number;
  leituras: LeituraDia[];
}
