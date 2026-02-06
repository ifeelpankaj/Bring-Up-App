/**
 * Task Utilities
 *
 * Helper functions for task-related operations.
 */

import type { Task, TimestampLike } from "../types/task.types";

/**
 * Parse Firebase Timestamp to Date object
 * Handles multiple timestamp formats from Firebase
 */
export const parseTimestamp = (timestamp: TimestampLike): Date => {
  if (!timestamp) {
    return new Date();
  }

  // Firebase Timestamp with _seconds
  if (
    typeof timestamp === "object" &&
    "_seconds" in timestamp &&
    timestamp._seconds
  ) {
    return new Date(timestamp._seconds * 1000);
  }

  // Firebase Timestamp with toDate method
  if (
    typeof timestamp === "object" &&
    "toDate" in timestamp &&
    typeof timestamp.toDate === "function"
  ) {
    return timestamp.toDate();
  }

  // Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // String or number
  return new Date(timestamp as string | number);
};

/**
 * Get expiration date from task
 */
export const getExpiresAt = (task: Task): Date => {
  return parseTimestamp(task.urgency.expiresAt);
};

/**
 * Check if a task is expired
 */
export const isTaskExpired = (task: Task): boolean => {
  const expiresAt = getExpiresAt(task);
  return expiresAt < new Date();
};

/**
 * Format time remaining for a task
 * Returns human-readable time string like "2h 30m" or "3d 5h"
 */
export const formatTimeRemaining = (task: Task): string => {
  const now = new Date();
  const expiresAt = getExpiresAt(task);
  const diff = expiresAt.getTime() - now.getTime();

  if (diff < 0) {
    return "Expired";
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  return `${minutes}m`;
};

/**
 * Format time remaining with more detail for display
 */
export const formatDetailedTimeRemaining = (task: Task): string => {
  const now = new Date();
  const expiresAt = getExpiresAt(task);
  const diff = expiresAt.getTime() - now.getTime();

  if (diff < 0) {
    return "Task has expired";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} remaining`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes} minute${minutes !== 1 ? "s" : ""} remaining`;
};

/**
 * Get task creation date formatted
 */
export const formatCreatedAt = (task: Task): string => {
  const createdAt = parseTimestamp(task.createdAt);
  return createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Calculate urgency level based on time remaining
 * Returns: 'high' (< 1 hour), 'medium' (< 4 hours), 'low' (> 4 hours)
 */
export const getUrgencyLevel = (task: Task): "high" | "medium" | "low" => {
  const now = new Date();
  const expiresAt = getExpiresAt(task);
  const diff = expiresAt.getTime() - now.getTime();
  const hoursRemaining = diff / (1000 * 60 * 60);

  if (hoursRemaining <= 1) return "high";
  if (hoursRemaining <= 4) return "medium";
  return "low";
};
