import { create } from 'zustand';

interface AppState {
  xp: number;
  nivel: number;
  streak: number;
  maiorStreak: number;
  setXP: (xp: number) => void;
  setNivel: (nivel: number) => void;
  setStreak: (streak: number) => void;
  setMaiorStreak: (streak: number) => void;
  updateStats: (stats: {
    xp: number;
    nivel: number;
    sequenciaAtual: number;
    maiorSequencia: number;
  }) => void;
}

export const useStore = create<AppState>((set) => ({
  xp: 0,
  nivel: 1,
  streak: 0,
  maiorStreak: 0,
  setXP: (xp) => set({ xp }),
  setNivel: (nivel) => set({ nivel }),
  setStreak: (streak) => set({ streak }),
  setMaiorStreak: (maiorStreak) => set({ maiorStreak }),
  updateStats: (stats) =>
    set({
      xp: stats.xp,
      nivel: stats.nivel,
      streak: stats.sequenciaAtual,
      maiorStreak: stats.maiorSequencia,
    }),
}));
