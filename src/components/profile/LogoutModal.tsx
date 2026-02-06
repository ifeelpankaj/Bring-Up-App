import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../../config/theme";

interface LogoutModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <Pressable style={styles.overlay} onPress={onCancel}>
      <Pressable style={styles.content} onPress={() => {}}>
        <View style={styles.iconContainer}>
          <Feather name="log-out" size={28} color={COLORS.error} />
        </View>
        <Text style={styles.title}>Logout</Text>
        <Text style={styles.message}>
          Are you sure you want to logout from your account?
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    width: "85%",
    maxWidth: 320,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.error}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: "row",
    gap: SPACING.md,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.backgroundDark,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
  logoutButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.white,
  },
});
