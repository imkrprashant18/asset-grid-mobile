import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";
import { removeUser } from "@/lib/storage";
import { LoginFormData } from "@/lib/validationSchema";
import { useAuthStore } from "@/store/auth-store";
import { LoginResponse, UserResponse } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";




const userKeys = {
  all: ["user"] as const,
  login: () => [...userKeys.all, "login"] as const,
  register: () => [...userKeys.all, "register"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  logout: () => [...userKeys.all, "logout"] as const,
} as const;

const authAPI = {
  //   register: async (credentials: RegisterInput) => {
  //     const { data } = await API.post<RegisterResponse>(
  //       API_ENDPOINTS.AUTH.REGISTER,
  //       credentials,
  //       { requiresAuth: false },
  //     );
  //     return data;
  //   },
  login: async (credentials: LoginFormData) => {
    const { data } = await API.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requiresAuth: false },
    );
    return data;
  },
  profile: async () => {
    const { data } = await API.get<UserResponse>(API_ENDPOINTS.AUTH.GETUSER, {
      requiresAuth: true,
    });

    return data;
  },
  logout: async () => {
    await removeUser();
    return;
  },
} as const;



// const useUserRegister = () => {
//   return useMutation({
//     mutationFn: authAPI.register,
//     meta: { errorMessage: "Registration failed" },
//   });
// }

const useUserLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    meta: { errorMessage: "Login failed" },
  });
};

const useUserLogout = () => {
  return useMutation({
    mutationFn: authAPI.logout,
    meta: { errorMessage: "Logout failed" },
  });
};

const useUserProfile = (enabled: boolean) => {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const data: UserResponse = await authAPI.profile();
      setUser(data);
      return data;
    },
    enabled,
    meta: { errorMessage: "Profile fetch failed" },
    retry: false,
    throwOnError: false,
  });
};
export const USERAUTHAPI = {
  //   useUserRegister,
  useUserLogin,
  useUserLogout,
  useUserProfile,
} as const;