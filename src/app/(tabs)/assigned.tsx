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
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import {
//   useGetMyTasksInfiniteQuery,
//   useUpdateTaskReactionMutation,
//   useCompleteTaskMutation,
// } from "../../store/api/task.api";
// import type { Task, TabType, TaskResponse } from "../../types/task.types";
// import { TaskReaction } from "../../types/task.types";
// import { TaskCard } from "../../components/TaskCard";
// import { EmptyState } from "../../components/EmptyState";
// import { TabBar } from "../../components/TabBar";
// import TaskDetailModal from "../../components/TaskDetailModal";
// import { useTaskCategorization } from "../../hooks/useTaskCategorization";
// import Toast from "../../components/Toast";
// import {
//   COLORS,
//   SPACING,
//   TYPOGRAPHY,
//   PLATFORM_STYLES,
// } from "../../config/theme";
// import { useFonts } from "expo-font";
// const PAGE_SIZE = 20;

// export default function InboxScreen() {
//   const insets = useSafeAreaInsets();
//   const [activeTab, setActiveTab] = useState<TabType>("new");
//   const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isFetching, refetch } = useGetMyTasksInfiniteQuery({
//     type: "assigned",
//     page,
//     limit: PAGE_SIZE,
//   });

//   const tasks = data?.items || [];
//   const hasNextPage = data?.meta?.hasNextPage || false;

//   const [updateReaction] = useUpdateTaskReactionMutation();
//   const [markComplete] = useCompleteTaskMutation();

//   const categorizedTasks = useTaskCategorization(tasks);

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
//   const [fontsLoaded] = useFonts({
//     // Slogan: require("../../../assets/fonts/Cameliya.ttf"),
//     Greet: require("../../../assets/fonts/RushDriver.otf"),
//   });
//   const handleReaction = useCallback(
//     async (taskId: string, reaction: TaskReaction) => {
//       try {
//         await updateReaction({ taskId, reaction }).unwrap();
//         closeTaskDetail();
//         Toast.show({
//           type: "success",
//           text1: "Response recorded",
//           text2: "Your response has been sent",
//         });
//       } catch (error: unknown) {
//         const err = error as { data?: { message?: string } };
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: err?.data?.message || "Failed to update response",
//         });
//       }
//     },
//     [updateReaction, closeTaskDetail],
//   );

//   const handleMarkDone = useCallback(
//     async (taskId: string) => {
//       try {
//         await markComplete({ taskId }).unwrap();
//         closeTaskDetail();
//         Toast.show({
//           type: "success",
//           text1: "Task completed",
//           text2: "Great job!",
//         });
//       } catch (error: unknown) {
//         const err = error as { data?: { message?: string } };
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: err?.data?.message || "Failed to mark as done",
//         });
//       }
//     },
//     [markComplete, closeTaskDetail],
//   );

//   const tabs = [
//     { key: "new" as TabType, title: "New", count: categorizedTasks.new.length },
//     {
//       key: "missed" as TabType,
//       title: "Missed",
//       count: categorizedTasks.missed.length,
//     },
//     {
//       key: "expired" as TabType,
//       title: "Expired",
//       count: categorizedTasks.expired.length,
//     },
//   ];

//   const currentTasks = categorizedTasks[activeTab];

//   const renderItem = useCallback(
//     ({ item }: { item: Task }) => (
//       <TaskCard
//         task={item}
//         mode="inbox"
//         tabType={activeTab}
//         onReaction={(reaction) => handleReaction(item.id, reaction)}
//         onMarkDone={() => handleMarkDone(item.id)}
//         onPress={() => openTaskDetail(item)}
//       />
//     ),
//     [activeTab, handleReaction, handleMarkDone, openTaskDetail],
//   );

//   const keyExtractor = useCallback((item: Task) => item.id, []);

//   const ListEmptyComponent = useCallback(
//     () => <EmptyState type={activeTab} />,
//     [activeTab],
//   );

//   const themedStyles = makeStyles(insets);

//   if (isLoading) {
//     return (
//       <View style={themedStyles.container}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor={COLORS.background}
//           translucent
//         />
//         <View style={themedStyles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.secondary} />
//           <Text style={themedStyles.loadingText}>Loading tasks...</Text>
//         </View>
//       </View>
//     );
//   }

//   //TODO Fix return null statement replace it with loader or some cool design loading font or skeloton loader
//   if (!fontsLoaded) return null;
//   return (
//     <View style={themedStyles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FAF8F6" />

//       <View style={themedStyles.header}>
//         <Text style={themedStyles.headerTitle}>Inbox</Text>
//         <Text style={themedStyles.headerSubtitle}>
//           {tasks?.length || 0} {tasks?.length === 1 ? "task" : "tasks"} assigned
//         </Text>
//       </View>

//       <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

//       <FlatList
//         data={currentTasks}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         contentContainerStyle={themedStyles.listContent}
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
//         onReaction={(reaction) =>
//           selectedTask && handleReaction(selectedTask.id, reaction)
//         }
//         onMarkDone={() => selectedTask && handleMarkDone(selectedTask.id)}
//         mode="inbox"
//       />
//     </View>
//   );
// }

// const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.background,
//     },
//     header: {
//       paddingHorizontal: SPACING.xxl,
//       // Uses insets.top so header clears the status bar/notch on both platforms
//       paddingTop: insets.top + SPACING.lg,
//       paddingBottom: SPACING.xl,
//     },
//     headerTitle: {
//       fontSize: TYPOGRAPHY.fontSize.display,
//       fontWeight: "300",
//       fontFamily: "Slogan",
//       color: COLORS.text.primary,
//       letterSpacing: -1,
//     },
//     headerSubtitle: {
//       fontSize: TYPOGRAPHY.fontSize.md,
//       color: COLORS.text.tertiary,
//       fontWeight: "500",
//       marginTop: SPACING.xs,
//     },
//     listContent: {
//       paddingHorizontal: SPACING.xxl,
//       // insets.bottom ensures content clears the home indicator on iOS
//       paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
//       flexGrow: 1,
//     },
//     loadingContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       gap: SPACING.lg,
//     },
//     loadingText: {
//       fontSize: TYPOGRAPHY.fontSize.lg,
//       color: COLORS.text.tertiary,
//       fontWeight: "500",
//     },
//   });
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
  BORDER_RADIUS,
} from "../../config/theme";

import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from "@/components/fonts";

const PAGE_SIZE = 20;

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("new");
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);

  const scrollY = React.useRef(new Animated.Value(0)).current;

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
  const themedStyles = makeStyles(insets);

  // Animated header title opacity — shrinks gracefully on scroll
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

  // ── Skeleton loader ─────────────────────────────────────────
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
            width={140}
            height={38}
            borderRadius={BORDER_RADIUS.md}
          />
          <View style={{ marginTop: SPACING.sm }}>
            <SkeletonBlock
              width={100}
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

      {/* ── Header ──────────────────────────────────────────── */}
      <Animated.View
        style={[themedStyles.header, { paddingTop: insets.top + SPACING.lg }]}
      >
        {/* Decorative orange accent line left of title */}
        <View style={themedStyles.headerRow}>
          <View style={themedStyles.accentBar} />
          <Animated.View
            style={{
              transform: [{ scale: headerTitleScale }],
              transformOrigin: "left",
            }}
          >
            <Text style={themedStyles.headerTitle}>INBOX</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[themedStyles.subtitleRow, { opacity: headerSubtitleOpacity }]}
        >
          {/* Task count pill */}
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
            {tasks?.length === 1 ? "task" : "tasks"} assigned
          </Text>
        </Animated.View>
      </Animated.View>

      {/* ── Tab Bar ─────────────────────────────────────────── */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

      {/* ── Task List ───────────────────────────────────────── */}
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

      {/* ── Task Detail Modal ────────────────────────────────── */}
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

// ── Skeleton shimmer block ───────────────────────────────────
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

  // Convert width to a valid type for Animated.View style
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
    // 3px tall orange accent bar left of INBOX title
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
    // Orange gradient pill showing task count
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
