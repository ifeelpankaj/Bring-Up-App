import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  PLATFORM_STYLES,
} from "../../config/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.text.light,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          ...SHADOWS.lg,
          height: PLATFORM_STYLES.tabBarHeight,
          paddingBottom: PLATFORM_STYLES.tabBarPadding,
          paddingTop: SPACING.sm,
          borderTopLeftRadius: BORDER_RADIUS.xxl,
          borderTopRightRadius: BORDER_RADIUS.xxl,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: SPACING.xs,
        },
      }}
    >
      <Tabs.Screen
        name="assigned"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Feather name="inbox" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="created"
        options={{
          title: "Outbox",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Feather name="send" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <LinearGradient
                colors={COLORS.gradient.fab}
                style={styles.fab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="plus" size={26} color={COLORS.text.white} />
              </LinearGradient>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Ionicons name="notifications-outline" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Feather name="user" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  iconActive: {
    backgroundColor: `${COLORS.secondary}15`,
  },
  fabContainer: {
    width: 56,
    height: 56,
    marginTop: -24,
    ...SHADOWS.secondary,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
});
