import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { getStatusBadge } from "../utils/outbox.utils";
import type { TaskCardProps } from "../types/task.types";
import { TaskReaction } from "../types/task.types";

// Countdown timer component - minimal pill style
const CountdownTimer: React.FC<{ expiresAt: any }> = ({ expiresAt }) => {
  const [countdown, setCountdown] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      let date: Date;
      if (expiresAt?._seconds) {
        date = new Date(expiresAt._seconds * 1000);
      } else if (expiresAt?.toDate) {
        date = expiresAt.toDate();
      } else {
        date = new Date(expiresAt);
      }

      const now = new Date();
      const diff = date.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Expired");
        setIsUrgent(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (diff < 3600000) {
        setIsUrgent(true);
        setCountdown(`${minutes}m`);
      } else if (days === 0) {
        setIsUrgent(hours < 3);
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setIsUrgent(false);
        setCountdown(`${days}d ${hours}h`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <View style={[styles.timerPill, isUrgent && styles.timerPillUrgent]}>
      <Feather
        name="clock"
        size={12}
        color={isUrgent ? "#E53935" : "#E88B63"}
      />
      <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
        {countdown}
      </Text>
    </View>
  );
};

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

  const getPersonInfo = () => {
    if (isOutbox) {
      return {
        label: "To",
        name: task.assignedTo.name,
        initial: task.assignedTo.name.charAt(0).toUpperCase(),
      };
    }
    return {
      label: "From",
      name: task.createdBy.name,
      initial: task.createdBy.name.charAt(0).toUpperCase(),
    };
  };

  const personInfo = getPersonInfo();

  // Inactive card for expired/missed tasks (inbox only)
  if (!isOutbox && isExpiredOrMissed) {
    return (
      <Pressable
        style={styles.card}
        onPress={onPress}
        android_ripple={{ color: "rgba(0,0,0,0.04)" }}
      >
        <View style={styles.inactiveCard}>
          <View style={styles.inactiveHeader}>
            <View style={styles.inactiveAvatarSmall}>
              <Text style={styles.inactiveAvatarText}>
                {personInfo.initial}
              </Text>
            </View>
            <View style={styles.inactiveHeaderText}>
              <Text style={styles.inactiveLabel}>{personInfo.label}</Text>
              <Text style={styles.inactiveName}>{personInfo.name}</Text>
            </View>
            <View
              style={[
                styles.statusChip,
                tabType === "expired"
                  ? styles.statusExpired
                  : styles.statusMissed,
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  tabType === "expired"
                    ? styles.statusExpiredText
                    : styles.statusMissedText,
                ]}
              >
                {tabType === "expired" ? "Expired" : "No response"}
              </Text>
            </View>
          </View>

          <Text style={styles.inactiveTitle} numberOfLines={2}>
            {task.title}
          </Text>

          {task.note && (
            <Text style={styles.inactiveNote} numberOfLines={2}>
              {task.note}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  // Outbox card
  if (isOutbox) {
    return (
      <Pressable
        style={styles.card}
        onPress={onPress}
        android_ripple={{ color: "rgba(0,0,0,0.04)" }}
      >
        <View style={styles.cardInner}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{personInfo.initial}</Text>
              </View>
              <View style={styles.personDetails}>
                <Text style={styles.labelText}>TO</Text>
                <Text style={styles.nameText}>{personInfo.name}</Text>
              </View>
            </View>
            <CountdownTimer expiresAt={task.urgency?.expiresAt} />
          </View>

          <Text style={styles.taskTitle} numberOfLines={2}>
            {task.title}
          </Text>

          {task.note && (
            <Text style={styles.taskNote} numberOfLines={2}>
              {task.note}
            </Text>
          )}

          {statusBadge && (
            <View
              style={[
                styles.reactionChip,
                { backgroundColor: `${statusBadge.backgroundColor}15` },
              ]}
            >
              <View
                style={[
                  styles.reactionDot,
                  { backgroundColor: statusBadge.backgroundColor },
                ]}
              />
              <Text
                style={[styles.reactionText, { color: statusBadge.textColor }]}
              >
                {statusBadge.label}
              </Text>
            </View>
          )}

          {onDelete && (
            <TouchableOpacity
              style={styles.deleteRow}
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete();
              }}
              activeOpacity={0.6}
            >
              <Feather name="trash-2" size={14} color="#E53935" />
              <Text style={styles.deleteLabel}>Delete task</Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    );
  }

  // Active inbox card
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.04)" }}
    >
      <View style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{personInfo.initial}</Text>
            </View>
            <View style={styles.personDetails}>
              <Text style={styles.labelText}>FROM</Text>
              <Text style={styles.nameText}>{personInfo.name}</Text>
            </View>
          </View>
          <CountdownTimer expiresAt={task.urgency?.expiresAt} />
        </View>

        <Text style={styles.taskTitle}>{task.title}</Text>

        {task.note && (
          <Text style={styles.taskNote} numberOfLines={3}>
            {task.note}
          </Text>
        )}

        {!hasReacted ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.reactionBtn, styles.btnPrimary]}
              onPress={() => onReaction?.(TaskReaction.ON_IT)}
              activeOpacity={0.7}
            >
              <Feather name="check" size={15} color="#fff" />
              <Text style={styles.btnTextLight}>Got it</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.reactionBtn, styles.btnWarning]}
              onPress={() => onReaction?.(TaskReaction.RUNNING_LATE)}
              activeOpacity={0.7}
            >
              <Feather name="clock" size={15} color="#fff" />
              <Text style={styles.btnTextLight}>Late</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.reactionBtn, styles.btnDanger]}
              onPress={() => onReaction?.(TaskReaction.NEED_HELP)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={15} color="#fff" />
              <Text style={styles.btnTextLight}>Can't</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={onMarkDone}
            activeOpacity={0.7}
          >
            <Feather name="check-circle" size={16} color="#fff" />
            <Text style={styles.doneBtnText}>Mark as Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Card Container
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardInner: {
    padding: 16,
  },

  // Header Row
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E88B63",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  personDetails: {
    marginLeft: 12,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },

  // Timer Pill
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  timerPillUrgent: {
    backgroundColor: "#FEE2E2",
  },
  timerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E88B63",
  },
  timerTextUrgent: {
    color: "#E53935",
  },

  // Task Content
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 22,
    marginBottom: 6,
  },
  taskNote: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 14,
  },

  // Reaction Chip (for outbox status)
  reactionChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  reactionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reactionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Action Buttons Row
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  reactionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  btnPrimary: {
    backgroundColor: "#E88B63",
  },
  btnWarning: {
    backgroundColor: "#F59E0B",
  },
  btnDanger: {
    backgroundColor: "#EF4444",
  },
  btnTextLight: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Mark Done Button
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 4,
    gap: 8,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Delete Row
  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 14,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 6,
  },
  deleteLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#E53935",
  },

  // Inactive Card Styles
  inactiveCard: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  inactiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inactiveAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveAvatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  inactiveHeaderText: {
    flex: 1,
    marginLeft: 10,
  },
  inactiveLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.4,
  },
  inactiveName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  inactiveTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 4,
  },
  inactiveNote: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusExpired: {
    backgroundColor: "#FEE2E2",
  },
  statusMissed: {
    backgroundColor: "#FEF3C7",
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusExpiredText: {
    color: "#DC2626",
  },
  statusMissedText: {
    color: "#D97706",
  },
});

export default TaskCard;
