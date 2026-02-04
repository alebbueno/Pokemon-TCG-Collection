import AsyncStorage from '@react-native-async-storage/async-storage';
import { PokemonSet, PokemonCard } from './pokemonTcg';

const OFFLINE_SETS_KEY = 'offline_sets_index';
const OFFLINE_SET_PREFIX = 'offline_set_';

interface OfflineSetData {
    set: PokemonSet;
    cards: PokemonCard[];
    downloadedAt: number;
}

const USER_COLLECTIONS_KEY = 'user_collections';

export interface UserCollection {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    createdAt: number;
    cards: string[]; // List of Card IDs
    cardVariants?: Record<string, string[]>; // Map<CardId, Variant[]> e.g. "xy1-1": ["foil", "masterball"]
    coverImage?: string;
    coverStyle?: {
        scale: number;
        offsetX: number;
        offsetY: number;
    };
}

export type CardVariantType = 'normal' | 'foil' | 'reverse' | 'pokeball' | 'masterball';

export const StorageService = {
    // ... existing offline set methods ...
    async saveSet(set: PokemonSet, cards: PokemonCard[]): Promise<void> {
        // ... implementation unchanged
        try {
            const iconKey = `${OFFLINE_SET_PREFIX}${set.id}`;
            const data: OfflineSetData = {
                set,
                cards,
                downloadedAt: Date.now()
            };
            await AsyncStorage.setItem(iconKey, JSON.stringify(data));

            const indexJson = await AsyncStorage.getItem(OFFLINE_SETS_KEY);
            let index: string[] = indexJson ? JSON.parse(indexJson) : [];
            if (!index.includes(set.id)) {
                index.push(set.id);
                await AsyncStorage.setItem(OFFLINE_SETS_KEY, JSON.stringify(index));
            }
        } catch (e) {
            console.error('Failed to save set offline', e);
            throw e;
        }
    },

    async removeSet(setId: string): Promise<void> {
        // ... implementation unchanged
        try {
            const key = `${OFFLINE_SET_PREFIX}${setId}`;
            await AsyncStorage.removeItem(key);

            const indexJson = await AsyncStorage.getItem(OFFLINE_SETS_KEY);
            if (indexJson) {
                let index: string[] = JSON.parse(indexJson);
                index = index.filter(id => id !== setId);
                await AsyncStorage.setItem(OFFLINE_SETS_KEY, JSON.stringify(index));
            }
        } catch (e) {
            console.error('Failed to remove offline set', e);
            throw e;
        }
    },

    async getSet(setId: string): Promise<OfflineSetData | null> {
        // ... implementation unchanged
        try {
            const key = `${OFFLINE_SET_PREFIX}${setId}`;
            const json = await AsyncStorage.getItem(key);
            return json ? JSON.parse(json) : null;
        } catch (e) {
            console.error('Failed to get offline set', e);
            return null;
        }
    },

    async isSetOffline(setId: string): Promise<boolean> {
        // ... implementation unchanged
        try {
            const indexJson = await AsyncStorage.getItem(OFFLINE_SETS_KEY);
            if (!indexJson) return false;
            const index: string[] = JSON.parse(indexJson);
            return index.includes(setId);
        } catch (e) {
            return false;
        }
    },

    // User Collections Methods

    async getUserCollections(): Promise<UserCollection[]> {
        try {
            const json = await AsyncStorage.getItem(USER_COLLECTIONS_KEY);
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error("Failed to load user collections", e);
            return [];
        }
    },

    async saveUserCollection(collection: UserCollection): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const index = collections.findIndex(c => c.id === collection.id);

            if (index >= 0) {
                collections[index] = collection;
            } else {
                collections.push(collection);
            }

            await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections));
        } catch (e) {
            console.error("Failed to save user collection", e);
            throw e;
        }
    },

    async deleteUserCollection(id: string): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const newCollections = collections.filter(c => c.id !== id);
            await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(newCollections));
        } catch (e) {
            console.error("Failed to delete user collection", e);
            throw e;
        }
    },

    async addCardToCollection(collectionId: string, cardId: string): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const collection = collections.find(c => c.id === collectionId);
            if (collection) {
                if (!collection.cards.includes(cardId)) {
                    collection.cards.push(cardId);
                    await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections));
                }
            }
        } catch (e) {
            console.error("Failed to add card to collection", e);
            throw e;
        }
    },

    async removeCardFromCollection(collectionId: string, cardId: string): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const collection = collections.find(c => c.id === collectionId);
            if (collection) {
                collection.cards = collection.cards.filter(id => id !== cardId);
                // Also remove variants if exists
                if (collection.cardVariants && collection.cardVariants[cardId]) {
                    delete collection.cardVariants[cardId];
                }
                await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections));
            }
        } catch (e) {
            console.error("Failed to remove card from collection", e);
            throw e;
        }
    },

    async addCardsToCollection(collectionId: string, cardIds: string[]): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const collection = collections.find(c => c.id === collectionId);
            if (collection) {
                // Add only new cards
                const newCards = cardIds.filter(id => !collection.cards.includes(id));
                if (newCards.length > 0) {
                    collection.cards = [...collection.cards, ...newCards];
                    await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections));
                }
            }
        } catch (e) {
            console.error("Failed to add cards to collection", e);
            throw e;
        }
    },

    async updateCardVariants(collectionId: string, cardId: string, variants: string[]): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const collection = collections.find(c => c.id === collectionId);
            if (collection) {
                if (!collection.cardVariants) {
                    collection.cardVariants = {};
                }
                collection.cardVariants[cardId] = variants;
                await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections));
            }
        } catch (e) {
            console.error("Failed to update card variants", e);
            throw e;
        }
    },

    async setCollectionCover(
        collectionId: string,
        imageUrl: string,
        style?: { scale: number; offsetX: number; offsetY: number }
    ): Promise<void> {
        try {
            const collections = await this.getUserCollections();
            const collection = collections.find(c => c.id === collectionId);
            if (collection) {
                collection.coverImage = imageUrl;
                if (style) {
                    collection.coverStyle = style;
                }
                await AsyncStorage.setItem(USER_COLLECTIONS_KEY, JSON.stringify(collections));
            }
        } catch (e) {
            console.error("Failed to set collection cover", e);
            throw e;
        }
    }
};
