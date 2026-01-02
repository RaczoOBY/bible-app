'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, TrendingUp, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/leitura', icon: BookOpen, label: 'Leitura' },
  { href: '/progresso', icon: TrendingUp, label: 'Progresso' },
  { href: '/conquistas', icon: Trophy, label: 'Conquistas' },
  { href: '/perfil', icon: User, label: 'Perfil' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-medium border-t border-black/8 z-40">
      <div className="max-w-md mx-auto flex items-center justify-around h-20 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                isActive
                  ? 'text-neutral-black'
                  : 'text-neutral-medium-gray hover:text-neutral-dark-gray'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
