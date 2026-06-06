import { router } from "expo-router";
import React, { PropsWithChildren, useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

const PublicWrapper = ({ children }: PropsWithChildren) => {
    const { user, hasHydrated, isVerified } = useAuthStore();

    const roleId = user?.roles?.[0];
    const isAdmin = roleId?.includes("SuperAdmin");

    useEffect(() => {
        if (!hasHydrated) return;
        if (user && isVerified) {
            router.replace(
                (isAdmin ? "/(administrator)/(tabs)" : "/(tabs)") as any
            );
        }
    }, [user, isVerified, hasHydrated, isAdmin]);

    return <>{children}</>;
};

export default PublicWrapper;