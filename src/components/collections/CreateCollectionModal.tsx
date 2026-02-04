import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/constants/tokens";

interface CreateCollectionModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    setName: string;
    totalCards: number;
    setLogo?: string;
    loading?: boolean;
    downloadStatus?: 'creating' | 'downloading' | 'complete';
}

export function CreateCollectionModal({
    visible,
    onClose,
    onConfirm,
    setName,
    totalCards,
    setLogo,
    loading = false,
    downloadStatus = 'creating',
}: CreateCollectionModalProps) {
    const getButtonText = () => {
        if (!loading) return 'Criar Coleção';

        switch (downloadStatus) {
            case 'creating':
                return 'Criando...';
            case 'downloading':
                return 'Baixando cartas...';
            case 'complete':
                return 'Finalizando...';
            default:
                return 'Criando...';
        }
    };
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        {/* Header with logo */}
                        <View style={styles.header}>
                            {setLogo && (
                                <Image
                                    source={{ uri: setLogo }}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            )}
                            <Text style={styles.title}>Criar Coleção?</Text>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <View style={styles.infoCard}>
                                <Ionicons name="albums" size={32} color={colors.primary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.setName}>{setName}</Text>
                                    <Text style={styles.cardCount}>{totalCards} cartas</Text>
                                </View>
                            </View>

                            <View style={styles.descriptionBox}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={20}
                                    color={colors.textSecondary}
                                />
                                <Text style={styles.description}>
                                    Todas as cartas serão adicionadas com quantidade 0. Marque as que você possui!
                                </Text>
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton, loading && styles.buttonDisabled]}
                                onPress={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <ActivityIndicator size="small" color="#FFF" />
                                        <Text style={styles.confirmButtonText}>{getButtonText()}</Text>
                                    </>
                                ) : (
                                    <>
                                        <Ionicons name="add-circle" size={20} color="#FFF" />
                                        <Text style={styles.confirmButtonText}>Criar Coleção</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: "85%",
        maxWidth: 400,
    },
    modal: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.card,
        overflow: "hidden",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    header: {
        padding: spacing.lg,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    logo: {
        width: 120,
        height: 48,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.textPrimary,
        textAlign: "center",
    },
    content: {
        padding: spacing.lg,
    },
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.md,
    },
    infoText: {
        marginLeft: spacing.md,
        flex: 1,
    },
    setName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: 2,
    },
    cardCount: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    descriptionBox: {
        flexDirection: "row",
        backgroundColor: colors.primary + "15",
        padding: spacing.md,
        borderRadius: borderRadius.sm,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
    },
    description: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
        marginLeft: spacing.sm,
    },
    actions: {
        flexDirection: "row",
        gap: spacing.md,
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.button,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: spacing.xs,
    },
    cancelButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.divider,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    confirmButton: {
        backgroundColor: colors.primary,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFF",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
