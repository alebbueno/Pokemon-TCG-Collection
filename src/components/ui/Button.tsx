import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    TouchableOpacityProps,
    StyleSheet,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "@/constants/tokens";

interface ButtonProps extends TouchableOpacityProps {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    children: React.ReactNode;
    loading?: boolean;
    icon?: string; // Adding placeholder for icon if used later, though not strictly needed for this fix
}

export function Button({
    variant = "primary",
    children,
    loading = false,
    disabled,
    style,
    ...props
}: ButtonProps) {

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                (disabled || loading) && styles.disabled,
                style
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "primary" ? colors.textPrimary : colors.primary}
                />
            ) : (
                <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.button,
        paddingVertical: 16, // py-4 (4 * 4 = 16)
        paddingHorizontal: 24, // px-6 (6 * 4 = 24)
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    disabled: {
        opacity: 0.5,
    },
    // Variants
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.divider,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
        borderStyle: 'dashed', // Optional, but often looks good for "add new"
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    // Text Styles
    text: {
        fontSize: 16, // text-body (approx)
        fontFamily: 'Inter-Medium', // Default for body
    },
    primaryText: {
        color: colors.textPrimary,
        fontFamily: 'Inter-SemiBold',
    },
    secondaryText: {
        color: colors.textPrimary,
        fontFamily: 'Inter-Medium',
    },
    outlineText: {
        color: colors.primary,
        fontFamily: 'Inter-Medium',
    },
    ghostText: {
        color: colors.textSecondary,
        fontFamily: 'Inter-Medium',
    }
});
