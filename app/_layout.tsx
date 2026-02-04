import { Slot, SplashScreen } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFonts } from "expo-font";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter: require("../assets/fonts/Inter-Regular.ttf"),
        "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
        "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        console.log(" [RootLayout] Fonts not loaded yet...");
        return null;
    }

    console.log(" [RootLayout] Fonts loaded! Rendering app...");

    return (
        <QueryClientProvider client={queryClient}>
            <Slot />
        </QueryClientProvider>
    );
}
