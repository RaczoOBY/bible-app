# Scripture Quest - Aplicativo de Leitura Bíblica Gamificada

Aplicativo web responsivo e gamificado para acompanhar e registrar o progresso de leitura bíblica anual baseado no plano Discipleship Journal.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **NextAuth.js** - Autenticação
- **Zustand** - Gerenciamento de estado (quando necessário)
- **Framer Motion** - Animações
- **date-fns** - Manipulação de datas
- **canvas-confetti** - Efeitos de confete

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL (local ou cloud)
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd bible-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```
DATABASE_URL="postgresql://user:password@localhost:5432/bible_app"
NEXTAUTH_SECRET="seu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. Configure o banco de dados:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
/src
  /app
    /(auth)          # Rotas de autenticação
    /(main)           # Rotas principais (protegidas)
    /api              # API Routes
  /components
    /ui               # Componentes UI base
    /features          # Componentes de features
    /layout            # Componentes de layout
  /lib
    /db               # Configuração do Prisma
    /utils             # Utilitários
    /hooks             # Custom hooks
    /constants          # Constantes
  /types              # Tipos TypeScript
  /data               # Dados estáticos (plano de leitura)
```

## 🎮 Funcionalidades

### ✅ Implementadas

- ✅ Autenticação com email/senha
- ✅ Dashboard com leituras do dia
- ✅ Sistema de marcar leituras
- ✅ Cálculo de XP e níveis
- ✅ Sistema de sequência (streak)
- ✅ Tela de progresso
- ✅ Tela de conquistas
- ✅ Tela de perfil
- ✅ Calendário visual do mês
- ✅ Animações básicas

### 🚧 Em desenvolvimento

- ⏳ PWA (Progressive Web App)
- ⏳ Notificações push
- ⏳ Tema claro/escuro
- ⏳ Exportar progresso
- ⏳ Anotações nas leituras

## 📊 Sistema de Gamificação

### XP e Níveis

- **10 XP** por leitura individual completada
- **50 XP** bônus por completar todas as 4 leituras do dia
- **Multiplicadores de sequência:**
  - 3+ dias: 1.2x
  - 7+ dias: 1.5x
  - 14+ dias: 2.0x
  - 30+ dias: 3.0x

### Níveis

1. 🌱 Iniciante (0-500 XP)
2. 📖 Aprendiz (501-1500 XP)
3. 📚 Estudante (1501-3500 XP)
4. ⭐ Leitor (3501-7000 XP)
5. ✨ Discípulo (7001-12000 XP)
6. 🏆 Mestre (12001-20000 XP)
7. 👑 Sábio (20001-35000 XP)
8. 🎖️ Escriba (35001+ XP)

### Conquistas

- 🌱 Primeiro Passo - Complete seu primeiro dia
- 🔥 Consistente - 3 dias seguidos
- ⭐ Semana Santa - 7 dias seguidos
- 💪 Quinzena Fiel - 14 dias seguidos
- 🏆 Mês de Ouro - 30 dias seguidos
- 👑 Centurião - 100 dias seguidos
- 📜 Discípulo - Complete os 4 Evangelhos
- ✝️ Novo Pacto - Complete o NT
- 🏅 Escriba - Complete a Bíblia
- 📅 Mês Perfeito - Complete todos os 25 dias do mês

## 🗄️ Banco de Dados

O projeto usa Prisma ORM com PostgreSQL. Os modelos principais são:

- **User** - Usuários do sistema
- **Leitura** - Leituras marcadas pelos usuários
- **Conquista** - Conquistas disponíveis
- **UserConquista** - Conquistas desbloqueadas pelos usuários
- **Anotacao** - Anotações dos usuários (futuro)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run db:generate` - Gera cliente Prisma
- `npm run db:push` - Sincroniza schema com banco
- `npm run db:seed` - Popula banco com dados iniciais
- `npm run db:studio` - Abre Prisma Studio

## 🎨 Design System

O projeto segue um design system de "Soft Glassmorphism" com:

- Cores suaves (mint, lavender, peach)
- Efeitos de vidro (glassmorphism)
- Animações suaves
- Tipografia SF Pro (fallback para sistema)

## 📱 Responsividade

- **Mobile First** - Design otimizado para mobile
- **Bottom Navigation** - Navegação inferior no mobile
- **Sidebar** - Navegação lateral no desktop
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: >= 640px
  - Desktop: >= 1024px

## 🔒 Segurança

- Autenticação com NextAuth.js
- Senhas hasheadas com bcrypt
- Rotas protegidas com middleware
- Validação de dados no servidor

## 📄 Licença

Este projeto é privado e de uso pessoal.

## 👨‍💻 Desenvolvimento

Para contribuir ou reportar problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para a jornada bíblica**
