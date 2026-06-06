import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function FiscalYearScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
      <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">Fiscal Year</Text>
    </SafeAreaView>
  );
}
