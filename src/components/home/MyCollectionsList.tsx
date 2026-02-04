import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "@/constants/tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CollectionService, Collection } from "@/services/collection";
import { useAuth } from "@/hooks/useAuth";

export function MyCollectionsList() {
    const router = useRouter();
    const { user } = useAuth();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadCollections();
        }, [user])
    );

    const loadCollections = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await CollectionService.getUserCollections(user.id);
            setCollections(data);
        } catch (error) {
            console.error("Failed to load collections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = () => {
        router.push("/(tabs)/explore");
    };

    const handleOpenCollection = (id: string) => {
        router.push(`/collection/${id}`);
    };

    if (loading && collections.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }

    const hasCollections = collections.length > 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Minhas Coleções</Text>
                {hasCollections && (
                    <TouchableOpacity onPress={() => router.push("/(tabs)/collection")}>
                        <Text style={styles.seeAll}>Ver todas</Text>
                    </TouchableOpacity>
                )}
            </View>

            {!hasCollections ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="albums-outline" size={32} color={colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>Nenhuma coleção ainda</Text>
                    <Text style={styles.emptyText}>
                        Comece a organizar suas cartas adicionando edições à sua coleção.
                    </Text>
                    <Button
                        variant="primary"
                        onPress={handleCreateCollection}
                        style={styles.createButton}
                    >
                        Explorar Edições
                    </Button>
                </View>
            ) : (
                <View style={styles.grid}>
                    {collections.slice(0, 3).map((collection) => (
                        <Card
                            key={collection.id}
                            style={styles.collectionCard}
                            onPress={() => handleOpenCollection(collection.id)}
                        >
                            <View style={styles.collectionThumb}>
                                {collection.set_logo ? (
                                    <Image
                                        source={{ uri: collection.set_logo }}
                                        style={styles.logoImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Ionicons name="images-outline" size={32} color={colors.textSecondary} />
                                )}
                            </View>
                            <View style={styles.collectionInfo}>
                                <Text style={styles.collectionName}>{collection.set_name}</Text>
                                <Text style={styles.collectionCount}>
                                    {collection.total_cards} cartas
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
                        </Card>
                    ))}
                    <Button
                        variant="outline"
                        onPress={handleCreateCollection}
                        style={{ marginTop: spacing.sm }}
                        icon="add"
                    >
                        Adicionar Coleção
                    </Button>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
        paddingBottom: 40,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
        fontFamily: "Inter-Bold",
    },
    seeAll: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
    },
    emptyContainer: {
        padding: spacing.xl,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.divider,
        borderStyle: "dashed",
    },
    emptyIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(246, 196, 83, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.md,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        fontFamily: "Inter-SemiBold",
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: spacing.lg,
        fontFamily: "Inter-Regular",
    },
    createButton: {
        width: "100%",
    },
    grid: {
        gap: spacing.md,
    },
    collectionCard: {
        padding: 0,
        flexDirection: "row",
        overflow: "hidden",
        alignItems: "center",
    },
    collectionThumb: {
        width: 80,
        height: 80,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    collectionInfo: {
        flex: 1,
        padding: spacing.md,
    },
    collectionName: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: 4,
        fontFamily: "Inter-SemiBold",
    },
    collectionCount: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: "500",
        fontFamily: "Inter-Medium",
    },
});
