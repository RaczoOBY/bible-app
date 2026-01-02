import { useState, useEffect } from 'react';

interface LeituraComStatus {
  tipo: 'nt1' | 'nt2' | 'at1' | 'at2';
  livro: string;
  abrev: string;
  referencia: string;
  completada: boolean;
  leituraId?: string;
}

interface UseLeiturasReturn {
  leituras: LeituraComStatus[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleLeitura: (tipo: string, completada: boolean) => Promise<void>;
}

export function useLeituras(mes: number, dia: number): UseLeiturasReturn {
  const [leituras, setLeituras] = useState<LeituraComStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarLeituras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/leituras/dia?mes=${mes}&dia=${dia}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar leituras');
      }
      const data = await response.json();
      if (data.leituras) {
        setLeituras(data.leituras);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const toggleLeitura = async (tipo: string, completada: boolean) => {
    try {
      const response = await fetch('/api/leituras/marcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mes,
          dia,
          tipo,
          completada: !completada,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar leitura');
      }

      await carregarLeituras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  useEffect(() => {
    carregarLeituras();
  }, [mes, dia]);

  return {
    leituras,
    loading,
    error,
    refetch: carregarLeituras,
    toggleLeitura,
  };
}
