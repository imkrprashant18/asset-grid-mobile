
import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";
import type { AssetFormData as CreateAssetInput } from "@/lib/validationSchema";
import type { AssetsResponse, AssetSingleResponse } from "@/types/api";
import type { Asset } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AssetFilters {
    name?: string;
    serialNumber?: string | null;
    clientBranchId?: string | null;
    purchaseDate?: string | null;
    fiscalYear?: string | null;
    usefulLife?: number | null;
    approvalStatus?: string | null;
    categoryId?: string | null;
    pageNumber?: number;
    pageSize?: number;
    data?: Asset[];
}

const assetKeys = {
    all: ["assetsdata"] as const,
    list: (filters: AssetFilters) => [...assetKeys.all, "list", filters] as const,
    single: (id: string) => [...assetKeys.all, "single", id] as const,
    create: () => [...assetKeys.all, "create"] as const,
    approve: (id: string, approvalStatus: string) =>
        [...assetKeys.all, "approve", id, approvalStatus] as const,
    upload: () => [...assetKeys.all, "upload"] as const,
} as const;

const assetsAPI = {
    getAll: async (filters: AssetFilters): Promise<AssetsResponse> => {
        const body = {
            name: filters.name ?? "",
            serialNumber: filters.serialNumber ?? "",
            clientBranchId: filters.clientBranchId ?? "",
            purchaseDate: filters.purchaseDate ?? null,
            fiscalYear: filters.fiscalYear ?? "",
            usefulLife: filters.usefulLife ?? null,
            approvalStatus: filters.approvalStatus ?? "",
            pageNumber: filters.pageNumber ?? 1,
            pageSize: filters.pageSize ?? 100,
        };
        const { data } = await API.post<AssetsResponse>(
            API_ENDPOINTS.ASSETS.LIST,
            body,
        );
        return data;
    },
    single: async (id: string): Promise<AssetSingleResponse> => {
        const { data } = await API.get<AssetSingleResponse>(
            API_ENDPOINTS.ASSETS.SINGLE(id),
        );
        return data;
    },
    create: async (payload: CreateAssetInput): Promise<Asset> => {
        const { data } = await API.post<Asset>(
            API_ENDPOINTS.ASSETS.CREATE,
            payload,
        );
        return data;
    },
    approve: async (
        id: string,
        approvalStatus: string,
        approvalMessage?: string,
    ): Promise<Asset> => {
        const { data } = await API.post<Asset>(API_ENDPOINTS.ASSETS.APPROVE, {
            id,
            approvalStatus,
            approvalMessage: approvalMessage,
        });
        return data;
    },
    upload: async (excelFile: File): Promise<void> => {
        const formData = new FormData();
        formData.append("excelFile", excelFile);
        await API.post(API_ENDPOINTS.ASSETS.BULK, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export const useAssets = (
    filters: AssetFilters,
    options?: { enabled?: boolean },
) => {
    return useQuery<AssetsResponse>({
        queryKey: assetKeys.list(filters),
        queryFn: () => assetsAPI.getAll(filters),
        meta: { errorMessage: "Failed to fetch assets" },
        enabled: options?.enabled ?? true,
    });
};

export const useAssetSingle = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<AssetSingleResponse>({
        queryKey: assetKeys.single(id),
        queryFn: () => assetsAPI.single(id),
        meta: { errorMessage: "Failed to fetch asset" },
        enabled: options?.enabled ?? true,
    });
};

export const useCreateAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: assetsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assetKeys.all });
        },
        meta: { errorMessage: "Failed to create asset" },
    });
};

export const useApproveAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            approvalStatus,
            approvalMessage,
        }: {
            id: string;
            approvalStatus: string;
            approvalMessage?: string;
        }) => assetsAPI.approve(id, approvalStatus, approvalMessage || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assetKeys.all });
        },
        meta: { errorMessage: "Failed to approve asset" },
    });
};

const useUploadAssets = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (excelFile: File) => assetsAPI.upload(excelFile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assetKeys.all });
        },
        meta: { errorMessage: "Failed to upload assets" },
    });
};
export const ASSETSAPI = {
    useAssets,
    useCreateAsset,
    useAssetSingle,
    useApproveAsset,
    useUploadAssets,
} as const;