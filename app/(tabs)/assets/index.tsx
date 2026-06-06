import { ASSETSAPI } from "@/api/assets";
import AddAsset from "@/components/Assets/AddAsset";
import AssetItem from "@/components/Assets/AssetItem";
import SearchHeader from "@/components/Assets/SearchHeader";
import { useDebounce } from "@/hooks/use-debounce";
import { useRefreshAll } from "@/hooks/use-refresh-all";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AssetScreen() {
  const { control } = useForm({ defaultValues: { search: "" } });
  const searchValue = useWatch({ control, name: "search" });
  const debouncedSearch = useDebounce(searchValue);
  const [activeStatus, setActiveStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  const { data, isLoading, isFetching } = ASSETSAPI.useAssets({
    name: debouncedSearch,
    approvalStatus: activeStatus,
    pageNumber,
    pageSize,
  });

  const assets = useMemo(() => data?.data ?? [], [data]);

  const loadMore = () => {
    if (!isFetching && assets.length >= pageSize) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveStatus(value);
    setPageNumber(1);
  };

  const [addVisible, setAddVisible] = useState(false);
  const { refreshing, onRefresh } = useRefreshAll();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark px-4 pt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Assets
        </Text>
        <TouchableOpacity
          onPress={() => setAddVisible(true)}
          className="bg-primary px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold text-sm">+ Add</Text>
        </TouchableOpacity>
      </View>

      <SearchHeader control={control} />

      {/* Status Tabs */}
      <View className="flex-row mb-4 gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => handleTabChange(tab.value)}
              className={`flex-1 py-2 rounded-xl items-center border ${isActive
                ? "bg-primary border-primary"
                : "bg-secondary dark:bg-border-dark border-border dark:border-border-dark"
                }`}
            >
              <Text
                className={`text-xs font-semibold ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" className="mt-10" />
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <AssetItem item={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={isFetching ? <ActivityIndicator size="small" /> : null}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-10">
              No {activeStatus || ""} assets found
            </Text>
          }
        />
      )}

      <AddAsset visible={addVisible} onClose={() => setAddVisible(false)} />
    </SafeAreaView>
  );
}
