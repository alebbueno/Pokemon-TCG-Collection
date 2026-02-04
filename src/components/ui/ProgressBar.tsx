import React from "react";
import { View, Text, ViewProps } from "react-native";
import { colors } from "@/constants/tokens";

interface ProgressBarProps extends ViewProps {
    progress: number; // 0-100
    showLabel?: boolean;
}

export function ProgressBar({
    progress,
    showLabel = false,
    style,
    ...props
}: ProgressBarProps) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={style} {...props}>
            <View className="h-[6px] bg-divider rounded-badge overflow-hidden">
                <View
                    className="h-full bg-primary rounded-badge"
                    style={{ width: `${clampedProgress}%` }}
                />
            </View>
            {showLabel && (
                <Text className="text-caption text-text-secondary mt-1">
                    {clampedProgress}%
                </Text>
            )}
        </View>
    );
}
