import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppButton from "@/components/ui/buttons";
import AppInput from "@/components/ui/input";
import { DEPARTMENTSAPI } from "@/api/departments";
import { useCreateDepartmentHandler } from "@/hooks/use-department";
import { useRefreshAll } from "@/hooks/use-refresh-all";
import { departmentSchema, type DepartmentFormData } from "@/lib/validationSchema";

const DepartmentItem = ({
  item,
  onEdit,
}: {
  item: { id: string; name: string; code: string };
  onEdit: (item: { id: string; name: string; code: string }) => void;
}) => (
  <View className="flex-row items-center justify-between px-4 py-3 mb-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
    <View>
      <Text className="text-sm font-semibold text-foreground dark:text-white">{item.name}</Text>
      <Text className="text-xs text-gray-400 mt-0.5">Code: {item.code}</Text>
    </View>
    <View className="flex-row items-center gap-2">
      <View className="bg-primary/10 px-3 py-1 rounded-full">
        <Text className="text-xs font-bold text-primary">{item.code}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onEdit(item)}
        className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
      >
        <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">Edit</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const List = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{ id: string; name: string; code: string } | null>(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => { setModalVisible(false); setSelectedDepartment(null); form.reset({ name: "", code: "" }); };

  const openEditModal = (item: { id: string; name: string; code: string }) => {
    setSelectedDepartment(item);
    form.reset({ id: item.id, name: item.name, code: item.code });
    setModalVisible(true);
  };

  const { data: departments, isLoading, isError } = DEPARTMENTSAPI.useGetDepartments();
  const { refreshing, onRefresh } = useRefreshAll();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: "", code: "" },
  });

  const { handleCreateDepartment: handleCreate, handleEditDepartment: handleEdit, isPending, isEditPending } = useCreateDepartmentHandler({
    onSuccess: () => { closeModal(); },
  });

  const handleSubmit = (data: DepartmentFormData) => {
    if (selectedDepartment) {
      handleEdit({ id: selectedDepartment.id, name: data.name, code: data.code });
    } else {
      handleCreate(data);
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-4 pt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-foreground dark:text-white">Departments</Text>
        <TouchableOpacity
          onPress={openModal}
          className="bg-primary px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold text-sm">+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#00829b" className="mt-10" />
      ) : isError ? (
        <Text className="text-center text-red-500 mt-10">Failed to load departments.</Text>
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DepartmentItem item={item} onEdit={openEditModal} />}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-10">No departments found.</Text>
          }
          onRefresh={onRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-900 rounded-t-3xl px-6 pt-6 pb-10">
            <Text className="text-lg font-bold text-foreground dark:text-white mb-4">
              {selectedDepartment ? "Edit Department" : "New Department"}
            </Text>

            <AppInput
              control={form.control}
              name="name"
              label="Department Name"
              placeholder="e.g. Finance"
              leftIcon="office-building-outline"
            />
            <AppInput
              control={form.control}
              name="code"
              label="Code"
              placeholder="e.g. FN"
              leftIcon="tag-outline"
            />

            <AppButton
              title={selectedDepartment ? "Update Department" : "Create Department"}
              onPress={form.handleSubmit(handleSubmit)}
              loading={selectedDepartment ? isEditPending : isPending}
              className="mt-2"
            />
            <AppButton
              title="Cancel"
              onPress={closeModal}
              variant="outline"
              className="mt-3"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default List;
