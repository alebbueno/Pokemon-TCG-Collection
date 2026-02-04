import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/constants/tokens";
import { View } from "react-native";

export default function TabsLayout() {
    const router = useRouter();
    const { session, loading } = useAuth();

    useEffect(() => {
        if (!loading && !session) {
            router.replace("/(auth)/login");
        }
    }, [session, loading]);

    if (loading || !session) {
        return <View style={{ flex: 1, backgroundColor: colors.background }} />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.divider,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explorar",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="collection"
                options={{
                    title: "Coleções",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="albums-outline" size={size} color={color} />
                    ),
                }}
            />
            {/* Hide home route if it exists, or just ensure it's not a tab */}
            <Tabs.Screen
                name="home"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
