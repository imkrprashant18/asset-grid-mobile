
import { useAuthStore } from "@/store/auth-store";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#00829b" />
    </View>
  );

  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/GetStarted" />;
}
