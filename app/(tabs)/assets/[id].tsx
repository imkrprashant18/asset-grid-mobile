import { ASSETSAPI } from "@/api/assets";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  approved: { label: "Approved", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
  pending: { label: "Pending", bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
  rejected: { label: "Rejected", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" },
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-800">
      <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="text-sm font-medium text-black dark:text-white flex-1 text-right ml-4">{String(value)}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-4 mb-4">
      <Text className="text-xs font-bold text-primary uppercase tracking-widest pt-4 pb-2">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data, isLoading } = ASSETSAPI.useAssetSingle(id);
  const asset = data?.data;

  const status = asset?.approvalStatus?.toLowerCase() ?? "pending";
  const badge = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={24} color={isDark ? "#f9fafb" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black dark:text-white flex-1" numberOfLines={1}>
          {asset ? asset.name : "Asset Details"}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" className="mt-20" />
      ) : !asset ? (
        <Text className="text-center text-gray-400 mt-20">Asset not found</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
          {/* Hero */}
          <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">
            {asset.imageUrl && asset.imageUrl !== "no image" ? (
              <Image
                source={{ uri: asset.imageUrl }}
                className="w-full h-52"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-40 bg-primary/10 items-center justify-center">
                <Text className="text-6xl">📦</Text>
              </View>
            )}
            <View className="p-4">
              <View className="flex-row items-start justify-between">
                <Text className="text-xl font-bold text-black dark:text-white flex-1 mr-3">
                  {asset.name}
                </Text>
                <View className={`px-3 py-1 rounded-full ${badge.bg}`}>
                  <Text className={`text-xs font-bold ${badge.text}`}>{badge.label}</Text>
                </View>
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                SN: {asset.serialNumber}
              </Text>
              {asset.approvalMessage ? (
                <Text className="text-xs text-gray-400 mt-2 italic">
                  "{asset.approvalMessage}"
                </Text>
              ) : null}
            </View>
          </View>

          {/* General Info */}
          <Section title="General Information">
            <InfoRow label="Serial Number" value={asset.serialNumber} />
            <InfoRow label="Useful Life" value={asset.usefulLife ? `${asset.usefulLife} years` : null} />
            <InfoRow label="Category" value={asset.category?.name} />
            <InfoRow label="Department" value={asset.department?.name} />
            <InfoRow label="Branch" value={asset.branch?.name} />
            <InfoRow label="Fiscal Year" value={asset.fiscalYear?.name} />
          </Section>

          {/* Finance Info */}
          {asset.assetFinance && (
            <Section title="Finance">
              <InfoRow label="Purchase Cost" value={asset.assetFinance.purchaseCost ? `$${asset.assetFinance.purchaseCost.toLocaleString()}` : null} />
              <InfoRow label="Purchase Date" value={asset.assetFinance.purchaseDate} />
              <InfoRow label="Depreciation Value" value={asset.assetFinance.depreciationValue ? `$${asset.assetFinance.depreciationValue.toLocaleString()}` : null} />
              <InfoRow label="Maintenance Cost" value={asset.assetFinance.maintenanceCost ? `$${asset.assetFinance.maintenanceCost.toLocaleString()}` : null} />
              <InfoRow label="Resale Value" value={asset.assetFinance.resaleValue ? `$${asset.assetFinance.resaleValue.toLocaleString()}` : null} />
              <InfoRow label="Warranty" value={asset.assetFinance.warranty} />
              <InfoRow label="Supplier" value={asset.assetFinance.supplierName} />
              <InfoRow label="Supplier Contact" value={asset.assetFinance.supplierContact} />
            </Section>
          )}

          {/* Depreciation */}
          {asset.depreciation && (
            <Section title="Depreciation">
              <InfoRow label="Total Depreciation" value={`$${asset.depreciation.totalDepreciation?.toLocaleString()}`} />
              <InfoRow label="Remaining Value" value={`$${asset.depreciation.remainingAmountAfterDepreciation?.toLocaleString()}`} />
              <InfoRow label="Years Passed" value={`${asset.depreciation.yearsPassed} years`} />
            </Section>
          )}

          {/* Branch Details */}
          {asset.branch && (
            <Section title="Branch Details">
              <InfoRow label="Name" value={asset.branch.name} />
              <InfoRow label="Code" value={asset.branch.code} />
              <InfoRow label="State" value={asset.branch.state} />
              <InfoRow label="District" value={asset.branch.district} />
              <InfoRow label="Address" value={asset.branch.addressLine} />
            </Section>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
