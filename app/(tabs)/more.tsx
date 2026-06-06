import { useAuthStore } from "@/store/auth-store";
import { useRefreshAll } from "@/hooks/use-refresh-all";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, RefreshControl, ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const MORE_ITEMS: { label: string; icon: IoniconsName; route: string }[] = [
  { label: "Users", icon: "people", route: "/(tabs)/more/users" },
  { label: "User Roles", icon: "shield-checkmark", route: "/(tabs)/more/user-roles" },
  { label: "Permissions", icon: "key", route: "/(tabs)/more/permissions" },
  { label: "Departments", icon: "business", route: "/(tabs)/more/departments" },
  { label: "Branches", icon: "git-branch", route: "/(tabs)/more/branches" },
  { label: "Fiscal Year", icon: "calendar", route: "/(tabs)/more/fiscal-year" },
  { label: "Categories", icon: "pricetag", route: "/(tabs)/more/categories" },
];

export default function MoreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuthStore();

  const bg = isDark ? "#111827" : "#f1f5f9";
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const textColor = isDark ? "#f9fafb" : "#0f172a";
  const subTextColor = isDark ? "#94a3b8" : "#64748b";

  const { refreshing, onRefresh } = useRefreshAll();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: textColor, marginBottom: 16 }}>More</Text>

        {/* Profile Card */}
        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: "#00829b",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff" }}>
              {user?.userName?.charAt(0)?.toUpperCase() ?? "U"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: textColor }}>
              {user?.userName ?? "Guest User"}
            </Text>
            <Text style={{ fontSize: 13, color: subTextColor, marginTop: 2 }}>
              {user?.email ?? ""}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </Pressable>

        {/* Management Grid */}
        <Text style={{ fontSize: 13, fontWeight: "600", color: subTextColor, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Management
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {MORE_ITEMS.map((item) => (
            <Pressable
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={{
                width: "47%",
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#00829b20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={item.icon} size={24} color="#00829b" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: "600", color: textColor, textAlign: "center" }}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
