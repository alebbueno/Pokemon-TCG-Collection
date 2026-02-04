# 🔧 Problemas Resolvidos - Pokémon TCG App

## Problemas Encontrados e Soluções

### 1. ❌ Erro: CLI Expo Antiga
**Problema**: Uso de comandos `expo` ou `exp` globais antigos.
**Solução**: Usar `npx expo start`.

### 2. ❌ Erro: babel-preset-expo não encontrado
**Problema**: Dependência faltando.
**Solução**: `npm install --save-dev babel-preset-expo`

### 3. ❌ Erro: Configuração do NativeWind v4 (Build Failure)
**Problema**: Erros de bundling `[BABEL] .plugins is not a valid Plugin property`.
NativeWind v4 requer configuração específica de Metro e Babel.

**Solução**:
1. Criado `metro.config.js` com `withNativeWind`.
2. Habilitado presets corretos no `babel.config.js`.
3. Ajustado `package.json` main para `expo-router/entry`.

### 4. ❌ Erro: Crash Crash na Inicialização (ClassCastException)
**Problema**: App fecha sozinho logo após abrir com erro `java.lang.String cannot be cast to java.lang.Boolean`.
**Causa**: NativeWind v4 aplicando estilos via `className` em componentes que não suportam ou têm conflito de props (ex: `Image`).
**Solução**: Usar `style={...}` padrão do React Native ao invés de `className` para o componente `Image` que causa o conflito.

---

## ✅ Status Atual

- ✅ Metro bundler rodando na porta 8083.
- ✅ Build Android realizado com sucesso.
- ✅ App inicializa sem crashes.

## 🚀 Próximos Passos

1. **Configurar Supabase**:
   Adicione as credenciais no arquivo `.env` para sair da tela de loading.

2. **Avisos Conhecidos**:
   - `WARN SafeAreaView has been deprecated...`: Aviso benigno de biblioteca, não afeta funcionamento imediato.
