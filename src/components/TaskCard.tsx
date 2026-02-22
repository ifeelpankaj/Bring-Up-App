// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import Feather from "@expo/vector-icons/Feather";

// import { getStatusBadge } from "../utils/outbox.utils";
// import type { TaskCardProps } from "../types/task.types";
// import { TaskReaction } from "../types/task.types";

// // Countdown timer component - minimal pill style
// const CountdownTimer: React.FC<{ expiresAt: any }> = ({ expiresAt }) => {
//   const [countdown, setCountdown] = useState<string>("");
//   const [isUrgent, setIsUrgent] = useState(false);

//   useEffect(() => {
//     const calculateCountdown = () => {
//       let date: Date;
//       if (expiresAt?._seconds) {
//         date = new Date(expiresAt._seconds * 1000);
//       } else if (expiresAt?.toDate) {
//         date = expiresAt.toDate();
//       } else {
//         date = new Date(expiresAt);
//       }

//       const now = new Date();
//       const diff = date.getTime() - now.getTime();

//       if (diff <= 0) {
//         setCountdown("Expired");
//         setIsUrgent(true);
//         return;
//       }

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
//       );
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//       if (diff < 3600000) {
//         setIsUrgent(true);
//         setCountdown(`${minutes}m`);
//       } else if (days === 0) {
//         setIsUrgent(hours < 3);
//         setCountdown(`${hours}h ${minutes}m`);
//       } else {
//         setIsUrgent(false);
//         setCountdown(`${days}d ${hours}h`);
//       }
//     };

//     calculateCountdown();
//     const interval = setInterval(calculateCountdown, 60000);
//     return () => clearInterval(interval);
//   }, [expiresAt]);

//   return (
//     <View style={[styles.timerPill, isUrgent && styles.timerPillUrgent]}>
//       <Feather
//         name="clock"
//         size={12}
//         color={isUrgent ? "#E53935" : "#E88B63"}
//       />
//       <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
//         {countdown}
//       </Text>
//     </View>
//   );
// };

// export const TaskCard: React.FC<TaskCardProps> = ({
//   task,
//   mode,
//   tabType,
//   onReaction,
//   onMarkDone,
//   onDelete,
//   onPress,
// }) => {
//   const reaction = String(task.assigneeReaction);
//   const hasReacted =
//     reaction === TaskReaction.ON_IT || reaction === TaskReaction.RUNNING_LATE;

//   const isExpiredOrMissed = tabType === "missed" || tabType === "expired";
//   const isOutbox = mode === "outbox";
//   const statusBadge = isOutbox ? getStatusBadge(task) : null;

//   const getPersonInfo = () => {
//     if (isOutbox) {
//       return {
//         label: "To",
//         name: task.assignedTo.name,
//         initial: task.assignedTo.name.charAt(0).toUpperCase(),
//       };
//     }
//     return {
//       label: "From",
//       name: task.createdBy.name,
//       initial: task.createdBy.name.charAt(0).toUpperCase(),
//     };
//   };

//   const personInfo = getPersonInfo();

//   // Inactive card for expired/missed tasks (inbox only)
//   if (!isOutbox && isExpiredOrMissed) {
//     return (
//       <Pressable
//         style={styles.card}
//         onPress={onPress}
//         android_ripple={{ color: "rgba(0,0,0,0.04)" }}
//       >
//         <View style={styles.inactiveCard}>
//           <View style={styles.inactiveHeader}>
//             <View style={styles.inactiveAvatarSmall}>
//               <Text style={styles.inactiveAvatarText}>
//                 {personInfo.initial}
//               </Text>
//             </View>
//             <View style={styles.inactiveHeaderText}>
//               <Text style={styles.inactiveLabel}>{personInfo.label}</Text>
//               <Text style={styles.inactiveName}>{personInfo.name}</Text>
//             </View>
//             <View
//               style={[
//                 styles.statusChip,
//                 tabType === "expired"
//                   ? styles.statusExpired
//                   : styles.statusMissed,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.statusChipText,
//                   tabType === "expired"
//                     ? styles.statusExpiredText
//                     : styles.statusMissedText,
//                 ]}
//               >
//                 {tabType === "expired" ? "Expired" : "No response"}
//               </Text>
//             </View>
//           </View>

//           <Text style={styles.inactiveTitle} numberOfLines={2}>
//             {task.title}
//           </Text>

//           {task.note && (
//             <Text style={styles.inactiveNote} numberOfLines={2}>
//               {task.note}
//             </Text>
//           )}
//         </View>
//       </Pressable>
//     );
//   }

//   // Outbox card
//   if (isOutbox) {
//     return (
//       <Pressable
//         style={styles.card}
//         onPress={onPress}
//         android_ripple={{ color: "rgba(0,0,0,0.04)" }}
//       >
//         <View style={styles.cardInner}>
//           <View style={styles.cardHeader}>
//             <View style={styles.avatarContainer}>
//               <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>{personInfo.initial}</Text>
//               </View>
//               <View style={styles.personDetails}>
//                 <Text style={styles.labelText}>TO</Text>
//                 <Text style={styles.nameText}>{personInfo.name}</Text>
//               </View>
//             </View>
//             <CountdownTimer expiresAt={task.urgency?.expiresAt} />
//           </View>

//           <Text style={styles.taskTitle} numberOfLines={2}>
//             {task.title}
//           </Text>

//           {task.note && (
//             <Text style={styles.taskNote} numberOfLines={2}>
//               {task.note}
//             </Text>
//           )}

//           {statusBadge && (
//             <View
//               style={[
//                 styles.reactionChip,
//                 { backgroundColor: `${statusBadge.backgroundColor}15` },
//               ]}
//             >
//               <View
//                 style={[
//                   styles.reactionDot,
//                   { backgroundColor: statusBadge.backgroundColor },
//                 ]}
//               />
//               <Text
//                 style={[styles.reactionText, { color: statusBadge.textColor }]}
//               >
//                 {statusBadge.label}
//               </Text>
//             </View>
//           )}

//           {onDelete && (
//             <TouchableOpacity
//               style={styles.deleteRow}
//               onPress={(e) => {
//                 e.stopPropagation?.();
//                 onDelete();
//               }}
//               activeOpacity={0.6}
//             >
//               <Feather name="trash-2" size={14} color="#E53935" />
//               <Text style={styles.deleteLabel}>Delete task</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </Pressable>
//     );
//   }

//   // Active inbox card
//   return (
//     <Pressable
//       style={styles.card}
//       onPress={onPress}
//       android_ripple={{ color: "rgba(0,0,0,0.04)" }}
//     >
//       <View style={styles.cardInner}>
//         <View style={styles.cardHeader}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>{personInfo.initial}</Text>
//             </View>
//             <View style={styles.personDetails}>
//               <Text style={styles.labelText}>FROM</Text>
//               <Text style={styles.nameText}>{personInfo.name}</Text>
//             </View>
//           </View>
//           <CountdownTimer expiresAt={task.urgency?.expiresAt} />
//         </View>

//         <Text style={styles.taskTitle}>{task.title}</Text>

//         {task.note && (
//           <Text style={styles.taskNote} numberOfLines={3}>
//             {task.note}
//           </Text>
//         )}

//         {!hasReacted ? (
//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={[styles.reactionBtn, styles.btnPrimary]}
//               onPress={() => onReaction?.(TaskReaction.ON_IT)}
//               activeOpacity={0.7}
//             >
//               <Feather name="check" size={15} color="#fff" />
//               <Text style={styles.btnTextLight}>Got it</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.reactionBtn, styles.btnWarning]}
//               onPress={() => onReaction?.(TaskReaction.RUNNING_LATE)}
//               activeOpacity={0.7}
//             >
//               <Feather name="clock" size={15} color="#fff" />
//               <Text style={styles.btnTextLight}>Late</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.reactionBtn, styles.btnDanger]}
//               onPress={() => onReaction?.(TaskReaction.NEED_HELP)}
//               activeOpacity={0.7}
//             >
//               <Feather name="x" size={15} color="#fff" />
//               <Text style={styles.btnTextLight}>Can't</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity
//             style={styles.doneBtn}
//             onPress={onMarkDone}
//             activeOpacity={0.7}
//           >
//             <Feather name="check-circle" size={16} color="#fff" />
//             <Text style={styles.doneBtnText}>Mark as Done</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   // Card Container
//   card: {
//     marginBottom: 12,
//     borderRadius: 16,
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardInner: {
//     padding: 16,
//   },

//   // Header Row
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },
//   avatarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   avatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#E88B63",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   avatarText: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
//   personDetails: {
//     marginLeft: 12,
//   },
//   labelText: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "#9CA3AF",
//     letterSpacing: 0.5,
//     marginBottom: 2,
//   },
//   nameText: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#1F2937",
//   },

//   // Timer Pill
//   timerPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFF5F0",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 5,
//   },
//   timerPillUrgent: {
//     backgroundColor: "#FEE2E2",
//   },
//   timerText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#E88B63",
//   },
//   timerTextUrgent: {
//     color: "#E53935",
//   },

//   // Task Content
//   taskTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1F2937",
//     lineHeight: 22,
//     marginBottom: 6,
//   },
//   taskNote: {
//     fontSize: 14,
//     color: "#6B7280",
//     lineHeight: 20,
//     marginBottom: 14,
//   },

//   // Reaction Chip (for outbox status)
//   reactionChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     marginBottom: 12,
//     gap: 6,
//   },
//   reactionDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   reactionText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   // Action Buttons Row
//   buttonRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 4,
//   },
//   reactionBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 11,
//     borderRadius: 10,
//     gap: 6,
//   },
//   btnPrimary: {
//     backgroundColor: "#E88B63",
//   },
//   btnWarning: {
//     backgroundColor: "#F59E0B",
//   },
//   btnDanger: {
//     backgroundColor: "#EF4444",
//   },
//   btnTextLight: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },

//   // Mark Done Button
//   doneBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#22C55E",
//     paddingVertical: 14,
//     borderRadius: 10,
//     marginTop: 4,
//     gap: 8,
//   },
//   doneBtnText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },

//   // Delete Row
//   deleteRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 14,
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//     gap: 6,
//   },
//   deleteLabel: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#E53935",
//   },

//   // Inactive Card Styles
//   inactiveCard: {
//     padding: 16,
//     backgroundColor: "#F9FAFB",
//   },
//   inactiveHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   inactiveAvatarSmall: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   inactiveAvatarText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#9CA3AF",
//   },
//   inactiveHeaderText: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   inactiveLabel: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#9CA3AF",
//     letterSpacing: 0.4,
//   },
//   inactiveName: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//   },
//   inactiveTitle: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#6B7280",
//     lineHeight: 21,
//     marginBottom: 4,
//   },
//   inactiveNote: {
//     fontSize: 13,
//     color: "#9CA3AF",
//     lineHeight: 18,
//   },
//   statusChip: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   statusExpired: {
//     backgroundColor: "#FEE2E2",
//   },
//   statusMissed: {
//     backgroundColor: "#FEF3C7",
//   },
//   statusChipText: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   statusExpiredText: {
//     color: "#DC2626",
//   },
//   statusMissedText: {
//     color: "#D97706",
//   },
// });

// export default TaskCard;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";

import { getStatusBadge } from "../utils/outbox.utils";
import type { TaskCardProps } from "../types/task.types";
import { TaskReaction } from "../types/task.types";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../config/theme";

// ── Countdown Timer ──────────────────────────────────────────
const CountdownTimer: React.FC<{ expiresAt: any }> = ({ expiresAt }) => {
  const [countdown, setCountdown] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculate = () => {
      let date: Date;
      if (expiresAt?._seconds) date = new Date(expiresAt._seconds * 1000);
      else if (expiresAt?.toDate) date = expiresAt.toDate();
      else date = new Date(expiresAt);

      const diff = date.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Expired");
        setIsUrgent(true);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);

      if (diff < 3600000) {
        setIsUrgent(true);
        setCountdown(`${mins}m`);
      } else if (days === 0) {
        setIsUrgent(hours < 3);
        setCountdown(`${hours}h ${mins}m`);
      } else {
        setIsUrgent(false);
        setCountdown(`${days}d ${hours}h`);
      }
    };
    calculate();
    const id = setInterval(calculate, 60000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <View style={[s.timerPill, isUrgent && s.timerPillUrgent]}>
      <Feather
        name="clock"
        size={11}
        color={isUrgent ? COLORS.error : COLORS.secondary}
      />
      <Text style={[s.timerText, isUrgent && s.timerTextUrgent]}>
        {countdown}
      </Text>
    </View>
  );
};

// ── Avatar Orb ───────────────────────────────────────────────
const AvatarOrb = ({
  initial,
  size = 44,
  muted = false,
}: {
  initial: string;
  size?: number;
  muted?: boolean;
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    {muted ? (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.backgroundDark,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: size * 0.38,
            fontWeight: "700",
            color: COLORS.text.tertiary,
          }}
        >
          {initial}
        </Text>
      </View>
    ) : (
      <LinearGradient
        colors={[COLORS.secondaryLight, COLORS.secondary]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text
          style={{ fontSize: size * 0.38, fontWeight: "700", color: "#FFF" }}
        >
          {initial}
        </Text>
      </LinearGradient>
    )}
  </View>
);

// ── Main TaskCard ─────────────────────────────────────────────
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  mode,
  tabType,
  onReaction,
  onMarkDone,
  onDelete,
  onPress,
}) => {
  const reaction = String(task.assigneeReaction);
  const hasReacted =
    reaction === TaskReaction.ON_IT || reaction === TaskReaction.RUNNING_LATE;

  const isExpiredOrMissed = tabType === "missed" || tabType === "expired";
  const isOutbox = mode === "outbox";
  const statusBadge = isOutbox ? getStatusBadge(task) : null;

  const personInfo = isOutbox
    ? {
        label: "TO",
        name: task.assignedTo.name,
        initial: task.assignedTo.name.charAt(0).toUpperCase(),
      }
    : {
        label: "FROM",
        name: task.createdBy.name,
        initial: task.createdBy.name.charAt(0).toUpperCase(),
      };

  // ── Inactive card (expired / missed inbox tasks) ────────────
  if (!isOutbox && isExpiredOrMissed) {
    const isExpired = tabType === "expired";
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: `${COLORS.secondary}08` }}
      >
        <View style={[s.card, s.cardMuted]}>
          {/* Muted left edge — grey for expired/missed */}
          <View
            style={[
              s.accentEdge,
              {
                backgroundColor: isExpired
                  ? COLORS.status.expired
                  : COLORS.status.missed,
              },
            ]}
          />

          <View style={s.inner}>
            {/* Header */}
            <View style={s.header}>
              <AvatarOrb initial={personInfo.initial} size={38} muted />
              <View style={s.personBlock}>
                <Text style={s.personLabel}>{personInfo.label}</Text>
                <Text style={s.personName}>{personInfo.name}</Text>
              </View>
              {/* Status chip */}
              <View
                style={[
                  s.statusChip,
                  {
                    backgroundColor: isExpired
                      ? COLORS.status.expiredBg
                      : COLORS.status.missedBg,
                  },
                ]}
              >
                <View
                  style={[
                    s.statusDot,
                    {
                      backgroundColor: isExpired
                        ? COLORS.status.expired
                        : COLORS.status.missed,
                    },
                  ]}
                />
                <Text
                  style={[
                    s.statusChipText,
                    {
                      color: isExpired
                        ? COLORS.status.expired
                        : COLORS.status.missed,
                    },
                  ]}
                >
                  {isExpired ? "Expired" : "No response"}
                </Text>
              </View>
            </View>

            <Text style={s.mutedTitle} numberOfLines={2}>
              {task.title}
            </Text>
            {task.note ? (
              <Text style={s.mutedNote} numberOfLines={2}>
                {task.note}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  }

  // ── Outbox card ─────────────────────────────────────────────
  if (isOutbox) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: `${COLORS.secondary}08` }}
      >
        <View style={s.card}>
          {/* Orange left accent edge */}
          <View style={[s.accentEdge, { backgroundColor: COLORS.secondary }]} />

          <View style={s.inner}>
            <View style={s.header}>
              <AvatarOrb initial={personInfo.initial} />
              <View style={s.personBlock}>
                <Text style={s.personLabel}>{personInfo.label}</Text>
                <Text style={s.personName}>{personInfo.name}</Text>
              </View>
              <CountdownTimer expiresAt={task.urgency?.expiresAt} />
            </View>

            <Text style={s.taskTitle} numberOfLines={2}>
              {task.title}
            </Text>

            {task.note ? (
              <Text style={s.taskNote} numberOfLines={2}>
                {task.note}
              </Text>
            ) : null}

            {statusBadge ? (
              <View
                style={[
                  s.reactionChip,
                  { backgroundColor: `${statusBadge.backgroundColor}14` },
                ]}
              >
                <View
                  style={[
                    s.reactionDot,
                    { backgroundColor: statusBadge.backgroundColor },
                  ]}
                />
                <Text
                  style={[s.reactionChipText, { color: statusBadge.textColor }]}
                >
                  {statusBadge.label}
                </Text>
              </View>
            ) : null}

            {onDelete ? (
              <TouchableOpacity
                style={s.deleteRow}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onDelete();
                }}
                activeOpacity={0.6}
              >
                <Feather name="trash-2" size={13} color={COLORS.error} />
                <Text style={s.deleteText}>Delete task</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  }

  // ── Active Inbox card ────────────────────────────────────────
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: `${COLORS.secondary}08` }}
    >
      <View style={s.card}>
        <View style={[s.accentEdge, { backgroundColor: COLORS.secondary }]} />

        <View style={s.inner}>
          <View style={s.header}>
            <AvatarOrb initial={personInfo.initial} />
            <View style={s.personBlock}>
              <Text style={s.personLabel}>{personInfo.label}</Text>
              <Text style={s.personName}>{personInfo.name}</Text>
            </View>
            <CountdownTimer expiresAt={task.urgency?.expiresAt} />
          </View>

          <Text style={s.taskTitle} numberOfLines={2}>
            {task.title}
          </Text>

          {task.note ? (
            <Text style={s.taskNote} numberOfLines={3}>
              {task.note}
            </Text>
          ) : null}

          {!hasReacted ? (
            // ── 3-button reaction row
            <View style={s.buttonRow}>
              <TouchableOpacity
                style={[s.reactionBtn, s.btnGotIt]}
                onPress={() => onReaction?.(TaskReaction.ON_IT)}
                activeOpacity={0.75}
              >
                <LinearGradient
                  colors={[COLORS.secondaryLight, COLORS.secondary]}
                  style={s.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Feather name="check" size={14} color="#FFF" />
                  <Text style={s.btnText}>Got it</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.reactionBtn, s.btnLate]}
                onPress={() => onReaction?.(TaskReaction.RUNNING_LATE)}
                activeOpacity={0.75}
              >
                <View style={s.btnSolid}>
                  <Feather name="clock" size={14} color={COLORS.warning} />
                  <Text style={[s.btnText, { color: COLORS.warning }]}>
                    Late
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.reactionBtn, s.btnCant]}
                onPress={() => onReaction?.(TaskReaction.CANT_DO)}
                activeOpacity={0.75}
              >
                <View
                  style={[s.btnSolid, { backgroundColor: COLORS.errorLight }]}
                >
                  <Feather name="x" size={14} color={COLORS.error} />
                  <Text style={[s.btnText, { color: COLORS.error }]}>
                    Can't
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            // ── Mark done button
            <TouchableOpacity
              style={s.doneBtn}
              onPress={onMarkDone}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[COLORS.success, COLORS.successDark]}
                style={s.doneBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="check-circle" size={16} color="#FFF" />
                <Text style={s.doneBtnText}>Mark as Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// ── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  // ── Card shell
  card: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    overflow: "hidden",
    // Slim, warm shadow matching tab bar
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardMuted: {
    backgroundColor: COLORS.backgroundDark,
    shadowOpacity: 0.04,
  },

  // Orange left-edge accent bar (same 4px pattern as screen headers)
  accentEdge: {
    width: 4,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
  },

  // Main content padding
  inner: {
    flex: 1,
    padding: SPACING.lg,
  },

  // ── Header row (avatar + person + timer)
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  personBlock: {
    flex: 1,
    gap: 2,
  },
  personLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.tertiary,
    letterSpacing: 0.8,
  },
  personName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "700",
    color: COLORS.text.primary,
    letterSpacing: -0.2,
  },

  // ── Timer pill
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.secondary}12`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
    flexShrink: 0,
  },
  timerPillUrgent: {
    backgroundColor: COLORS.errorLight,
  },
  timerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  timerTextUrgent: {
    color: COLORS.error,
  },

  // ── Task content
  taskTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "700",
    color: COLORS.text.primary,
    lineHeight: 22,
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },
  taskNote: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },

  // ── Status chip (outbox reaction state)
  reactionChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  reactionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reactionChipText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // ── Delete row
  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SPACING.xs,
  },
  deleteText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.error,
  },

  // ── Reaction buttons
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  reactionBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  btnGotIt: {},
  btnLate: {
    backgroundColor: COLORS.warningLight,
  },
  btnCant: {
    backgroundColor: COLORS.errorLight,
  },
  // Gradient fill for "Got it"
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  // Flat fill for "Late" and "Can't"
  btnSolid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
    backgroundColor: COLORS.warningLight,
  },
  btnText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.2,
  },

  // ── Mark done button
  doneBtn: {
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    marginTop: SPACING.xs,
  },
  doneBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  doneBtnText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.2,
  },

  // ── Muted (expired / missed) variants
  mutedTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING.xs,
  },
  mutedNote: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.tertiary,
    lineHeight: 18,
  },

  // ── Status chip (inactive cards)
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    gap: 5,
    flexShrink: 0,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusChipText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});

export default TaskCard;
