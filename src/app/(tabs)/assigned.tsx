import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as Notifications from "expo-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useGetMyTasksInfiniteQuery,
  useUpdateTaskReactionMutation,
  useCompleteTaskMutation,
} from "../../store/api/task.api";
import type { Task, TabType, TaskResponse } from "../../types/task.types";
import { TaskReaction } from "../../types/task.types";
import { TaskCard } from "../../components/TaskCard";
import { EmptyState } from "../../components/EmptyState";
import { TabBar } from "../../components/TabBar";
import TaskDetailModal from "../../components/TaskDetailModal";
import { useTaskCategorization } from "../../hooks/useTaskCategorization";
import Toast from "../../components/Toast";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  PLATFORM_STYLES,
} from "../../config/theme";

const PAGE_SIZE = 20;

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("new");
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useGetMyTasksInfiniteQuery({
    type: "assigned",
    page,
    limit: PAGE_SIZE,
  });

  const tasks = data?.items || [];
  const hasNextPage = data?.meta?.hasNextPage || false;

  const [updateReaction] = useUpdateTaskReactionMutation();
  const [markComplete] = useCompleteTaskMutation();

  const categorizedTasks = useTaskCategorization(tasks);

  // Auto-refresh on notification received
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
    if (!isFetching && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasNextPage]);

  const openTaskDetail = useCallback((task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  }, []);

  const closeTaskDetail = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setSelectedTask(null), 300);
  }, []);

  const handleReaction = useCallback(
    async (taskId: string, reaction: TaskReaction) => {
      try {
        await updateReaction({ taskId, reaction }).unwrap();
        closeTaskDetail();
        Toast.show({
          type: "success",
          text1: "Response recorded",
          text2: "Your response has been sent",
        });
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err?.data?.message || "Failed to update response",
        });
      }
    },
    [updateReaction, closeTaskDetail],
  );

  const handleMarkDone = useCallback(
    async (taskId: string) => {
      try {
        await markComplete({ taskId }).unwrap();
        closeTaskDetail();
        Toast.show({
          type: "success",
          text1: "Task completed",
          text2: "Great job!",
        });
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err?.data?.message || "Failed to mark as done",
        });
      }
    },
    [markComplete, closeTaskDetail],
  );

  const tabs = [
    { key: "new" as TabType, title: "New", count: categorizedTasks.new.length },
    {
      key: "missed" as TabType,
      title: "Missed",
      count: categorizedTasks.missed.length,
    },
    {
      key: "expired" as TabType,
      title: "Expired",
      count: categorizedTasks.expired.length,
    },
  ];

  const currentTasks = categorizedTasks[activeTab];

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        mode="inbox"
        tabType={activeTab}
        onReaction={(reaction) => handleReaction(item.id, reaction)}
        onMarkDone={() => handleMarkDone(item.id)}
        onPress={() => openTaskDetail(item)}
      />
    ),
    [activeTab, handleReaction, handleMarkDone, openTaskDetail],
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => <EmptyState type={activeTab} />,
    [activeTab],
  );

  const themedStyles = makeStyles(insets);

  if (isLoading) {
    return (
      <View style={themedStyles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
          translucent
        />
        <View style={themedStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={themedStyles.loadingText}>Loading tasks...</Text>
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

      <View style={themedStyles.header}>
        <Text style={themedStyles.headerTitle}>Inbox</Text>
        <Text style={themedStyles.headerSubtitle}>
          {tasks?.length || 0} {tasks?.length === 1 ? "task" : "tasks"} assigned
        </Text>
      </View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

      <FlatList
        data={currentTasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={themedStyles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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

      <TaskDetailModal
        visible={modalVisible}
        task={selectedTask}
        onClose={closeTaskDetail}
        onReaction={(reaction) =>
          selectedTask && handleReaction(selectedTask.id, reaction)
        }
        onMarkDone={() => selectedTask && handleMarkDone(selectedTask.id)}
        mode="inbox"
      />
    </View>
  );
}

const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      paddingHorizontal: SPACING.xxl,
      // Uses insets.top so header clears the status bar/notch on both platforms
      paddingTop: insets.top + SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    headerTitle: {
      fontSize: TYPOGRAPHY.fontSize.display,
      fontWeight: "300",
      color: COLORS.text.primary,
      letterSpacing: -1,
    },
    headerSubtitle: {
      fontSize: TYPOGRAPHY.fontSize.md,
      color: COLORS.text.tertiary,
      fontWeight: "500",
      marginTop: SPACING.xs,
    },
    listContent: {
      paddingHorizontal: SPACING.xxl,
      // insets.bottom ensures content clears the home indicator on iOS
      paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
      flexGrow: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: SPACING.lg,
    },
    loadingText: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      color: COLORS.text.tertiary,
      fontWeight: "500",
    },
  });
