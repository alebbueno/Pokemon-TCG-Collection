export const colors = {
    // Primary colors (from NOVO_DESIGN_SYSTEM)
    primary: "#6C21DC",        // Roxo principal
    secondary: "#80B4F6",      // Azul claro
    primaryDark: "#352359",    // Roxo escuro (texto)

    // Gradient colors
    gradientStart: "#6C21DC",  // Início do gradiente
    gradientEnd: "#80B4F6",    // Fim do gradiente

    // Icon colors
    icon: "#C0BFF2",           // Lilás claro
    iconActive: "#6C21DC",     // Ícone ativo

    // Neutrals
    background: "#FFFFFF",     // Background principal
    surface: "#F6F7FB",        // Background secundário
    divider: "#E6E8F0",        // Bordas/divisores

    // Text
    error: "#EF4444",          // Vermelho erro
    textPrimary: "#352359",    // Texto principal (roxo escuro)
    textSecondary: "#6B6B8A",  // Texto secundário
    textDisabled: "#A0A3BD",   // Texto desabilitado

    // Feedback
    success: "#2ECC71",
    danger: "#E5484D",         // Error color from design system

    // Tag/Chip colors
    tagBackground: "#F1EFFF",
    tagText: "#6C21DC",
} as const;

export const typography = {
    titleXL: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "700" as const,
    },
    title: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "600" as const,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: "500" as const,
    },
    body: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "400" as const,
    },
    caption: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "400" as const,
    },
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
} as const;

export const borderRadius = {
    card: 16,
    button: 14,
    input: 12,
    icon: 12,
    badge: 999,
    sm: 8,
} as const;

export const shadows = {
    card: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
} as const;
