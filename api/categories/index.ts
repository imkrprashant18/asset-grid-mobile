import { useQuery } from "@tanstack/react-query";
import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";

const categoriesAPI = {
  list: async () => {
    const res = await API.post(API_ENDPOINTS.CATEGORIES.LIST, { name: "", code: "" });
    return res.data?.data ?? res.data;
  },
};

export const useGetCategories = () =>
  useQuery({ queryKey: ["categories", "list"], queryFn: categoriesAPI.list });

export const CATEGORIESAPI = { useGetCategories } as const;
