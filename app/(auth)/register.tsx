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
                        Criar Conta
                    </Text>
                    <Text style={styles.subtitle}>
                        Junte-se à comunidade de colecionadores
                    </Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Nome
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome"
                        placeholderTextColor={colors.textSecondary}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!loading}
                    />
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

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                        Confirmar Senha
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <Button
                    variant="primary"
                    onPress={handleRegister}
                    loading={loading}
                    style={styles.button}
                >
                    Cadastrar
                </Button>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Já tem uma conta?{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/login")}
                        disabled={loading}
                    >
                        <Text style={styles.signInText}>
                            Entrar
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
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },
    header: {
        marginBottom: spacing["2xl"],
    },
    title: {
        fontSize: 32,
        color: colors.textPrimary,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        fontFamily: 'Inter-Bold',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        fontFamily: 'Inter-Regular',
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
        marginBottom: spacing.sm,
        fontFamily: 'Inter-Medium',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.button,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.divider,
        fontFamily: 'Inter-Regular',
    },
    button: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontFamily: 'Inter-Regular',
    },
    signInText: {
        fontSize: 16,
        color: colors.secondary,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },
});
