import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/tokens';
import { Button } from '@/components/ui/Button';
import { StorageService, CardVariantType } from '@/services/storage';
import { EditCoverModal } from './EditCoverModal';

interface VariantSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    collectionId: string;
    cardId: string;
    cardName: string;
    cardImage?: string;
    onUpdate?: () => void;
}

const VARIANTS: { id: CardVariantType; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { id: 'normal', label: 'Normal', icon: 'ellipse-outline', color: colors.textSecondary },
    { id: 'foil', label: 'Holo / Foil', icon: 'star', color: '#FFD700' }, // Gold
    { id: 'reverse', label: 'Reverse Foil', icon: 'refresh', color: '#A0A0A0' }, // Silver
    { id: 'pokeball', label: 'Poké Ball', icon: 'radio-button-on', color: '#EF4444' }, // Red
    { id: 'masterball', label: 'Master Ball', icon: 'planet', color: '#8B5CF6' }, // Purple
];

export function VariantSelectionModal({ visible, onClose, collectionId, cardId, cardName, cardImage, onUpdate }: VariantSelectionModalProps) {
    const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
    const [showEditCover, setShowEditCover] = useState(false);

    useEffect(() => {
        if (visible) {
            loadVariants();
        }
    }, [visible, collectionId, cardId]);

    const loadVariants = async () => {
        try {
            const collections = await StorageService.getUserCollections();
            const collection = collections.find(c => c.id === collectionId);
            if (collection && collection.cardVariants && collection.cardVariants[cardId]) {
                setSelectedVariants(collection.cardVariants[cardId]);
            } else {
                // Default to normal if nothing set? Or empty?
                // Usually if you have the card, you have at least one version.
                // Let's default to empty or just let user select. 
                // If they added it, maybe default to normal or just empty array implying "standard copy".
                setSelectedVariants([]);
            }
        } catch (error) {
            console.error("Failed to load variants", error);
        }
    };

    const toggleVariant = (variantId: string) => {
        setSelectedVariants(prev => {
            if (prev.includes(variantId)) {
                return prev.filter(v => v !== variantId);
            } else {
                return [...prev, variantId];
            }
        });
    };

    const handleSave = async () => {
        try {
            await StorageService.updateCardVariants(collectionId, cardId, selectedVariants);
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to save variants", error);
        }
    };

    const handleSetCover = () => {
        if (!cardImage) return;
        setShowEditCover(true);
    };

    const handleSaveCover = async (style: { scale: number; offsetX: number; offsetY: number }) => {
        if (!cardImage) return;
        try {
            await StorageService.setCollectionCover(collectionId, cardImage, style);
            if (onUpdate) onUpdate();
            // alert('Capa atualizada com sucesso!'); // Feedback inside modal or after
            setShowEditCover(false);
            onClose();
        } catch (error) {
            console.error("Failed to set cover", error);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Variações: {cardName}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>Selecione as versões que você possui:</Text>

                    <ScrollView style={styles.list}>
                        {VARIANTS.map((variant) => {
                            const isSelected = selectedVariants.includes(variant.id);
                            return (
                                <TouchableOpacity
                                    key={variant.id}
                                    style={[styles.item, isSelected && styles.itemSelected]}
                                    onPress={() => toggleVariant(variant.id)}
                                >
                                    <View style={styles.row}>
                                        <Ionicons name={variant.icon} size={24} color={variant.color} style={styles.icon} />
                                        <Text style={[styles.label, isSelected && styles.labelSelected]}>{variant.label}</Text>
                                    </View>
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={24} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.actions}>
                        {cardImage && (
                            <Button
                                variant="outline"
                                onPress={handleSetCover}
                                style={styles.actionButton}
                                icon="image-outline"
                            >
                                Definir como Capa
                            </Button>
                        )}

                        <Button onPress={handleSave} style={styles.saveButton}>
                            Salvar Alterações
                        </Button>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>

            {cardImage && (
                <EditCoverModal
                    visible={showEditCover}
                    onClose={() => setShowEditCover(false)}
                    onSave={handleSaveCover}
                    imageUrl={cardImage}
                />
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontFamily: 'Inter-Bold',
        flex: 1,
        marginRight: spacing.md,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        fontFamily: 'Inter-Regular',
    },
    list: {
        maxHeight: 300,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        borderRadius: borderRadius.sm,
    },
    itemSelected: {
        backgroundColor: colors.primary + '10', // 10% opacity primary
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: spacing.md,
    },
    label: {
        fontSize: 16,
        color: colors.textPrimary,
        fontFamily: 'Inter-Medium',
    },
    labelSelected: {
        fontWeight: '600',
        color: colors.textPrimary,
    },
    actions: {
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
    saveButton: {
        width: '100%',
    },
    actionButton: {
        width: '100%',
    },
});
