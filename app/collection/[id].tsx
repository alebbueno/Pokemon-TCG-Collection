import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "@/constants/tokens";
import { CollectionService, CollectionDetails } from "@/services/collection";
import { useAuth } from "@/hooks/useAuth";
import { ImageWithLoader } from "@/components/ui/ImageWithLoader";

export default function CollectionDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [collection, setCollection] = useState<CollectionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadCollection();
        }
    }, [id]);

    const loadCollection = async () => {
        try {
            setLoading(true);
            const data = await CollectionService.getCollectionDetails(id);

            if (!data) {
                // Collection not found
                setCollection(null);
                setErrorMsg("Dados da coleção retornaram vazios (null).");
            } else {
                setCollection(data);
                setErrorMsg(null);
            }
        } catch (error: any) {
            console.error("Failed to load collection", error);
            setErrorMsg(error.message || "Erro desconhecido ao carregar coleção");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadCollection();
        setRefreshing(false);
    };

    const handleDeleteCollection = () => {
        Alert.alert(
            "Excluir coleção",
            "Tem certeza que deseja excluir esta coleção?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        if (!collection) return;
                        await CollectionService.deleteCollection(collection.id);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleCardPress = (cardId: string) => {
        router.push(`/card/${cardId}`);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!collection) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Coleção não encontrada</Text>
                    {errorMsg && (
                        <View style={{ marginTop: 16, padding: 16, backgroundColor: '#FFEBEE', borderRadius: 8 }}>
                            <Text style={{ color: colors.error, fontWeight: 'bold' }}>Erro técnico:</Text>
                            <Text style={{ color: colors.error, marginTop: 4 }}>{errorMsg}</Text>
                            <Text style={{ color: '#666', marginTop: 8, fontSize: 12 }}>ID: {id}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.collectionName}>{collection.set_name}</Text>
                    <Text style={styles.progressText}>
                        {collection.collected_count}/{collection.total_cards} cartas ({collection.progress_percentage}%)
                    </Text>
                </View>
                <TouchableOpacity onPress={handleDeleteCollection} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={22} color={colors.error} />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${collection.progress_percentage}%` }
                        ]}
                    />
                </View>
            </View>

            {/* Cards Grid */}
            <FlatList
                data={collection.cards}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.grid}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.cardContainer,
                            item.quantity === 0 && styles.cardNotOwned
                        ]}
                        onPress={() => handleCardPress(item.card_id)}
                    >
                        <View style={styles.cardImageContainer}>
                            {item.card_image ? (
                                <ImageWithLoader
                                    source={{ uri: item.card_image }}
                                    style={styles.cardImage}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={[styles.cardImage, { backgroundColor: colors.surface }]} />
                            )}
                        </View>
                        {item.quantity > 0 && (
                            <View style={styles.quantityBadge}>
                                <Text style={styles.quantityText}>×{item.quantity}</Text>
                            </View>
                        )}
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardInfoText} numberOfLines={1}>{item.card_name}</Text>
                            <Text style={styles.cardNumberText}>#{item.card_number}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="albums-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>Nenhuma carta nesta coleção</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: spacing.md,
        textAlign: "center",
    },
    backButton: {
        marginTop: spacing.lg,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.button,
    },
    backButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    backBtn: {
        padding: spacing.sm,
    },
    deleteBtn: {
        padding: spacing.sm,
    },
    headerInfo: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    collectionName: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
    },
    progressText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    progressBarContainer: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: colors.surface,
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    grid: {
        padding: spacing.sm,
    },
    cardContainer: {
        flex: 1 / 3,
        padding: spacing.xs,
        marginBottom: spacing.md,
    },
    cardImageContainer: {
        aspectRatio: 0.7,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        ...shadows.card,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardInfo: {
        marginTop: 4,
        alignItems: 'center',
    },
    cardInfoText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    cardNumberText: {
        fontSize: 9,
        color: colors.textSecondary,
    },
    cardNotOwned: {
        opacity: 0.3,
    },
    quantityBadge: {
        position: "absolute",
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: "center",
    },
    quantityText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
});
