import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Modal,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  signOut as firebaseSignOut,
} from "@react-native-firebase/auth";

import { useMeQuery, useLogoutMutation } from "../../store/api/auth.api";
import authApi from "../../store/api/auth.api";
import { useGetMyTasksQuery, taskApi } from "../../store/api/task.api";
import { TaskStatus } from "../../types/task.types";
import { useAppDispatch } from "../../store/hooks";
import { clearUser } from "../../store/slices/auth.slice";
import Toast from "../../components/Toast";
import {
  ProfileHeader,
  ProfileStats,
  ProfileMenuItem,
  ProfileMenuSection,
  LogoutModal,
} from "../../components/profile";
import { COLORS, SPACING, PLATFORM_STYLES } from "../../config/theme";

const getInitials = (name: string): string => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const formatJoinDate = (dateString?: string): string => {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const { data: meData, isLoading: isUserLoading } = useMeQuery();
  const user = meData?.user;

  const { data: createdTasks } = useGetMyTasksQuery({ type: "created" });
  const { data: assignedTasks } = useGetMyTasksQuery({ type: "assigned" });

  const taskStats = useMemo(() => {
    const allTasks = [...(createdTasks || []), ...(assignedTasks || [])];
    const completed = allTasks.filter(
      (task) => String(task.status) === TaskStatus.COMPLETED,
    ).length;
    const created = (createdTasks || []).length;
    const inProgress = allTasks.filter(
      (task) => String(task.status) === TaskStatus.PENDING,
    ).length;
    return { completed, created, inProgress };
  }, [createdTasks, assignedTasks]);

  const profileData = useMemo(
    () => ({
      name: user?.name || "User",
      email: user?.email || "",
      initials: getInitials(user?.name || ""),
      joinedDate: formatJoinDate(user?.createdAt ?? undefined),
    }),
    [user],
  );

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout().unwrap();
    } catch {
      // Continue even if backend logout fails
    }

    try {
      await GoogleSignin.signOut();
      const auth = getAuth();
      await firebaseSignOut(auth);
      dispatch(clearUser());
      dispatch(authApi.util.resetApiState());
      dispatch(taskApi.util.resetApiState());

      Toast.show({
        type: "success",
        text1: "Logged out",
        text2: "You have been successfully logged out",
      });

      router.replace("/");
    } catch {
      Toast.show({
        type: "error",
        text1: "Logout Error",
        text2: "An error occurred, but you have been logged out",
      });
      dispatch(clearUser());
      router.replace("/");
    }
  };

  if (isUserLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader
          name={profileData.name}
          email={profileData.email}
          initials={profileData.initials}
          joinedDate={profileData.joinedDate}
          scaleAnim={scaleAnim}
        />

        <ProfileStats
          completedTasks={taskStats.completed}
          createdTasks={taskStats.created}
          inProgressTasks={taskStats.inProgress}
        />

        <View style={styles.menuWrapper}>
          <ProfileMenuSection title="Support">
            <ProfileMenuItem
              icon="help-circle"
              title="Help & FAQ"
              subtitle="Get answers to common questions"
              onPress={() => router.push("/settings/help")}
            />
            <ProfileMenuItem
              icon="message-circle"
              title="Contact Support"
              subtitle="Reach out to our team"
              onPress={() => router.push("/settings/contact")}
            />
            <ProfileMenuItem
              icon="file-text"
              title="Terms & Privacy"
              onPress={() => router.push("/settings/terms")}
            />
          </ProfileMenuSection>

          <ProfileMenuSection>
            <ProfileMenuItem
              icon="log-out"
              title="Logout"
              onPress={handleLogout}
              showArrow={false}
              isDangerous
            />
          </ProfileMenuSection>
        </View>

        <Text style={styles.version}>Bring Up v1.0.0</Text>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: PLATFORM_STYLES.tabBarHeight + SPACING.xl,
  },
  menuWrapper: {
    paddingHorizontal: SPACING.lg,
  },
  version: {
    textAlign: "center",
    color: COLORS.text.light,
    fontSize: 12,
    fontWeight: "500",
    marginTop: SPACING.xl,
  },
});
