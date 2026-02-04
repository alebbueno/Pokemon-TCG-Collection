import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/constants/tokens";
import { StorageService, UserCollection } from "@/services/storage";
import { PokemonTcgService, PokemonCard } from "@/services/pokemonTcg";
import { VariantSelectionModal } from "@/components/collections/VariantSelectionModal";

export default function CollectionDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [collection, setCollection] = useState<UserCollection | null>(null);
    const [cards, setCards] = useState<PokemonCard[]>([]);
    const [loading, setLoading] = useState(true);

    // Variant Selection State
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [selectedCardName, setSelectedCardName] = useState<string>("");
    const [selectedCardImage, setSelectedCardImage] = useState<string | undefined>(undefined);
    const [showVariantModal, setShowVariantModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (id) {
                loadCollection();
            }
        }, [id])
    );

    const loadCollection = async () => {
        try {
            // Only show loader on initial load, not refreshes (e.g. after modal close)
            if (!collection) setLoading(true);

            const collections = await StorageService.getUserCollections();
            const found = collections.find(c => c.id === id);

            if (found) {
                setCollection(found);
                if (found.cards.length > 0) {
                    const cardData = await PokemonTcgService.getCardsByIds(found.cards);
                    setCards(cardData);
                } else {
                    setCards([]);
                }
            }
        } catch (error) {
            console.error("Failed to load collection", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCollection = () => {
        Alert.alert(
            "Excluir coleção",
            "Tem certeza que deseja excluir esta coleção? As cartas não serão excluídas.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        if (!collection) return;
                        await StorageService.deleteUserCollection(collection.id);
                        router.back();
                    }
                }
            ]
        );
    };

    const handleCardPress = (cardId: string) => {
        router.push(`/card/${cardId}`);
    };

    const handleCardLongPress = (cardId: string, cardName: string, cardImage?: string) => {
        setSelectedCardId(cardId);
        setSelectedCardName(cardName);
        setSelectedCardImage(cardImage);
        setShowVariantModal(true);
    };

    if (loading && !collection) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!collection) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.center, { padding: spacing.xl }]}>
                    <Text style={styles.errorText}>Coleção não encontrada</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderCardBadges = (cardId: string) => {
        const variants = collection.cardVariants?.[cardId] || [];
        if (variants.length === 0) return null;

        // Map variants to icons/colors
        // This logic mirrors VariantSelectionModal but simplified for badges
        const getBadge = (variant: string) => {
            switch (variant) {
                case 'foil': return { icon: 'star', color: '#FFD700' };
                case 'reverse': return { icon: 'refresh', color: '#FFFFFF' }; // White for visibility on image
                case 'pokeball': return { icon: 'radio-button-on', color: '#EF4444' };
                case 'masterball': return { icon: 'planet', color: '#8B5CF6' };
                default: return null;
            }
        };

        return (
            <View style={styles.badgeContainer}>
                {variants.map(v => {
                    const badge = getBadge(v);
                    if (!badge) return null;
                    return (
                        <View key={v} style={styles.badge}>
                            <Ionicons name={badge.icon as any} size={10} color={badge.color} />
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{collection.name}</Text>
                    <Text style={styles.headerSubtitle}>{collection.cards.length} cartas</Text>
                </View>
                <TouchableOpacity onPress={handleDeleteCollection} style={styles.headerButton}>
                    <Ionicons name="trash-outline" size={24} color={colors.danger} />
                </TouchableOpacity>
            </View>

            {collection.description ? (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{collection.description}</Text>
                </View>
            ) : null}

            <FlatList
                data={cards}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => handleCardPress(item.id)}
                        onLongPress={() => handleCardLongPress(item.id, item.name, item.image)}
                    >
                        <Image
                            source={{ uri: item.image ? `${item.image}/low.png` : undefined }}
                            style={styles.cardImage}
                            resizeMode="contain"
                        />
                        {renderCardBadges(item.id)}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="albums-outline" size={48} color={colors.divider} />
                        <Text style={styles.emptyText}>Esta coleção está vazia.</Text>
                        <Text style={styles.emptySubText}>Explore cartas e adicione-as aqui.</Text>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.push('/(tabs)/explore')}
                        >
                            <Text style={styles.exploreButtonText}>Explorar Coleções</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            <VariantSelectionModal
                visible={showVariantModal}
                onClose={() => setShowVariantModal(false)}
                collectionId={collection.id}
                cardId={selectedCardId || ""}
                cardName={selectedCardName}
                cardImage={selectedCardImage}
                onUpdate={loadCollection}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        backgroundColor: colors.surface,
    },
    headerButton: {
        padding: spacing.sm,
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
        fontFamily: "Inter-Bold",
    },
    headerSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        fontFamily: "Inter-Regular",
    },
    descriptionContainer: {
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    descriptionText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        fontFamily: "Inter-Regular",
    },
    listContent: {
        padding: spacing.sm,
        flexGrow: 1,
    },
    columnWrapper: {
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    cardItem: {
        flex: 1,
        aspectRatio: 0.7,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        maxWidth: '100%',
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: spacing.md,
        fontFamily: "Inter-SemiBold",
    },
    emptySubText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        textAlign: 'center',
        marginBottom: spacing.lg,
        fontFamily: "Inter-Regular",
    },
    exploreButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.button,
    },
    exploreButtonText: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontFamily: "Inter-SemiBold",
    },
    errorText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    backButton: {
        padding: spacing.md,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.button,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "Inter-Bold",
    }
});
