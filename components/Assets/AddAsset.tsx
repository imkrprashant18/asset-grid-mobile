import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppInput from "@/components/ui/input";
import AppSelect from "@/components/ui/select";
import AppButton from "@/components/ui/buttons";
import { assetSchema, type AssetFormData } from "@/lib/validationSchema";
import { ASSETSAPI } from "@/api/assets";
import { CATEGORIESAPI } from "@/api/categories";
import { BRANCHESAPI } from "@/api/branches";
import { FISCALYEARAPI } from "@/api/fiscalyear";
import { DEPARTMENTSAPI } from "@/api/departments";
import { useToast } from "expo-toast";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddAsset({ visible, onClose }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const toast = useToast();

  const { data: categories } = CATEGORIESAPI.useGetCategories();
  const { data: branches } = BRANCHESAPI.useGetBranches();
  const { data: fiscalYears } = FISCALYEARAPI.useGetFiscalYears();
  const { data: departments } = DEPARTMENTSAPI.useGetDepartments();

  const categoryOptions = (categories ?? []).map((c: any) => ({ label: c.name, value: c.id }));
  const branchOptions = (branches ?? []).map((b: any) => ({ label: b.name, value: b.id }));
  const fiscalYearOptions = (fiscalYears ?? []).map((f: any) => ({ label: f.name, value: f.id }));
  const departmentOptions = (departments ?? []).map((d: any) => ({ label: d.name, value: d.id }));

  const { mutate: createAsset, isPending } = ASSETSAPI.useCreateAsset();

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      categoryId: "",
      departmentId: "",
      clientBranchId: "",
      fiscalYearId: "",
      usefulLife: 0,
      imageUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data: AssetFormData) => {
    createAsset(data, {
      onSuccess: () => {
        toast.show("Asset created successfully");
        handleClose();
      },
      onError: () => {
        toast.show("Failed to create asset");
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />

        <View
          style={{
            backgroundColor: isDark ? "#111827" : "#ffffff",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: "92%",
          }}
        >
          {/* Handle bar */}
          <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: isDark ? "#374151" : "#e2e8f0" }} />
          </View>

          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: isDark ? "#f9fafb" : "#0f172a" }}>
              Add New Asset
            </Text>
            <TouchableOpacity onPress={handleClose} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={26} color={isDark ? "#6b7280" : "#94a3b8"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AppInput
              control={form.control}
              name="name"
              label="Asset Name"
              placeholder="e.g. MacBook Pro"
              leftIcon="cube-outline"
            />

            <AppInput
              control={form.control}
              name="serialNumber"
              label="Serial Number"
              placeholder="e.g. SN-001234"
              leftIcon="barcode-outline"
            />

            <AppSelect
              control={form.control}
              name="categoryId"
              label="Category"
              options={categoryOptions}
              placeholder="Select a category"
              leftIcon="pricetag-outline"
            />

            <AppSelect
              control={form.control}
              name="departmentId"
              label="Department"
              options={departmentOptions}
              placeholder="Select a department"
              leftIcon="business-outline"
            />

            <AppSelect
              control={form.control}
              name="clientBranchId"
              label="Branch"
              options={branchOptions}
              placeholder="Select a branch"
              leftIcon="git-branch-outline"
            />

            <AppSelect
              control={form.control}
              name="fiscalYearId"
              label="Fiscal Year"
              options={fiscalYearOptions}
              placeholder="Select fiscal year"
              leftIcon="calendar-outline"
            />

            <AppInput
              control={form.control}
              name="usefulLife"
              label="Useful Life (years)"
              placeholder="e.g. 5"
              keyboardType="numeric"
              leftIcon="time-outline"
            />

            <AppInput
              control={form.control}
              name="imageUrl"
              label="Image URL (optional)"
              placeholder="https://..."
              leftIcon="image-outline"
            />

            <AppButton
              title="Create Asset"
              onPress={form.handleSubmit(onSubmit)}
              loading={isPending}
              className="mt-2"
            />
            <AppButton
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              className="mt-3"
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
