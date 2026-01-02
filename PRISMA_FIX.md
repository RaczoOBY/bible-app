# Correção para Prisma 7

Se você está usando **Prisma 7** e recebeu o erro sobre `datasource url`, há duas opções:

## Opção 1: Usar Prisma 5.x (Recomendado)

Instale uma versão específica do Prisma 5:

```bash
npm install @prisma/client@^5.19.0 prisma@^5.19.0
```

Isso manterá a compatibilidade com o schema atual.

## Opção 2: Migrar para Prisma 7

Se você precisa usar Prisma 7, siga estes passos:

### 1. Atualize o schema.prisma

Remova a linha `url` do datasource:

```prisma
datasource db {
  provider = "postgresql"
  // url removida - será configurada em prisma.config.ts
}
```

### 2. Crie prisma/config.ts

```typescript
import { defineConfig } from 'prisma';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

### 3. Atualize src/lib/db/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { createAdapter } from '@prisma/adapter-postgresql';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = createAdapter(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. Instale dependências adicionais

```bash
npm install @prisma/adapter-postgresql pg
```

---

**Recomendação:** Use a Opção 1 (Prisma 5.x) para maior estabilidade e compatibilidade.
