import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/constants/tokens";
import { View, Platform, StyleSheet, Animated } from "react-native";

// Animated Icon Component
function AnimatedTabIcon({
    name,
    outlineName,
    color,
    focused
}: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    outlineName: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
    focused: boolean;
}) {
    const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
    const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: focused ? 1.1 : 1,
                useNativeDriver: true,
                friction: 5,
            }),
            Animated.timing(opacityAnim, {
                toValue: focused ? 1 : 0.6,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [focused]);

    return (
        <Animated.View
            style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                }
            ]}
        >
            <Ionicons
                name={focused ? name : outlineName}
                size={22}
                color={color}
            />
        </Animated.View>
    );
}

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
                tabBarActiveTintColor: "#FFFFFF",
                tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 30,
                    left: 20,
                    marginRight: "10%",
                    marginLeft: "10%",
                    width: "80%",
                    height: 65,
                    backgroundColor: colors.primary,
                    borderRadius: 999,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarItemStyle: {
                    height: 55,
                    paddingVertical: 8,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            name="home"
                            outlineName="home-outline"
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Edições",
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            name="layers"
                            outlineName="layers-outline"
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="collection"
                options={{
                    title: "Coleção",
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            name="albums"
                            outlineName="albums-outline"
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Social",
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            name="people"
                            outlineName="people-outline"
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 45,
        height: 45,
        borderRadius: 999,
    },
    activeIconContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
});

