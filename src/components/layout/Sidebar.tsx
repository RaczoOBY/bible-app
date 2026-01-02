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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 glass-medium rounded-2xl p-6 h-fit sticky top-6">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-neutral-black text-white'
                  : 'text-neutral-dark-gray hover:bg-white/60'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
