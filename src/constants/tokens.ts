export const colors = {
    // Primary colors
    primary: "#F6C453",
    secondary: "#F39C12",

    // Neutrals
    background: "#F8F6F2",
    surface: "#FFFFFF",
    divider: "#EAEAEA",

    // Text
    textPrimary: "#1C1C1C",
    textSecondary: "#7A7A7A",

    // Feedback
    success: "#2ECC71",
    danger: "#E74C3C",
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
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
} as const;

export const borderRadius = {
    card: 14,
    button: 12,
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
