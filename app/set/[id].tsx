import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/constants/tokens";
import { PokemonTcgService, PokemonCard, PokemonSet } from "@/services/pokemonTcg";
import { Card } from "@/components/ui/Card";
import { ImageWithLoader } from "@/components/ui/ImageWithLoader";
import { StorageService } from "@/services/storage";
import { AddToCollectionModal } from "@/components/collections/AddToCollectionModal";

export default function SetDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [set, setSet] = useState<PokemonSet | null>(null);
    const [cards, setCards] = useState<PokemonCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortMode, setSortMode] = useState<"number" | "name">("number");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isOffline, setIsOffline] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Multi-selection state
    const [isSelectionMode, setSelectionMode] = useState(false);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);

    useEffect(() => {
        if (id) {
            checkOfflineStatus();
            loadSetDetails();
        }
    }, [id]);

    const checkOfflineStatus = async () => {
        const offline = await StorageService.isSetOffline(id);
        setIsOffline(offline);
    };

    const loadSetDetails = async () => {
        try {
            setLoading(true);
            const { set: fetchedSet, cards: fetchedCards } = await PokemonTcgService.getSetDetails(id);

            if (fetchedSet) {
                setSet(fetchedSet);
                setCards(fetchedCards);
            } else {
                const offlineData = await StorageService.getSet(id);
                if (offlineData) {
                    setSet(offlineData.set);
                    setCards(offlineData.cards);
                }
            }
        } catch (error) {
            console.error("Failed to load set details", error);
            const offlineData = await StorageService.getSet(id);
            if (offlineData) {
                setSet(offlineData.set);
                setCards(offlineData.cards);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadToggle = async () => {
        if (!set) return;
        try {
            setDownloading(true);
            if (isOffline) {
                await StorageService.removeSet(id);
                setIsOffline(false);
            } else {
                await StorageService.saveSet(set, cards);
                setIsOffline(true);
            }
        } catch (error) {
            console.error("Failed to toggle offline status", error);
        } finally {
            setDownloading(false);
        }
    };

    const handleSelectCard = (cardId: string) => {
        setSelectedCards(prev => {
            if (prev.includes(cardId)) {
                const newSelection = prev.filter(id => id !== cardId);
                // If exiting selection mode automatically when empty:
                // if (newSelection.length === 0) setSelectionMode(false);
                return newSelection;
            } else {
                return [...prev, cardId];
            }
        });
    };

    const toggleSelectionMode = () => {
        if (isSelectionMode) {
            setSelectionMode(false);
            setSelectedCards([]);
        } else {
            setSelectionMode(true);
        }
    };

    const sortedCards = [...cards].sort((a, b) => {
        if (sortMode === "number") {
            const numA = parseInt(a.localId.replace(/\D/g, ''));
            const numB = parseInt(b.localId.replace(/\D/g, ''));
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localId.localeCompare(b.localId);
        }
        return a.name.localeCompare(b.name);
    });

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!set) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>Coleção não encontrada</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleCardPress = (cardId: string) => {
        if (isSelectionMode) {
            handleSelectCard(cardId);
        } else {
            router.push(`/card/${cardId}`);
        }
    };

    const handleLongPress = (cardId: string) => {
        if (!isSelectionMode) {
            setSelectionMode(true);
            handleSelectCard(cardId);
        }
    };

    const renderCardItem = ({ item }: { item: PokemonCard }) => {
        const imageUrl = item.image ? `${item.image}/high.png` : undefined;
        const isSelected = selectedCards.includes(item.id);

        if (viewMode === "list") {
            return (
                <TouchableOpacity
                    onPress={() => handleCardPress(item.id)}
                    onLongPress={() => handleLongPress(item.id)}
                    style={[styles.listItem, isSelected && styles.selectedItem]}
                >
                    <View style={styles.listImageContainer}>
                        {imageUrl ? (
                            <ImageWithLoader source={{ uri: imageUrl }} style={styles.listImage} resizeMode="contain" />
                        ) : (
                            <View style={[styles.listImage, { backgroundColor: colors.divider }]} />
                        )}
                    </View>
                    <View style={styles.listItemContent}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <Text style={styles.cardNumber}>#{item.localId}</Text>
                    </View>
                    {isSelectionMode && (
                        <View style={styles.checkbox}>
                            <Ionicons
                                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                                size={24}
                                color={isSelected ? colors.primary : colors.textSecondary}
                            />
                        </View>
                    )}
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => handleCardPress(item.id)}
                onLongPress={() => handleLongPress(item.id)}
                style={[styles.gridItem, isSelected && styles.selectedItem]}
            >
                <View style={[styles.gridImageContainer, isSelected && { opacity: 0.8 }]}>
                    {imageUrl ? (
                        <ImageWithLoader source={{ uri: imageUrl }} style={styles.gridImage} resizeMode="contain" />
                    ) : (
                        <View style={[styles.gridImage, { backgroundColor: colors.divider }]} />
                    )}
                    {isSelectionMode && (
                        <View style={styles.gridCheckbox}>
                            <Ionicons
                                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                                size={24}
                                color={isSelected ? colors.primary : "#fff"}
                                style={!isSelected ? { textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 2 } : undefined}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.gridInfo}>
                    <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.gridNumber}>#{item.localId}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{set ? set.name : 'Carregando...'}</Text>
                    <Text style={styles.headerSubtitle}>{set.cardCount.official} cartas</Text>
                </View>
                <TouchableOpacity
                    onPress={toggleSelectionMode}
                    style={[styles.headerButton, isSelectionMode && { backgroundColor: colors.primary + '20', borderRadius: borderRadius.button }]}
                >
                    <Ionicons name={isSelectionMode ? "close-circle-outline" : "checkbox-outline"} size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Controls */}
            {!isSelectionMode && (
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => setSortMode(prev => prev === "number" ? "name" : "number")}
                    >
                        <Ionicons name="swap-vertical" size={18} color={colors.textSecondary} />
                        <Text style={styles.controlText}>
                            {sortMode === "number" ? "Por Número" : "Por Nome"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDownloadToggle}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                        disabled={downloading || loading || !set}
                    >
                        {downloading ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <>
                                <Ionicons
                                    name={isOffline ? "cloud-done" : "cloud-download-outline"}
                                    size={18}
                                    color={isOffline ? colors.success : colors.textSecondary}
                                />
                                <Text style={[styles.controlText, isOffline && { color: colors.success }]}>
                                    {isOffline ? "Baixado" : "Baixar"}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => setViewMode(prev => prev === "grid" ? "list" : "grid")}
                    >
                        <Ionicons name={viewMode === "grid" ? "list" : "grid"} size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            )}

            {isSelectionMode && (
                <View style={styles.selectionBar}>
                    <Text style={styles.selectionText}>{selectedCards.length} selecionadas</Text>
                    {selectedCards.length > 0 && (
                        <TouchableOpacity
                            style={styles.addToCollectionButton}
                            onPress={() => setShowAddToCollectionModal(true)}
                        >
                            <Text style={styles.addToCollectionText}>Adicionar à Coleção</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <FlatList
                data={sortedCards}
                key={viewMode}
                numColumns={viewMode === "grid" ? 3 : 1}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderCardItem}
                columnWrapperStyle={viewMode === "grid" ? styles.columnWrapper : undefined}
            />

            <AddToCollectionModal
                visible={showAddToCollectionModal}
                onClose={() => {
                    setShowAddToCollectionModal(false);
                    setSelectionMode(false);
                    setSelectedCards([]);
                }}
                cardIds={selectedCards}
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
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
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
    headerRight: {
        width: 40,
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        backgroundColor: colors.background,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    viewButton: {
        padding: 4,
    },
    controlText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: "500",
        fontFamily: "Inter-Medium",
    },
    listContent: {
        padding: spacing.sm,
    },
    columnWrapper: {
        gap: spacing.sm,
    },
    // Grid Styles
    gridItem: {
        flex: 1,
        marginBottom: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.divider,
    },
    gridImageContainer: {
        aspectRatio: 0.7, // Card ratio
        width: "100%",
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    gridImage: {
        width: "100%",
        height: "100%",
    },
    gridInfo: {
        padding: 4,
        alignItems: "center",
    },
    gridName: {
        fontSize: 10,
        fontWeight: "600",
        color: colors.textPrimary,
        textAlign: "center",
        fontFamily: "Inter-SemiBold",
    },
    gridNumber: {
        fontSize: 10,
        color: colors.textSecondary,
        fontFamily: "Inter-Regular",
    },
    // List Styles
    listItem: {
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        padding: spacing.sm,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.divider,
        alignItems: "center",
    },
    listImageContainer: {
        width: 50,
        height: 70,
        marginRight: spacing.md,
    },
    listImage: {
        width: "100%",
        height: "100%",
    },
    // The listContent below is for the content *inside* the list item, not the FlatList's contentContainerStyle
    // The previous listContent (padding: spacing.sm) is for the FlatList's contentContainerStyle
    listItemContent: {
        flex: 1,
        justifyContent: "center",
    },
    cardName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        fontFamily: "Inter-SemiBold",
    },
    cardNumber: {
        fontSize: 14,
        color: colors.textSecondary,
        fontFamily: "Inter-Regular",
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
    },
    // Selection Mode Styles
    selectedItem: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10', // Light opacity primary
    },
    checkbox: {
        marginLeft: spacing.md,
    },
    gridCheckbox: {
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 1,
    },
    selectionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    selectionText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        fontFamily: 'Inter-SemiBold',
    },
    addToCollectionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.button,
    },
    addToCollectionText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
    },
});
