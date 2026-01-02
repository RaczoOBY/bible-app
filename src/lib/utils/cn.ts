import { type ClassValue, clsx } from 'clsx';

/**
 * Utilitário para combinar classes CSS
 * 
 * ⚠️ IMPORTANTE: Para funcionalidade completa, instale as dependências:
 * npm install clsx tailwind-merge
 * 
 * Esta versão funciona sem tailwind-merge, mas classes conflitantes do Tailwind
 * podem não ser mescladas corretamente.
 */
export function cn(...inputs: ClassValue[]) {
  // Versão simplificada sem tailwind-merge
  // Funciona, mas não mescla classes conflitantes do Tailwind
  return clsx(inputs);
}
