import React from "react";
import { View, ViewProps, DimensionValue } from "react-native";

interface SkeletonProps extends ViewProps {
    width?: DimensionValue;
    height?: DimensionValue;
    rounded?: boolean;
}

export function Skeleton({
    width = "100%",
    height = 20,
    rounded = false,
    style,
    ...props
}: SkeletonProps) {
    return (
        <View
            className={`bg-divider ${rounded ? "rounded-badge" : "rounded-md"}`}
            style={[{ width, height }, style]}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <View className="bg-surface rounded-card p-lg">
            <Skeleton height={120} rounded className="mb-md" />
            <Skeleton height={20} width="70%" className="mb-sm" />
            <Skeleton height={16} width="50%" />
        </View>
    );
}
