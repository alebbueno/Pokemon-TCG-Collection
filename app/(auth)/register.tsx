import { useState } from "react";
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
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validatePassword } from "@/utils/validation";
import { colors, spacing, borderRadius, typography } from "@/constants/tokens";

export default function Register() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "Por favor, insira seu nome");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            Alert.alert("Senha Fraca", passwordValidation.errors.join("\n"));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        try {
            setLoading(true);
            await signUp(email, password, name);
            Alert.alert(
                "Sucesso",
                "Conta criada com sucesso! Por favor, verifique seu e-mail para confirmação.",
                [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
            );
        } catch (error: any) {
            Alert.alert("Falha no Cadastro", error.message || "Ocorreu um erro");
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
                            <Text style={styles.title}>Criar Conta</Text>
                            <Text style={styles.subtitle}>
                                Já tem uma conta?{" "}
                                <Text
                                    style={styles.linkText}
                                    onPress={() => router.push("/(auth)/login")}
                                >
                                    Entrar
                                </Text>
                            </Text>
                        </View>

                        <View style={styles.form}>
                            {/* Name Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite seu nome"
                                    placeholderTextColor={colors.textSecondary}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    editable={!loading}
                                />
                            </View>

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

                            {/* Confirm Password Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirme sua senha"
                                    placeholderTextColor={colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                style={[styles.registerButton, loading && styles.buttonDisabled]}
                                onPress={handleRegister}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.registerButtonText}>
                                    {loading ? "Cadastrando..." : "Cadastrar"}
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>Ou Continue Com</Text>
                                <View style={styles.divider} />
                            </View>

                            {/* Social Signup Buttons */}
                            <View style={styles.socialButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.socialButton}
                                    disabled={loading}
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
        marginTop: 180, // 220px (image height) - 40px (overlap)
        paddingBottom: spacing.xl,
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
    registerButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.button,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.sm,
    },
    registerButtonText: {
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
