import React from "react";
import { View, Text, ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "danger";
}

export function Badge({
    children,
    variant = "default",
    style,
    ...props
}: BadgeProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case "success":
                return "bg-success";
            case "danger":
                return "bg-danger";
            default:
                return "bg-primary";
        }
    };

    return (
        <View
            className={`rounded-badge px-2 py-1 ${getVariantStyles()}`}
            style={style}
            {...props}
        >
            <Text className="text-caption font-medium text-text-primary">
                {children}
            </Text>
        </View>
    );
}
