import React from "react";
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  COLORS,
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../config/theme";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastIconConfig {
  name: keyof typeof Feather.glyphMap;
  color: string;
  bgColor: string;
}

const getIconConfig = (type: ToastType): ToastIconConfig => {
  switch (type) {
    case "success":
      return {
        name: "check-circle",
        color: COLORS.success,
        bgColor: COLORS.successLight,
      };
    case "error":
      return {
        name: "alert-circle",
        color: COLORS.error,
        bgColor: COLORS.errorLight,
      };
    case "warning":
      return {
        name: "alert-triangle",
        color: COLORS.warning,
        bgColor: COLORS.warningLight,
      };
    case "info":
    default:
      return {
        name: "info",
        color: COLORS.info,
        bgColor: COLORS.infoLight,
      };
  }
};

const CustomToast: React.FC<ToastConfigParams<{ type: ToastType }>> = (
  props,
) => {
  const type = (props.type as ToastType) || "info";
  const iconConfig = getIconConfig(type);
  const borderColor = iconConfig.color;

  return (
    <View style={[styles.container, { borderLeftColor: borderColor }]}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconConfig.bgColor }]}
      >
        <Feather name={iconConfig.name} size={20} color={iconConfig.color} />
      </View>
      <View style={styles.textContainer}>
        {props.text1 && <Text style={styles.title}>{props.text1}</Text>}
        {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
      </View>
    </View>
  );
};

const toastConfig: ToastConfig = {
  success: (props) => <CustomToast {...props} />,
  error: (props) => <CustomToast {...props} />,
  info: (props) => <CustomToast {...props} />,
  warning: (props) => <CustomToast {...props} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderLeftWidth: 4,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.lg,
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
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
});

export const ToastProvider = () => {
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={60}
      visibilityTime={3000}
    />
  );
};

export { Toast };
export default Toast;
