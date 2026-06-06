import { USERAUTHAPI } from "@/api/auth";
import { getUser, removeUser } from "@/lib/storage";
import { useAuthStore } from "@/store/auth-store";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "expo-toast";
import * as React from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, configureFonts } from "react-native-paper";
import { setCachedToken } from "@/config/reques";
import "./global.css";
SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 1000 * 60 },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        removeUser();
        router.replace("/");
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        removeUser();
        router.replace("/");
      }
    },
  }),
});

function AuthBootstrap() {
  const { resetAuth, setHasHydrated } = useAuthStore();
  const [hasToken, setHasToken] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    getUser().then((token) => {
      setCachedToken(token);
      if (!token) {
        resetAuth();
      }
      setHasToken(!!token);
      setHasHydrated(true);
    });
  }, []);

  USERAUTHAPI.useUserProfile(hasToken === true);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  SplashScreen.hideAsync();

  const fontConfig = {
    bodyLarge: { fontFamily: "Poppins_400Regular" },
    bodyMedium: { fontFamily: "Poppins_400Regular" },
    bodySmall: { fontFamily: "Poppins_400Regular" },
    labelLarge: { fontFamily: "Poppins_500Medium" },
    labelMedium: { fontFamily: "Poppins_500Medium" },
    labelSmall: { fontFamily: "Poppins_500Medium" },
    titleLarge: { fontFamily: "Poppins_600SemiBold" },
    titleMedium: { fontFamily: "Poppins_600SemiBold" },
    titleSmall: { fontFamily: "Poppins_600SemiBold" },
    headlineLarge: { fontFamily: "Poppins_700Bold" },
    headlineMedium: { fontFamily: "Poppins_700Bold" },
    headlineSmall: { fontFamily: "Poppins_700Bold" },
    displayLarge: { fontFamily: "Poppins_700Bold" },
    displayMedium: { fontFamily: "Poppins_700Bold" },
    displaySmall: { fontFamily: "Poppins_700Bold" },
  };

  const baseTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const theme = { ...baseTheme, fonts: configureFonts({ config: fontConfig }) };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <ToastProvider>
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            backgroundColor="transparent"
          />
          <AuthBootstrap />
          <Slot />
        </ToastProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}