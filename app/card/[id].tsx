import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "@/constants/tokens";
import { PokemonTcgService, DetailedPokemonCard } from "@/services/pokemonTcg";
import { ImageWithLoader } from "@/components/ui/ImageWithLoader";

import { AddToCollectionModal } from "@/components/collections/AddToCollectionModal";

export default function CardDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [card, setCard] = useState<DetailedPokemonCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAddToCollectionVisible, setAddToCollectionVisible] = useState(false);

    useEffect(() => {
        if (id) {
            loadCardDetails();
        }
    }, [id]);

    const loadCardDetails = async () => {
        try {
            setLoading(true);
            const data = await PokemonTcgService.getCardDetails(id);
            setCard(data);
        } catch (error) {
            console.error("Failed to load card details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!card) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>Carta não encontrada</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const imageUrl = card.image ? `${card.image}/high.png` : undefined;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{card.name}</Text>

                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setAddToCollectionVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                    {imageUrl ? (
                        <View style={styles.cardImageContainer}>
                            <ImageWithLoader
                                source={{ uri: imageUrl }}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                        </View>
                    ) : (
                        <View style={[styles.cardImageContainer, { backgroundColor: colors.divider, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: colors.textSecondary }}>Imagem indisponível</Text>
                        </View>
                    )}
                </View>

                {/* Details Section */}
                {/* ... existing details ... */}

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                    {/* Basic Info */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardName}>{card.name}</Text>
                        <View style={styles.hpContainer}>
                            {card.hp && <Text style={styles.hpText}>HP {card.hp}</Text>}
                            {card.types?.map((type, index) => (
                                <Text key={index} style={styles.typeText}>{type}</Text>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.subInfo}>
                        {card.rarity} — {card.set.name}
                    </Text>

                    <View style={styles.divider} />

                    {/* Abilities */}
                    {card.abilities?.map((ability, index) => (
                        <View key={`ability-${index}`} style={styles.abilityContainer}>
                            <Text style={styles.abilityType}>{ability.type}</Text>
                            <Text style={styles.abilityName}>{ability.name}</Text>
                            <Text style={styles.abilityEffect}>{ability.effect}</Text>
                        </View>
                    ))}

                    {/* Attacks */}
                    {card.attacks?.map((attack, index) => (
                        <View key={`attack-${index}`} style={styles.attackContainer}>
                            <View style={styles.attackHeader}>
                                <View style={styles.costContainer}>
                                    {attack.cost?.map((cost, i) => (
                                        <Text key={i} style={styles.costText}>{cost}</Text>
                                    ))}
                                </View>
                                <Text style={styles.attackName}>{attack.name}</Text>
                                <Text style={styles.attackDamage}>{attack.damage}</Text>
                            </View>
                            {attack.effect && <Text style={styles.attackEffect}>{attack.effect}</Text>}
                        </View>
                    ))}

                    <View style={styles.divider} />

                    {/* Footer Info */}
                    <View style={styles.footerInfo}>
                        <InfoRow label="Fraqueza" items={card.weaknesses} />
                        <InfoRow label="Resistência" items={card.resistances} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Recuo</Text>
                            <Text style={styles.infoValue}>{card.retreat ? card.retreat : '—'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ilustrador</Text>
                            <Text style={styles.infoValue}>{card.illustrator || '—'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Número</Text>
                            <Text style={styles.infoValue}>{card.number}</Text>
                        </View>
                    </View>

                    {card.description && (
                        <Text style={styles.flavorText}>{card.description}</Text>
                    )}
                </View>
            </ScrollView>

            <AddToCollectionModal
                visible={isAddToCollectionVisible}
                onClose={() => setAddToCollectionVisible(false)}
                cardId={card.id}
            />
        </SafeAreaView>
    );
}

const InfoRow = ({ label, items }: { label: string, items?: { type: string; value?: string }[] }) => {
    if (!items || items.length === 0) return null;
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
                {items.map((item, idx) => (
                    <Text key={idx} style={styles.infoValue}>{item.type} {item.value}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
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
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
        textAlign: 'center',
        fontFamily: "Inter-Bold",
    },
    headerRight: {
        width: 40,
    },
    content: {
        paddingBottom: spacing.xl,
    },
    imageSection: {
        padding: spacing.lg,
        alignItems: 'center',
        backgroundColor: '#e0e0e0', // Slightly darker background for image highlight
    },
    cardImageContainer: {
        width: '80%',
        aspectRatio: 0.7,
        borderRadius: borderRadius.card,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20, // Overlap image section slightly
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    cardName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontFamily: "Inter-Bold",
        flex: 1,
    },
    hpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    hpText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.danger, // Red for HP usually
        fontFamily: "Inter-Bold",
    },
    typeText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: colors.textSecondary,
    },
    subInfo: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        fontFamily: "Inter-Regular",
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: spacing.md,
    },
    abilityContainer: {
        marginBottom: spacing.md,
    },
    abilityType: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.danger,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    abilityName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    abilityEffect: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    attackContainer: {
        marginBottom: spacing.md,
    },
    attackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    costContainer: {
        flexDirection: 'row',
        marginRight: 8,
        gap: 2,
    },
    costText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    attackName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    attackDamage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    attackEffect: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        marginTop: 2,
    },
    footerInfo: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    flavorText: {
        fontStyle: 'italic',
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: spacing.lg,
        textAlign: 'center',
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
