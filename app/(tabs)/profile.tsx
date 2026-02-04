import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card, Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/constants/tokens";
import { useState } from "react";

export default function Profile() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await signOut();
                            router.replace("/(auth)/login");
                        } catch (error: any) {
                            Alert.alert("Erro", error.message || "Falha ao sair");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.userName}>
                        {user?.user_metadata?.name || "Usuário"}
                    </Text>
                    <Text style={styles.userEmail}>
                        {user?.email}
                    </Text>
                </View>

                {/* Profile Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Informações da Conta
                    </Text>

                    <Card style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoContent}>
                                <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.label}>Nome</Text>
                                    <Text style={styles.value}>
                                        {user?.user_metadata?.name || "Não definido"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Card style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoContent}>
                                <Ionicons name="mail-outline" size={24} color={colors.textSecondary} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.label}>E-mail</Text>
                                    <Text style={styles.value}>
                                        {user?.email}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Card>
                        <View style={styles.infoRow}>
                            <View style={styles.infoContent}>
                                <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.label}>Membro Desde</Text>
                                    <Text style={styles.value}>
                                        {new Date(user?.created_at || "").toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Sobre
                    </Text>

                    <Card>
                        <Text style={styles.aboutTitle}>
                            App de Coleção Pokémon TCG
                        </Text>
                        <Text style={styles.aboutVersion}>
                            Versão 1.0.0
                        </Text>
                    </Card>
                </View>

                {/* Sign Out Button */}
                <Button
                    variant="secondary"
                    onPress={handleSignOut}
                    loading={loading}
                    style={styles.signOutButton}
                >
                    Sair
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 85,
    },
    header: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 96,
        height: 96,
        backgroundColor: colors.primary,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    userEmail: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    card: {
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoTextContainer: {
        marginLeft: spacing.md,
    },
    label: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    aboutTitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    aboutVersion: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    signOutButton: {
        marginBottom: spacing.xl,
    },
});
