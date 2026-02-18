// import React, { useState, useCallback, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   RefreshControl,
//   StatusBar,
//   ActivityIndicator,
// } from "react-native";
// import * as Notifications from "expo-notifications";

// import {
//   useGetMyTasksInfiniteQuery,
//   useDeleteTaskMutation,
// } from "../../store/api/task.api";
// import type { Task, OutboxTabType } from "../../types/task.types";
// import { TaskCard } from "../../components/TaskCard";
// import { EmptyState } from "../../components/EmptyState";
// import { TabBar } from "../../components/TabBar";
// import TaskDetailModal from "../../components/TaskDetailModal";
// import { useOutboxTaskCategorization } from "../../hooks/useOutboxTaskCategorization";
// import Toast from "../../components/Toast";
// import {
//   COLORS,
//   SPACING,
//   TYPOGRAPHY,
//   PLATFORM_STYLES,
// } from "../../config/theme";

// const PAGE_SIZE = 20;

// export default function OutboxScreen() {
//   const [activeTab, setActiveTab] = useState<OutboxTabType>("pending");
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isFetching, refetch } = useGetMyTasksInfiniteQuery({
//     type: "created",
//     page,
//     limit: PAGE_SIZE,
//   });

//   const tasks = data?.items || [];
//   const hasNextPage = data?.meta?.hasNextPage || false;

//   const [deleteTask] = useDeleteTaskMutation();

//   const categorizedTasks = useOutboxTaskCategorization(tasks);

//   // Auto-refresh on notification received
//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(() => {
//       setPage(1);
//       refetch();
//     });

//     return () => subscription.remove();
//   }, [refetch]);

//   const handleRefresh = useCallback(() => {
//     setPage(1);
//     refetch();
//   }, [refetch]);

//   const loadMore = useCallback(() => {
//     if (!isFetching && hasNextPage) {
//       setPage((prev) => prev + 1);
//     }
//   }, [isFetching, hasNextPage]);

//   const openTaskDetail = useCallback((task: Task) => {
//     setSelectedTask(task);
//     setModalVisible(true);
//   }, []);

//   const closeTaskDetail = useCallback(() => {
//     setModalVisible(false);
//     setTimeout(() => setSelectedTask(null), 300);
//   }, []);

//   const handleDelete = useCallback(
//     async (taskId: string) => {
//       Toast.show({
//         type: "info",
//         text1: "Deleting task...",
//       });

//       try {
//         await deleteTask(taskId).unwrap();
//         closeTaskDetail();
//         Toast.show({
//           type: "success",
//           text1: "Task deleted",
//           text2: "The task has been removed",
//         });
//       } catch (error: unknown) {
//         const err = error as { data?: { message?: string } };
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: err?.data?.message || "Failed to delete task",
//         });
//       }
//     },
//     [deleteTask, closeTaskDetail],
//   );

//   const tabs = [
//     {
//       key: "pending" as OutboxTabType,
//       title: "Pending",
//       count: categorizedTasks.pending.length,
//     },
//     {
//       key: "inProgress" as OutboxTabType,
//       title: "Active",
//       count: categorizedTasks.inProgress.length,
//     },
//     {
//       key: "closed" as OutboxTabType,
//       title: "Closed",
//       count: categorizedTasks.closed.length,
//     },
//   ];

//   const currentTasks = categorizedTasks[activeTab];

//   const renderItem = useCallback(
//     ({ item }: { item: Task }) => (
//       <TaskCard
//         task={item}
//         mode="outbox"
//         tabType={activeTab}
//         onDelete={() => handleDelete(item.id)}
//         onPress={() => openTaskDetail(item)}
//       />
//     ),
//     [activeTab, handleDelete, openTaskDetail],
//   );

//   const keyExtractor = useCallback((item: Task) => item.id, []);

//   const ListEmptyComponent = useCallback(
//     () => <EmptyState type={activeTab} />,
//     [activeTab],
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor={COLORS.background}
//         />
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.secondary} />
//           <Text style={styles.loadingText}>Loading tasks...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Outbox</Text>
//         <Text style={styles.headerSubtitle}>
//           {tasks?.length || 0} {tasks?.length === 1 ? "task" : "tasks"} created
//         </Text>
//       </View>

//       <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

//       <FlatList
//         data={currentTasks}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={ListEmptyComponent}
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={
//           isFetching && page > 1 ? (
//             <ActivityIndicator
//               size="small"
//               color={COLORS.secondary}
//               style={{ marginVertical: SPACING.lg }}
//             />
//           ) : null
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={isFetching && page === 1}
//             onRefresh={handleRefresh}
//             tintColor={COLORS.secondary}
//             colors={[COLORS.secondary]}
//           />
//         }
//       />

//       <TaskDetailModal
//         visible={modalVisible}
//         task={selectedTask}
//         onClose={closeTaskDetail}
//         onDelete={() => selectedTask && handleDelete(selectedTask.id)}
//         mode="outbox"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     paddingHorizontal: SPACING.xxl,
//     paddingTop: 60,
//     paddingBottom: SPACING.xl,
//   },
//   headerTitle: {
//     fontSize: TYPOGRAPHY.fontSize.display,
//     fontWeight: "300",
//     color: COLORS.text.primary,
//     letterSpacing: -1,
//   },
//   headerSubtitle: {
//     fontSize: TYPOGRAPHY.fontSize.md,
//     color: COLORS.text.tertiary,
//     fontWeight: "500",
//     marginTop: SPACING.xs,
//   },
//   listContent: {
//     paddingHorizontal: SPACING.xxl,
//     paddingBottom: PLATFORM_STYLES.tabBarHeight + SPACING.xl,
//     flexGrow: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     gap: SPACING.lg,
//   },
//   loadingText: {
//     fontSize: TYPOGRAPHY.fontSize.lg,
//     color: COLORS.text.tertiary,
//     fontWeight: "500",
//   },
// });
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
  useDeleteTaskMutation,
} from "../../store/api/task.api";
import type { Task, OutboxTabType } from "../../types/task.types";
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
} from "../../config/theme";

const PAGE_SIZE = 20;

export default function OutboxScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<OutboxTabType>("pending");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useGetMyTasksInfiniteQuery({
    type: "created",
    page,
    limit: PAGE_SIZE,
  });

  const tasks = data?.items || [];
  const hasNextPage = data?.meta?.hasNextPage || false;

  const [deleteTask] = useDeleteTaskMutation();

  const categorizedTasks = useOutboxTaskCategorization(tasks);

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

  const handleDelete = useCallback(
    async (taskId: string) => {
      Toast.show({
        type: "info",
        text1: "Deleting task...",
      });

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

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
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
        <Text style={themedStyles.headerTitle}>Outbox</Text>
        <Text style={themedStyles.headerSubtitle}>
          {tasks?.length || 0} {tasks?.length === 1 ? "task" : "tasks"} created
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
        onDelete={() => selectedTask && handleDelete(selectedTask.id)}
        mode="outbox"
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
      // ✅ Replaces hardcoded 60 — clears notch/Dynamic Island on iOS
      // and translucent status bar on Android
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
      // ✅ Adds insets.bottom so last item clears the home indicator on iOS
      // and gesture nav bar on Android
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
