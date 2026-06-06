import ProtectedWrapper from "@/layout/AuthLayout";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ITEMS: { name: string; label: string; icon: IoniconsName }[] = [
  { name: "index", label: "Dashboard", icon: "bar-chart" },
  { name: "assets/index", label: "Assets", icon: "cube" },
  { name: "scanner", label: "", icon: "scan" },
  { name: "finance", label: "Finance", icon: "cash" },
  { name: "more", label: "More", icon: "grid" },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const activeColor = "#00829b";
  const inactiveColor = "#94a3b8";
  const bg = colorScheme === "dark" ? "#111827" : "#ffffff";
  const border = colorScheme === "dark" ? "#393a3c" : "#e4e7ec";

  return (
    <View
      style={{
        backgroundColor: bg,
        borderTopColor: border,
        borderTopWidth: 1,
        flexDirection: "row",
        height: 64 + insets.bottom,
        paddingBottom: insets.bottom,
        alignItems: "center",
      }}
    >
      {TAB_ITEMS.map((tab, index) => {
        const focused = state.index === index;
        const isScanner = tab.name === "scanner";

        if (isScanner) {
          return (
            <View key={tab.name} style={{ flex: 1, alignItems: "center" }}>
              <Pressable
                onPress={() => router.push("/(tabs)/scanner")}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#00829b",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                  shadowColor: "#00829b",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="scan" size={28} color="#fff" />
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 3 }}
          >
            <Ionicons
              name={focused ? tab.icon : (`${tab.icon}-outline` as IoniconsName)}
              size={22}
              color={focused ? activeColor : inactiveColor}
            />
            <Text style={{ fontSize: 11, fontWeight: "600", color: focused ? activeColor : inactiveColor }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <ProtectedWrapper>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="assets" options={{ href: null }} />
        <Tabs.Screen name="assets/index" options={{ href: null }} />
        <Tabs.Screen name="assets/[id]" options={{ href: null }} />
        <Tabs.Screen name="scanner" />
        <Tabs.Screen name="finance" />
        <Tabs.Screen name="more" />
        {/* More sub-screens — hidden from tab bar */}
        <Tabs.Screen name="more/users" options={{ href: null }} />
        <Tabs.Screen name="more/user-roles" options={{ href: null }} />
        <Tabs.Screen name="more/permissions" options={{ href: null }} />
        <Tabs.Screen name="more/departments" options={{ href: null }} />
        <Tabs.Screen name="more/branches" options={{ href: null }} />
        <Tabs.Screen name="more/fiscal-year" options={{ href: null }} />
        <Tabs.Screen name="more/categories" options={{ href: null }} />
        {/* Hide old screens */}

        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
    </ProtectedWrapper>
  );
}
