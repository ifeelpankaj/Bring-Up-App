/**
 * Outbox Task Categorization Hook
 *
 * Categorizes outbox tasks into pending, inProgress, and closed buckets.
 */

import { useMemo } from "react";
import type { Task, OutboxCategorizedTasks } from "../types/task.types";
import { TaskReaction, TaskStatus } from "../types/task.types";
import { getExpiresAt } from "../utils/task.utils";

/**
 * Hook for categorizing outbox (created) tasks
 *
 * @param tasks - Array of tasks to categorize
 * @returns Categorized tasks object with pending, inProgress, and closed arrays
 */
export const useOutboxTaskCategorization = (
  tasks: Task[] | undefined,
): OutboxCategorizedTasks => {
  return useMemo(() => {
    if (!tasks) {
      return { pending: [], inProgress: [], closed: [] };
    }

    const now = new Date();

    // Helper to check if status matches
    const isStatus = (task: Task, status: TaskStatus): boolean => {
      return String(task.status).toLowerCase() === status.toLowerCase();
    };

    // Helper to check reaction
    const hasReaction = (task: Task, reaction: TaskReaction): boolean => {
      return String(task.assigneeReaction) === reaction;
    };

    // Pending: No reaction yet, not expired
    const pendingTasks = tasks.filter((task: Task) => {
      const expiresAt = getExpiresAt(task);
      const isExpired = expiresAt < now || isStatus(task, TaskStatus.EXPIRED);
      return (
        !task.assigneeReaction &&
        !isExpired &&
        !isStatus(task, TaskStatus.COMPLETED) &&
        !isStatus(task, TaskStatus.CANCELLED)
      );
    });

    // In Progress: Accepted (on_it or running_late), not completed, not expired
    const inProgressTasks = tasks.filter((task: Task) => {
      const expiresAt = getExpiresAt(task);
      const isExpired = expiresAt < now || isStatus(task, TaskStatus.EXPIRED);
      return (
        (hasReaction(task, TaskReaction.ON_IT) ||
          hasReaction(task, TaskReaction.RUNNING_LATE)) &&
        !isExpired &&
        !isStatus(task, TaskStatus.COMPLETED)
      );
    });

    // Closed: Completed, Cant_do, Missed, or Expired
    const closedTasks = tasks.filter((task: Task) => {
      const expiresAt = getExpiresAt(task);
      const isExpired = expiresAt < now || isStatus(task, TaskStatus.EXPIRED);
      return (
        isStatus(task, TaskStatus.COMPLETED) ||
        hasReaction(task, TaskReaction.CANT_DO) ||
        isExpired ||
        isStatus(task, TaskStatus.CANCELLED)
      );
    });

    return {
      pending: pendingTasks,
      inProgress: inProgressTasks,
      closed: closedTasks,
    };
  }, [tasks]);
};
