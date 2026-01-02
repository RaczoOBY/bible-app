'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XPProgressBar } from '@/components/features/XPProgressBar';
import { LevelBadge } from '@/components/features/LevelBadge';
import { StreakCounter } from '@/components/features/StreakCounter';
import { LogOut } from 'lucide-react';

export default function PerfilPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<{
    xp: number;
    nivel: number;
    sequenciaAtual: number;
    maiorSequencia: number;
    diasCompletados: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    try {
      const response = await fetch('/api/progresso');
      const data = await response.json();
      setStats({
        xp: data.xp || 0,
        nivel: data.nivel || 1,
        sequenciaAtual: data.sequenciaAtual || 0,
        maiorSequencia: data.maiorSequencia || 0,
        diasCompletados: data.diasCompletados || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-medium-gray">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-dark-gray">Perfil</h1>

      {/* Informações do usuário */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-teal to-primary-sage flex items-center justify-center text-2xl font-bold text-white">
            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-dark-gray">
              {session?.user?.name || 'Usuário'}
            </p>
            <p className="text-sm text-neutral-medium-gray">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <LevelBadge xp={stats.xp} />
      </Card>

      {/* Estatísticas */}
      <Card variant="mint">
        <h2 className="text-lg font-semibold text-neutral-dark-gray mb-4">
          Estatísticas
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-medium-gray">Dias Completados</span>
            <span className="text-lg font-bold text-neutral-dark-gray">
              {stats.diasCompletados}
            </span>
          </div>
          <StreakCounter
            streak={stats.sequenciaAtual}
            maiorStreak={stats.maiorSequencia}
          />
        </div>
      </Card>

      {/* XP e Progresso */}
      <Card>
        <XPProgressBar xp={stats.xp} />
      </Card>

      {/* Configurações */}
      <Card>
        <h2 className="text-lg font-semibold text-neutral-dark-gray mb-4">
          Configurações
        </h2>
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => {
              // TODO: Implementar tema claro/escuro
              alert('Tema em desenvolvimento');
            }}
          >
            Tema Claro/Escuro
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => {
              // TODO: Implementar notificações
              alert('Notificações em desenvolvimento');
            }}
          >
            Notificações
          </Button>
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <Button
          variant="secondary"
          className="w-full justify-center text-warning"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </Button>
      </Card>
    </div>
  );
}
