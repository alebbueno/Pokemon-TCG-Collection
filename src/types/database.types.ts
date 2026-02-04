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
        };
    };
}
