import TCGdex, { SetResume } from '@tcgdex/sdk';

// Polyfill for TCGdex SDK in React Native
if (typeof window === 'undefined') {
    (global as any).window = {};
}
if (!('localStorage' in (global as any).window)) {
    (global as any).window.localStorage = {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
    };
}
if (!('sessionStorage' in (global as any).window)) {
    (global as any).window.sessionStorage = {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
    };
}

const tcgdex = new TCGdex('pt');
const tcgdexEn = new TCGdex('en');

export interface PokemonCard {
    id: string;
    localId: string;
    name: string;
    image?: string;
    items?: string[]; // Sometimes image isn't direct?
}

export interface PokemonSet {
    id: string;
    name: string;
    cardCount: {
        total: number;
        official: number;
    };
    logo?: string;
    symbol?: string;
    releaseDate?: string;
}

export interface DetailedPokemonCard extends PokemonCard {
    hp?: number;
    types?: string[];
    evolveFrom?: string;
    description?: string; // Flavor text
    rarity?: string;
    illustrator?: string;
    abilities?: {
        type: string;
        name: string;
        effect: string;
    }[];
    attacks?: {
        name: string;
        cost?: string[];
        damage?: string | number;
        effect?: string;
    }[];
    weaknesses?: {
        type: string;
        value?: string;
    }[];
    resistances?: {
        type: string;
        value?: string;
    }[];
    retreat?: number;
    set: {
        id: string;
        name: string;
    };
    number: string;
    regulationMark?: string;
}

export const PokemonTcgService = {
    /**
     * Get cards from the most recent 3 sets.
     * @param limit Total number of cards to return (approximate)
     */
    async getRecentCards(limit: number = 15): Promise<PokemonCard[]> {
        try {
            // 1. Fetch all sets
            const sets = await tcgdex.set.list();

            // 2. Get the last 3 sets (assuming list is chronological, oldest first)
            // TCGdex list order is usually chronological or by series.
            // We'll assume the end of the list is the most recent.
            const recentSets = sets.slice(-3).reverse();

            let allCards: PokemonCard[] = [];

            // 3. Fetch cards for these sets
            for (const setInfo of recentSets) {
                if (allCards.length >= limit) break;

                const setDetails = await tcgdex.set.get(setInfo.id);
                if (setDetails && setDetails.cards) {
                    // Filter out non-cards if necessary, though set.cards should be cards.
                    // We only take a few from each set to avoid huge payloads if we are just showing a slider.
                    // Or we take all and shuffle?
                    // The request says "show cards from last 3 editions".
                    // Let's take the first 5-6 cards from each of the last 3 sets.
                    const setCards = setDetails.cards.slice(0, 10).map(card => ({
                        id: card.id,
                        localId: card.localId,
                        name: card.name,
                        image: card.image,
                    }));
                    allCards = [...allCards, ...setCards];
                }
            }

            return allCards.slice(0, limit);
        } catch (error) {
            console.error("Error fetching recent cards:", error);
            return [];
        }
    },

    /**
     * Get all sets for the Explore screen
     */
    async getAllSets(): Promise<PokemonSet[]> {
        try {
            // Fetch all series first to get context (logos path requires series ID)
            const seriesList = await tcgdex.serie.list();

            let allSets: PokemonSet[] = [];

            // Fetch details for each series to get their sets
            // We use Promise.all to fetch in parallel, but might need to chunk if too many series.
            // There are about 20-25 series, so Promise.all should be fine.
            const seriesDetailsPromises = seriesList.map(s => tcgdex.serie.get(s.id));
            const seriesDetails = await Promise.all(seriesDetailsPromises);

            for (const serie of seriesDetails) {
                if (!serie || !serie.sets) continue;

                // Filter out TCG Pocket series (digital only)
                if (serie.id === 'tcgp') continue;

                // For RECENT series (e.g. Scarlet & Violet, Sword & Shield), we need exact dates.
                // Fetch full set details for sets in these series to ensure correct grouping.
                // Assuming 'sv' and 'swsh' are ids for recent ones, or just last 3 series in list.
                // Let's rely on the fact that seriesList is usually ordered. 
                // We'll check if the series releaseDate is recent (> 2020)
                const isRecent = (serie as any).releaseDate && new Date((serie as any).releaseDate).getFullYear() >= 2020;

                const serieSets = await Promise.all(serie.sets
                    .filter((s: any) => s.cardCount.official > 0)
                    .map(async (s: any) => {
                        let releaseDate = s.releaseDate || (serie as any).releaseDate;

                        // If it's a recent series and we rely on proxy date, try to fetch specific set details
                        // This fixes the "2025 set in 2024" issue if the set list lacked the date
                        if (isRecent && !s.releaseDate) {
                            try {
                                const fullSet = await tcgdex.set.get(s.id);
                                if (fullSet && fullSet.releaseDate) {
                                    releaseDate = fullSet.releaseDate;
                                }
                            } catch (e) {
                                // Ignore error, keep proxy date
                            }
                        }

                        return {
                            id: s.id,
                            name: s.name,
                            cardCount: s.cardCount,
                            logo: s.logo ? `${s.logo}.png` : `https://assets.tcgdex.net/pt/${serie.id}/${s.id}/logo.png`,
                            symbol: s.symbol,
                            releaseDate: releaseDate
                        };
                    })
                );

                allSets = [...allSets, ...serieSets];
            }

            // Sort by release date descending (newest first)
            return allSets.sort((a, b) => {
                const dateA = new Date(a.releaseDate || '1970-01-01');
                const dateB = new Date(b.releaseDate || '1970-01-01');
                return dateB.getTime() - dateA.getTime();
            });

        } catch (error) {
            console.error("Error fetching sets:", error);
            return [];
        }
    },

    async getSetDetails(setId: string): Promise<{ set: PokemonSet | null, cards: PokemonCard[] }> {
        try {
            // tcgdex.set.get(id) returns detailed set info including cards array (usually partial)
            let set = await tcgdex.set.get(setId);
            let usingFallback = false;

            // Fallback to EN if PT set has no cards but should have them
            if (!set || !set.cards || set.cards.length === 0) {
                // Check if it's supposed to have cards
                // If fetched set was null, we definitely try EN.
                // If set exists but cards are empty, we check cardCount.
                if (!set || (set.cardCount && set.cardCount.official > 0)) {
                    console.log(`Fetching fallback EN data for set ${setId}`);
                    try {
                        const setEn = await tcgdexEn.set.get(setId);
                        if (setEn && setEn.cards && setEn.cards.length > 0) {
                            set = set || setEn; // Keep PT metadata if it existed, otherwise use EN
                            // Actually, if PT existed but had no cards, we want to mix them?
                            // We want the cards from EN.
                            // And maybe the logo from EN if PT logo was missing.
                            if (!set.logo) set.logo = setEn.logo;
                            set.cards = setEn.cards; // Use EN cards
                            usingFallback = true;
                        }
                    } catch (err) {
                        console.log("Fallback EN fetch failed", err);
                    }
                }
            }

            if (!set) return { set: null, cards: [] };

            // Construct set object
            const pokemonSet: PokemonSet = {
                id: set.id,
                name: set.name,
                cardCount: set.cardCount,
                logo: set.logo ? `${set.logo}.png` : undefined,
                symbol: set.symbol,
                releaseDate: set.releaseDate
            };

            // Map cards from the set object
            const pokemonCards: PokemonCard[] = (set.cards || []).map((c: any) => ({
                id: c.id,
                localId: c.localId,
                name: c.name,
                image: c.image
            }));

            // If we used fallback, maybe we want to fetch full card details for them?
            // No, the list is usually enough for the grid.

            return { set: pokemonSet, cards: pokemonCards };

        } catch (error) {
            console.error("Error fetching set details:", error);
            return { set: null, cards: [] };
        }
    },

    async getCardDetails(cardId: string): Promise<DetailedPokemonCard | null> {
        try {
            let card = await tcgdex.card.get(cardId);

            // Fallback to EN if card not found in PT
            if (!card) {
                try {
                    const cardEn = await tcgdexEn.card.get(cardId);
                    if (cardEn) {
                        card = cardEn;
                    }
                } catch (e) {
                    console.log("Fallback EN card fetch failed", e);
                }
            }

            if (!card) return null;

            return {
                id: card.id,
                localId: card.localId,
                name: card.name,
                image: card.image,
                hp: card.hp,
                types: card.types,
                evolveFrom: card.evolveFrom,
                description: card.description,
                rarity: card.rarity,
                illustrator: card.illustrator,
                abilities: card.abilities,
                attacks: card.attacks,
                weaknesses: card.weaknesses,
                resistances: card.resistances,
                retreat: card.retreat,
                set: {
                    id: card.set.id,
                    name: card.set.name
                },
                number: card.localId,
                regulationMark: card.regulationMark
            };
        } catch (error) {
            console.error("Error fetching card details:", error);
            return null;
        }
    },

    async getCardsByIds(cardIds: string[]): Promise<PokemonCard[]> {
        if (!cardIds || cardIds.length === 0) return [];

        try {
            // Fetch in parallel
            // We use getCardDetails effectively but asking for summary
            // But we actually just need PokemonCard structure for the list
            const promises = cardIds.map(async (id) => {
                try {
                    let card = await tcgdex.card.get(id);
                    if (!card) {
                        // try fallback
                        try {
                            card = await tcgdexEn.card.get(id);
                        } catch (e) { }
                    }
                    if (card) {
                        return {
                            id: card.id,
                            localId: card.localId,
                            name: card.name,
                            image: card.image
                        };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            });

            const results = await Promise.all(promises);
            // Filter nulls and cast to PokemonCard[]
            return results.filter((c) => c !== null) as PokemonCard[];
        } catch (error) {
            console.error("Error fetching cards by IDs", error);
            return [];
        }
    }
};
