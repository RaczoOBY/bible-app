'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark-gray mb-2">
            Criar Conta
          </h1>
          <p className="text-neutral-medium-gray">Comece sua jornada bíblica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <div className="p-3 rounded-xl bg-warning/10 text-warning text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-medium-gray">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary-teal font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
