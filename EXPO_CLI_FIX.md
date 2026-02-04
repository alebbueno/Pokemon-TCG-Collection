# ⚠️ Problema com Expo CLI

Se você recebeu o erro sobre `sdkVersion` inválido, é porque está usando uma versão antiga do Expo CLI global.

## ✅ Solução

**Use `npx expo` em vez de `expo`:**

```bash
# ❌ NÃO use
expo start

# ✅ USE
npx expo start
```

## 🚀 Comandos Corretos

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Executar no iOS
npx expo start --ios

# Executar no Android
npx expo start --android

# Executar na web
npx expo start --web
```

## 🔧 Opcional: Remover CLI Global Antiga

Se quiser, você pode remover a CLI global antiga:

```bash
npm uninstall -g expo-cli
```

Não é necessário instalar nada globalmente - o `npx` usa a versão local do projeto automaticamente!
