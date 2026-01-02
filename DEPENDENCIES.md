# Dependências Faltantes - Instalação Completa

## ⚠️ Erros Encontrados

O projeto está usando várias bibliotecas que não estão instaladas. Execute o comando abaixo para instalar todas as dependências necessárias:

## 📦 Comando de Instalação Completo

```bash
npm install next-auth@^4.24.0 @prisma/client@^5.22.0 prisma@^5.22.0 bcryptjs zustand framer-motion date-fns lucide-react canvas-confetti clsx tailwind-merge tsx @types/bcryptjs
```

## 📋 Lista de Dependências por Categoria

### Autenticação
- ✅ `next-auth@^4.24.0` - Autenticação (usado em: auth.ts, middleware, páginas de login)

### Banco de Dados
- ✅ `@prisma/client@^5.22.0` - Cliente Prisma
- ✅ `prisma@^5.22.0` - CLI do Prisma

### Segurança
- ✅ `bcryptjs` - Hash de senhas (usado em: auth.ts, register route)
- ✅ `@types/bcryptjs` - Tipos TypeScript para bcryptjs

### Estado e UI
- ✅ `zustand` - Gerenciamento de estado (usado em: useStore.ts)
- ✅ `framer-motion` - Animações (usado em: StreakCounter.tsx)
- ✅ `lucide-react` - Ícones (usado em: vários componentes)

### Utilitários
- ✅ `date-fns` - Manipulação de datas (usado em: dashboard, leitura)
- ✅ `canvas-confetti` - Efeitos de confete (usado em: dashboard)
- ✅ `clsx` - Utilitário para classes CSS (usado em: cn.ts)
- ✅ `tailwind-merge` - Merge de classes Tailwind (usado em: cn.ts)

### Desenvolvimento
- ✅ `tsx` - Executar TypeScript (usado em: seed.ts)

## 🔍 Verificação de Imports

### ✅ Verificado e Funcionando
- `next-auth` - ✅ Corrigido middleware
- `@prisma/client` - ✅ Instalado
- `prisma` - ✅ Instalado

### ⚠️ Faltando (causarão erros)
- `next-auth` - ❌ Não instalado
- `bcryptjs` - ❌ Não instalado
- `zustand` - ❌ Não instalado
- `framer-motion` - ❌ Não instalado
- `date-fns` - ❌ Não instalado
- `lucide-react` - ❌ Não instalado
- `canvas-confetti` - ❌ Não instalado
- `clsx` - ❌ Não instalado
- `tailwind-merge` - ❌ Não instalado
- `tsx` - ❌ Não instalado
- `@types/bcryptjs` - ❌ Não instalado

## 🚀 Após Instalação

Depois de instalar todas as dependências:

1. **Configure o banco de dados:**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

2. **Execute o projeto:**
```bash
npm run dev
```

## 📝 Notas

- O middleware foi corrigido para não depender de `next-auth/middleware`
- Todas as dependências estão listadas acima
- Use a versão específica do Prisma (5.22.0) para evitar problemas de compatibilidade
