import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { colors, spacing, borderRadius } from "@/constants/tokens";
import { Card } from "@/components/ui/Card";
import { PokemonTcgService, PokemonCard } from "@/services/pokemonTcg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Approx standard card aspect ratio

export function LatestCollectionsSlider() {
    const [cards, setCards] = useState<PokemonCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const recentCards = await PokemonTcgService.getRecentCards(10);
            setCards(recentCards);
        } catch (error) {
            console.error("Failed to load featured cards");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    if (cards.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Últimas Cartas</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + spacing.md}
            >
                {cards.map((item) => (
                    <Card key={`${item.id}-${item.localId}`} style={styles.card}>
                        <View style={styles.imageContainer}>
                            {item.image ? (
                                <Image
                                    source={{ uri: `${item.image}/high.png` }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={[styles.image, { backgroundColor: colors.divider }]} />
                            )}
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.subtitle}>
                                #{item.localId}
                            </Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginLeft: spacing.lg,
        marginBottom: spacing.md,
        fontFamily: "Inter-Bold",
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    card: {
        width: CARD_WIDTH,
        marginRight: spacing.md,
        padding: 0,
        overflow: "hidden",
    },
    imageContainer: {
        height: CARD_HEIGHT,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.sm,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    info: {
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 4,
        fontFamily: "Inter-SemiBold",
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        fontFamily: "Inter-Regular",
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
    },
});
