import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../../config/theme";

interface StatItemProps {
  value: number;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, icon, color }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconWrapper, { backgroundColor: `${color}15` }]}>
      <Feather name={icon} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface ProfileStatsProps {
  completedTasks: number;
  createdTasks: number;
  inProgressTasks: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  completedTasks,
  createdTasks,
  inProgressTasks,
}) => {
  return (
    <View style={[styles.statsContainer, SHADOWS.sm]}>
      <StatItem
        value={completedTasks}
        label="Completed"
        icon="check-circle"
        color={COLORS.success}
      />
      <View style={styles.statDivider} />
      <StatItem
        value={createdTasks}
        label="Created"
        icon="plus-circle"
        color={COLORS.secondary}
      />
      <View style={styles.statDivider} />
      <StatItem
        value={inProgressTasks}
        label="Active"
        icon="clock"
        color={COLORS.info}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: -SPACING.xxl,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.tertiary,
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: COLORS.borderLight,
  },
});
