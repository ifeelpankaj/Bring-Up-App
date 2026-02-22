// // import React, { useEffect, useMemo, useState, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   ActivityIndicator,
// //   Animated,
// //   Modal,
// //   StatusBar,
// // } from "react-native";
// // import { useRouter } from "expo-router";
// // import { GoogleSignin } from "@react-native-google-signin/google-signin";
// // import {
// //   getAuth,
// //   signOut as firebaseSignOut,
// // } from "@react-native-firebase/auth";

// // import { useMeQuery, useLogoutMutation } from "../../store/api/auth.api";
// // import authApi from "../../store/api/auth.api";
// // import { useGetMyTasksQuery, taskApi } from "../../store/api/task.api";
// // import { TaskStatus } from "../../types/task.types";
// // import { useAppDispatch } from "../../store/hooks";
// // import { clearUser } from "../../store/slices/auth.slice";
// // import Toast from "../../components/Toast";
// // import {
// //   ProfileHeader,
// //   ProfileStats,
// //   ProfileMenuItem,
// //   ProfileMenuSection,
// //   LogoutModal,
// // } from "../../components/profile";
// // import { COLORS, SPACING, PLATFORM_STYLES } from "../../config/theme";

// // const getInitials = (name: string): string => {
// //   if (!name) return "?";
// //   const words = name.trim().split(/\s+/);
// //   if (words.length === 1) {
// //     return words[0].substring(0, 2).toUpperCase();
// //   }
// //   return (words[0][0] + words[words.length - 1][0]).toUpperCase();
// // };

// // const formatJoinDate = (dateString?: string): string => {
// //   if (!dateString) return "Recently";
// //   try {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("en-US", {
// //       month: "short",
// //       year: "numeric",
// //     });
// //   } catch {
// //     return "Recently";
// //   }
// // };

// // export default function ProfileScreen() {
// //   const router = useRouter();
// //   const dispatch = useAppDispatch();
// //   const [logout] = useLogoutMutation();
// //   const [showLogoutModal, setShowLogoutModal] = useState(false);
// //   const scaleAnim = useRef(new Animated.Value(0)).current;

// //   const { data: meData, isLoading: isUserLoading } = useMeQuery();
// //   const user = meData?.user;

// //   const { data: createdTasks } = useGetMyTasksQuery({ type: "created" });
// //   const { data: assignedTasks } = useGetMyTasksQuery({ type: "assigned" });

// //   const taskStats = useMemo(() => {
// //     const allTasks = [...(createdTasks || []), ...(assignedTasks || [])];
// //     const completed = allTasks.filter(
// //       (task) => String(task.status) === TaskStatus.COMPLETED,
// //     ).length;
// //     const created = (createdTasks || []).length;
// //     const inProgress = allTasks.filter(
// //       (task) => String(task.status) === TaskStatus.PENDING,
// //     ).length;
// //     return { completed, created, inProgress };
// //   }, [createdTasks, assignedTasks]);

// //   const profileData = useMemo(
// //     () => ({
// //       name: user?.name || "User",
// //       email: user?.email || "",
// //       initials: getInitials(user?.name || ""),
// //       joinedDate: formatJoinDate(user?.createdAt ?? undefined),
// //     }),
// //     [user],
// //   );

// //   useEffect(() => {
// //     Animated.spring(scaleAnim, {
// //       toValue: 1,
// //       tension: 50,
// //       friction: 7,
// //       useNativeDriver: true,
// //     }).start();
// //   }, [scaleAnim]);

// //   const handleLogout = () => setShowLogoutModal(true);

// //   const confirmLogout = async () => {
// //     setShowLogoutModal(false);
// //     try {
// //       await logout().unwrap();
// //     } catch {
// //       // Continue even if backend logout fails
// //     }

// //     try {
// //       await GoogleSignin.signOut();
// //       const auth = getAuth();
// //       await firebaseSignOut(auth);
// //       dispatch(clearUser());
// //       dispatch(authApi.util.resetApiState());
// //       dispatch(taskApi.util.resetApiState());

// //       Toast.show({
// //         type: "success",
// //         text1: "Logged out",
// //         text2: "You have been successfully logged out",
// //       });

// //       router.replace("/");
// //     } catch {
// //       Toast.show({
// //         type: "error",
// //         text1: "Logout Error",
// //         text2: "An error occurred, but you have been logged out",
// //       });
// //       dispatch(clearUser());
// //       router.replace("/");
// //     }
// //   };

// //   if (isUserLoading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <StatusBar
// //           barStyle="dark-content"
// //           backgroundColor={COLORS.background}
// //         />
// //         <ActivityIndicator size="large" color={COLORS.secondary} />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

// //       <ScrollView
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={styles.scrollContent}
// //       >
// //         <ProfileHeader
// //           name={profileData.name}
// //           email={profileData.email}
// //           initials={profileData.initials}
// //           joinedDate={profileData.joinedDate}
// //           scaleAnim={scaleAnim}
// //         />

// //         <ProfileStats
// //           completedTasks={taskStats.completed}
// //           createdTasks={taskStats.created}
// //           inProgressTasks={taskStats.inProgress}
// //         />

// //         <View style={styles.menuWrapper}>
// //           <ProfileMenuSection title="Support">
// //             <ProfileMenuItem
// //               icon="help-circle"
// //               title="Help & FAQ"
// //               subtitle="Get answers to common questions"
// //               onPress={() => router.push("/settings/help")}
// //             />
// //             <ProfileMenuItem
// //               icon="message-circle"
// //               title="Contact Support"
// //               subtitle="Reach out to our team"
// //               onPress={() => router.push("/settings/contact")}
// //             />
// //             <ProfileMenuItem
// //               icon="file-text"
// //               title="Terms & Privacy"
// //               onPress={() => router.push("/settings/terms")}
// //             />
// //           </ProfileMenuSection>

// //           <ProfileMenuSection>
// //             <ProfileMenuItem
// //               icon="log-out"
// //               title="Logout"
// //               onPress={handleLogout}
// //               showArrow={false}
// //               isDangerous
// //             />
// //           </ProfileMenuSection>
// //         </View>

// //         <Text style={styles.version}>Bring Up v1.0.0</Text>
// //       </ScrollView>

// //       <Modal
// //         animationType="fade"
// //         transparent
// //         visible={showLogoutModal}
// //         onRequestClose={() => setShowLogoutModal(false)}
// //       >
// //         <LogoutModal
// //           onCancel={() => setShowLogoutModal(false)}
// //           onConfirm={confirmLogout}
// //         />
// //       </Modal>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: COLORS.background,
// //   },
// //   scrollContent: {
// //     paddingBottom: PLATFORM_STYLES.tabBarHeight + SPACING.xl,
// //   },
// //   menuWrapper: {
// //     paddingHorizontal: SPACING.lg,
// //   },
// //   version: {
// //     textAlign: "center",
// //     color: COLORS.text.light,
// //     fontSize: 12,
// //     fontWeight: "500",
// //     marginTop: SPACING.xl,
// //   },
// // });
// import React, { useEffect, useMemo, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Animated,
//   Modal,
//   StatusBar,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import {
//   getAuth,
//   signOut as firebaseSignOut,
// } from "@react-native-firebase/auth";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { useMeQuery, useLogoutMutation } from "../../store/api/auth.api";
// import authApi from "../../store/api/auth.api";
// import { useGetMyTasksQuery, taskApi } from "../../store/api/task.api";
// import { TaskStatus } from "../../types/task.types";
// import { useAppDispatch } from "../../store/hooks";
// import { clearUser } from "../../store/slices/auth.slice";
// import Toast from "../../components/Toast";
// import {
//   ProfileHeader,
//   ProfileStats,
//   ProfileMenuItem,
//   ProfileMenuSection,
//   LogoutModal,
// } from "../../components/profile";
// import { COLORS, SPACING, PLATFORM_STYLES } from "../../config/theme";

// const getInitials = (name: string): string => {
//   if (!name) return "?";
//   const words = name.trim().split(/\s+/);
//   if (words.length === 1) {
//     return words[0].substring(0, 2).toUpperCase();
//   }
//   return (words[0][0] + words[words.length - 1][0]).toUpperCase();
// };

// const formatJoinDate = (dateString?: string): string => {
//   if (!dateString) return "Recently";
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return "Recently";
//   }
// };

// export default function ProfileScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [logout] = useLogoutMutation();
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(0)).current;

//   const { data: meData, isLoading: isUserLoading } = useMeQuery();
//   const user = meData?.user;

//   const { data: createdTasks } = useGetMyTasksQuery({ type: "created" });
//   const { data: assignedTasks } = useGetMyTasksQuery({ type: "assigned" });

//   const taskStats = useMemo(() => {
//     const allTasks = [...(createdTasks || []), ...(assignedTasks || [])];
//     const completed = allTasks.filter(
//       (task) => String(task.status) === TaskStatus.COMPLETED,
//     ).length;
//     const created = (createdTasks || []).length;
//     const inProgress = allTasks.filter(
//       (task) => String(task.status) === TaskStatus.PENDING,
//     ).length;
//     return { completed, created, inProgress };
//   }, [createdTasks, assignedTasks]);

//   const profileData = useMemo(
//     () => ({
//       name: user?.name || "User",
//       email: user?.email || "",
//       initials: getInitials(user?.name || ""),
//       joinedDate: formatJoinDate(user?.createdAt ?? undefined),
//     }),
//     [user],
//   );

//   useEffect(() => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       tension: 50,
//       friction: 7,
//       useNativeDriver: true,
//     }).start();
//   }, [scaleAnim]);

//   const handleLogout = () => setShowLogoutModal(true);

//   const confirmLogout = async () => {
//     setShowLogoutModal(false);
//     try {
//       await logout().unwrap();
//     } catch {
//       // Continue even if backend logout fails
//     }

//     try {
//       await GoogleSignin.signOut();
//       const auth = getAuth();
//       await firebaseSignOut(auth);
//       dispatch(clearUser());
//       dispatch(authApi.util.resetApiState());
//       dispatch(taskApi.util.resetApiState());

//       Toast.show({
//         type: "success",
//         text1: "Logged out",
//         text2: "You have been successfully logged out",
//       });

//       router.replace("/");
//     } catch {
//       Toast.show({
//         type: "error",
//         text1: "Logout Error",
//         text2: "An error occurred, but you have been logged out",
//       });
//       dispatch(clearUser());
//       router.replace("/");
//     }
//   };

//   const themedStyles = makeStyles(insets);

//   if (isUserLoading) {
//     return (
//       <View style={themedStyles.loadingContainer}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor={COLORS.background}
//           translucent
//         />
//         <ActivityIndicator size="large" color={COLORS.secondary} />
//       </View>
//     );
//   }

//   return (
//     <View style={themedStyles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FAF8F6" />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={themedStyles.scrollContent}
//       >
//         <ProfileHeader
//           name={profileData.name}
//           email={profileData.email}
//           initials={profileData.initials}
//           joinedDate={profileData.joinedDate}
//           scaleAnim={scaleAnim}
//         />

//         <ProfileStats
//           completedTasks={taskStats.completed}
//           createdTasks={taskStats.created}
//           inProgressTasks={taskStats.inProgress}
//         />

//         <View style={themedStyles.menuWrapper}>
//           <ProfileMenuSection title="Support">
//             <ProfileMenuItem
//               icon="help-circle"
//               title="Help & FAQ"
//               subtitle="Get answers to common questions"
//               onPress={() => router.push("/settings/help")}
//             />
//             <ProfileMenuItem
//               icon="message-circle"
//               title="Contact Support"
//               subtitle="Reach out to our team"
//               onPress={() => router.push("/settings/contact")}
//             />
//             <ProfileMenuItem
//               icon="file-text"
//               title="Terms & Privacy"
//               onPress={() => router.push("/settings/terms")}
//             />
//           </ProfileMenuSection>

//           <ProfileMenuSection>
//             <ProfileMenuItem
//               icon="log-out"
//               title="Logout"
//               onPress={handleLogout}
//               showArrow={false}
//               isDangerous
//             />
//           </ProfileMenuSection>
//         </View>

//         <Text style={themedStyles.version}>Bring Up v1.0.0</Text>
//       </ScrollView>

//       <Modal
//         animationType="fade"
//         transparent
//         visible={showLogoutModal}
//         onRequestClose={() => setShowLogoutModal(false)}
//       >
//         <LogoutModal
//           onCancel={() => setShowLogoutModal(false)}
//           onConfirm={confirmLogout}
//         />
//       </Modal>
//     </View>
//   );
// }

// const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.background,
//     },
//     loadingContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: COLORS.background,
//     },
//     scrollContent: {
//       // ✅ ProfileHeader likely has its own colored background that extends
//       // under the status bar — insets.top is NOT added here so the header
//       // can intentionally bleed edge-to-edge under the translucent status bar.
//       // insets.bottom clears the home indicator / Android gesture bar.
//       paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
//     },
//     menuWrapper: {
//       paddingHorizontal: SPACING.lg,
//     },
//     version: {
//       textAlign: "center",
//       color: COLORS.text.light,
//       fontSize: 12,
//       fontWeight: "500",
//       marginTop: SPACING.xl,
//     },
//   });
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import Feather from "@expo/vector-icons/Feather";

import { useMeQuery, useLogoutMutation } from "../../store/api/auth.api";
import authApi from "../../store/api/auth.api";
import { useGetMyTasksQuery, taskApi } from "../../store/api/task.api";
import { TaskStatus } from "../../types/task.types";
import { useAppDispatch } from "../../store/hooks";
import { clearUser } from "../../store/slices/auth.slice";
import Toast from "../../components/Toast";
import { LogoutModal } from "../../components/profile";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  PLATFORM_STYLES,
  SHADOWS,
} from "../../config/theme";
import { FONTS } from "@/components/fonts";

// ── Helpers ──────────────────────────────────────────────────
const getInitials = (name: string): string => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return words.length === 1
    ? words[0].substring(0, 2).toUpperCase()
    : (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const formatJoinDate = (dateString?: string): string => {
  if (!dateString) return "Recently";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
};

// ── Skeleton shimmer ─────────────────────────────────────────
function SkeletonBlock({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const shimmer = useRef(new Animated.Value(0)).current;
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
    outputRange: [0.4, 0.8],
  });
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: `${COLORS.secondary}22`,
          opacity,
        },
        style,
      ]}
    />
  );
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  value,
  label,
  icon,
  accent = false,
}: {
  value: number;
  label: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <View style={statStyles.card}>
      {accent ? (
        <LinearGradient
          colors={[COLORS.secondaryLight, COLORS.secondary]}
          style={statStyles.iconOrb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={icon as any} size={16} color="#FFF" />
        </LinearGradient>
      ) : (
        <View
          style={[
            statStyles.iconOrb,
            { backgroundColor: `${COLORS.secondary}14` },
          ]}
        >
          <Feather name={icon as any} size={16} color={COLORS.secondary} />
        </View>
      )}
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    ...SHADOWS.sm,
  },
  iconOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: "800",
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.tertiary,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

// ── Menu Item ─────────────────────────────────────────────────
function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  isDangerous = false,
  showArrow = true,
  isLast = false,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDangerous?: boolean;
  showArrow?: boolean;
  isLast?: boolean;
}) {
  const tint = isDangerous ? COLORS.error : COLORS.secondary;
  return (
    <TouchableOpacity
      style={[menuStyles.item, !isLast && menuStyles.itemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[menuStyles.iconBox, { backgroundColor: `${tint}12` }]}>
        <Feather name={icon as any} size={18} color={tint} />
      </View>
      <View style={menuStyles.itemContent}>
        <Text
          style={[menuStyles.itemTitle, isDangerous && { color: COLORS.error }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={menuStyles.itemSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {showArrow && (
        <Feather name="chevron-right" size={16} color={COLORS.text.tertiary} />
      )}
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  itemSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
});

// ── Menu Section Card ─────────────────────────────────────────
function MenuSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.wrapper}>
      {title ? <Text style={sectionStyles.title}>{title}</Text> : null}
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.lg },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.tertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.sm,
  },
});

// ── Screen ───────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const avatarScale = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data: meData, isLoading: isUserLoading } = useMeQuery();
  const user = meData?.user;

  const { data: createdTasks } = useGetMyTasksQuery({ type: "created" });
  const { data: assignedTasks } = useGetMyTasksQuery({ type: "assigned" });

  const taskStats = useMemo(() => {
    const all = [...(createdTasks || []), ...(assignedTasks || [])];
    return {
      completed: all.filter((t) => String(t.status) === TaskStatus.COMPLETED)
        .length,
      created: (createdTasks || []).length,
      inProgress: all.filter((t) => String(t.status) === TaskStatus.PENDING)
        .length,
    };
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
    Animated.spring(avatarScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout().unwrap();
    } catch {}
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(getAuth());
      dispatch(clearUser());
      dispatch(authApi.util.resetApiState());
      dispatch(taskApi.util.resetApiState());
      Toast.show({
        type: "success",
        text1: "Logged out",
        text2: "You've been logged out",
      });
      router.replace("/");
    } catch {
      Toast.show({
        type: "error",
        text1: "Logout Error",
        text2: "Logged out with errors",
      });
      dispatch(clearUser());
      router.replace("/");
    }
  };

  const s = makeStyles(insets);

  // ── Skeleton ──────────────────────────────────────────────
  if (isUserLoading) {
    return (
      <View style={s.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
          translucent
        />
        <View style={[s.header, { paddingTop: insets.top + SPACING.lg }]}>
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
        {/* Avatar skeleton */}
        <View style={{ alignItems: "center", marginTop: SPACING.xl }}>
          <SkeletonBlock width={88} height={88} borderRadius={44} />
          <View
            style={{
              marginTop: SPACING.md,
              gap: SPACING.sm,
              alignItems: "center",
            }}
          >
            <SkeletonBlock
              width={140}
              height={18}
              borderRadius={BORDER_RADIUS.sm}
            />
            <SkeletonBlock
              width={100}
              height={13}
              borderRadius={BORDER_RADIUS.sm}
            />
          </View>
        </View>
        {/* Stats skeleton */}
        <View
          style={{
            flexDirection: "row",
            gap: SPACING.md,
            paddingHorizontal: SPACING.xxl,
            marginTop: SPACING.xl,
          }}
        >
          {[1, 2, 3].map((i) => (
            <SkeletonBlock
              key={i}
              width="30%"
              height={90}
              borderRadius={BORDER_RADIUS.lg}
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent
      />

      {/* ── Header — matches Inbox/Outbox/Alerts ────────────── */}
      <Animated.View
        style={[s.header, { paddingTop: insets.top + SPACING.lg }]}
      >
        <View style={s.headerRow}>
          <View style={s.accentBar} />
          <Animated.View style={{ transform: [{ scale: headerTitleScale }] }}>
            <Text style={s.headerTitle}>PROFILE</Text>
          </Animated.View>
        </View>
        <Animated.View
          style={[s.subtitleRow, { opacity: headerSubtitleOpacity }]}
        >
          <Text style={s.headerSubtitle}>
            Member since {profileData.joinedDate}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {/* ── Avatar Card ───────────────────────────────────── */}
        <View style={s.avatarSection}>
          <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
            {/* Outer glow ring */}
            <View style={s.avatarRing}>
              <LinearGradient
                colors={[
                  COLORS.secondaryLight,
                  COLORS.secondary,
                  COLORS.secondaryDark,
                ]}
                style={s.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={s.avatarInitials}>{profileData.initials}</Text>
              </LinearGradient>
            </View>
          </Animated.View>

          <Text style={s.profileName}>{profileData.name}</Text>
          <Text style={s.profileEmail}>{profileData.email}</Text>

          {/* Joined badge */}
          <View style={s.joinedBadge}>
            <Feather name="calendar" size={11} color={COLORS.secondary} />
            <Text style={s.joinedText}>Joined {profileData.joinedDate}</Text>
          </View>
        </View>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <View style={s.statsRow}>
          <StatCard
            value={taskStats.completed}
            label="Completed"
            icon="check-circle"
            accent
          />
          <StatCard value={taskStats.created} label="Created" icon="send" />
          <StatCard value={taskStats.inProgress} label="Pending" icon="clock" />
        </View>

        {/* ── Menu ──────────────────────────────────────────── */}
        <View style={s.menuWrapper}>
          <MenuSection title="Support">
            <MenuItem
              icon="help-circle"
              title="Help & FAQ"
              subtitle="Answers to common questions"
              onPress={() => router.push("/settings/help")}
            />
            <MenuItem
              icon="message-circle"
              title="Contact Support"
              subtitle="Reach out to our team"
              onPress={() => router.push("/settings/contact")}
            />
            <MenuItem
              icon="file-text"
              title="Terms & Privacy"
              onPress={() => router.push("/settings/terms")}
              isLast
            />
          </MenuSection>

          <MenuSection>
            <MenuItem
              icon="log-out"
              title="Logout"
              onPress={handleLogout}
              showArrow={false}
              isDangerous
              isLast
            />
          </MenuSection>
        </View>

        <Text style={s.version}>Bring Up v1.0.0</Text>
      </Animated.ScrollView>

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

// ── Styles ───────────────────────────────────────────────────
const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    // ── Header — identical to Inbox/Outbox/Alerts
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
    },
    headerSubtitle: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.tertiary,
      fontWeight: "500",
    },

    // ── Avatar section
    avatarSection: {
      alignItems: "center",
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.xxl,
      gap: SPACING.xs,
    },
    // Outer ring — soft orange halo
    avatarRing: {
      width: 96,
      height: 96,
      borderRadius: 48,
      padding: 3,
      backgroundColor: `${COLORS.secondary}20`,
      marginBottom: SPACING.md,
    },
    avatarGradient: {
      width: "100%",
      height: "100%",
      borderRadius: 46,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInitials: {
      fontSize: TYPOGRAPHY.fontSize.xxl,
      fontWeight: "800",
      color: "#FFF",
      letterSpacing: 1,
    },
    profileName: {
      fontSize: TYPOGRAPHY.fontSize.xl,
      fontWeight: "700",
      color: COLORS.text.primary,
      letterSpacing: -0.3,
    },
    profileEmail: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.tertiary,
      fontWeight: "500",
      marginTop: 2,
    },
    joinedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: `${COLORS.secondary}10`,
      borderRadius: BORDER_RADIUS.full,
      paddingHorizontal: SPACING.md,
      paddingVertical: 5,
      marginTop: SPACING.sm,
      borderWidth: 1,
      borderColor: `${COLORS.secondary}20`,
    },
    joinedText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.secondary,
      fontWeight: "700",
      letterSpacing: 0.2,
    },

    // ── Stats
    statsRow: {
      flexDirection: "row",
      gap: SPACING.md,
      paddingHorizontal: SPACING.xxl,
      marginBottom: SPACING.xl,
    },

    // ── Menu
    menuWrapper: {
      paddingHorizontal: SPACING.xxl,
    },

    // ── Footer
    version: {
      textAlign: "center",
      color: COLORS.text.light,
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: "500",
      marginTop: SPACING.lg,
      marginBottom: SPACING.md,
    },

    // ── Scroll
    scrollContent: {
      paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
    },
  });
