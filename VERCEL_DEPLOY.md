# 🚀 Deploy na Vercel - Guia Completo

## ✅ Configuração Corrigida

O problema `prisma: command not found` foi corrigido usando `npx` para executar o Prisma.

## 📋 Arquivos Configurados

### vercel.json
```json
{
  "buildCommand": "npx prisma generate && next build"
}
```

### package.json
- `build`: `npx prisma generate && next build`
- `postinstall`: `npx prisma generate`

## 🔧 Como Funciona

1. **Instalação (`npm install`):**
   - Instala todas as dependências
   - Executa `postinstall` → `npx prisma generate`

2. **Build (`npm run build`):**
   - Executa `npx prisma generate` primeiro
   - Depois executa `next build`

## 🌐 Deploy na Vercel

### Passo 1: Configurar Variáveis de Ambiente

Na Vercel Dashboard, adicione:

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=seu-secret-key-aqui
NEXTAUTH_URL=https://seu-app.vercel.app
```

### Passo 2: Conectar Repositório

1. Vá para [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. A Vercel detectará automaticamente o Next.js

### Passo 3: Configurar Build

A Vercel usará automaticamente:
- **Build Command:** `npx prisma generate && next build` (do vercel.json)
- **Output Directory:** `.next` (detectado automaticamente)
- **Install Command:** `npm install` (padrão)

### Passo 4: Deploy

1. Clique em "Deploy"
2. A Vercel executará:
   - `npm install` → `postinstall` gera Prisma Client
   - `npx prisma generate` → garante atualização
   - `next build` → build do Next.js

## ⚠️ Importante

### Banco de Dados

Use um PostgreSQL cloud:
- **Neon** (recomendado): https://neon.tech
- **Supabase**: https://supabase.com
- **Vercel Postgres**: Integrado com Vercel

### NEXTAUTH_SECRET

Gere um secret seguro:
```bash
openssl rand -base64 32
```

### NEXTAUTH_URL

Use a URL completa do seu app:
- Desenvolvimento: `http://localhost:3000`
- Produção: `https://seu-app.vercel.app`

## 🔍 Troubleshooting

### Erro: "prisma: command not found"
✅ **Resolvido** - Agora usa `npx prisma generate`

### Erro: "DATABASE_URL not found"
- Verifique se a variável está configurada na Vercel
- Use o nome exato: `DATABASE_URL`

### Erro: "Prisma Client not generated"
- O `postinstall` script garante geração após instalação
- O `buildCommand` garante geração antes do build

## ✅ Checklist de Deploy

- [ ] Repositório conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados PostgreSQL criado
- [ ] `DATABASE_URL` configurada
- [ ] `NEXTAUTH_SECRET` configurado
- [ ] `NEXTAUTH_URL` configurado
- [ ] `vercel.json` presente no projeto
- [ ] `package.json` com scripts corretos

## 🎯 Status

- ✅ `vercel.json` configurado
- ✅ `package.json` atualizado
- ✅ Prisma usando `npx`
- ✅ Pronto para deploy

---

**O projeto está pronto para deploy na Vercel!** 🚀
