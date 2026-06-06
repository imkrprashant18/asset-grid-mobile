import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
};

const variantStyles = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  outline: "bg-transparent border border-primary",
  danger: "bg-red-500",
};

const textStyles = {
  primary: "text-white",
  secondary: "text-primary",
  outline: "text-primary",
  danger: "text-white",
};

const AppButton = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  textClassName = "",
}: AppButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      className={`
        py-4 rounded-2xl items-center justify-center
        ${variantStyles[variant]}
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className={`
            font-semibold text-base
            ${textStyles[variant]}
            ${textClassName}
          `}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;