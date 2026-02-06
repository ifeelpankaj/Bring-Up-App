/**
 * Outbox Utilities
 *
 * Helper functions for outbox task operations.
 */

import type { Task } from "../types/task.types";
import { TaskReaction, TaskStatus } from "../types/task.types";
import { getExpiresAt, parseTimestamp } from "./task.utils";

/** Status badge configuration */
export interface StatusBadge {
  label: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
}

/**
 * Check if task has a specific status
 */
const isStatus = (task: Task, status: TaskStatus | string): boolean => {
  return String(task.status).toLowerCase() === status.toLowerCase();
};

/**
 * Check if task has a specific reaction
 */
const hasReaction = (task: Task, reaction: TaskReaction): boolean => {
  return String(task.assigneeReaction) === reaction;
};

/**
 * Get status badge configuration for outbox tasks
 */
export const getStatusBadge = (task: Task): StatusBadge => {
  const now = new Date();
  const expiresAt = getExpiresAt(task);
  const isExpired = expiresAt < now || isStatus(task, TaskStatus.EXPIRED);

  // Completed
  if (isStatus(task, TaskStatus.COMPLETED)) {
    return {
      label: "Completed",
      backgroundColor: "#E8F5E9",
      textColor: "#2E7D32",
      icon: "check-circle",
    };
  }

  // Can't do
  if (hasReaction(task, TaskReaction.CANT_DO)) {
    return {
      label: "Can't",
      backgroundColor: "#FFEBEE",
      textColor: "#C62828",
      icon: "x-circle",
    };
  }

  // Missed (expired with no reaction)
  if (isExpired && !task.assigneeReaction) {
    return {
      label: "Missed",
      backgroundColor: "#ECEFF1",
      textColor: "#546E7A",
      icon: "alert-circle",
    };
  }

  // Expired (had reaction but didn't complete)
  if (isExpired && task.assigneeReaction) {
    return {
      label: "Expired",
      backgroundColor: "#F5F5F5",
      textColor: "#9E9E9E",
      icon: "clock",
    };
  }

  // Running Late
  if (hasReaction(task, TaskReaction.RUNNING_LATE)) {
    return {
      label: "Running Late",
      backgroundColor: "#FFF3E0",
      textColor: "#E65100",
      icon: "alert-triangle",
    };
  }

  // Accepted (got it)
  if (hasReaction(task, TaskReaction.ON_IT)) {
    return {
      label: "Accepted",
      backgroundColor: "#E8F5E9",
      textColor: "#388E3C",
      icon: "thumbs-up",
    };
  }

  // Waiting (no reaction yet)
  return {
    label: "Waiting",
    backgroundColor: "#FFF8E1",
    textColor: "#F57C00",
    icon: "clock",
  };
};

/**
 * Format deadline for outbox tasks
 */
export const formatOutboxDeadline = (task: Task): string => {
  const expiresAt = getExpiresAt(task);
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff < 0) {
    return "Expired";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  }

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m left`;
};
