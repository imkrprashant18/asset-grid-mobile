import { useQuery } from "@tanstack/react-query";
import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";

const branchesAPI = {
  list: async () => {
    const res = await API.post(API_ENDPOINTS.BRANCHES.LIST, { name: "", code: "" });
    return res.data?.data ?? res.data;
  },
};

export const useGetBranches = () =>
  useQuery({ queryKey: ["branches", "list"], queryFn: branchesAPI.list });

export const BRANCHESAPI = { useGetBranches } as const;
