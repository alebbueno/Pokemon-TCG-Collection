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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Bem-vindo de volta
                    </Text>
                    <Text style={styles.subtitle}>
                        Faça login para continuar sua coleção
                    </Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        E-mail
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Senha
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/(auth)/forgot-password")}
                    style={styles.forgotPassword}
                    disabled={loading}
                >
                    <Text style={styles.forgotPasswordText}>
                        Esqueceu a senha?
                    </Text>
                </TouchableOpacity>

                <Button
                    variant="primary"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.button}
                >
                    Entrar
                </Button>

                <Button
                    variant="secondary"
                    onPress={() => promptAsync()}
                    disabled={loading || !request}
                    style={styles.button}
                    loading={loading && !email} // Show loading on this button if loading is true but email is empty (implying social login)
                >
                    Entrar com Google
                </Button>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Não tem uma conta?{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/register")}
                        disabled={loading}
                    >
                        <Text style={styles.signUpText}>
                            Cadastre-se
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6F2', // bg-background
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24, // px-lg
    },
    header: {
        marginBottom: 48, // mb-2xl
    },
    title: {
        fontSize: 32, // text-title-xl
        color: colors.textPrimary,
        fontWeight: 'bold',
        marginBottom: 8, // mb-sm
        fontFamily: 'Inter-Bold',
    },
    subtitle: {
        fontSize: 16, // text-body
        color: colors.textSecondary,
        fontFamily: 'Inter-Regular',
    },
    inputGroup: {
        marginBottom: 32, // mb-xl (email) / mb-md (password) - standardized here for simplicity or specific if needed
    },
    label: {
        fontSize: 14, // text-subtitle
        color: colors.textPrimary,
        fontWeight: '500', // font-medium
        marginBottom: 8, // mb-sm
        fontFamily: 'Inter-Medium',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.button,
        paddingHorizontal: 16, // px-lg
        paddingVertical: 16, // py-4
        fontSize: 16, // text-body
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.divider,
        fontFamily: 'Inter-Regular',
    },
    forgotPassword: {
        marginBottom: 32, // mb-xl
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        fontSize: 16, // text-body
        color: colors.secondary,
        fontWeight: '500', // font-medium
        textAlign: 'right',
        fontFamily: 'Inter-Medium',
    },
    button: {
        marginBottom: 16, // mb-md / mb-xl
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        fontSize: 16, // text-body
        color: colors.textSecondary,
        fontFamily: 'Inter-Regular',
    },
    signUpText: {
        fontSize: 16, // text-body
        color: colors.secondary,
        fontWeight: '600', // font-semibold
        fontFamily: 'Inter-SemiBold',
    },
});
