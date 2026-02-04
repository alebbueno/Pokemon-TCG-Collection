import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/constants/tokens";
import { useAuth } from "@/hooks/useAuth";

export function HomeHeader() {
    const router = useRouter();
    const { user } = useAuth();

    const handleProfilePress = () => {
        router.push("/(tabs)/profile");
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.appName}>Pokémon TCG</Text>
                <Text style={styles.appSubtitle}>Collection</Text>
            </View>

            <TouchableOpacity
                style={styles.avatarButton}
                onPress={handleProfilePress}
            >
                <View style={styles.avatarContainer}>
                    {user?.user_metadata?.avatar_url ? (
                        <Image
                            source={{ uri: user.user_metadata.avatar_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <Ionicons name="person" size={20} color={colors.textSecondary} />
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
    },
    appName: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.textPrimary,
        fontFamily: "Inter-Bold",
        lineHeight: 24,
    },
    appSubtitle: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        marginTop: -4,
    },
    avatarButton: {
        padding: 4,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.divider,
        overflow: "hidden",
    },
    avatar: {
        width: "100%",
        height: "100%",
    },
});
