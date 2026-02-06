import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../config/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;
  const variantStyles = VARIANTS[variant];
  const sizeStyles = SIZES[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : (
        <Text
          style={[styles.text, sizeStyles.text, variantStyles.text, textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const VARIANTS = {
  primary: {
    container: { backgroundColor: COLORS.accent },
    text: { color: COLORS.text.white },
  },
  secondary: {
    container: {
      backgroundColor: COLORS.background,
      borderWidth: 1.5,
      borderColor: COLORS.border,
    },
    text: { color: COLORS.text.secondary },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: COLORS.accent,
    },
    text: { color: COLORS.accent },
  },
  danger: {
    container: { backgroundColor: COLORS.error },
    text: { color: COLORS.text.white },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: COLORS.accent },
  },
};

const SIZES = {
  sm: {
    container: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md },
    text: { fontSize: TYPOGRAPHY.fontSize.sm },
  },
  md: {
    container: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg },
    text: { fontSize: TYPOGRAPHY.fontSize.md },
  },
  lg: {
    container: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
    text: { fontSize: TYPOGRAPHY.fontSize.lg },
  },
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
