import { setCachedToken } from "@/config/reques";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

const isWeb = Platform.OS === "web";

export const getUser = async (): Promise<string | null> => {
  if (isWeb) return localStorage.getItem(TOKEN_KEY);
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const saveUser = async (token: string) => {
  setCachedToken(token);
  if (isWeb) return localStorage.setItem(TOKEN_KEY, token);
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const removeUser = async () => {
  setCachedToken(null);
  if (isWeb) return localStorage.removeItem(TOKEN_KEY);
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
