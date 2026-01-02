import planoData from '@/data/plano-leitura.json';
import type { PlanoLeitura } from '@/types/plano';

const plano = planoData as PlanoLeitura;

export const XP_POR_LEITURA = plano.gamificacao.xpPorLeitura;
export const XP_DIA_COMPLETO = plano.gamificacao.xpDiaCompleto;
export const MULTIPLICADORES = plano.gamificacao.multiplicadores;

export const NIVEIS = plano.niveis;

export interface NivelInfo {
  nivel: number;
  nome: string;
  xpMin: number;
  xpMax: number;
  icone: string;
}

export function calcularNivel(xp: number): NivelInfo {
  const nivel = NIVEIS.find(n => xp >= n.xpMin && xp <= n.xpMax) || NIVEIS[0];
  return nivel;
}

export function calcularXPProximoNivel(xp: number): number {
  const nivelAtual = calcularNivel(xp);
  if (nivelAtual.nivel === NIVEIS.length) {
    return nivelAtual.xpMax; // Último nível
  }
  return nivelAtual.xpMax + 1;
}

export function calcularProgressoNivel(xp: number): number {
  const nivelAtual = calcularNivel(xp);
  const xpNoNivel = xp - nivelAtual.xpMin;
  const xpNecessario = nivelAtual.xpMax - nivelAtual.xpMin;
  return Math.min(100, Math.max(0, (xpNoNivel / xpNecessario) * 100));
}

export function calcularMultiplicadorStreak(streak: number): number {
  if (streak >= 30) return MULTIPLICADORES["30"];
  if (streak >= 14) return MULTIPLICADORES["14"];
  if (streak >= 7) return MULTIPLICADORES["7"];
  if (streak >= 3) return MULTIPLICADORES["3"];
  return 1.0;
}

export function calcularXPLeitura(streak: number): number {
  const multiplicador = calcularMultiplicadorStreak(streak);
  return Math.round(XP_POR_LEITURA * multiplicador);
}

export function calcularXPDiaCompleto(streak: number): number {
  const multiplicador = calcularMultiplicadorStreak(streak);
  return Math.round(XP_DIA_COMPLETO * multiplicador);
}

export function verificarLevelUp(xpAnterior: number, xpNovo: number): boolean {
  const nivelAnterior = calcularNivel(xpAnterior);
  const nivelNovo = calcularNivel(xpNovo);
  return nivelNovo.nivel > nivelAnterior.nivel;
}
