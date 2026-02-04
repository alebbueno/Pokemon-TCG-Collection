import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/tokens";
import { HomeHeader } from "@/components/home/HomeHeader";
import { LatestCollectionsSlider } from "@/components/home/LatestCollectionsSlider";
import { MyCollectionsList } from "@/components/home/MyCollectionsList";

export default function Home() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <HomeHeader />
                <LatestCollectionsSlider />
                <MyCollectionsList />
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
        paddingBottom: 85,
    },
});
