import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, configureFonts } from "react-native-paper";

import "./global.css";

SplashScreen.preventAutoHideAsync();

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
    <PaperProvider theme={theme}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
      />

      <Slot />
    </PaperProvider>
  );
}