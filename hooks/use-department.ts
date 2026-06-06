import { DEPARTMENTSAPI } from "@/api/departments";
import { useToast } from "expo-toast";

interface UseDepartmentHandlerOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

type CreateDepartmentPayload = {
  name: string;
  code: string;
};

type EditDepartmentPayload = {
  id: string;
  name: string;
  code: string;
};

export const useCreateDepartmentHandler = (options?: UseDepartmentHandlerOptions) => {
  const toast = useToast();

  const { mutate: createDepartment, isPending } = DEPARTMENTSAPI.useCreateDepartments();
  const { mutate: editDepartment, isPending: isEditPending } = DEPARTMENTSAPI.useEditDepartment();

  const handleCreateDepartment = (payload: CreateDepartmentPayload) => {
    createDepartment(payload, {
      onSuccess: (response) => {
        toast.show(response?.message ?? "Department created successfully");
        options?.onSuccess?.();
      },
      onError: (error) => {
        console.log(error)
        toast.show("Failed to create department");
        options?.onError?.();
      },
    });
  };

  const handleEditDepartment = (payload: EditDepartmentPayload) => {
    editDepartment(payload, {
      onSuccess: (response) => {
        toast.show(response?.message ?? "Department updated successfully");
        options?.onSuccess?.();
      },
      onError: () => {
        toast.show("Failed to update department");
        options?.onError?.();
      },
    });
  };

  return {
    handleCreateDepartment,
    handleEditDepartment,
    isPending,
    isEditPending,
  };
};
