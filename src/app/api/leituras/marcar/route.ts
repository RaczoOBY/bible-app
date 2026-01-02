import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import {
  calcularXPLeitura,
  calcularXPDiaCompleto,
  verificarLevelUp,
  calcularNivel,
} from '@/lib/utils/gamificacao';
import { getLeiturasDoDia } from '@/lib/utils/plano';
import { getConquistaPorId } from '@/lib/constants/conquistas';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { mes, dia, tipo, completada } = await request.json();

    if (mes === undefined || dia === undefined || !tipo || completada === undefined) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Buscar ou criar leitura
    const leitura = await prisma.leitura.upsert({
      where: {
        userId_mes_dia_tipo: {
          userId,
          mes,
          dia,
          tipo,
        },
      },
      update: {
        completada,
        completadaEm: completada ? new Date() : null,
      },
      create: {
        userId,
        mes,
        dia,
        tipo,
        referencia: '',
        completada,
        completadaEm: completada ? new Date() : null,
      },
    });

    // Buscar usuário atual
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        leituras: {
          where: { mes, dia },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Calcular XP e atualizar streak
    let xpGanho = 0;
    let levelUp = false;
    let conquistasDesbloqueadas: string[] = [];

    if (completada) {
      // Calcular XP da leitura
      const xpLeitura = calcularXPLeitura(user.sequenciaAtual);
      xpGanho += xpLeitura;

      // Verificar se completou todas as 4 leituras do dia
      const leiturasCompletadas = user.leituras.filter((l) => l.completada).length;
      const todasCompletadas = leiturasCompletadas === 4;

      if (todasCompletadas) {
        const xpBonus = calcularXPDiaCompleto(user.sequenciaAtual);
        xpGanho += xpBonus;

        // Atualizar streak
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);

        const leituraOntem = await prisma.leitura.findFirst({
          where: {
            userId,
            mes: ontem.getMonth() + 1,
            dia: ontem.getDate(),
            completada: true,
          },
        });

        let novaSequencia = user.sequenciaAtual;
        if (leituraOntem) {
          novaSequencia = user.sequenciaAtual + 1;
        } else {
          novaSequencia = 1;
        }

        const maiorSequencia = Math.max(novaSequencia, user.maiorSequencia);

        // Verificar conquistas de streak
        if (novaSequencia === 1) {
          const conquista = getConquistaPorId('primeiro_dia');
          if (conquista) {
            const existe = await prisma.userConquista.findUnique({
              where: {
                userId_conquistaId: {
                  userId,
                  conquistaId: conquista.id,
                },
              },
            });

            if (!existe) {
              await prisma.userConquista.create({
                data: {
                  userId,
                  conquistaId: conquista.id,
                },
              });
              xpGanho += conquista.xp;
              conquistasDesbloqueadas.push(conquista.id);
            }
          }
        }

        // Verificar outras conquistas de streak
        const streakConquistas = [3, 7, 14, 30, 100];
        for (const streak of streakConquistas) {
          if (novaSequencia === streak) {
            const conquista = getConquistaPorId(`seq_${streak}`);
            if (conquista) {
              const existe = await prisma.userConquista.findUnique({
                where: {
                  userId_conquistaId: {
                    userId,
                    conquistaId: conquista.id,
                  },
                },
              });

              if (!existe) {
                await prisma.userConquista.create({
                  data: {
                    userId,
                    conquistaId: conquista.id,
                  },
                });
                xpGanho += conquista.xp;
                conquistasDesbloqueadas.push(conquista.id);
              }
            }
          }
        }

        // Atualizar usuário
        const xpAnterior = user.xp;
        const novoXP = xpAnterior + xpGanho;
        const novoNivel = calcularNivel(novoXP);

        levelUp = verificarLevelUp(xpAnterior, novoXP);

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: novoXP,
            nivel: novoNivel.nivel,
            sequenciaAtual: novaSequencia,
            maiorSequencia,
          },
        });
      } else {
        // Apenas atualizar XP sem atualizar streak
        const novoXP = user.xp + xpGanho;
        const novoNivel = calcularNivel(novoXP);

        levelUp = verificarLevelUp(user.xp, novoXP);

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: novoXP,
            nivel: novoNivel.nivel,
          },
        });
      }
    } else {
      // Desmarcar leitura - remover XP (simplificado)
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: Math.max(0, user.xp - 10),
        },
      });
    }

    return NextResponse.json({
      success: true,
      xpGanho,
      levelUp,
      conquistasDesbloqueadas,
    });
  } catch (error) {
    console.error('Erro ao marcar leitura:', error);
    return NextResponse.json(
      { error: 'Erro ao marcar leitura' },
      { status: 500 }
    );
  }
}
