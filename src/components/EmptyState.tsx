import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { EmptyStateType } from "../types/task.types";
import { COLORS, SPACING, TYPOGRAPHY } from "../config/theme";

interface EmptyStateProps {
  type: EmptyStateType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const getContent = () => {
    switch (type) {
      case "new":
        return {
          icon: "inbox",
          title: "All clear",
          subtitle: "No new tasks at the moment",
        };
      case "missed":
        return {
          icon: "check-circle",
          title: "Great job",
          subtitle: "You haven't missed any tasks",
        };
      case "expired":
        return {
          icon: "archive",
          title: "Nothing here",
          subtitle: "No expired tasks to show",
        };
      case "pending":
        return {
          icon: "send",
          title: "No pending tasks",
          subtitle: "Tasks waiting for response will appear here",
        };
      case "inProgress":
        return {
          icon: "activity",
          title: "No active tasks",
          subtitle: "Accepted tasks being worked on will show here",
        };
      case "closed":
        return {
          icon: "archive",
          title: "No closed tasks",
          subtitle: "Completed and expired tasks will appear here",
        };
      default:
        return {
          icon: "inbox",
          title: "No tasks",
          subtitle: "No tasks to display",
        };
    }
  };

  const content = getContent();

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Feather
          name={content.icon as any}
          size={40}
          color={COLORS.borderLight}
        />
      </View>
      <Text style={styles.emptyTitle}>{content.title}</Text>
      <Text style={styles.emptySubtitle}>{content.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.tertiary,
    fontWeight: "400",
    letterSpacing: 0.1,
  },
});
