'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LevelBadge } from '@/components/features/LevelBadge';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/progresso')
        .then((res) => res.json())
        .then((data) => setXp(data.xp || 0))
        .catch(() => {});
    }
  }, [session]);

  if (!session?.user) return null;

  return (
    <header className="glass-medium rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-medium-gray">Olá,</p>
          <p className="text-xl font-bold text-neutral-dark-gray">
            {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LevelBadge xp={xp} showLabel={false} />
          <Button
            variant="icon"
            onClick={() => signOut({ callbackUrl: '/login' })}
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
