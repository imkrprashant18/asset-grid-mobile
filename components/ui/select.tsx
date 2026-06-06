import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { HelperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type Option = { label: string; value: string };

type AppSelectProps = {
  control: any;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
};

const AppSelect = ({ control, name, label, options, placeholder, leftIcon }: AppSelectProps) => {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bg = isDark ? "#1a2234" : "#ffffff";
  const border = isDark ? "#393a3c" : "#e4e7ec";
  const textColor = isDark ? "#f9fafb" : "#0f172a";
  const placeholderColor = isDark ? "#9ca3af" : "#94a3b8";
  const modalBg = isDark ? "#111827" : "#f1f5f9";
  const itemBg = isDark ? "#1e293b" : "#ffffff";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === value);

        return (
          <View className="mb-4">
            <Text style={{ fontSize: 12, color: isDark ? "#d1d5db" : "#475569", marginBottom: 4, marginLeft: 4 }}>
              {label}
            </Text>

            <TouchableOpacity
              onPress={() => setOpen(true)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: error ? "#ef4444" : border,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 14,
                gap: 10,
              }}
            >
              {leftIcon && <Ionicons name={leftIcon} size={20} color="#00829b" />}
              <Text style={{ flex: 1, color: selected ? textColor : placeholderColor, fontSize: 14 }}>
                {selected ? selected.label : (placeholder ?? `Select ${label}`)}
              </Text>
              <Ionicons name="chevron-down" size={18} color={placeholderColor} />
            </TouchableOpacity>

            <HelperText type="error" visible={!!error} style={{ color: "#ef4444" }}>
              {error?.message}
            </HelperText>

            <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
              <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setOpen(false)} />
              <View style={{ backgroundColor: modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16, paddingBottom: 40, maxHeight: "60%" }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: textColor }}>{label}</Text>
                  <TouchableOpacity onPress={() => setOpen(false)}>
                    <Ionicons name="close" size={22} color={textColor} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => {
                    const isSelected = item.value === value;
                    return (
                      <TouchableOpacity
                        onPress={() => { onChange(item.value); setOpen(false); }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: itemBg,
                          marginHorizontal: 16,
                          marginBottom: 8,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          borderWidth: isSelected ? 1.5 : 0,
                          borderColor: isSelected ? "#00829b" : "transparent",
                        }}
                      >
                        <Text style={{ color: isSelected ? "#00829b" : textColor, fontWeight: isSelected ? "600" : "400", fontSize: 14 }}>
                          {item.label}
                        </Text>
                        {isSelected && <Ionicons name="checkmark-circle" size={18} color="#00829b" />}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default AppSelect;
