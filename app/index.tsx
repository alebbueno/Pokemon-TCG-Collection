import { useEffect } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/constants/tokens";

export default function Index() {
    const router = useRouter();
    const { session, loading } = useAuth();

    useEffect(() => {
        console.log(" [Index] Auth check running...", { loading, session: !!session });
        if (!loading) {
            if (session) {
                console.log(" [Index] Session found, redirecting to Home");
                router.replace("/(tabs)/home");
            } else {
                console.log(" [Index] No session, redirecting to Welcome");
                router.replace("/(auth)/welcome");
            }
        }
    }, [session, loading]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Placeholder for logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../assets/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 128,
        height: 128,
        backgroundColor: colors.primary,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 96,
        height: 96,
    },
});
