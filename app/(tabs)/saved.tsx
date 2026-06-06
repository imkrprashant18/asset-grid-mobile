import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark px-6 py-8">
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark mb-4">
          Saved
        </Text>
        <Text className="text-center text-gray-500 dark:text-gray-400 text-base leading-6">
          Your saved assets and favorites will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
