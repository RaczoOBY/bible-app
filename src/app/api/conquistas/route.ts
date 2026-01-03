import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { CONQUISTAS } from '@/lib/constants/conquistas';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Buscar conquistas do usuário
    const userConquistas = await prisma.userConquista.findMany({
      where: { userId },
      include: {
        conquista: true,
      },
    });

    const conquistasComStatus = CONQUISTAS.map((conquista) => {
      const userConquista = userConquistas.find(
        (uc: { conquista: { codigo: string } }) => uc.conquista.codigo === conquista.id
      );

      return {
        ...conquista,
        desbloqueada: !!userConquista,
        desbloqueadaEm: userConquista?.desbloqueadaEm || null,
        vezesObtida: userConquista?.vezesObtida || 0,
      };
    });

    const totalDesbloqueadas = conquistasComStatus.filter((c) => c.desbloqueada).length;

    return NextResponse.json({
      conquistas: conquistasComStatus,
      total: CONQUISTAS.length,
      desbloqueadas: totalDesbloqueadas,
    });
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conquistas' },
      { status: 500 }
    );
  }
}
