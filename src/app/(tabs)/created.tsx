import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Notifications from "expo-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import {
  useGetMyTasksInfiniteQuery,
  useDeleteTaskMutation,
} from "../../store/api/task.api";
import type { TaskResponse, OutboxTabType } from "../../types/task.types";
import { TaskCard } from "../../components/TaskCard";
import { EmptyState } from "../../components/EmptyState";
import { TabBar } from "../../components/TabBar";
import TaskDetailModal from "../../components/TaskDetailModal";
import { useOutboxTaskCategorization } from "../../hooks/useOutboxTaskCategorization";
import Toast from "../../components/Toast";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  PLATFORM_STYLES,
  BORDER_RADIUS,
} from "../../config/theme";
import { FONTS } from "@/components/fonts";

const PAGE_SIZE = 20;

export default function OutboxScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<OutboxTabType>("pending");
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const { data, isLoading, isFetching, refetch } = useGetMyTasksInfiniteQuery({
    type: "created",
    page,
    limit: PAGE_SIZE,
  });

  const tasks = data?.items || [];
  const hasNextPage = data?.meta?.hasNextPage || false;

  const [deleteTask] = useDeleteTaskMutation();
  const categorizedTasks = useOutboxTaskCategorization(tasks);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(() => {
      setPage(1);
      refetch();
    });
    return () => subscription.remove();
  }, [refetch]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasNextPage) setPage((prev) => prev + 1);
  }, [isFetching, hasNextPage]);

  const openTaskDetail = useCallback((task: TaskResponse) => {
    setSelectedTask(task);
    setModalVisible(true);
  }, []);

  const closeTaskDetail = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setSelectedTask(null), 300);
  }, []);

  const handleDelete = useCallback(
    async (taskId: string) => {
      Toast.show({ type: "info", text1: "Deleting task..." });
      try {
        await deleteTask(taskId).unwrap();
        closeTaskDetail();
        Toast.show({
          type: "success",
          text1: "Task deleted",
          text2: "The task has been removed",
        });
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err?.data?.message || "Failed to delete task",
        });
      }
    },
    [deleteTask, closeTaskDetail],
  );

  const tabs = [
    {
      key: "pending" as OutboxTabType,
      title: "Pending",
      count: categorizedTasks.pending.length,
    },
    {
      key: "inProgress" as OutboxTabType,
      title: "Active",
      count: categorizedTasks.inProgress.length,
    },
    {
      key: "closed" as OutboxTabType,
      title: "Closed",
      count: categorizedTasks.closed.length,
    },
  ];

  const currentTasks = categorizedTasks[activeTab];
  const themedStyles = makeStyles(insets);

  // ── Scroll-driven header animations (mirrors Inbox)
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

  const renderItem = useCallback(
    ({ item }: { item: TaskResponse }) => (
      <TaskCard
        task={item}
        mode="outbox"
        tabType={activeTab}
        onDelete={() => handleDelete(item.id)}
        onPress={() => openTaskDetail(item)}
      />
    ),
    [activeTab, handleDelete, openTaskDetail],
  );

  const keyExtractor = useCallback((item: TaskResponse) => item.id, []);
  const ListEmptyComponent = useCallback(
    () => <EmptyState type={activeTab} />,
    [activeTab],
  );

  // ── Skeleton loader ──────────────────────────────────────────
  if (isLoading) {
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
              width={110}
              height={14}
              borderRadius={BORDER_RADIUS.sm}
            />
          </View>
        </View>
        <View style={{ paddingHorizontal: SPACING.xxl, marginTop: SPACING.sm }}>
          <SkeletonBlock
            width="100%"
            height={44}
            borderRadius={BORDER_RADIUS.xl}
          />
        </View>
        <View
          style={{
            paddingHorizontal: SPACING.xxl,
            marginTop: SPACING.xl,
            gap: SPACING.md,
          }}
        >
          {[1, 2, 3].map((i) => (
            <SkeletonBlock
              key={i}
              width="100%"
              height={110}
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

      {/* ── Header ────────────────────────────────────────────── */}
      <Animated.View
        style={[themedStyles.header, { paddingTop: insets.top + SPACING.lg }]}
      >
        <View style={themedStyles.headerRow}>
          <View style={themedStyles.accentBar} />

          <Animated.View style={{ transform: [{ scale: headerTitleScale }] }}>
            <Text style={themedStyles.headerTitle}>OUTBOX</Text>
          </Animated.View>
        </View>

        {/* Subtitle row — fades on scroll */}
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
              <Text style={themedStyles.countPillText}>
                {tasks?.length || 0}
              </Text>
            </LinearGradient>
          </View>
          <Text style={themedStyles.headerSubtitle}>
            {tasks?.length === 1 ? "task" : "tasks"} created
          </Text>
        </Animated.View>
      </Animated.View>

      {/* ── Tab Bar ───────────────────────────────────────────── */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

      {/* ── Task List ─────────────────────────────────────────── */}
      <Animated.FlatList
        data={currentTasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={themedStyles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <ActivityIndicator
              size="small"
              color={COLORS.secondary}
              style={{ marginVertical: SPACING.lg }}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
      />

      {/* ── Task Detail Modal ──────────────────────────────────── */}
      <TaskDetailModal
        visible={modalVisible}
        task={selectedTask}
        onClose={closeTaskDetail}
        onDelete={() => selectedTask && handleDelete(selectedTask.id)}
        mode="outbox"
      />
    </View>
  );
}

// ── Skeleton shimmer (shared pattern with Inbox) ─────────────
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

  React.useEffect(() => {
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
  }, [shimmer]);

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

// ── Styles ───────────────────────────────────────────────────
const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    // ── Header
    header: {
      paddingHorizontal: SPACING.xxl,
      paddingBottom: SPACING.lg,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      overflow: "visible",
      paddingTop: 4,
    },

    // Orange accent bar — matches Inbox exactly
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
      textAlignVertical: "center",
    },

    subtitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: SPACING.sm,
      gap: SPACING.sm,
    },

    // Orange gradient task count pill
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
    },

    // ── List
    listContent: {
      paddingHorizontal: SPACING.xxl,
      paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
      paddingTop: SPACING.sm,
      flexGrow: 1,
    },
  });
