import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, PanResponder, Animated, LayoutChangeEvent, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/tokens';
import { Button } from '@/components/ui/Button';

interface EditCoverModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (style: { scale: number; offsetX: number; offsetY: number }) => void;
    imageUrl: string;
}

const PREVIEW_SIZE = 200; // Scaled up version of the 80x80 thumb

export function EditCoverModal({ visible, onClose, onSave, imageUrl }: EditCoverModalProps) {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // PanResponder for dragging
    const pan = useRef(new Animated.ValueXY()).current;

    // We need to track the last offset to resume dragging correctly
    const lastOffset = useRef({ x: 0, y: 0 });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: lastOffset.current.x,
                    y: lastOffset.current.y
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();
                // Store the current value as the last offset
                // @ts-ignore - _value exists on AnimatedLib
                lastOffset.current = { x: pan.x._value, y: pan.y._value };
                setOffset(lastOffset.current);
            }
        })
    ).current;

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleSave = () => {
        onSave({
            scale,
            offsetX: lastOffset.current.x,
            offsetY: lastOffset.current.y
        });
        onClose();
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
                        <Text style={styles.title}>Ajustar Capa</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.instruction}>Arraste e amplie para ajustar a capa.</Text>

                    <View style={styles.editorContainer}>
                        <View style={styles.mask}>
                            <Animated.View
                                {...panResponder.panHandlers}
                                style={[
                                    styles.imageContainer,
                                    {
                                        transform: [
                                            { translateX: pan.x },
                                            { translateY: pan.y },
                                            { scale: scale }
                                        ]
                                    }
                                ]}
                            >
                                <Image
                                    source={{ uri: `${imageUrl}/high.png` }} // Use high res for editing
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </Animated.View>
                        </View>
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                            <Ionicons name="remove" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.zoomText}>{Math.round(scale * 100)}%</Text>
                        <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                            <Ionicons name="add" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <Button onPress={handleSave} style={styles.saveButton}>
                        Salvar Capa
                    </Button>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60, // Safe area
    },
    modalContent: {
        flex: 1,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontFamily: 'Inter-Bold',
    },
    instruction: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
    editorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        height: 300,
        backgroundColor: colors.background, // Checkerboard bg usually, but solid for now
        borderRadius: borderRadius.card,
        overflow: 'hidden',
    },
    mask: {
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        borderRadius: borderRadius.sm, // Match the thumb style or circle? Thumb is currently implicitly square/rounded
        backgroundColor: 'black',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300, // Make it large enough to cover
        height: 400,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
        gap: spacing.lg,
    },
    zoomButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.divider,
    },
    zoomText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        fontFamily: 'Inter-Medium',
        width: 60,
        textAlign: 'center',
    },
    saveButton: {
        width: '100%',
    },
});
