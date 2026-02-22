// import { Tabs } from "expo-router";
// import React from "react";
// import { View, StyleSheet } from "react-native";
// import Feather from "@expo/vector-icons/Feather";

// import Ionicons from "@expo/vector-icons/Ionicons";
// import { LinearGradient } from "expo-linear-gradient";
// import {
//   COLORS,
//   SPACING,
//   BORDER_RADIUS,
//   SHADOWS,
//   PLATFORM_STYLES,
// } from "../../config/theme";
// import { SafeAreaView } from "react-native-safe-area-context";
// export default function TabLayout() {
//   return (
//     <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
//       <Tabs
//         screenOptions={{
//           headerShown: false,
//           tabBarActiveTintColor: COLORS.secondary,
//           tabBarInactiveTintColor: COLORS.text.light,
//           tabBarStyle: {
//             backgroundColor: COLORS.surface,
//             borderTopWidth: 0,
//             ...SHADOWS.lg,
//             height: PLATFORM_STYLES.tabBarHeight,
//             paddingBottom: PLATFORM_STYLES.tabBarPadding,
//             paddingTop: SPACING.sm,
//             borderTopLeftRadius: BORDER_RADIUS.xxl,
//             borderTopRightRadius: BORDER_RADIUS.xxl,
//             position: "absolute",
//             left: 0,
//             right: 0,
//             bottom: 0,
//           },
//           tabBarLabelStyle: {
//             fontSize: 11,
//             fontWeight: "600",
//             marginTop: 2,
//           },
//           tabBarItemStyle: {
//             paddingTop: SPACING.xs,
//           },
//         }}
//       >
//         <Tabs.Screen
//           name="assigned"
//           options={{
//             title: "Inbox",
//             tabBarIcon: ({ color, focused }) => (
//               <View style={[styles.iconWrapper, focused && styles.iconActive]}>
//                 <Feather name="inbox" size={22} color={color} />
//               </View>
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="created"
//           options={{
//             title: "Outbox",
//             tabBarIcon: ({ color, focused }) => (
//               <View style={[styles.iconWrapper, focused && styles.iconActive]}>
//                 <Feather name="send" size={22} color={color} />
//               </View>
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="create"
//           options={{
//             title: "",
//             tabBarIcon: () => (
//               <View style={styles.fabContainer}>
//                 <LinearGradient
//                   colors={COLORS.gradient.fab}
//                   style={styles.fab}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                 >
//                   <Feather name="plus" size={26} color={COLORS.text.white} />
//                 </LinearGradient>
//               </View>
//             ),
//             tabBarLabel: () => null,
//           }}
//         />

//         <Tabs.Screen
//           name="notifications"
//           options={{
//             title: "Alerts",
//             tabBarIcon: ({ color, focused }) => (
//               <View style={[styles.iconWrapper, focused && styles.iconActive]}>
//                 <Ionicons
//                   name="notifications-outline"
//                   size={22}
//                   color={color}
//                 />
//               </View>
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="profile"
//           options={{
//             title: "Profile",
//             tabBarIcon: ({ color, focused }) => (
//               <View style={[styles.iconWrapper, focused && styles.iconActive]}>
//                 <Feather name="user" size={22} color={color} />
//               </View>
//             ),
//           }}
//         />
//       </Tabs>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   iconWrapper: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//   },
//   iconActive: {
//     backgroundColor: `${COLORS.secondary}15`,
//   },
//   fabContainer: {
//     width: 56,
//     height: 56,
//     marginTop: -24,
//     ...SHADOWS.secondary,
//   },
//   fab: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 3,
//     borderColor: COLORS.surface,
//   },
// });
import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  PLATFORM_STYLES,
} from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.secondary, // vivid orange
          tabBarInactiveTintColor: COLORS.text.tertiary,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopWidth: 0,
            height: PLATFORM_STYLES.tabBarHeight,
            paddingBottom: PLATFORM_STYLES.tabBarPadding,
            paddingTop: SPACING.xs,
            // Floating island — tight margins, heavy rounding
            marginHorizontal: SPACING.xl,
            marginBottom: SPACING.lg,
            borderRadius: 32,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            // Warm orange-tinted shadow
            shadowColor: COLORS.secondary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 20,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            letterSpacing: 0.3,
            marginTop: 1,
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
              <TabIcon focused={focused}>
                <Feather name="inbox" size={20} color={color} />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="created"
          options={{
            title: "Outbox",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Feather name="send" size={20} color={color} />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "",
            tabBarIcon: () => <FabButton />,
            tabBarLabel: () => null,
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Ionicons
                  name={focused ? "notifications" : "notifications-outline"}
                  size={20}
                  color={color}
                />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon focused={focused}>
                <Feather name="user" size={20} color={color} />
              </TabIcon>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

// ── Tab Icon — warm orange pill + dot when active ───────────
function TabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activePill} />}
      {children}
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// ── FAB — glassy orange orb with depth ─────────────────────
function FabButton() {
  return (
    <View style={styles.fabOuter}>
      <View style={styles.fabGlow} />
      <LinearGradient
        colors={[COLORS.secondaryLight, COLORS.secondary, COLORS.secondaryDark]}
        style={styles.fab}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        {/* Top-left glass highlight arc */}

        <Feather name="plus" size={22} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 38,
    position: "relative",
  },
  // Soft warm pill — orange at ~8% opacity
  activePill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 6,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.secondary}14`,
  },
  // Tiny warm dot below icon — premium positional signal
  activeDot: {
    position: "absolute",
    bottom: 0,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.secondary,
  },

  // FAB lifts above bar
  fabOuter: {
    width: 54,
    height: 54,
    marginTop: -22,
    alignItems: "center",
    justifyContent: "center",
  },
  // Soft ambient bloom
  fabGlow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: `${COLORS.secondary}1E`,
  },
  // Gradient orb
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.surface,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.secondaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: { elevation: 18 },
    }),
  },
  // Top-left glass arc — gives orb a 3D sphere feel
  fabInnerRing: {
    position: "absolute",
    top: 7,
    left: 7,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.40)",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },
});
