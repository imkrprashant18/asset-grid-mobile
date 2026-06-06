import React, { useEffect, PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

import { useAuthStore } from "@/store/auth-store";

const ProtectedWrapper = ({ children }: PropsWithChildren) => {
    const { user, hasHydrated, isVerified } = useAuthStore();

    const roleId = user?.roles?.[0];
    const isAuthorized = !!user && roleId !== "SuperAdmin";

    useEffect(() => {
        if (!hasHydrated) return;
        if (!user || (isVerified && !isAuthorized)) {
            router.replace("/(auth)/GetStarted");
        }
    }, [hasHydrated, isVerified, isAuthorized, user]);

    if (!hasHydrated) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthorized) return null;

    return <>{children}</>;
};

export default ProtectedWrapper;