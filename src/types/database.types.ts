export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    name: string;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name: string;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    avatar_url?: string | null;
                    created_at?: string;
                };
            };
            collections: {
                Row: {
                    id: string;
                    user_id: string;
                    set_id: string;
                    set_name: string;
                    set_logo: string | null;
                    set_series: string | null;
                    release_date: string | null;
                    total_cards: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    set_id: string;
                    set_name: string;
                    set_logo?: string | null;
                    set_series?: string | null;
                    release_date?: string | null;
                    total_cards: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    set_id?: string;
                    set_name?: string;
                    set_logo?: string | null;
                    set_series?: string | null;
                    release_date?: string | null;
                    total_cards?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            user_cards: {
                Row: {
                    id: string;
                    user_id: string;
                    collection_id: string;
                    card_id: string;
                    card_name: string;
                    card_number: string | null;
                    card_image: string | null;
                    card_rarity: string | null;
                    quantity: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    collection_id: string;
                    card_id: string;
                    card_name: string;
                    card_number?: string | null;
                    card_image?: string | null;
                    card_rarity?: string | null;
                    quantity?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    collection_id?: string;
                    card_id?: string;
                    card_name?: string;
                    card_number?: string | null;
                    card_image?: string | null;
                    card_rarity?: string | null;
                    quantity?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
