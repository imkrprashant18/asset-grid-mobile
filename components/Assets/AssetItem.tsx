import { Asset } from "@/types/user";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  approved: { label: "Approved", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
  pending:  { label: "Pending",  bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
  rejected: { label: "Rejected", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" },
};

export default function AssetItem({ item }: { item: Asset }) {
  const status = item.approvalStatus?.toLowerCase() ?? "pending";
  const badge = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/assets/${item.id}`)}
      activeOpacity={0.7}
      className="mb-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <View className="flex-row items-center p-4 gap-3">

        {/* Image / Placeholder */}
        {item.imageUrl && item.imageUrl !== "no image" ? (
          <Image
            source={{ uri: item.imageUrl }}
            className="w-14 h-14 rounded-xl bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
            <Text className="text-2xl">📦</Text>
          </View>
        )}

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-black dark:text-white flex-1 mr-2" numberOfLines={1}>
              {item.name}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${badge.bg}`}>
              <Text className={`text-xs font-semibold ${badge.text}`}>
                {badge.label}
              </Text>
            </View>
          </View>

          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            SN: {item.serialNumber}
          </Text>

          <View className="flex-row gap-3 mt-1">
            {item.category?.name && (
              <Text className="text-xs text-gray-400">
                📁 {item.category.name}
              </Text>
            )}
            {item.department?.name && (
              <Text className="text-xs text-gray-400">
                🏢 {item.department.name}
              </Text>
            )}
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}
