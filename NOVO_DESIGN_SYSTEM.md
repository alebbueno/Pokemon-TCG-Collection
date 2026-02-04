# Design System — pokeio

Design system oficial do app **pokeio**, uma rede social para colecionadores de Pokémon TCG.

Este documento define padrões visuais, componentes e diretrizes de UI para desenvolvimento do app em **Expo (React Native)**, compatível com **Android e iOS**.

---

## 🎯 Princípios de Design

- **Flat & Moderno**
- Visual limpo, leve e consistente
- Foco em legibilidade e hierarquia
- Estilo profissional, porém amigável
- Interface social-first

---

## 🎨 Paleta de Cores

### Cores Primárias

| Uso | Cor | Hex |
|---|---|---|
| Texto principal | Roxo escuro | `#352359` |
| Background ícone (gradiente) | Roxo | `#6C21DC` |
| Background ícone (gradiente) | Azul claro | `#80B4F6` |
| Ícones | Lilás claro | `#C0BFF2` |

### Gradiente Principal

```css
linear-gradient(135deg, #6C21DC 0%, #80B4F6 100%)
```

### Cores Neutras

| Uso | Hex |
|---|---|
| Background principal | `#FFFFFF` |
| Background secundário | `#F6F7FB` |
| Divider / Bordas | `#E6E8F0` |
| Texto secundário | `#6B6B8A` |
| Texto desabilitado | `#A0A3BD` |

---

## 🔤 Tipografia

### Fonte Principal

- **Inter** (ou System default como fallback)

### Escala Tipográfica

| Uso | Tamanho | Peso |
|---|---|---|
| Heading XL | 28px | 700 |
| Heading L | 22px | 600 |
| Heading M | 18px | 600 |
| Body | 15px | 400 |
| Small | 13px | 400 |
| Caption | 11px | 400 |

Cor padrão de texto: `#352359`

---

## 🧱 Grid & Espaçamento

- Base de espaçamento: **8px**

| Token | Valor |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

Bordas arredondadas:
- Cards: **16px**
- Botões: **14px**
- Inputs: **12px**
- Ícones: **12px**

---

## 🔘 Botões

### Botão Primário

- Background: Gradiente principal
- Texto: `#FFFFFF`
- Altura: 48px
- Radius: 14px
- Fonte: 15px / 600

Estados:
- Hover: leve aumento de brilho
- Disabled: opacity 0.5

---

### Botão Secundário

- Background: `#FFFFFF`
- Borda: 1px `#E6E8F0`
- Texto: `#352359`

---

### Botão Ghost

- Background: transparente
- Texto: `#6C21DC`

---

## 🧩 Cards

### Card Padrão

- Background: `#FFFFFF`
- Radius: 16px
- Padding: 16px
- Shadow leve (iOS)
- Elevation 2 (Android)

Usado para:
- Cartas Pokémon
- Álbuns
- Posts sociais
- Comentários

---

## 🧭 Navbar / Tab Bar

### Bottom Tab Bar

- Background: `#FFFFFF`
- Altura: 64px
- Ícone ativo: `#6C21DC`
- Ícone inativo: `#A0A3BD`

Tabs sugeridas:
- Home
- Coleções
- Criar (+)
- Social
- Perfil

---

## 🧠 Ícones

- Estilo: **Outline / Flat**
- Biblioteca sugerida: **Lucide Icons** ou **Phosphor Icons**
- Cor padrão: `#C0BFF2`
- Tamanho padrão: 24px

---

## 🏷️ Tags & Chips

### Tag Padrão

- Background: `#F1EFFF`
- Texto: `#6C21DC`
- Radius: 999px
- Padding: 6px 12px

Usado para:
- Tipo de coleção
- Raridade
- Artista

---

## ✏️ Inputs

### Input Padrão

- Background: `#FFFFFF`
- Borda: 1px `#E6E8F0`
- Radius: 12px
- Altura: 48px
- Padding horizontal: 14px

Estados:
- Focus: borda `#6C21DC`
- Error: borda `#E5484D`

---

## 🧰 Tooltips & Feedback

### Toast / Snackbar

- Background: `#352359`
- Texto: `#FFFFFF`
- Radius: 12px

### Loading

- Spinner com gradiente pokeio
- Skeleton loader com `#F1F2F8`

---

## 📱 Telas Base

### Splash

- Logo central
- Background branco ou gradiente suave
- Animação leve de escala ou fade

### Auth (Login / Cadastro)

- Layout centralizado
- Social login destacado
- Botão primário dominante

### Home

- Feed social
- Cards de coleção
- CTA de criar álbum

---

## 🧠 Acessibilidade

- Contraste AA
- Touch target mínimo: 44px
- Texto escalável

---

## 📦 Tokens Recomendados (Theme)

```ts
colors: {
  primary: '#6C21DC',
  secondary: '#80B4F6',
  text: '#352359',
  icon: '#C0BFF2',
  background: '#FFFFFF',
  surface: '#F6F7FB'
}
```

---

**pokeio** — seu álbum, suas regras.

