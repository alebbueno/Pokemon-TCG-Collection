import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/constants/tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StorageService, UserCollection } from "@/services/storage";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";

export function MyCollectionsList() {
    const router = useRouter();
    const [collections, setCollections] = useState<UserCollection[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadCollections();
        }, [])
    );

    const loadCollections = async () => {
        const data = await StorageService.getUserCollections();
        setCollections(data);
    };

    const handleCreateCollection = () => {
        setModalVisible(true);
    };

    const handleSaveCollection = async (name: string, description: string) => {
        try {
            const newCollection: UserCollection = {
                id: Date.now().toString(),
                name,
                description,
                createdAt: Date.now(),
                cards: []
            };
            await StorageService.saveUserCollection(newCollection);
            await loadCollections();
            setModalVisible(false);
        } catch (error) {
            console.error("Failed to create collection", error);
        }
    };

    const handleOpenCollection = (id: string) => {
        router.push(`/collection/${id}`);
    };

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
                        Comece a organizar suas cartas criando sua primeira coleção.
                    </Text>
                    <Button
                        variant="primary"
                        onPress={handleCreateCollection}
                        style={styles.createButton}
                    >
                        Criar Nova Coleção
                    </Button>
                </View>
            ) : (
                <View style={styles.grid}>
                    {collections.slice(0, 3).map((collection) => ( // Show only first 3
                        <Card
                            key={collection.id}
                            style={styles.collectionCard}
                            onPress={() => handleOpenCollection(collection.id)}
                        >
                            <View style={[styles.collectionThumb, { overflow: 'hidden' }]}>
                                {collection.coverImage ? (
                                    <View
                                        style={{
                                            width: 120, // 300 * 0.4
                                            height: 160, // 400 * 0.4
                                            transform: [
                                                { translateX: (collection.coverStyle?.offsetX || 0) * 0.4 },
                                                { translateY: (collection.coverStyle?.offsetY || 0) * 0.4 },
                                                { scale: collection.coverStyle?.scale || 1 }
                                            ],
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image
                                            source={{ uri: `${collection.coverImage}/low.png` }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : (
                                    <Ionicons name="images-outline" size={32} color={colors.textSecondary} />
                                )}
                            </View>
                            <View style={styles.collectionInfo}>
                                <Text style={styles.collectionName}>{collection.name}</Text>
                                <Text style={styles.collectionCount}>
                                    {collection.cards.length} cartas
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
                        Nova Coleção
                    </Button>
                </View>
            )}

            <CreateCollectionModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSaveCollection}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
        paddingBottom: 40,
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
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
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
    coverImage: {
        width: '100%',
        height: '100%',
    },
});
