import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "../../config/theme";
import React, { useEffect } from "react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../store/api/alert.api";
import { NotificationType } from "../../types";

// Helper to format time ago
const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) return "";

  let date: Date;
  if (timestamp._seconds) {
    date = new Date(timestamp._seconds * 1000);
  } else if (timestamp.toDate) {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

const NotificationCard = ({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: () => void;
}) => {
  const getNotificationIcon = (type: NotificationType | string) => {
    switch (type) {
      case NotificationType.TASK_ASSIGNED:
        return "inbox";
      case NotificationType.TASK_COMPLETED:
        return "check-circle";
      case NotificationType.TASK_ACCEPTED:
        return "thumbs-up";
      case NotificationType.TASK_REJECTED:
        return "thumbs-down";
      case NotificationType.DEADLINE_APPROACHING:
        return "alert-circle";
      case NotificationType.TASK_OVERDUE:
        return "alert-triangle";
      default:
        return "bell";
    }
  };

  const getGradientColors = (
    type: NotificationType | string,
  ): [string, string] => {
    switch (type) {
      case NotificationType.TASK_ASSIGNED:
        return [COLORS.secondary, "#D97D54"];
      case NotificationType.TASK_COMPLETED:
        return [COLORS.success, "#4CAF50"];
      case NotificationType.TASK_ACCEPTED:
        return [COLORS.info, "#1976D2"];
      case NotificationType.TASK_REJECTED:
        return [COLORS.error, "#D32F2F"];
      case NotificationType.DEADLINE_APPROACHING:
        return ["#FF9800", "#F57C00"];
      case NotificationType.TASK_OVERDUE:
        return [COLORS.error, "#D32F2F"];
      default:
        return ["#9E9E9E", "#757575"];
    }
  };

  const gradientColors = getGradientColors(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard,
        SHADOWS.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.iconGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Feather
          name={getNotificationIcon(notification.type)}
          size={20}
          color={COLORS.text.white}
        />
      </LinearGradient>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.body}
        </Text>
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationTime}>
            {formatTimeAgo(notification.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.emptyContainer}>
      <Animated.View
        style={[
          styles.emptyIconContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={[COLORS.secondary, `${COLORS.secondary}DD`]}
          style={styles.emptyIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="bell-off" size={64} color={COLORS.text.white} />
        </LinearGradient>
      </Animated.View>

      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! Notifications will appear here
      </Text>
    </View>
  );
};

export default function NotificationsScreen() {
  const {
    data: notifications = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery({});

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#FFF8F3"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFF8F3"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Alerts</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount === 0
              ? "All caught up!"
              : `${unreadCount} ${unreadCount === 1 ? "notification" : "notifications"}`}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark All as Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
      >
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.notificationsContent}>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => handleMarkAsRead(notification.id)}
              />
            ))}
            <View style={styles.bottomSpacer} />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  markAllButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.accent,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  notificationsContent: {
    paddingTop: SPACING.md,
  },
  bottomSpacer: {
    height: 100,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: "flex-start",
    gap: SPACING.lg,
  },
  unreadCard: {
    backgroundColor: "#FFFBF8",
    borderWidth: 1.5,
    borderColor: `${COLORS.secondary}30`,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    flexShrink: 0,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.text.light,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    marginBottom: SPACING.xxl,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
