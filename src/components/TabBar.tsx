import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../config/theme";

interface Tab<T = string> {
  key: T;
  title: string;
  count: number;
}

interface TabBarProps<T = string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabPress: (tab: T) => void;
}

export const TabBar = <T extends string>({
  tabs,
  activeTab,
  onTabPress,
}: TabBarProps<T>) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.title}
            </Text>
            {tab.count > 0 && (
              <View
                style={[styles.tabBadge, isActive && styles.tabBadgeActive]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    isActive && styles.tabBadgeTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  tabActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "500",
    color: COLORS.text.secondary,
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: COLORS.text.white,
    fontWeight: "600",
  },
  tabBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
  },
  tabBadgeActive: {
    backgroundColor: COLORS.text.white,
  },
  tabBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.white,
  },
  tabBadgeTextActive: {
    color: COLORS.secondary,
  },
});
