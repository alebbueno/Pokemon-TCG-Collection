import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/tokens';
import { Button } from '@/components/ui/Button';

interface CreateCollectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string) => void;
}

export function CreateCollectionModal({ visible, onClose, onSubmit }: CreateCollectionModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name, description);
        setName('');
        setDescription('');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Nova Coleção</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome da Coleção</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Meus Favoritos"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={colors.textSecondary}
                                autoFocus
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Descrição (Opcional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Uma breve descrição..."
                                value={description}
                                onChangeText={setDescription}
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button
                            variant="secondary"
                            style={styles.button}
                            onPress={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={!name.trim()}
                        >
                            Criar
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontFamily: 'Inter-Bold',
    },
    form: {
        marginBottom: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
        fontFamily: 'Inter-SemiBold',
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.divider,
        borderRadius: borderRadius.button,
        padding: spacing.md,
        fontSize: 16,
        color: colors.textPrimary,
        fontFamily: 'Inter-Regular',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        flex: 1,
    },
});
