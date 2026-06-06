import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { useColorScheme, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

type AppInputProps = {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad";
  rules?: object;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
};

const AppInput = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  rules,
  disabled = false,
  leftIcon,
  rightIcon,
}: AppInputProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-4">
          <TextInput
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={hidePassword}
            keyboardType={keyboardType}
            disabled={disabled}
            autoCapitalize="none"
            outlineColor={isDark ? "#393a3c" : "#e4e7ec"}
            activeOutlineColor="#00829b"
            textColor={isDark ? "#f9fafb" : "#0f172a"}
            placeholderTextColor={isDark ? "#9ca3af" : "#94a3b8"}
            left={
              leftIcon ? (
                <TextInput.Icon icon={leftIcon} color="#00829b" />
              ) : undefined
            }
            right={
              secureTextEntry ? (
                <TextInput.Icon
                  icon={hidePassword ? "eye-off-outline" : "eye-outline"}
                  color="#00829b"
                  onPress={() => setHidePassword((prev) => !prev)}
                />
              ) : rightIcon ? (
                <TextInput.Icon icon={rightIcon} color="#00829b" />
              ) : undefined
            }
            theme={{
              dark: isDark,
              colors: {
                primary: "#00829b",
                background: isDark ? "#111827" : "#ffffff",
                text: isDark ? "#f9fafb" : "#0f172a",
                placeholder: isDark ? "#9ca3af" : "#94a3b8",
                outline: isDark ? "#393a3c" : "#e4e7ec",
                error: "#ef4444",
                onSurfaceVariant: isDark ? "#d1d5db" : "#475569",
              },
              roundness: 16,
            }}
            style={{
              backgroundColor: isDark ? "#1a2234" : "#ffffff",
            }}
            contentStyle={{
              paddingVertical: 8,
            }}
          />

          <HelperText
            type="error"
            visible={!!error}
            style={{
              color: "#ef4444",
            }}
          >
            {error?.message}
          </HelperText>
        </View>
      )}
    />
  );
};

export default AppInput;