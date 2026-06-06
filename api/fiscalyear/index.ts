import { useQuery } from "@tanstack/react-query";
import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";

const fiscalyearAPI = {
  list: async () => {
    const res = await API.post(API_ENDPOINTS.FISCALYEAR.LIST, { name: "" });
    return res.data?.data ?? res.data;
  },
};

export const useGetFiscalYears = () =>
  useQuery({ queryKey: ["fiscalyear", "list"], queryFn: fiscalyearAPI.list });

export const FISCALYEARAPI = { useGetFiscalYears } as const;
