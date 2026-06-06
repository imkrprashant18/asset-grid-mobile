import AppButton from "@/components/ui/buttons";
import AppInput from "@/components/ui/input";
import { useLoginHandler } from "@/hooks/use-auth";
import { LoginFormData, loginSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const { handleLogin, isPending } = useLoginHandler();
  const { height } = useWindowDimensions();
  const isSmallScreen = height < 700;

  const onSubmit = async (data: LoginFormData) => {
    handleLogin(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 justify-center px-6 py-6">

            {/* Header */}
            <View className={`items-center ${isSmallScreen ? "mb-6" : "mb-10"}`}>
              {!isSmallScreen && (
                <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-4 border border-primary/20">
                  <Text className="text-4xl">🔐</Text>
                </View>
              )}
              <Text className="text-3xl font-extrabold text-foreground dark:text-foreground-dark">
                Welcome Back
              </Text>
              <Text className="text-center text-gray-500 dark:text-gray-400 mt-2 text-sm px-6">
                Login to continue managing your assets securely and efficiently.
              </Text>
            </View>

            <View className="bg-white dark:bg-[#1a2234] rounded-3xl p-6 border border-border dark:border-border-dark shadow-lg">
              <AppInput
                control={control}
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                leftIcon="email-outline"
              />

              <AppInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                leftIcon="lock-outline"
              />

              <TouchableOpacity className="items-end mb-5">
                <Text className="text-primary font-medium text-sm">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <AppButton
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isPending || isSubmitting}
                variant="primary"
              />
            </View>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500 dark:text-gray-400">
                Don't have an account?
              </Text>
              <TouchableOpacity>
                <Text className="text-primary font-semibold ml-1">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
