import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/tokens';
import { Button } from '@/components/ui/Button';
import { StorageService, UserCollection } from '@/services/storage';
import { CreateCollectionModal } from './CreateCollectionModal';

interface AddToCollectionModalProps {
    visible: boolean;
    onClose: () => void;
    cardId?: string;
    cardIds?: string[];
}

export function AddToCollectionModal({ visible, onClose, cardId, cardIds }: AddToCollectionModalProps) {
    const [collections, setCollections] = useState<UserCollection[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

    // Determine logic based on props
    const targetCardIds = cardIds || (cardId ? [cardId] : []);
    const isSingleCard = targetCardIds.length === 1;

    useEffect(() => {
        if (visible) {
            loadCollections();
        }
    }, [visible]);

    const loadCollections = async () => {
        const data = await StorageService.getUserCollections();
        setCollections(data);

        // Only load "added" state if checking a single card
        if (isSingleCard) {
            const map: Record<string, boolean> = {};
            data.forEach(c => {
                if (c.cards.includes(targetCardIds[0])) {
                    map[c.id] = true;
                }
            });
            setAddedMap(map);
        } else {
            setAddedMap({});
        }
    };

    const handleToggleCollection = async (collectionId: string) => {
        try {
            if (isSingleCard) {
                // Toggle logic for single card
                const isAdded = addedMap[collectionId];
                if (isAdded) {
                    await StorageService.removeCardFromCollection(collectionId, targetCardIds[0]);
                } else {
                    await StorageService.addCardToCollection(collectionId, targetCardIds[0]);
                }

                setAddedMap(prev => ({
                    ...prev,
                    [collectionId]: !isAdded
                }));
            } else {
                // Bulk add logic
                await StorageService.addCardsToCollection(collectionId, targetCardIds);
                Alert.alert("Sucesso", `${targetCardIds.length} cartas adicionadas à coleção!`);
                onClose();
            }
        } catch (error) {
            console.error("Failed to update collection", error);
            Alert.alert("Erro", "Não foi possível atualizar a coleção.");
        }
    };

    const handleCreateSubmit = async (name: string, description: string) => {
        try {
            const newCollection: UserCollection = {
                id: Date.now().toString(),
                name,
                description,
                createdAt: Date.now(),
                cards: []
            };
            await StorageService.saveUserCollection(newCollection);
            await loadCollections();
            setShowCreateModal(false);
        } catch (error) {
            console.error("Failed to create collection", error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {isSingleCard ? "Adicionar à Coleção" : `Adicionar ${targetCardIds.length} cartas`}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.list}>
                        {collections.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Você não tem coleções.</Text>
                            </View>
                        ) : (
                            collections.map(collection => (
                                <TouchableOpacity
                                    key={collection.id}
                                    style={styles.collectionItem}
                                    onPress={() => handleToggleCollection(collection.id)}
                                >
                                    <View style={styles.collectionIcon}>
                                        <Ionicons name="albums-outline" size={24} color={colors.primary} />
                                    </View>
                                    <View style={styles.collectionInfo}>
                                        <Text style={styles.collectionName}>{collection.name}</Text>
                                        <Text style={styles.collectionCount}>{collection.cards.length} cartas</Text>
                                    </View>
                                    <View style={styles.checkbox}>
                                        {isSingleCard ? (
                                            addedMap[collection.id] ? (
                                                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                            ) : (
                                                <Ionicons name="ellipse-outline" size={24} color={colors.textSecondary} />
                                            )
                                        ) : (
                                            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                    <Button
                        variant="ghost"
                        onPress={() => setShowCreateModal(true)}
                        style={styles.createButton}
                    >
                        + Criar Nova Coleção
                    </Button>
                </View>

                <CreateCollectionModal
                    visible={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateSubmit}
                />
            </View>
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
        maxHeight: '60%',
        minHeight: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontFamily: 'Inter-Bold',
    },
    list: {
        marginBottom: spacing.md,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontFamily: 'Inter-Regular',
    },
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    collectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    collectionInfo: {
        flex: 1,
    },
    collectionName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        fontFamily: 'Inter-SemiBold',
    },
    collectionCount: {
        fontSize: 12,
        color: colors.textSecondary,
        fontFamily: 'Inter-Regular',
    },
    checkbox: {
        padding: spacing.xs,
    },
    createButton: {
        marginTop: spacing.sm,
    },
});
