import { Slot } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
    console.log(" [AuthLayout] Mounting...");
    return (
        <View style={{ flex: 1, backgroundColor: "#F8F6F2" }}>
            <Slot />
        </View>
    );
}
