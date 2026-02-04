import React from "react";
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { shadows } from "@/constants/tokens";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    onPress?: () => void;
}

export function Card({ children, style, onPress, ...props }: CardProps) {
    const cardStyle = [
        {
            backgroundColor: '#FFFFFF', // surface
            borderRadius: 16, // card
            padding: 24, // lg
        },
        shadows.card,
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7} {...(props as TouchableOpacityProps)}>
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle} {...props}>
            {children}
        </View>
    );
}
