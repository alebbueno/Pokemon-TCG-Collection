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
import { validateEmail } from "@/utils/validation";
import { colors, spacing, borderRadius } from "@/constants/tokens";

export default function ForgotPassword() {
    const router = useRouter();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(email);
            Alert.alert(
                "E-mail Enviado",
                "Verifique seu e-mail para instruções de redefinição de senha.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert("Falha no Envio", error.message || "Ocorreu um erro");
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
                        Esqueceu a Senha?
                    </Text>
                    <Text style={styles.subtitle}>
                        Digite seu e-mail e enviaremos um link para redefinir sua senha
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

                <Button
                    variant="primary"
                    onPress={handleResetPassword}
                    loading={loading}
                    style={styles.button}
                >
                    Enviar Link
                </Button>

                <TouchableOpacity
                    onPress={() => router.back()}
                    disabled={loading}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>
                        Voltar para Login
                    </Text>
                </TouchableOpacity>
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
    },
    header: {
        marginBottom: spacing["2xl"],
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    inputGroup: {
        marginBottom: spacing.xl,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
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
    },
    button: {
        marginBottom: spacing.lg,
    },
    backButton: {
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.secondary,
    },
});
