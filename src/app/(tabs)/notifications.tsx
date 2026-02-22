import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  RefreshControl,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../store/api/alert.api";
import { NotificationType } from "../../types";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  PLATFORM_STYLES,
  SHADOWS,
} from "../../config/theme";
import { FONTS } from "@/components/fonts";

// ── Time formatter ───────────────────────────────────────────
const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) return "";
  let date: Date;
  if (timestamp._seconds) date = new Date(timestamp._seconds * 1000);
  else if (timestamp.toDate) date = timestamp.toDate();
  else date = new Date(timestamp);

  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

// ── Notification type config ─────────────────────────────────
const getTypeConfig = (type: NotificationType | string) => {
  switch (type) {
    case NotificationType.TASK_ASSIGNED:
      return {
        icon: "inbox",
        colors: [COLORS.secondaryLight, COLORS.secondary] as [string, string],
      };
    case NotificationType.TASK_COMPLETED:
      return {
        icon: "check-circle",
        colors: [COLORS.success, COLORS.successDark] as [string, string],
      };
    case NotificationType.TASK_ACCEPTED:
      return {
        icon: "thumbs-up",
        colors: [COLORS.info, COLORS.infoDark] as [string, string],
      };
    case NotificationType.TASK_REJECTED:
      return {
        icon: "thumbs-down",
        colors: [COLORS.error, COLORS.errorDark] as [string, string],
      };
    case NotificationType.DEADLINE_APPROACHING:
      return {
        icon: "alert-circle",
        colors: [COLORS.warning, COLORS.warningDark] as [string, string],
      };
    case NotificationType.TASK_OVERDUE:
      return {
        icon: "alert-triangle",
        colors: [COLORS.error, COLORS.errorDark] as [string, string],
      };
    default:
      return {
        icon: "bell",
        colors: ["#A1A1AA", "#71717A"] as [string, string],
      };
  }
};

// ── Skeleton shimmer ─────────────────────────────────────────
function SkeletonBlock({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
}) {
  const shimmer = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.85],
  });

  let computedWidth: number | "auto" | `${number}%` = width as any;
  if (typeof width === "string" && width.endsWith("%")) {
    // Convert "100%" to template literal type
    computedWidth = `${parseFloat(width)}%` as `${number}%`;
  }

  return (
    <Animated.View
      style={{
        width: computedWidth,
        height,
        borderRadius,
        backgroundColor: `${COLORS.secondary}22`,
        opacity,
      }}
    />
  );
}

// ── Notification Card ────────────────────────────────────────
const NotificationCard = React.memo(
  ({
    notification,
    onPress,
    s,
  }: {
    notification: any;
    onPress: () => void;
    s: ReturnType<typeof makeStyles>;
  }) => {
    const { icon, colors } = getTypeConfig(notification.type);
    const isUnread = !notification.isRead;

    return (
      <TouchableOpacity
        style={[s.card, isUnread && s.cardUnread]}
        onPress={onPress}
        activeOpacity={0.72}
      >
        {isUnread && <View style={s.cardAccentEdge} />}
        <LinearGradient
          colors={colors}
          style={s.iconOrb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={icon as any} size={18} color="#FFF" />
        </LinearGradient>
        <View style={s.cardBody}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle} numberOfLines={1}>
              {notification.title}
            </Text>
            {isUnread && <View style={s.unreadDot} />}
          </View>
          <Text style={s.cardMessage} numberOfLines={2}>
            {notification.body}
          </Text>
          <Text style={s.cardTime}>
            {formatTimeAgo(notification.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

// ── Empty State ──────────────────────────────────────────────
const EmptyState = ({ s }: { s: ReturnType<typeof makeStyles> }) => {
  const scale = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 10,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={s.emptyContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={[COLORS.secondaryLight, COLORS.secondary]}
          style={s.emptyOrb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="bell-off" size={40} color="#FFF" />
        </LinearGradient>
      </Animated.View>
      <Text style={s.emptyTitle}>All Clear</Text>
      <Text style={s.emptySubtitle}>
        No notifications yet. You're fully caught up.
      </Text>
    </View>
  );
};

// ── Screen ───────────────────────────────────────────────────
export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const {
    data: notifications = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery({});

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsRead(id).unwrap();
      } catch {}
    },
    [markAsRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead().unwrap();
    } catch {}
  }, [markAllAsRead]);

  // Scroll-driven header animations — matches Inbox/Outbox
  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.82],
    extrapolate: "clamp",
  });
  const headerSubtitleOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const themedStyles = makeStyles(insets);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <NotificationCard
        notification={item}
        onPress={() => handleMarkAsRead(item.id)}
        s={themedStyles}
      />
    ),
    [handleMarkAsRead, themedStyles],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  // ── Skeleton loader ──────────────────────────────────────
  if (isLoading && notifications.length === 0) {
    return (
      <View style={themedStyles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
          translucent
        />
        <View
          style={[themedStyles.header, { paddingTop: insets.top + SPACING.lg }]}
        >
          <SkeletonBlock
            width={160}
            height={38}
            borderRadius={BORDER_RADIUS.md}
          />
          <View style={{ marginTop: SPACING.sm }}>
            <SkeletonBlock
              width={120}
              height={14}
              borderRadius={BORDER_RADIUS.sm}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: SPACING.xxl,
            marginTop: SPACING.xl,
            gap: SPACING.md,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock
              key={i}
              width="100%"
              height={88}
              borderRadius={BORDER_RADIUS.lg}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={themedStyles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent
      />

      {/* ── Header — identical structure to Inbox/Outbox ─────── */}
      <Animated.View
        style={[themedStyles.header, { paddingTop: insets.top + SPACING.lg }]}
      >
        <View style={themedStyles.headerRow}>
          {/* Same orange accent bar as Inbox & Outbox */}
          <View style={themedStyles.accentBar} />
          <Animated.View style={{ transform: [{ scale: headerTitleScale }] }}>
            <Text style={themedStyles.headerTitle}>ALERTS</Text>
          </Animated.View>
        </View>

        {/* Subtitle row — count pill + label */}
        <Animated.View
          style={[themedStyles.subtitleRow, { opacity: headerSubtitleOpacity }]}
        >
          <View style={themedStyles.countPill}>
            <LinearGradient
              colors={[COLORS.secondaryLight, COLORS.secondary]}
              style={themedStyles.countPillGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={themedStyles.countPillText}>{unreadCount}</Text>
            </LinearGradient>
          </View>
          <Text style={themedStyles.headerSubtitle}>
            {unreadCount === 0
              ? "all caught up"
              : `unread ${unreadCount === 1 ? "notification" : "notifications"}`}
          </Text>

          {/* Mark all read — right-aligned, subtle */}
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={themedStyles.markAllBtn}
              activeOpacity={0.7}
            >
              <Text style={themedStyles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>

      {/* ── List ─────────────────────────────────────────────── */}
      <Animated.FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={themedStyles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState s={themedStyles} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
      />
    </View>
  );
}

// ── All styles in one place — no orphaned `styles` reference ─
const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    // ── Screen
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    // ── Header — mirrors Inbox/Outbox exactly
    header: {
      paddingHorizontal: SPACING.xxl,
      paddingBottom: SPACING.lg,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    accentBar: {
      width: 4,
      height: 32,
      borderRadius: 2,
      backgroundColor: COLORS.secondary,
      marginRight: SPACING.xs,
    },
    headerTitle: {
      fontSize: 34,
      fontFamily: FONTS.sprintura,
      color: COLORS.text.primary,
      letterSpacing: 1.5,
      includeFontPadding: false,
      lineHeight: 44,
      textAlignVertical: "center",
    },
    subtitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: SPACING.sm,
      gap: SPACING.sm,
    },
    countPill: {
      borderRadius: BORDER_RADIUS.full,
      overflow: "hidden",
    },
    countPillGradient: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      borderRadius: BORDER_RADIUS.full,
      minWidth: 26,
      alignItems: "center",
    },
    countPillText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: "700",
      color: COLORS.text.white,
      letterSpacing: 0.3,
    },
    headerSubtitle: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.tertiary,
      fontWeight: "500",
      flex: 1,
    },
    markAllBtn: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      borderColor: `${COLORS.secondary}40`,
      backgroundColor: `${COLORS.secondary}0A`,
    },
    markAllText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: "700",
      color: COLORS.secondary,
      letterSpacing: 0.2,
    },

    // ── List
    listContent: {
      paddingHorizontal: SPACING.xxl,
      paddingTop: SPACING.sm,
      paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
      flexGrow: 1,
    },

    // ── Notification Card
    card: {
      flexDirection: "row",
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      alignItems: "center",
      gap: SPACING.md,
      overflow: "hidden",
    },
    cardUnread: {
      backgroundColor: `${COLORS.secondary}08`,
      borderWidth: 1,
      borderColor: `${COLORS.secondary}25`,
    },
    cardAccentEdge: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      backgroundColor: COLORS.secondary,
      borderTopLeftRadius: BORDER_RADIUS.lg,
      borderBottomLeftRadius: BORDER_RADIUS.lg,
    },
    iconOrb: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    cardBody: {
      flex: 1,
      gap: 3,
    },
    cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    cardTitle: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: "700",
      color: COLORS.text.primary,
      flex: 1,
    },
    unreadDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: COLORS.secondary,
      flexShrink: 0,
    },
    cardMessage: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.secondary,
      lineHeight: 19,
    },
    cardTime: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.text.tertiary,
      fontWeight: "600",
      marginTop: 2,
    },

    // ── Empty state
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      paddingHorizontal: SPACING.xxxl,
      gap: SPACING.lg,
    },
    emptyOrb: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: "center",
      justifyContent: "center",
      ...SHADOWS.secondary,
    },
    emptyTitle: {
      fontSize: TYPOGRAPHY.fontSize.xxl,
      fontFamily: FONTS.sprintura,
      fontWeight: "800",
      color: COLORS.text.primary,
      letterSpacing: 1,
      includeFontPadding: false,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.tertiary,
      textAlign: "center",
      lineHeight: 22,
      fontWeight: "500",
    },
  });
