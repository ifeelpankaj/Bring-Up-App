import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../config/theme";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

/**
 * Reusable avatar component showing user initials
 */
export const Avatar: React.FC<AvatarProps> = ({ name, size = "md", style }) => {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const sizeStyles = SIZES[size];

  return (
    <View style={[styles.avatar, sizeStyles.container, style]}>
      <Text style={[styles.avatarText, sizeStyles.text]}>{initial}</Text>
    </View>
  );
};

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  style?: ViewStyle;
}

/**
 * Reusable badge component for status indicators
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  style,
}) => {
  const variantStyles = BADGE_VARIANTS[variant];

  return (
    <View style={[styles.badge, variantStyles.container, style]}>
      <Text style={[styles.badgeText, variantStyles.text]}>{label}</Text>
    </View>
  );
};

interface IconButtonProps {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Reusable icon button component
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = COLORS.text.secondary,
  style,
}) => {
  return (
    <View style={[styles.iconButton, style]}>
      <Feather name={icon} size={size} color={color} onPress={onPress} />
    </View>
  );
};

interface MetaRowProps {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  iconColor?: string;
  textColor?: string;
}

/**
 * Reusable meta info row with icon
 */
export const MetaRow: React.FC<MetaRowProps> = ({
  icon,
  text,
  iconColor = COLORS.text.light,
  textColor = COLORS.text.secondary,
}) => {
  return (
    <View style={styles.metaRow}>
      <Feather name={icon} size={14} color={iconColor} />
      <Text style={[styles.metaText, { color: textColor }]}>{text}</Text>
    </View>
  );
};

interface DividerProps {
  style?: ViewStyle;
}

/**
 * Horizontal divider line
 */
export const Divider: React.FC<DividerProps> = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

// Size configurations for Avatar
const SIZES = {
  sm: {
    container: { width: 32, height: 32, borderRadius: 16 },
    text: { fontSize: 12 },
  },
  md: {
    container: { width: 40, height: 40, borderRadius: 20 },
    text: { fontSize: 16 },
  },
  lg: {
    container: { width: 56, height: 56, borderRadius: 28 },
    text: { fontSize: 22 },
  },
};

// Badge variant configurations
const BADGE_VARIANTS = {
  default: {
    container: { backgroundColor: COLORS.surface },
    text: { color: COLORS.text.secondary },
  },
  success: {
    container: { backgroundColor: `${COLORS.success}20` },
    text: { color: COLORS.success },
  },
  warning: {
    container: { backgroundColor: `${COLORS.warning}20` },
    text: { color: COLORS.warning },
  },
  error: {
    container: { backgroundColor: `${COLORS.error}20` },
    text: { color: COLORS.error },
  },
  info: {
    container: { backgroundColor: `${COLORS.accent}20` },
    text: { color: COLORS.accent },
  },
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  iconButton: {
    padding: SPACING.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
});

export default {
  Avatar,
  Badge,
  IconButton,
  MetaRow,
  Divider,
};
