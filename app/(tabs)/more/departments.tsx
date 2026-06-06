import { SafeAreaView } from "react-native-safe-area-context";
import List from "@/components/Departsments/List";

export default function DepartmentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <List />
    </SafeAreaView>
  );
}
