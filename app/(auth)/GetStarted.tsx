import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const GetStarted = () => {
  const router = useRouter();
  const handlePress = () => {
    router.push("/Login")
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-6 justify-between">

      {/* Hero Section */}
      <View className="items-center mt-10">

        {/* Logo */}
        <View className="bg-white/10 dark:bg-white/5 p-6 rounded-3xl mb-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="text-4xl font-extrabold text-primary tracking-tight">
          AssetGrid
        </Text>

        {/* Subtitle */}
        <Text className="text-center text-muted-foreground dark:text-foreground-dark mt-3 text-base leading-6 px-2">
          Manage, track, and organize all your assets in one powerful dashboard.
        </Text>

        {/* Feature Pills */}
        <View className="flex-row flex-wrap justify-center mt-6 gap-2">
          {["Fast Tracking", "Smart Reports", "Secure Data"].map((item, i) => (
            <View
              key={i}
              className="px-3 py-1 rounded-full bg-primary/10"
            >
              <Text className="text-xs text-primary">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View className="mb-10">

        {/* Primary Button */}
        <TouchableOpacity className="w-full bg-primary py-4 rounded-2xl items-center shadow-md active:opacity-80">
          <Text className="text-white font-semibold text-lg">
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Secondary Button */}
        <TouchableOpacity className="mt-4 items-center active:opacity-60" onPress={handlePress}>
          <Text className="text-primary text-sm font-medium">
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default GetStarted;