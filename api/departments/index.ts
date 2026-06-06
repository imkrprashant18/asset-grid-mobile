import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import API from "@/config/reques";
import API_ENDPOINTS from "@/lib/endpoints";
import type { DepartmentFormData } from "@/lib/validationSchema";

const departmentsKeys = {
    all: ["departments"] as const,
    list: () => [...departmentsKeys.all, "list"] as const,
} as const;

const departmentsAPI = {
    list: async (params?: { name?: string; code?: string }) => {
        const res = await API.post(API_ENDPOINTS.DEPARTMENTS.LIST, {
            name: params?.name ?? "",
            code: params?.code ?? "",
        });

        // handle both: array response OR wrapped response { data: [...] }
        return res.data?.data ?? res.data;
    },

    create: async (payload: DepartmentFormData) => {
        const { data } = await API.post(API_ENDPOINTS.DEPARTMENTS.CREATE, payload);
        console.log(data)
        return data;
    },

    single: async (id: string) => {
        const { data } = await API.get(API_ENDPOINTS.DEPARTMENTS.SINGLE(id));
        return data;
    },

    edit: async (payload: DepartmentFormData & { id: string }) => {
        const { id, ...body } = payload;
        const { data } = await API.put(API_ENDPOINTS.DEPARTMENTS.SINGLE(id), body);
        return data;
    },
} as const;

export const useGetDepartments = (
    params?: { name?: string; code?: string },
    options?: { enabled?: boolean },
) => {
    return useQuery({
        queryKey: [...departmentsKeys.list(), params],
        queryFn: () => departmentsAPI.list(params),
        enabled: options?.enabled ?? true,
    });
};

export const useCreateDepartments = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: departmentsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentsKeys.all });
        },
        meta: {
            successMessage: "Department created successfully",
            errorMessage: "Department creation failed",
        },
    });
};

export const useGetSingleDepartment = (
    id: string,
    options?: { enabled?: boolean },
) => {
    return useQuery({
        queryKey: ["departments", id],
        queryFn: () => departmentsAPI.single(id),
        enabled: options?.enabled ?? true,
    });
};

export const useEditDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: departmentsAPI.edit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentsKeys.all });
        },
        meta: {
            successMessage: "Department updated successfully",
            errorMessage: "Department update failed",
        },
    });
};

export const DEPARTMENTSAPI = {
    useGetDepartments,
    useCreateDepartments,
    useGetSingleDepartment,
    useEditDepartment,
} as const;