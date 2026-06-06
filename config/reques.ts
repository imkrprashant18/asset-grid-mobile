import { getUser, removeUser } from "@/lib/storage";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import API_VERSION from "./ApiVersion";
import { handleApiError } from "./handleError";


declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
    __retryCount?: number;
  }
}

const baseURL = "https://api.asset.dev.techrida.com" + API_VERSION;

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL in environment variables");
}

const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// In-memory token cache — avoids async SecureStore read on every request
let cachedToken: string | null | undefined = undefined;

export const getCachedToken = async () => {
  if (cachedToken === undefined) {
    cachedToken = await getUser();
  }
  return cachedToken;
};

export const setCachedToken = (token: string | null) => {
  cachedToken = token;
};

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    if (config.requiresAuth !== false) {
      const token = await getCachedToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
);

const MAX_RETRIES = 3;
const RETRY_DELAY = 10000;

API.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config;
    if (!config) {
      handleApiError(error);
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      removeUser();
      return Promise.reject(error);
    }
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout");
    const isNetworkError = !error.response;

    if (isTimeout || isNetworkError) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return API(config);
      }
    }
    handleApiError(error);
    return Promise.reject(error);
  },
);

export default API;