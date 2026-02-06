import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { Task } from "../types/task.types";
import { TaskReaction, TaskStatus } from "../types/task.types";
import { formatTimeRemaining } from "../utils/task.utils";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../config/theme";

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onReaction?: (reaction: TaskReaction) => void;
  onMarkDone?: () => void;
  onDelete?: () => void;
  mode: "inbox" | "outbox";
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  onClose,
  onReaction,
  onMarkDone,
  onDelete,
  mode,
}) => {
  if (!task) return null;

  const isExpired = task.status === TaskStatus.EXPIRED;
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isPending = task.status === TaskStatus.PENDING;

  const reaction = String(task.assigneeReaction);
  const hasReacted =
    reaction === TaskReaction.ON_IT || reaction === TaskReaction.RUNNING_LATE;

  const getStatusColor = () => {
    if (isCompleted) return COLORS.success;
    if (isExpired) return COLORS.error;
    return COLORS.secondary;
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (isExpired) return "Expired";
    if (task.assigneeReaction) {
      return task.assigneeReaction.replace(/_/g, " ");
    }
    return "Pending";
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "N/A";

    let date: Date;

    // Handle Firestore Timestamp
    if (timestamp && typeof timestamp === "object" && "_seconds" in timestamp) {
      const ts = timestamp as { _seconds: number; _nanoseconds?: number };
      date = new Date(ts._seconds * 1000);
    }
    // Handle Firestore Timestamp.toDate() method
    else if (
      timestamp &&
      typeof timestamp === "object" &&
      "toDate" in timestamp
    ) {
      const ts = timestamp as { toDate: () => Date };
      date = ts.toDate();
    }
    // Handle regular Date or timestamp number/string
    else {
      date = new Date(timestamp as string | number);
    }

    // Validate date
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor()}20` },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor() },
                  ]}
                />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Feather name="x" size={22} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{task.title}</Text>

            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <View style={styles.metaIcon}>
                  <Feather
                    name={mode === "inbox" ? "user" : "send"}
                    size={16}
                    color={COLORS.text.light}
                  />
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.metaLabel}>
                    {mode === "inbox" ? "From" : "Assigned to"}
                  </Text>
                  <Text style={styles.metaValue}>
                    {mode === "inbox"
                      ? task.createdBy.name
                      : task.assignedTo.name}
                  </Text>
                  <Text style={styles.metaEmail}>
                    {mode === "inbox"
                      ? task.createdBy.email
                      : task.assignedTo.email}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaIcon}>
                  <Feather name="clock" size={16} color={COLORS.text.light} />
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.metaLabel}>Time Remaining</Text>
                  <Text
                    style={[
                      styles.metaValue,
                      { color: isExpired ? COLORS.error : COLORS.secondary },
                    ]}
                  >
                    {formatTimeRemaining(task)}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaIcon}>
                  <Feather
                    name="calendar"
                    size={16}
                    color={COLORS.text.light}
                  />
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.metaLabel}>Created</Text>
                  <Text style={styles.metaValue}>
                    {formatDate(task.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={[styles.metaRow, { marginBottom: 0 }]}>
                <View style={styles.metaIcon}>
                  <Feather name="zap" size={16} color={COLORS.text.light} />
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.metaLabel}>Duration</Text>
                  <Text style={styles.metaValue}>
                    {task.urgency?.durationMinutes
                      ? `${task.urgency.durationMinutes} minutes`
                      : "Not set"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <View style={styles.notesContainer}>
                {task.note ? (
                  <Text style={styles.notesText}>{task.note}</Text>
                ) : (
                  <Text style={styles.noNotesText}>No notes added</Text>
                )}
              </View>
            </View>

            {mode === "outbox" && task.assigneeReaction && (
              <View style={styles.reactionSection}>
                <Text style={styles.reactionLabel}>
                  Response from {task.assignedTo.name}
                </Text>
                <View style={styles.reactionBadge}>
                  <Feather
                    name={
                      task.assigneeReaction === TaskReaction.ON_IT
                        ? "check-circle"
                        : task.assigneeReaction === TaskReaction.RUNNING_LATE
                          ? "clock"
                          : "alert-circle"
                    }
                    size={18}
                    color={COLORS.secondary}
                  />
                  <Text style={styles.reactionText}>
                    {task.assigneeReaction.replace(/_/g, " ")}
                  </Text>
                </View>
              </View>
            )}

            {mode === "inbox" && isPending && (
              <View style={styles.actionsSection}>
                {!hasReacted ? (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => onReaction?.(TaskReaction.ON_IT)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryButtonText}>Got it</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.secondaryButton]}
                      onPress={() => onReaction?.(TaskReaction.RUNNING_LATE)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.secondaryButtonText}>
                        Running late
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.tertiaryButton]}
                      onPress={() => onReaction?.(TaskReaction.NEED_HELP)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.tertiaryButtonText}>Can't</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.markDoneButton}
                    onPress={onMarkDone}
                    activeOpacity={0.8}
                  >
                    <Feather name="check" size={18} color={COLORS.text.white} />
                    <Text style={styles.markDoneText}>Mark as Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {mode === "outbox" && onDelete && (
              <View style={styles.actionsSection}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={onDelete}
                  activeOpacity={0.8}
                >
                  <Feather name="trash-2" size={18} color={COLORS.error} />
                  <Text style={styles.deleteButtonText}>Delete Task</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay.medium,
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.85,
    ...SHADOWS.lg,
  },
  header: {
    alignItems: "center",
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.text.light,
    borderRadius: 2,
    opacity: 0.3,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: "700",
    color: COLORS.text.primary,
    lineHeight: 32,
    marginBottom: SPACING.lg,
  },
  metaSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.secondary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  metaContent: {
    flex: 1,
  },
  metaLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.light,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  metaEmail: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  notesSection: {
    marginBottom: SPACING.lg,
  },
  notesLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 80,
  },
  notesText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  noNotesText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.light,
    fontStyle: "italic",
  },
  reactionSection: {
    marginBottom: SPACING.lg,
  },
  reactionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  reactionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.secondary}15`,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  reactionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.secondary,
    textTransform: "capitalize",
  },
  actionsSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tertiaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.white,
  },
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  tertiaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  markDoneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  markDoneText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.white,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: `${COLORS.error}10`,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
  },
  deleteButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.error,
  },
  bottomSpacer: {
    height: SPACING.xxxl,
  },
});

export default TaskDetailModal;
