import { USERAUTHAPI } from "@/api/auth";
import { saveUser } from "@/lib/storage";
import { LoginFormData } from "@/lib/validationSchema";
import { useAuthStore } from "@/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useToast } from "expo-toast";

const useLoginHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setUser, setHasHydrated } = useAuthStore();

  const { mutate: login, isPending } = USERAUTHAPI.useUserLogin();

  const handleLogin = (data: LoginFormData) => {
    login(data, {
      onSuccess: async (response) => {
        const accessToken = response?.data?.accessToken;
        const user = response?.data?.user;
        if (!accessToken || !user) {
          toast.show("Login failed. Please try again.");
          return;
        }
        await saveUser(accessToken);
        queryClient.setQueryData(["authToken"], accessToken);
        setUser({ data: user });
        setHasHydrated(true);
        toast.show(response?.message ?? "Login successful");
        router.replace("/(tabs)");
      },
      onError: () => {
        toast.show("Something went wrong. Try again.");
      },
    });
  };

  return { handleLogin, isPending };
};

export { useLoginHandler };
