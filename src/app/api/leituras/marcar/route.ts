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
import { getLeiturasDoDia, getDiasPorMes, getMargemMes } from '@/lib/utils/plano';
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
      const leiturasCompletadas = user.leituras.filter((l: { completada: boolean }) => l.completada).length;
      const todasCompletadas = leiturasCompletadas === 4;

      if (todasCompletadas) {
        const xpBonus = calcularXPDiaCompleto(user.sequenciaAtual);
        xpGanho += xpBonus;

        // Atualizar streak com lógica melhorada
        // Considera a margem do plano (25 dias por mês em meses de 30-31 dias)
        const hoje = new Date();
        const diasPorMes = getDiasPorMes(); // 25

        // Buscar todos os dias completados deste mês
        const leiturasCompletadasMes = await prisma.leitura.findMany({
          where: {
            userId,
            mes,
            completada: true,
          },
        });

        // Contar quantos dias têm 4 leituras completadas
        const leiturasPorDia = new Map<number, number>();
        leiturasCompletadasMes.forEach((l: { dia: number }) => {
          const count = leiturasPorDia.get(l.dia) || 0;
          leiturasPorDia.set(l.dia, count + 1);
        });

        const diasCompletosNoMes: number[] = [];
        leiturasPorDia.forEach((count, diaNum) => {
          if (count >= 4) {
            diasCompletosNoMes.push(diaNum);
          }
        });
        diasCompletosNoMes.sort((a, b) => a - b);

        // Lógica de streak melhorada:
        // 1. Verificar se há uma sequência contínua de dias completados
        // 2. A sequência pode ter "buracos" se ainda há margem disponível
        let novaSequencia = user.sequenciaAtual;

        // Verificar o dia anterior do plano (não o dia do calendário)
        const diaAnteriorPlano = dia - 1;

        if (diaAnteriorPlano >= 1) {
          // Verificar se o dia anterior do plano foi completado
          const diaAnteriorCompleto = diasCompletosNoMes.includes(diaAnteriorPlano);

          if (diaAnteriorCompleto) {
            // Dia anterior completo - incrementar streak
            novaSequencia = user.sequenciaAtual + 1;
          } else {
            // Dia anterior não completo - verificar se ainda tem margem
            const diasDoMesAtual = new Date(hoje.getFullYear(), mes, 0).getDate();
            const margemMes = diasDoMesAtual - diasPorMes;
            const diaAtualCalendario = hoje.getDate();

            // Quantos dias do plano deveriam estar feitos até agora
            const diasProgramados = Math.min(diaAtualCalendario, diasPorMes);

            // Quantos dias estão pendentes
            const diasPendentes = diasProgramados - diasCompletosNoMes.length;

            // Se ainda tem margem, mantém o streak (não quebra)
            // Margem disponível = margem total - dias já "usados"
            const margemDisponivel = margemMes - Math.max(0, diasPendentes - 1);

            if (margemDisponivel > 0 && user.sequenciaAtual > 0) {
              // Ainda tem margem - mantém streak mas não incrementa
              // O streak só incrementa quando completa dias em sequência
              novaSequencia = user.sequenciaAtual;
            } else if (diasCompletosNoMes.length === 1 && diasCompletosNoMes[0] === dia) {
              // Primeiro dia completado - começa streak
              novaSequencia = 1;
            } else {
              // Sem margem e com buraco - reseta streak
              novaSequencia = 1;
            }
          }
        } else {
          // Primeiro dia do mês - verificar mês anterior
          const ontem = new Date(hoje);
          ontem.setDate(ontem.getDate() - 1);

          const leituraOntemMesAnterior = await prisma.leitura.findFirst({
            where: {
              userId,
              mes: ontem.getMonth() + 1,
              dia: ontem.getDate(),
              completada: true,
            },
          });

          if (leituraOntemMesAnterior) {
            novaSequencia = user.sequenciaAtual + 1;
          } else {
            novaSequencia = 1;
          }
        }

        const maiorSequencia = Math.max(novaSequencia, user.maiorSequencia);

        // Helper para verificar e desbloquear conquista
        const verificarConquista = async (codigo: string) => {
          const conquistaInfo = getConquistaPorId(codigo);
          if (!conquistaInfo) return;

          // Buscar a conquista no banco pelo código
          const conquistaDb = await prisma.conquista.findUnique({
            where: { codigo },
          });

          if (!conquistaDb) return;

          const existe = await prisma.userConquista.findUnique({
            where: {
              userId_conquistaId: {
                userId,
                conquistaId: conquistaDb.id,
              },
            },
          });

          if (!existe) {
            await prisma.userConquista.create({
              data: {
                userId,
                conquistaId: conquistaDb.id,
              },
            });
            xpGanho += conquistaInfo.xp;
            conquistasDesbloqueadas.push(codigo);
          }
        };

        // Verificar conquistas de streak
        if (novaSequencia === 1) {
          await verificarConquista('primeiro_dia');
        }

        // Verificar outras conquistas de streak
        const streakConquistas = [3, 7, 14, 30, 100];
        for (const streak of streakConquistas) {
          if (novaSequencia === streak) {
            await verificarConquista(`seq_${streak}`);
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
