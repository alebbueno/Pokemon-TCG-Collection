import { supabase } from "@/lib/supabase";
import { PokemonTcgService, PokemonCard } from "@/services/pokemonTcg";
import { Database } from "@/types/database.types";

type Collection = Database["public"]["Tables"]["collections"]["Row"];
type CollectionInsert = Database["public"]["Tables"]["collections"]["Insert"];
type UserCard = Database["public"]["Tables"]["user_cards"]["Row"];
type UserCardInsert = Database["public"]["Tables"]["user_cards"]["Insert"];
type UserCardUpdate = Database["public"]["Tables"]["user_cards"]["Update"];

export interface CollectionWithProgress extends Collection {
    collected_count: number;
    progress_percentage: number;
}

export interface CollectionDetails extends Collection {
    cards: UserCard[];
    collected_count: number;
    progress_percentage: number;
}

export class CollectionService {
    /**
     * Create a new collection from a Pokemon TCG set
     * Fetches all cards from the set and creates user_cards with quantity = 0
     */
    static async createCollection(
        userId: string,
        setId: string
    ): Promise<{ collection: Collection; error: Error | null }> {
        try {
            // Check if collection already exists
            const { data: existing } = await supabase
                .from("collections")
                .select("id")
                .eq("user_id", userId)
                .eq("set_id", setId)
                .single();

            if (existing) {
                throw new Error("Você já possui esta coleção");
            }

            // Fetch set details from Pokemon TCG API
            const { set, cards } = await PokemonTcgService.getSetDetails(setId);
            if (!set) {
                throw new Error("Edição não encontrada");
            }

            if (!cards || cards.length === 0) {
                throw new Error("Nenhuma carta encontrada para esta edição");
            }

            // Create collection
            const { data: collection, error: collectionError } = await supabase
                .from("collections")
                .insert({
                    user_id: userId,
                    set_id: set.id,
                    set_name: set.name,
                    set_logo: set.logo,
                    release_date: set.releaseDate,
                    total_cards: set.cardCount.total,
                })
                .select()
                .single();

            if (collectionError || !collection) {
                throw collectionError || new Error("Erro ao criar coleção");
            }

            // Create user_cards for all cards with quantity = 0
            const userCards: UserCardInsert[] = cards.map((card: PokemonCard) => ({
                user_id: userId,
                collection_id: collection.id,
                card_id: card.id,
                card_name: card.name,
                card_number: card.localId,
                card_image: card.image,
                quantity: 0,
            }));

            // Batch insert cards (Supabase handles large inserts efficiently)
            const { error: cardsError } = await supabase
                .from("user_cards")
                .insert(userCards);

            if (cardsError) {
                // Rollback: delete the collection if card insertion fails
                await supabase
                    .from("collections")
                    .delete()
                    .eq("id", collection.id);
                throw cardsError;
            }

            return { collection, error: null };
        } catch (error) {
            console.error("=== Error creating collection ===");
            console.error("Error:", error);
            console.error("Error type:", typeof error);
            if (error instanceof Error) {
                console.error("Message:", error.message);
                console.error("Stack:", error.stack);
            }

            const errorMessage = error instanceof Error
                ? error.message
                : "Erro desconhecido ao criar coleção";

            return {
                collection: null as any,
                error: new Error(errorMessage),
            };
        }
    }

    /**
     * Create collection and download set for offline access
     * This is the recommended method for creating collections as it ensures offline availability
     */
    static async createCollectionWithDownload(
        userId: string,
        setId: string,
        onProgress?: (status: 'creating' | 'downloading' | 'complete') => void
    ): Promise<{ collection: Collection; error: Error | null }> {
        try {
            // Step 1: Create the collection
            onProgress?.('creating');
            const { collection, error: createError } = await this.createCollection(userId, setId);

            if (createError || !collection) {
                return { collection: null as any, error: createError };
            }

            // Step 2: Download set for offline access
            onProgress?.('downloading');
            const { set, cards } = await PokemonTcgService.getSetDetails(setId);

            if (set && cards && cards.length > 0) {
                // Import StorageService dynamically to avoid circular deps  
                const { StorageService } = await import('@/services/storage');
                await StorageService.saveSet(set, cards);
            }

            onProgress?.('complete');
            return { collection, error: null };
        } catch (error) {
            console.error("Error creating collection with download:", error);
            const errorMessage = error instanceof Error
                ? error.message
                : "Erro ao criar coleção e baixar edição";

            return {
                collection: null as any,
                error: new Error(errorMessage),
            };
        }
    }

    /**
     * Get all collections for a user with progress
     */
    static async getUserCollections(
        userId: string
    ): Promise<CollectionWithProgress[]> {
        try {
            const { data: collections, error } = await supabase
                .from("collections")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (!collections) return [];

            // Get progress for each collection
            const collectionsWithProgress = await Promise.all(
                collections.map(async (collection) => {
                    const progress = await this.getCollectionProgress(collection.id);
                    return {
                        ...collection,
                        collected_count: progress.collected_count,
                        progress_percentage: progress.progress_percentage,
                    };
                })
            );

            return collectionsWithProgress;
        } catch (error) {
            console.error("Error fetching collections:", error);
            return [];
        }
    }

    /**
     * Get collection details with all cards
     */
    static async getCollectionDetails(
        collectionId: string
    ): Promise<CollectionDetails | null> {
        try {
            console.log("Fetching collection details for:", collectionId);

            const { data: collection, error: collectionError } = await supabase
                .from("collections")
                .select("*")
                .eq("id", collectionId)
                .single();

            if (collectionError) {
                console.error("Error fetching collection:", collectionError);
                throw collectionError;
            }

            if (!collection) {
                console.error("Collection not found (null data)");
                return null;
            }

            console.log("Collection found:", collection.set_name);

            const { data: cards, error: cardsError } = await supabase
                .from("user_cards")
                .select("*")
                .eq("collection_id", collectionId)
                .order("card_number", { ascending: true });

            if (cardsError) {
                console.error("Error fetching cards:", cardsError);
                throw cardsError;
            }

            console.log(`Fetched ${cards?.length || 0} cards`);

            const progress = await this.getCollectionProgress(collectionId);

            return {
                ...collection,
                cards: cards || [],
                collected_count: progress.collected_count,
                progress_percentage: progress.progress_percentage,
            };
        } catch (error) {
            console.error("Error in getCollectionDetails:", error);
            return null;
        }
    }

    /**
     * Get collection progress (collected cards / total cards)
     */
    static async getCollectionProgress(
        collectionId: string
    ): Promise<{ collected_count: number; progress_percentage: number }> {
        try {
            const { data: collection, error: collectionError } = await supabase
                .from("collections")
                .select("total_cards")
                .eq("id", collectionId)
                .single();

            if (collectionError || !collection) {
                return { collected_count: 0, progress_percentage: 0 };
            }

            const { data: cards, error: cardsError } = await supabase
                .from("user_cards")
                .select("quantity")
                .eq("collection_id", collectionId)
                .gt("quantity", 0);

            if (cardsError) {
                return { collected_count: 0, progress_percentage: 0 };
            }

            const collected_count = cards?.length || 0;
            const progress_percentage = Math.round(
                (collected_count / collection.total_cards) * 100
            );

            return { collected_count, progress_percentage };
        } catch (error) {
            console.error("Error getting collection progress:", error);
            return { collected_count: 0, progress_percentage: 0 };
        }
    }

    /**
     * Update card quantity
     */
    static async updateCardQuantity(
        userCardId: string,
        quantity: number
    ): Promise<{ success: boolean; error: Error | null }> {
        try {
            const { error } = await supabase
                .from("user_cards")
                .update({ quantity: Math.max(0, quantity) })
                .eq("id", userCardId);

            if (error) throw error;

            return { success: true, error: null };
        } catch (error) {
            console.error("Error updating card quantity:", error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error("Erro desconhecido"),
            };
        }
    }

    /**
     * Check if user already has a collection for a set
     */
    static async hasCollection(userId: string, setId: string): Promise<boolean> {
        try {
            const { data } = await supabase
                .from("collections")
                .select("id")
                .eq("user_id", userId)
                .eq("set_id", setId)
                .single();

            return !!data;
        } catch (error) {
            return false;
        }
    }

    /**
     * Delete a collection and all its cards
     */
    static async deleteCollection(
        collectionId: string
    ): Promise<{ success: boolean; error: Error | null }> {
        try {
            const { error } = await supabase
                .from("collections")
                .delete()
                .eq("id", collectionId);

            if (error) throw error;

            return { success: true, error: null };
        } catch (error) {
            console.error("Error deleting collection:", error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error("Erro desconhecido"),
            };
        }
    }
}

export type { Collection, CollectionInsert, UserCard, UserCardInsert, UserCardUpdate };
