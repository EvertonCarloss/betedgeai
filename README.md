# BetEdge AI 🎯

SaaS de sugestões de apostas baseadas em estatísticas reais + análise de IA.

**Stack:** Next.js 14 · Supabase · Anthropic Claude · Odds API · Tailwind CSS · Vercel

---

## 🚀 Setup em 5 passos

### 1. Clone e instale dependências
```bash
git clone <seu-repo>
cd betedge-ai
npm install
```

### 2. Configure as variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha:

```env
# Supabase — https://supabase.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic — https://console.anthropic.com
ANTHROPIC_API_KEY=

# Odds API (grátis 500 req/mês) — https://the-odds-api.com
ODDS_API_KEY=
```

### 3. Configure o Supabase
1. Crie um projeto em [supabase.com](https://supabase.com)
2. No SQL Editor, execute o conteúdo de `supabase/migrations/001_initial.sql`
3. Copie URL e anon key para o `.env.local`

### 4. Rode localmente
```bash
npm run dev
# http://localhost:3000
```

### 5. Deploy na Vercel
```bash
npm install -g vercel
vercel
# Configure as env vars no dashboard da Vercel
```

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/    # POST — busca odds + analisa com IA
│   │   ├── odds/       # GET  — scores ao vivo
│   │   └── bets/       # CRUD de apostas (GET/POST/PATCH/DELETE)
│   ├── auth/login/     # Página de login/cadastro
│   ├── dashboard/      # Métricas, gráfico de saldo, resumo
│   ├── suggestions/    # Motor de sugestões da IA
│   ├── live/           # Jogos ao vivo
│   ├── history/        # Histórico com resultado ganhou/perdeu
│   ├── stats/          # ROI, winrate, yield, acerto por esporte
│   └── settings/       # API keys, banca, comportamento da IA
├── components/
│   ├── ui/             # Badge, Button, Card, Input, Select, StatCard
│   ├── layout/         # Sidebar
│   └── betting/        # BetCard, BetSlip
├── hooks/
│   ├── useBets.ts      # CRUD + stats calculadas
│   └── useProfile.ts   # Perfil do usuário
├── lib/
│   ├── anthropic.ts    # Prompt de análise de odds
│   ├── odds-api.ts     # Wrapper da Odds API
│   ├── supabase/       # Client, server, middleware
│   └── utils.ts        # cn, formatCurrency, SPORTS, MARKETS
├── store/              # Zustand (slip, sport/market, suggestions)
└── types/              # TypeScript types
supabase/
└── migrations/
    └── 001_initial.sql # Tabelas profiles + bets + RLS + triggers
```

---

## 🔑 APIs utilizadas

| API | Uso | Plano gratuito |
|-----|-----|---------------|
| [Odds API](https://the-odds-api.com) | Odds e scores reais | 500 req/mês |
| [Anthropic Claude](https://console.anthropic.com) | Análise e sugestões | Pay-per-use |
| [Supabase](https://supabase.com) | Auth + banco de dados | 500MB grátis |

---

## ⚡ Funcionalidades

- **Auth completo** com Supabase (login, cadastro, sessão por cookies)
- **Sugestões IA** — busca odds reais e gera sugestões fundamentadas
- **Cupom de apostas** — até 6 seleções, cálculo de odd total e retorno
- **Histórico** — registra apostas, marca ganhou/perdeu, filtra
- **Dashboard** — métricas em tempo real, gráfico de evolução do saldo
- **Estatísticas** — ROI, winrate, yield, acerto por odd range e esporte
- **Ao vivo** — placar dos jogos em andamento
- **Configurações** — API keys, banca, comportamento da IA
