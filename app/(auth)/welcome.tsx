import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, borderRadius, typography } from "@/constants/tokens";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
    const router = useRouter();
    const [fadeAnim] = useState(new Animated.Value(0));

    useState(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    });

    const handleGetStarted = () => {
        router.push("/(auth)/login");
    };

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Decorative background elements */}
            <View style={styles.decorativeContainer}>
                <View style={[styles.decorativeCircle, styles.circle1]} />
                <View style={[styles.decorativeCircle, styles.circle2]} />
                <View style={[styles.decorativeCircle, styles.circle3]} />
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Illustration placeholder - you can replace with an actual illustration */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.cardIllustration}>
                        <View style={styles.miniCard1} />
                        <View style={styles.miniCard2} />
                        <View style={styles.miniCard3} />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Seu Álbum,{"\n"}Suas Regras
                    </Text>
                    <Text style={styles.subtitle}>
                        Organize sua coleção de Pokémon TCG{"\n"}facilmente em um só lugar
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Começar</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    decorativeContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
    },
    decorativeCircle: {
        position: "absolute",
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    circle1: {
        width: 300,
        height: 300,
        top: -100,
        right: -100,
    },
    circle2: {
        width: 200,
        height: 200,
        bottom: 100,
        left: -50,
    },
    circle3: {
        width: 150,
        height: 150,
        top: height * 0.3,
        right: 30,
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: height * 0.15,
        paddingBottom: spacing["2xl"] + 20,
        paddingHorizontal: spacing.lg,
    },
    illustrationContainer: {
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    cardIllustration: {
        width: 200,
        height: 200,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    miniCard1: {
        width: 120,
        height: 160,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: borderRadius.card,
        position: "absolute",
        transform: [{ rotate: "-15deg" }],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.5)",
    },
    miniCard2: {
        width: 120,
        height: 160,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderRadius: borderRadius.card,
        position: "absolute",
        transform: [{ rotate: "0deg" }],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.6)",
    },
    miniCard3: {
        width: 120,
        height: 160,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: borderRadius.card,
        position: "absolute",
        transform: [{ rotate: "15deg" }],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.7)",
    },
    textContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: spacing.md,
        fontFamily: "Inter-Bold",
        lineHeight: 42,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        lineHeight: 24,
        fontFamily: "Inter-Regular",
    },
    button: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 18,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.button,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.primary,
        fontFamily: "Inter-SemiBold",
    },
});
