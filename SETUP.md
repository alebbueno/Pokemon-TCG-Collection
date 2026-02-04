# Pokémon TCG Collection App - Guia de Configuração

## Início Rápido

1. **Instalar dependências**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configurar Supabase**:
   - Crie um projeto Supabase em https://supabase.com
   - Atualize o \`.env\` com suas credenciais:
     \`\`\`
     EXPO_PUBLIC_SUPABASE_URL=sua-url-aqui
     EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
     \`\`\`

3. **Executar migration do banco de dados**:
   - Abra o SQL Editor do Supabase
   - Copie e execute o SQL de \`supabase/migrations/001_create_profiles.sql\`

4. **Baixar fontes** (opcional):
   - Baixe a fonte Inter do Google Fonts
   - Coloque em \`assets/fonts/\`:
     - Inter-Regular.ttf
     - Inter-Medium.ttf
     - Inter-SemiBold.ttf
     - Inter-Bold.ttf
   - Ou pule esta etapa e use fontes do sistema (remova o carregamento de fontes de \`app/_layout.tsx\`)

5. **Iniciar o app**:
   \`\`\`bash
   npx expo start
   \`\`\`

## Próximos Passos

- Teste o registro e login
- Explore a estrutura do app
- Comece a construir funcionalidades de coleção!

## Precisa de Ajuda?

Confira o README.md completo para documentação detalhada.
