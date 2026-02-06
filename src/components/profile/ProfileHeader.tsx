import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { COLORS, SPACING, TYPOGRAPHY } from "../../config/theme";

interface ProfileHeaderProps {
  name: string;
  email: string;
  initials: string;
  joinedDate: string;
  scaleAnim: Animated.Value;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  initials,
  joinedDate,
  scaleAnim,
}) => {
  return (
    <LinearGradient
      colors={COLORS.gradient.secondary}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[styles.avatarContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </Animated.View>

      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userEmail}>{email}</Text>

      <View style={styles.joinedContainer}>
        <Feather name="calendar" size={14} color={COLORS.text.white} />
        <Text style={styles.joinedText}>Joined {joinedDate}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 70,
    paddingBottom: SPACING.xxxl,
    alignItems: "center",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: COLORS.text.white,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: "700",
    color: COLORS.text.white,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: SPACING.lg,
    fontWeight: "500",
  },
  joinedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  joinedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
});
