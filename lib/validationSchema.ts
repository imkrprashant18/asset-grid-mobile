import z from "zod";



export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;



export const assetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  serialNumber: z.string(),
  categoryId: z.string().min(1, "Category is required"),
  departmentId: z.string().min(1, "Department is required"),
  clientBranchId: z.string().min(1, "Branch is required"),
  fiscalYearId: z.string().optional(),
  usefulLife: z.coerce.number().min(0, "Useful life cannot be negative"),
  imageUrl: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;


export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Department name is required"),
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(2, "Code cannot be more than 2 characters")
    .regex(/^[A-Za-z0-9]{1,2}$/, "Code must be letters or numbers only"),
});
export type DepartmentFormData = z.infer<typeof departmentSchema>;