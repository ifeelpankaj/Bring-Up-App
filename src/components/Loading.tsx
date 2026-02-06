import React, { useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ViewStyle,
  Text,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SPACING, BORDER_RADIUS, TEXT_STYLES } from "../config/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = COLORS.secondary,
  text,
  fullScreen = false,
}) => {
  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.inlineContainer;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.loadingText}>{text}</Text>}
    </View>
  );
};

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = BORDER_RADIUS.sm,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

interface TaskCardSkeletonProps {
  count?: number;
}

export const TaskCardSkeleton: React.FC<TaskCardSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <View style={styles.skeletonListContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.taskCardSkeleton}>
          <View style={styles.skeletonHeader}>
            <Skeleton width={48} height={48} borderRadius={24} />
            <View style={styles.skeletonHeaderText}>
              <Skeleton width="60%" height={16} style={styles.skeletonMargin} />
              <Skeleton width="40%" height={12} />
            </View>
            <Skeleton width={70} height={24} borderRadius={8} />
          </View>
          <Skeleton width="90%" height={18} style={styles.skeletonMargin} />
          <Skeleton width="70%" height={14} />
        </View>
      ))}
    </View>
  );
};

export const LoadingOverlay: React.FC<{ visible: boolean; text?: string }> = ({
  visible,
  text = "Loading...",
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.overlayText}>{text}</Text>
      </View>
    </View>
  );
};

export const ScreenLoader: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => {
  return (
    <View style={styles.screenLoader}>
      <ActivityIndicator size="large" color={COLORS.secondary} />
      <Text style={styles.screenLoaderText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  inlineContainer: {
    padding: SPACING.xxl,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...TEXT_STYLES.bodySmall,
    marginTop: SPACING.md,
    color: COLORS.text.secondary,
  },
  skeleton: {
    backgroundColor: COLORS.borderLight,
    overflow: "hidden",
  },
  shimmer: {
    width: 200,
    height: "100%",
    position: "absolute",
  },
  skeletonListContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.md,
  },
  taskCardSkeleton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  skeletonHeaderText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  skeletonMargin: {
    marginBottom: SPACING.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay.medium,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    minWidth: 150,
  },
  overlayText: {
    ...TEXT_STYLES.body,
    marginTop: SPACING.md,
    color: COLORS.text.primary,
  },
  screenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    gap: SPACING.lg,
  },
  screenLoaderText: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
  },
});
