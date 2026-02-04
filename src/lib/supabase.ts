import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Custom storage implementation using SecureStore for tokens
const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
