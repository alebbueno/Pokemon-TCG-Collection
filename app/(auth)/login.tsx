import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    StyleSheet,
    Image,
    ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail } from "@/utils/validation";
import { colors, spacing, borderRadius, typography } from "@/constants/tokens";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    console.log(" [Login] Screen mounting...");
    const router = useRouter();
    const { signIn, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ["profile", "email"],
        // Google does not support exp:// URIs. We use the Expo Auth Proxy for Expo Go.
        redirectUri: "https://auth.expo.io/@alebbueno/pokemon-tcg-collection",
    });

    useEffect(() => {
        if (request) {
            console.log(" [Google Auth] Redirect URI:", request.redirectUri);
            console.log(" [Google Auth] Scopes:", request.scopes);
            console.log(" [Google Auth] Client IDs Present:", {
                ios: !!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
                android: !!process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
                web: !!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            });
        }
    }, [request]);

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            if (id_token) {
                handleGoogleSignInProcess(id_token);
            }
        } else if (response?.type === "error") {
            Alert.alert("Erro no Login Google", "Não foi possível conectar com o Google.");
        }
    }, [response]);

    const handleGoogleSignInProcess = async (token: string) => {
        try {
            setLoading(true);
            await signInWithGoogle(token);
            router.replace("/(tabs)/home");
        } catch (error: any) {
            Alert.alert("Falha no Login Google", error.message || "Ocorreu um erro ao autenticar com Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }

        if (!password) {
            Alert.alert("Erro", "Por favor, insira sua senha");
            return;
        }

        try {
            setLoading(true);
            await signIn(email, password);
            router.replace("/(tabs)/home");
        } catch (error: any) {
            Alert.alert("Falha no Login", error.message || "Ocorreu um erro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Image Background Header */}
            <ImageBackground
                source={require("../../assets/img-login.jpg")}
                style={styles.imageHeader}
                resizeMode="cover"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* White Card Container */}
                    <View style={styles.card}>
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Image
                                source={require("../../assets/pokeio-logo.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.title}>Entrar</Text>
                            <Text style={styles.subtitle}>
                                Ainda não tem conta?{" "}
                                <Text
                                    style={styles.linkText}
                                    onPress={() => router.push("/(auth)/register")}
                                >
                                    Cadastre-se
                                </Text>
                            </Text>
                        </View>

                        <View style={styles.form}>
                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite seu e-mail"
                                    placeholderTextColor={colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity
                                onPress={() => router.push("/(auth)/forgot-password")}
                                style={styles.forgotPassword}
                                disabled={loading}
                            >
                                <Text style={styles.forgotPasswordText}>
                                    Esqueceu a senha?
                                </Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                style={[styles.loginButton, loading && styles.buttonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.loginButtonText}>
                                    {loading ? "Entrando..." : "Entrar"}
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>Ou Continue Com</Text>
                                <View style={styles.divider} />
                            </View>

                            {/* Social Login Buttons */}
                            <View style={styles.socialButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.socialButton}
                                    onPress={() => promptAsync()}
                                    disabled={loading || !request}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.socialButtonText}>Google</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    imageHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 220,
        zIndex: 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        marginTop: 180, // 220px (image height) - 80px (overlap)
    },
    card: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.card,
        padding: spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: spacing.xl,
        position: "relative",
        zIndex: 10,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
    },
    logo: {
        width: 160,
        height: 80,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        fontFamily: "Inter-Bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        fontFamily: "Inter-Regular",
        textAlign: "center",
    },
    linkText: {
        color: colors.primary,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
    },
    form: {
        gap: spacing.md,
    },
    inputContainer: {
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.divider,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.md,
        paddingVertical: 16,
        fontSize: 15,
        color: colors.textPrimary,
        fontFamily: "Inter-Regular",
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: spacing.sm,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: "500",
        fontFamily: "Inter-Medium",
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.button,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.sm,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        fontFamily: "Inter-SemiBold",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: spacing.lg,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.divider,
    },
    dividerText: {
        marginHorizontal: spacing.md,
        fontSize: 13,
        color: colors.textSecondary,
        fontFamily: "Inter-Regular",
    },
    socialButtonsContainer: {
        gap: spacing.sm,
    },
    socialButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.divider,
        borderRadius: borderRadius.button,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.textPrimary,
        fontFamily: "Inter-Medium",
    },
});
