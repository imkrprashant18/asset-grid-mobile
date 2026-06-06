import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";
import { useQuery } from "@tanstack/react-query";


const dashboardKeys = {
    all: ["dashboard"] as const,
    overview: () => [...dashboardKeys.all, "overview"] as const,
} as const;

const DashboardAPI = {
    overview: async () => {
        const { data } = await API.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
        return data;
    },

} as const;





export const useGetDashboardOverView = () => {
    return useQuery({
        queryKey: dashboardKeys.overview(),
        queryFn: DashboardAPI.overview,
    });
};




export const DASHBOARDAPI = {
    useGetDashboardOverView,
} as const;