import { removeUser } from "@/lib/storage";
import { useAuthStore } from "@/store/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, resetAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    removeUser();
    queryClient.clear();
    resetAuth();
    router.replace("/(auth)/GetStarted");
  };

  const colorScheme = useColorScheme();


  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark px-6 py-8">
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}
      >
        <Ionicons name="chevron-back" size={22} color="#00829b" />
        <Text style={{ color: "#00829b", fontSize: 15, fontWeight: "600" }}>Back</Text>
      </Pressable>

      {/* Header */}
      <View className="items-center mb-8">
        <View className="h-24 w-24 rounded-full bg-secondary dark:bg-border-dark items-center justify-center mb-4">
          <Text className="text-3xl font-bold text-primary">
            {user?.userName?.charAt(0)?.toUpperCase() ?? "U"}
          </Text>
        </View>

        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          {user?.userName ?? "Guest User"}
        </Text>

        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          {user?.email ?? "Not logged in"}
        </Text>
      </View>

      {/* Roles */}
      {user?.roles?.length ? (
        <View className="bg-secondary dark:bg-border-dark rounded-2xl p-5 mb-5">
          <Text className="text-foreground dark:text-foreground-dark font-semibold mb-2">
            Roles
          </Text>

          {user.roles.map((role, index) => (
            <View
              key={index}
              className="px-3 py-2 rounded-lg bg-background dark:bg-background-dark border border-border dark:border-border-dark mb-2"
            >
              <Text className="text-foreground dark:text-foreground-dark">
                {role}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-secondary dark:bg-border-dark rounded-2xl p-5 mb-5">
          <Text className="text-gray-500 dark:text-gray-400">
            No roles assigned
          </Text>
        </View>
      )}

      {/* Scopes */}
      {user?.scopes?.length ? (
        <View className="bg-secondary dark:bg-border-dark rounded-2xl p-5 mb-5">
          <Text className="text-foreground dark:text-foreground-dark font-semibold mb-2">
            Permissions
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {user.scopes.map((scope, index) => (
              <View
                key={index}
                className="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20"
              >
                <Text className="text-primary text-xs font-medium">
                  {scope}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={handleLogout}
        className="mt-auto py-4 rounded-xl active:opacity-80 bg-red-500"
      >
        <Text className="text-center text-white font-semibold">Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}