# 🎴 Pokémon TCG Collection App

Um aplicativo mobile para colecionadores de Pokémon TCG construído com Expo, React Native e Supabase.

## ✨ Funcionalidades

- ✅ **Sistema de Autenticação Completo**
  - Registro e login com Email/Senha
  - Recuperação de senha
  - Login com Google pronto (requer configuração)
  - Persistência segura de sessão com Expo SecureStore

- ✅ **UI/UX Moderna**
  - Design limpo e premium seguindo o design system
  - NativeWind (Tailwind CSS) para estilização
  - Animações e transições suaves
  - Estados de carregamento com skeleton

- ✅ **Navegação**
  - Expo Router com roteamento baseado em arquivos
  - Navegação por abas (Home, Coleção, Perfil)
  - Rotas protegidas com redirecionamento automático

- ✅ **Perfil do Usuário**
  - Visualizar informações da conta
  - Funcionalidade de logout
  - Perfil criado automaticamente no registro

## 🚀 Stack Tecnológica

- **Framework**: Expo (Managed Workflow)
- **Linguagem**: TypeScript
- **Navegação**: Expo Router
- **Estilização**: NativeWind (Tailwind CSS)
- **Gerenciamento de Estado**: Zustand
- **Busca de Dados**: TanStack Query
- **Backend**: Supabase (Auth + Database)
- **Armazenamento Seguro**: Expo Secure Store

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Supabase (tier gratuito funciona)
- iOS Simulator (Mac) ou Android Emulator

## 🛠️ Instruções de Configuração

### 1. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Supabase

1. Crie um novo projeto em [supabase.com](https://supabase.com)
2. Copie a URL do projeto e a chave anon
3. Atualize o arquivo \`.env\`:

\`\`\`env
EXPO_PUBLIC_SUPABASE_URL=sua-url-do-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
\`\`\`

### 3. Configurar o Banco de Dados

Execute a migration no SQL Editor do Supabase:

\`\`\`bash
# Copie o conteúdo de supabase/migrations/001_create_profiles.sql
# e execute no SQL Editor do Supabase
\`\`\`

Ou use a CLI do Supabase:

\`\`\`bash
npx supabase db push
\`\`\`

### 4. Configurar Login com Google (Opcional)

1. Vá para seu projeto Supabase → Authentication → Providers
2. Habilite o provedor Google
3. Configure as credenciais OAuth no Google Cloud Console
4. Adicione a URL de redirecionamento do Supabase ao seu app OAuth do Google

### 5. Adicionar Fontes

O app usa a família de fontes Inter. Baixe do [Google Fonts](https://fonts.google.com/specimen/Inter) e coloque em \`assets/fonts/\`:

- \`Inter-Regular.ttf\`
- \`Inter-Medium.ttf\`
- \`Inter-SemiBold.ttf\`
- \`Inter-Bold.ttf\`

Ou use fontes do sistema removendo o carregamento de fontes de \`app/_layout.tsx\`.

### 6. Executar o App

\`\`\`bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Executar no iOS
npx expo start --ios

# Executar no Android
npx expo start --android

# Executar na web
npx expo start --web
\`\`\`

## 📱 Estrutura do App

\`\`\`
app/
├── _layout.tsx              # Layout raiz com QueryClient
├── index.tsx                # Splash screen com verificação de sessão
├── (auth)/                  # Telas de autenticação
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
└── (tabs)/                  # Telas principais do app
    ├── _layout.tsx          # Navegação por abas
    ├── home.tsx
    ├── collection.tsx
    └── profile.tsx

src/
├── components/
│   └── ui/                  # Componentes UI reutilizáveis
│       ├── Card.tsx
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── ProgressBar.tsx
│       └── Skeleton.tsx
├── constants/
│   └── tokens.ts            # Tokens do design system
├── hooks/
│   └── useAuth.ts           # Hook de autenticação
├── lib/
│   └── supabase.ts          # Cliente Supabase
├── store/
│   └── authStore.ts         # Store Zustand de autenticação
├── types/
│   └── database.types.ts    # Tipos TypeScript do banco de dados
└── utils/
    └── validation.ts        # Utilitários de validação de formulários
\`\`\`

## 🎨 Design System

O app segue um design system abrangente definido em \`design_system_pokemon_tcg_app.md\`:

- **Cores**: Amarelo primário (#F6C453), laranja secundário, neutros
- **Tipografia**: Família de fontes Inter com escalas definidas
- **Espaçamento**: Unidade base de 4px
- **Componentes**: Cards, botões, badges, barras de progresso

## 🔐 Fluxo de Autenticação

1. **Splash Screen**: Verifica sessão existente
   - Se logado → redireciona para Home
   - Se não logado → redireciona para Login

2. **Registro**: Cria usuário no Supabase Auth
   - Cria perfil automaticamente no banco via trigger
   - Email de verificação enviado

3. **Login**: Email/senha ou Login com Google
   - Sessão armazenada com segurança via SecureStore
   - Redirecionamento automático para Home

4. **Recuperação de Senha**: Link de reset via email

## 🗄️ Schema do Banco de Dados

### Tabela profiles

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, referencia auth.users |
| name | TEXT | Nome de exibição do usuário |
| avatar_url | TEXT | URL do avatar (opcional) |
| created_at | TIMESTAMP | Data de criação da conta |

**Políticas RLS**:
- Usuários podem visualizar seu próprio perfil
- Usuários podem atualizar seu próprio perfil
- Criado automaticamente no registro do usuário

## 🚧 Em Breve

- Gerenciamento de coleção de cartas Pokémon
- Navegação por sets TCG
- Rastreamento de valor das cartas
- Estatísticas da coleção
- Busca e filtros
- Modo escuro

## 📝 Variáveis de Ambiente

\`\`\`env
EXPO_PUBLIC_SUPABASE_URL=sua-url-do-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
\`\`\`

## 🐛 Solução de Problemas

### Erros de Path Alias do TypeScript

Se você ver erros "Cannot find module '@/...'", reinicie o servidor TypeScript no VS Code:
- Cmd+Shift+P → "TypeScript: Restart TS Server"

### Problemas de Conexão com Supabase

- Verifique se o arquivo \`.env\` tem as credenciais corretas
- Verifique se o projeto Supabase está ativo
- Certifique-se de que a migration do banco foi executada com sucesso

### Problemas ao Carregar Fontes

Se as fontes não carregarem:
- Verifique se os arquivos de fonte existem em \`assets/fonts/\`
- Verifique se os nomes dos arquivos correspondem exatamente em \`app/_layout.tsx\`
- Ou remova o carregamento de fontes e use fontes do sistema

## 📄 Licença

MIT

## 👨‍💻 Autor

Construído com ❤️ para colecionadores de Pokémon TCG
