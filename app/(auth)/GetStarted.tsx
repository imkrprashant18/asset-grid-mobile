import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
        useAnimatedStyle,
        useSharedValue,
        withDelay,
        withSpring,
        withTiming,
} from "react-native-reanimated";

const GetStarted = () => {
        // Anim values
        const opacity = useSharedValue(0);
        const translateY = useSharedValue(30);
        const scale = useSharedValue(0.9);

        useEffect(() => {
                opacity.value = withTiming(1, { duration: 600 });
                translateY.value = withSpring(0);
                scale.value = withSpring(1);
        }, []);

        const containerStyle = useAnimatedStyle(() => ({
                opacity: opacity.value,
                transform: [{ translateY: translateY.value }, { scale: scale.value }],
        }));

        const buttonScale = useSharedValue(1);

        const buttonAnim = useAnimatedStyle(() => ({
                transform: [{ scale: buttonScale.value }],
        }));

        const onPressIn = () => {
                buttonScale.value = withSpring(0.96);
        };

        const onPressOut = () => {
                buttonScale.value = withSpring(1);
        };

        return (
                <View className="flex-1 bg-background dark:bg-background-dark px-6 justify-between">

                        {/* Animated Hero */}
                        <Animated.View style={containerStyle} className="items-center mt-10">

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
                                                <Animated.View
                                                        key={i}
                                                        style={{
                                                                opacity: withDelay(i * 150, withTiming(1, { duration: 500 })),
                                                                transform: [
                                                                        {
                                                                                translateY: withDelay(i * 150, withTiming(0, { duration: 500 })),
                                                                        },
                                                                ],
                                                        }}
                                                        className="px-3 py-1 rounded-full bg-primary/10"
                                                >
                                                        <Text className="text-xs text-primary">{item}</Text>
                                                </Animated.View>
                                        ))}
                                </View>
                        </Animated.View>

                        {/* Bottom Buttons */}
                        <View className="mb-10">

                                {/* Animated Button */}
                                <Animated.View style={buttonAnim}>
                                        <TouchableOpacity
                                                onPressIn={onPressIn}
                                                onPressOut={onPressOut}
                                                className="w-full bg-primary py-4 rounded-2xl items-center shadow-md"
                                        >
                                                <Text className="text-white font-semibold text-lg">
                                                        Get Started
                                                </Text>
                                        </TouchableOpacity>
                                </Animated.View>

                                {/* Secondary */}
                                <TouchableOpacity className="mt-4 items-center active:opacity-60">
                                        <Text className="text-primary text-sm font-medium">
                                                Already have an account? Sign in
                                        </Text>
                                </TouchableOpacity>

                        </View>
                </View>
                
        );
};

export default GetStarted;