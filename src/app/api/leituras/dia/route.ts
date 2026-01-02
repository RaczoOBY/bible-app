import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { getLeiturasDoDia } from '@/lib/utils/plano';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mes = parseInt(searchParams.get('mes') || '1');
    const dia = parseInt(searchParams.get('dia') || '1');

    const leiturasDoDia = getLeiturasDoDia(mes, dia);

    if (!leiturasDoDia) {
      return NextResponse.json(
        { error: 'Dia não encontrado no plano' },
        { status: 404 }
      );
    }

    // Buscar leituras completadas do usuário
    const leiturasCompletadas = await prisma.leitura.findMany({
      where: {
        userId: session.user.id,
        mes,
        dia,
      },
    });

    const leiturasComStatus = leiturasDoDia.leituras.map((leitura) => {
      const completada = leiturasCompletadas.find(
        (l) => l.tipo === leitura.tipo
      );

      return {
        ...leitura,
        completada: completada?.completada || false,
        leituraId: completada?.id,
      };
    });

    return NextResponse.json({
      dia: leiturasDoDia.dia,
      mes,
      leituras: leiturasComStatus,
    });
  } catch (error) {
    console.error('Erro ao buscar leituras:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar leituras' },
      { status: 500 }
    );
  }
}
