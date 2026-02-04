import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { colors } from '@/constants/tokens';

interface ImageWithLoaderProps {
    source: { uri: string };
    style?: StyleProp<ImageStyle>;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export function ImageWithLoader({ source, style, resizeMode = 'contain' }: ImageWithLoaderProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <View style={[styles.container, style]}>
            <Image
                source={source}
                style={[StyleSheet.absoluteFill, styles.image]}
                resizeMode={resizeMode}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setError(true);
                }}
            />
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            )}
            {error && (
                <View style={[styles.loaderContainer, { backgroundColor: colors.divider }]}>
                    {/* Optional: Add error icon */}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});
