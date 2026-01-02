# Instruções de Instalação - Scripture Quest

## 📦 Dependências Necessárias

Execute o seguinte comando para instalar todas as dependências:

```bash
npm install next-auth@^4.24.0 @prisma/client@^5.22.0 prisma@^5.22.0 bcryptjs zustand framer-motion date-fns lucide-react canvas-confetti clsx tailwind-merge tsx @types/bcryptjs
```

**⚠️ IMPORTANTE:** Todas essas dependências são obrigatórias. O projeto não funcionará sem elas.

**Nota sobre Prisma:** Este projeto foi configurado para usar Prisma 5.x. Se você tiver Prisma 7 instalado, consulte `PRISMA_FIX.md`.

**Nota sobre NextAuth:** Use a versão 4.x (não beta) para maior estabilidade. O middleware foi ajustado para funcionar sem `next-auth/middleware`.

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bible_app?schema=public"
NEXTAUTH_SECRET="gere-um-secret-key-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**Para gerar um NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Banco de Dados

#### Opção A: PostgreSQL Local
1. Instale PostgreSQL localmente
2. Crie um banco de dados:
```sql
CREATE DATABASE bible_app;
```
3. Atualize o `DATABASE_URL` no `.env`

#### Opção B: PostgreSQL Cloud (Recomendado)
1. Crie uma conta no [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a connection string e cole no `.env`

### 3. Configurar Prisma

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com banco de dados
npm run db:push

# Popular banco com conquistas iniciais
npm run db:seed
```

### 4. Executar Aplicação

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🎯 Primeiros Passos

1. **Criar Conta**: Acesse `/register` e crie sua conta
2. **Login**: Faça login em `/login`
3. **Dashboard**: Você será redirecionado para `/dashboard`
4. **Começar Leitura**: Marque as leituras do dia como completadas

## 📱 PWA (Progressive Web App)

Para habilitar o PWA completamente, você precisará:

1. Criar ícones do app:
   - `/public/icon-192.png` (192x192px)
   - `/public/icon-512.png` (512x512px)

2. O manifest.json já está configurado em `/public/manifest.json`

3. Para produção, configure o `next-pwa` no `next.config.ts` (opcional)

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

### Erro: "DATABASE_URL not found"
Verifique se o arquivo `.env` existe e está na raiz do projeto.

### Erro: "Prisma schema validation error"
Verifique se o PostgreSQL está rodando e acessível.

### Erro: "next-auth session error"
Verifique se o `NEXTAUTH_SECRET` está configurado corretamente.

## 📚 Estrutura de Dados

O plano de leitura está em `/src/data/plano-leitura.json` e contém:
- 12 meses de leitura
- 25 dias por mês
- 4 leituras por dia (2 NT + 2 AT)

## 🎮 Sistema de Gamificação

- **XP por leitura**: 10 XP
- **XP bônus dia completo**: 50 XP
- **Multiplicadores de streak**: 3 dias (1.2x), 7 dias (1.5x), 14 dias (2.0x), 30 dias (3.0x)
- **8 níveis** de progressão
- **10 conquistas** principais

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL configurado (local ou cloud)
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Prisma configurado (`npm run db:generate && npm run db:push`)
- [ ] Seed executado (`npm run db:seed`)
- [ ] Aplicação rodando (`npm run dev`)

## 🚀 Deploy

Para fazer deploy na Vercel:

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente na Vercel
3. Use um PostgreSQL cloud (Neon ou Vercel Postgres)
4. Deploy automático!

---

**Pronto para começar sua jornada bíblica! 📖✨**
