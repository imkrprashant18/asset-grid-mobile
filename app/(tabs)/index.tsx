
import { DASHBOARDAPI } from "@/api/dashboard";
import { useRefreshAll } from "@/hooks/use-refresh-all";
import React, { useMemo } from "react";
import { Dimensions, RefreshControl, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;


function AnalysisCard({ financialSummary }: any) {
  const cards = useMemo(
    () => [
      {
        title: "Total Purchase Cost",
        value: financialSummary?.totalPurchaseCost ?? 0,
      },
      {
        title: "Total Depreciation",
        value: financialSummary?.totalDepreciationAmount ?? 0,
      },
      {
        title: "Remaining Amount",
        value: financialSummary?.remainingAmount ?? 0,
      },
    ],
    [financialSummary]
  );

  return (
    <View className="flex-row flex-wrap justify-between gap-3">
      {cards.map((item, index) => (
        <View
          key={index}
          className="w-[48%] bg-white dark:bg-[#1e293b] p-4 rounded-xl"
        >
          <Text className="text-gray-500 dark:text-gray-400 text-sm">{item.title}</Text>
          <Text className="text-xl font-bold mt-2 text-foreground dark:text-foreground-dark">
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}


function AssetPieChart({ data }: any) {
  const chartData = useMemo(() => {
    if (!data?.length) return [];

    const colors = ["#4f46e5", "#0ea5e9", "#f97316", "#22c55e", "#eab308"];

    return data.slice(0, 5).map((item: any, index: number) => ({
      name: item.categoryName,
      population: item.totalPurchaseCost,
      color: colors[index % colors.length],
      legendFontColor: "#666",
      legendFontSize: 12,
    }));
  }, [data]);

  if (!chartData.length) {
    return (
      <Text className="text-center text-gray-400">No chart data</Text>
    );
  }

  return (
    <PieChart
      data={chartData}
      width={screenWidth - 40}
      height={220}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="10"
      chartConfig={{
        color: () => "#000",
      }}
      absolute
    />
  );
}

function AssetList({ data }: any) {
  return (
    <View className="mt-4">
      {data?.slice(0, 5)?.map((item: any, index: number) => (
        <View
          key={index}
          className="flex-row justify-between p-3 border-b border-border dark:border-border-dark"
        >
          <Text className="text-foreground dark:text-foreground-dark">
            {item.name ?? "Asset"}
          </Text>
          <Text className="text-gray-500">
            {item.serialNumber ?? "-"}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function DashboardScreen() {
  const { data, isLoading } = DASHBOARDAPI.useGetDashboardOverView();
  const { refreshing, onRefresh } = useRefreshAll();

  const dashboard = data?.data;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#f1f5f9] dark:bg-background-dark">
        <Text className="text-foreground dark:text-foreground-dark">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f1f5f9] dark:bg-background-dark">
      <ScrollView className="px-4 py-6" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        {/* Header */}
        <Text className="text-2xl font-bold mb-4 text-foreground dark:text-foreground-dark">
          Dashboard
        </Text>

        {/* Analysis */}
        <AnalysisCard financialSummary={dashboard?.financialSummary} />

        {/* Pie Chart */}
        <View className="mt-6 bg-white dark:bg-[#1e293b] p-4 rounded-xl">
          <Text className="text-lg font-semibold mb-3 text-foreground dark:text-foreground-dark">
            Asset Distribution
          </Text>
          <AssetPieChart data={dashboard?.assetDistributionsByCategory} />
        </View>

        {/* Assets */}
        <View className="mt-6 bg-white dark:bg-[#1e293b] p-4 rounded-xl">
          <Text className="text-lg font-semibold mb-3 text-foreground dark:text-foreground-dark">
            Latest Assets
          </Text>
          <AssetList data={dashboard?.assets} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}