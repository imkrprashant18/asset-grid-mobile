import { AxiosError } from "axios";
import { Alert } from "react-native";

interface ErrorData {
  errors?: Record<string, string[]>;
  message?: string;
  Message?: string;
  title?: string;
}

export const handleApiError = (
  error: unknown,
  fallbackMessage = "An error occurred",
): void => {
  const axiosError = error as AxiosError<ErrorData>;
  const { message: rawErrorMessage, code, config, response } = axiosError;

  if (
    rawErrorMessage?.includes("canceled") ||
    rawErrorMessage?.includes("aborted") ||
    code === "ERR_CANCELED"
  ) {
    return;
  }

  if (config?.method?.toUpperCase() === "GET") return;

  if (!response) {
  Alert.alert("Error", rawErrorMessage || fallbackMessage);
    return;
  }

  const { status, data } = response;

  const backendMessage =
    data?.message || data?.Message || data?.title || rawErrorMessage;

  if (status === 400 && data?.errors) {
    const firstError = Object.values(data.errors)[0]?.[0];
     Alert.alert("Error", firstError || backendMessage || fallbackMessage);
    return;
  }
   Alert.alert("Error", backendMessage || fallbackMessage);
};