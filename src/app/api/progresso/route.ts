import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { getPlanoCompleto, calcularStatusLeituraMes, getMargemMes } from '@/lib/utils/plano';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Buscar todas as leituras completadas
    const leiturasCompletadas = await prisma.leitura.findMany({
      where: {
        userId,
        completada: true,
      },
    });

    const plano = getPlanoCompleto();
    const totalDias = plano.metadata.totalDias;
    const diasCompletados = new Set<string>();

    leiturasCompletadas.forEach((leitura: { mes: number; dia: number }) => {
      const chave = `${leitura.mes}-${leitura.dia}`;
      diasCompletados.add(chave);
    });

    const diasCompletadosCount = diasCompletados.size;
    const progressoPercentual = (diasCompletadosCount / totalDias) * 100;

    // Estatísticas por mês com dias específicos completados
    const progressoPorMes = plano.meses.map((mes) => {
      const diasMesCompletados = new Set<number>();
      const leiturasPorDia = new Map<number, number>();

      leiturasCompletadas
        .filter((l: { mes: number }) => l.mes === mes.id)
        .forEach((leitura: { dia: number }) => {
          const count = leiturasPorDia.get(leitura.dia) || 0;
          leiturasPorDia.set(leitura.dia, count + 1);
        });

      // Um dia só está "completado" se tiver todas as 4 leituras
      leiturasPorDia.forEach((count, dia) => {
        if (count >= 4) {
          diasMesCompletados.add(dia);
        }
      });

      return {
        mes: mes.id,
        nome: mes.nome,
        diasCompletados: diasMesCompletados.size,
        diasCompletadosArray: Array.from(diasMesCompletados), // Array de dias específicos
        totalDias: plano.metadata.diasPorMes,
        percentual: (diasMesCompletados.size / plano.metadata.diasPorMes) * 100,
      };
    });

    // Buscar usuário para pegar streak
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        sequenciaAtual: true,
        maiorSequencia: true,
        xp: true,
        nivel: true,
      },
    });

    // Calcular status do mês atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const mesAtualData = progressoPorMes.find((m) => m.mes === mesAtual);
    const statusMesAtual = calcularStatusLeituraMes(
      mesAtual,
      mesAtualData?.diasCompletadosArray || [],
      hoje
    );

    // Verificar se hoje foi completado
    const diaAtual = hoje.getDate();
    const hojeCompleto = mesAtualData?.diasCompletadosArray?.includes(diaAtual) || false;

    return NextResponse.json({
      totalDias,
      diasCompletados: diasCompletadosCount,
      progressoPercentual: Math.round(progressoPercentual * 100) / 100,
      progressoPorMes,
      sequenciaAtual: user?.sequenciaAtual || 0,
      maiorSequencia: user?.maiorSequencia || 0,
      xp: user?.xp || 0,
      nivel: user?.nivel || 1,
      // Novo: informações do mês atual para UX melhorada
      statusMesAtual: {
        ...statusMesAtual,
        hojeCompleto,
        mesNome: mesAtualData?.nome || '',
        margemTotal: getMargemMes(mesAtual),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar progresso' },
      { status: 500 }
    );
  }
}
