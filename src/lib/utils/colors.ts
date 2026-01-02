/**
 * Utilitário para cores customizadas
 * Garante compatibilidade com Tailwind CSS v4
 */

export const colors = {
  // Primárias
  primaryMint: 'var(--primary-mint)',
  primarySage: 'var(--primary-sage)',
  primaryTeal: 'var(--primary-teal)',
  
  // Secundárias
  secondaryLavender: 'var(--secondary-lavender)',
  secondaryLilac: 'var(--secondary-lilac)',
  secondaryPurple: 'var(--secondary-purple)',
  
  // Destaque
  accentPeach: 'var(--accent-peach)',
  accentCoral: 'var(--accent-coral)',
  accentSalmon: 'var(--accent-salmon)',
  
  // Neutras
  neutralWhite: 'var(--neutral-white)',
  neutralOffWhite: 'var(--neutral-off-white)',
  neutralLightGray: 'var(--neutral-light-gray)',
  neutralMediumGray: 'var(--neutral-medium-gray)',
  neutralDarkGray: 'var(--neutral-dark-gray)',
  neutralBlack: 'var(--neutral-black)',
  
  // Semânticas
  success: 'var(--success)',
  warning: 'var(--warning)',
  info: 'var(--info)',
  highlight: 'var(--highlight)',
} as const;

/**
 * Helper para criar classes Tailwind com cores customizadas
 * Usa sintaxe de classes arbitrárias que sempre funciona
 */
export const colorClasses = {
  text: {
    darkGray: 'text-[var(--neutral-dark-gray)]',
    mediumGray: 'text-[var(--neutral-medium-gray)]',
    black: 'text-[var(--neutral-black)]',
    white: 'text-[var(--neutral-white)]',
    teal: 'text-[var(--primary-teal)]',
    success: 'text-[var(--success)]',
    warning: 'text-[var(--warning)]',
  },
  bg: {
    black: 'bg-[var(--neutral-black)]',
    darkGray: 'bg-[var(--neutral-dark-gray)]',
    white: 'bg-[var(--neutral-white)]',
    teal: 'bg-[var(--primary-teal)]',
    mint: 'bg-[var(--primary-mint)]',
    lavender: 'bg-[var(--secondary-lavender)]',
    peach: 'bg-[var(--accent-peach)]',
  },
  border: {
    lightGray: 'border-[var(--neutral-light-gray)]',
    mediumGray: 'border-[var(--neutral-medium-gray)]',
    teal: 'border-[var(--primary-teal)]',
  },
} as const;
