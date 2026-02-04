# 🎴 Design System — Pokémon TCG App

> Documento base de UI/UX e componentes para o App de Colecionadores de Pokémon TCG

---

## 1. Visão Geral

**Objetivo**  
Criar uma experiência mobile **clean, colecionável e premium**, focada em imagens das cartas, fácil de navegar com uma mão e emocionalmente recompensadora para colecionadores.

**Princípios**
- Image-first (cartas sempre em destaque)
- Baixa carga cognitiva
- Visual de álbum físico
- Feedback visual imediato
- Pensado para Free + Pro

---

## 2. Identidade Visual

### 2.1 Mood
- Colecionador
- Premium
- Organizado
- Moderno

Referências emocionais:
- Álbum físico
- Cartas protegidas
- Valor / raridade

---

## 3. Paleta de Cores

### 3.1 Cores Primárias

| Uso | Cor | Hex |
|---|---|---|
| Primary | Amarelo Pokémon | #F6C453 |
| Secondary | Laranja destaque | #F39C12 |

### 3.2 Neutros

| Uso | Cor | Hex |
|---|---|---|
| Background | Off-white | #F8F6F2 |
| Surface | Branco | #FFFFFF |
| Divider | Cinza claro | #EAEAEA |

### 3.3 Texto

| Uso | Cor | Hex |
|---|---|---|
| Texto primário | Preto suave | #1C1C1C |
| Texto secundário | Cinza médio | #7A7A7A |

### 3.4 Feedback

| Uso | Cor | Hex |
|---|---|---|
| Success / Valor positivo | Verde | #2ECC71 |
| Danger / Alerta | Vermelho | #E74C3C |

---

## 4. Tipografia

### 4.1 Fonte
- **Inter** (fallback: System / SF Pro / Roboto)

### 4.2 Escala Tipográfica

| Uso | Tamanho | Peso |
|---|---|---|
| Title XL | 24–28 | Bold |
| Title | 20–22 | SemiBold |
| Subtitle | 16–18 | Medium |
| Body | 14–16 | Regular |
| Caption | 12–13 | Regular |

Regras:
- Valores e preços sempre em **bold**
- Raridade pode usar cor ou badge

---

## 5. Grid & Espaçamento

- Base: múltiplos de **4px**
- Padding padrão de telas: **16px**
- Espaço entre cards: **12–16px**

---

## 6. Componentes

### 6.1 Card (Container base)

**Estilo**
- Background: Surface
- Border-radius: 14px
- Shadow leve

**Uso**
- Coleções
- Cartas
- Stats

---

### 6.2 Card de Carta Pokémon

**Elementos**
- Imagem da carta (prioridade máxima)
- Nome
- Tipo / raridade
- Quantidade (badge)

**Estados**
- Normal
- Selecionado
- Duplicado
- Favorito ⭐

---

### 6.3 Progress Bar

- Altura: 6px
- Border-radius: 999px
- Background: Divider
- Fill: Primary

Usado para:
- Progresso do set
- Progresso de coleção

---

### 6.4 Buttons

#### Primary
- Background: Primary
- Texto: Preto
- Radius: 12px

#### Secondary
- Background: Surface
- Border: Divider

#### Ghost
- Apenas texto
- Para ações secundárias

---

### 6.5 Badges

Usos:
- Raridade
- Quantidade
- Status Pro

Estilo:
- Radius: 999px
- Padding: 4px 8px

---

## 7. Navegação

### 7.1 Bottom Tabs

Tabs:
- Explore
- Collection (default)
- Profile

Regras:
- Ícones simples
- Label curto
- Estado ativo com Primary

---

## 8. Telas Padrão

### 8.1 Auth
- Tela limpa
- Login Google
- Branding sutil

### 8.2 Home / Collection
- Lista de coleções
- Preview de cartas
- Valor total visível

### 8.3 Collection Detail
- Header com nome
- Progress bar
- Grid de cartas

### 8.4 Card Detail
- Carta em destaque (hero)
- Nome + raridade
- Valor médio
- CTA claro

---

## 9. Estados de UI

### Loading
- Skeleton loading
- Nunca usar spinner puro

### Empty State
- Ilustração leve
- CTA claro

### Error
- Linguagem amigável
- Nunca técnica

---

## 10. Animações

- Transições suaves (200–300ms)
- Scale leve ao tocar cards
- Feedback tátil (haptic)

---

## 11. Regras de UX

- Carta sempre maior que texto
- Ações primárias visíveis
- Zero telas mortas
- Uma ação principal por tela

---

## 12. Acessibilidade

- Contraste AA
- Tamanho mínimo de toque: 44px
- Texto legível em modo claro

---

## 13. Monetização (UI)

### Free
- Badge discreto
- Ads não invasivos

### Pro
- Badge PRO
- Destaque visual sutil
- Sem poluição visual

---

## 14. Próximos Passos

- Criar tokens no NativeWind
- Componentizar UI base
- Conectar com API Pokémon TCG
- Preparar tema dark (futuro)

---

**Documento vivo — evoluir junto com o produto**

