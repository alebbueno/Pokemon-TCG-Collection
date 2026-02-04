import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PokemonTcgService, PokemonSet } from "@/services/pokemonTcg";
import { colors, spacing, borderRadius } from "@/constants/tokens";
import { Ionicons } from "@expo/vector-icons";

interface SetsByYear {
    year: string;
    data: PokemonSet[];
}

export default function ExploreScreen() {
    const router = useRouter();
    const [sections, setSections] = useState<SetsByYear[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSets();
    }, []);

    const loadSets = async () => {
        try {
            const sets = await PokemonTcgService.getAllSets();

            // Group sets by year
            const grouped: Record<string, PokemonSet[]> = {};
            sets.forEach(set => {
                const year = set.releaseDate ? new Date(set.releaseDate).getFullYear().toString() : "Unknown";
                if (!grouped[year]) {
                    grouped[year] = [];
                }
                grouped[year].push(set);
            });

            // Convert to array and sort years descending
            const sortedSections = Object.keys(grouped)
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map(year => ({
                    year,
                    data: grouped[year]
                }));

            setSections(sortedSections);

        } catch (error) {
            console.error("Failed to load sets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPress = (setId: string) => {
        router.push(`/set/${setId}`);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Carregando coleções...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Explorar</Text>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SetItem item={item} onPress={handleSetPress} />}
                renderSectionHeader={({ section: { year } }) => (
                    <View style={styles.yearHeaderContainer}>
                        <Text style={styles.yearText}>{year}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    );
}

const SetItem = ({ item, onPress }: { item: PokemonSet, onPress: (id: string) => void }) => {
    const [logoUrl, setLogoUrl] = useState(item.logo);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setLogoUrl(item.logo);
        setImageError(false);
    }, [item.logo]);

    return (
        <TouchableOpacity style={styles.setItem} onPress={() => onPress(item.id)}>
            <View style={styles.imgContainer}>
                {logoUrl && !imageError ? (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logo}
                        resizeMode="contain"
                        onError={() => {
                            if (logoUrl && logoUrl.includes('/pt/')) {
                                setLogoUrl(logoUrl.replace('/pt/', '/en/'));
                            } else {
                                setImageError(true);
                            }
                        }}
                    />
                ) : (
                    <Text style={styles.placeholderLogo}>{item.name.substring(0, 2).toUpperCase()}</Text>
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.setName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.metaContainer}>
                    <Text style={styles.cardCount}>{item.cardCount.total} cartas</Text>
                    <Text style={styles.releaseDate}>{item.releaseDate}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: spacing.md,
        color: colors.textSecondary,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        backgroundColor: colors.surface,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.textPrimary,
        fontFamily: "Inter-Bold",
    },
    listContent: {
        padding: spacing.md,
    },
    yearHeaderContainer: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.background,
        marginTop: spacing.md,
    },
    yearText: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.textPrimary,
        fontFamily: "Inter-Bold",
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        paddingLeft: spacing.sm,
    },
    setItem: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        padding: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.divider,
        elevation: 1,
    },
    imgContainer: {
        width: 60,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    placeholderLogo: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.textSecondary,
    },
    infoContainer: {
        flex: 1,
    },
    setName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardCount: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    releaseDate: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});
