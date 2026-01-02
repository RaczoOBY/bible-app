import { PrismaClient } from '@prisma/client';
import planoData from '../src/data/plano-leitura.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar conquistas
  const conquistas = planoData.conquistas;
  
  for (const conquista of conquistas) {
    await prisma.conquista.upsert({
      where: { codigo: conquista.id },
      update: {
        nome: conquista.nome,
        descricao: conquista.desc,
        xp: conquista.xp,
        icone: conquista.icone,
      },
      create: {
        codigo: conquista.id,
        nome: conquista.nome,
        descricao: conquista.desc,
        xp: conquista.xp,
        icone: conquista.icone,
        tipo: conquista.id.startsWith('seq_') ? 'repetivel' : 'unica',
      },
    });
  }

  console.log(`✅ ${conquistas.length} conquistas criadas/atualizadas`);
  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
