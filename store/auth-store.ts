import type { UserResponse } from "@/types/api";
import type { User } from "@/types/user";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    hasHydrated: boolean;
    isVerified: boolean;
    setUser: (apiUser: UserResponse) => void;
    resetAuth: () => void;
    setHasHydrated: (state: boolean) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    immer((set) => ({
        user: null,
        isLoading: true,
        hasHydrated: false,
        isVerified: false,

        setUser: (apiUser) =>
            set((state) => {
                state.user = {
                    id: apiUser.data.id,
                    userName: apiUser.data.userName,
                    email: apiUser.data.email,
                    roles: apiUser.data.roles,
                    scopes: apiUser.data.scopes,
                };

                state.isVerified = true;
                state.isLoading = false;
            }),

        resetAuth: () =>
            set((state) => {
                state.user = null;
                state.isVerified = false;
                state.isLoading = false;
                state.hasHydrated = false;
            }),

        setHasHydrated: (value) =>
            set((state) => {
                state.hasHydrated = value;
            }),

        setLoading: (loading) =>
            set((state) => {
                state.isLoading = loading;
            }),
    }))
);