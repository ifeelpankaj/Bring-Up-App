import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../../config/theme";

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  isDangerous?: boolean;
}

export const ProfileMenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  isDangerous = false,
}) => {
  const iconColor = isDangerous ? COLORS.error : COLORS.secondary;
  const iconBgColor = isDangerous
    ? `${COLORS.error}15`
    : `${COLORS.secondary}15`;

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[styles.menuItemText, isDangerous && styles.dangerousText]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Feather name="chevron-right" size={20} color={COLORS.text.light} />
      )}
    </TouchableOpacity>
  );
};

interface MenuSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const ProfileMenuSection: React.FC<MenuSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.menuContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    fontWeight: "600",
  },
  dangerousText: {
    color: COLORS.error,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.tertiary,
    marginTop: 2,
  },
});
