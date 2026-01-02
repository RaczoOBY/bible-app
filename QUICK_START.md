# 🚀 Quick Start - Scripture Quest

## ⚡ Instalação Rápida (1 comando)

Execute este comando para instalar todas as dependências:

```bash
npm install next-auth@^4.24.0 @prisma/client@^5.22.0 prisma@^5.22.0 bcryptjs zustand framer-motion date-fns lucide-react canvas-confetti clsx tailwind-merge tsx @types/bcryptjs
```

**OU** use o script de instalação:

```bash
chmod +x install-deps.sh
./install-deps.sh
```

## 🔧 Configuração Rápida

### 1. Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e adicione:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bible_app"
NEXTAUTH_SECRET="gere-um-secret-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**Para gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Configure o banco de dados:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Execute o projeto:

```bash
npm run dev
```

Acesse: http://localhost:3000

## ⚠️ Erros Comuns

### Erro: "Module not found: tailwind-merge"
**Solução:** Execute o comando de instalação acima.

### Erro: "DATABASE_URL not found"
**Solução:** Crie o arquivo `.env` com a variável `DATABASE_URL`.

### Erro: "Prisma schema validation"
**Solução:** Execute `npm run db:generate` primeiro.

## 📚 Documentação Completa

- `INSTALL.md` - Instalação detalhada
- `DEPENDENCIES.md` - Lista de dependências
- `FIXES.md` - Correções aplicadas
- `PRISMA_FIX.md` - Ajustes para Prisma 7

---

**Pronto! Agora é só começar a usar! 🎉**
