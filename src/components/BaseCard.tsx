import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  PressableProps,
} from "react-native";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../config/theme";

interface BaseCardProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "inactive" | "highlighted";
  onPress?: () => void;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  style,
  variant = "default",
  onPress,
  ...pressableProps
}) => {
  const cardStyles = [
    styles.card,
    variant === "inactive" && styles.cardInactive,
    variant === "highlighted" && styles.cardHighlighted,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={cardStyles}
        onPress={onPress}
        android_ripple={{ color: "rgba(0,0,0,0.05)" }}
        {...pressableProps}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardInactive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
    borderColor: `${COLORS.border}80`,
  },
  cardHighlighted: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
});

export default BaseCard;
