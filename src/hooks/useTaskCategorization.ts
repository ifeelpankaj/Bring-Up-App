/**
 * Task Categorization Hook
 *
 * Categorizes inbox tasks into new, missed, and expired buckets.
 */

import { useMemo } from "react";
import {
  Task,
  TaskReaction,
  TaskStatus,
  InboxCategorizedTasks,
} from "../types/task.types";
import { getExpiresAt } from "../utils/task.utils";

/**
 * Hook for categorizing inbox tasks
 *
 * @param tasks - Array of tasks to categorize
 * @returns Categorized tasks object with new, missed, and expired arrays
 */
export const useTaskCategorization = (
  tasks: Task[] | undefined,
): InboxCategorizedTasks => {
  return useMemo(() => {
    if (!tasks) {
      return { new: [], missed: [], expired: [] };
    }

    const now = new Date();

    // New tasks: pending status, not expired, and user can still react
    const newTasks = tasks.filter((task: Task) => {
      const expiresAt = getExpiresAt(task);
      const isExpired =
        expiresAt < now ||
        String(task.status).toLowerCase() === TaskStatus.EXPIRED;

      // Show in New if: not expired, and either no reaction or reacted with on_it/running_late (so they can mark done)
      const reaction = String(task.assigneeReaction).toLowerCase();
      return (
        !isExpired &&
        String(task.status).toLowerCase() !== TaskStatus.EXPIRED &&
        String(task.status).toLowerCase() !== TaskStatus.COMPLETED &&
        reaction !== TaskReaction.CANT_DO
      );
    });

    // Missed tasks: expired/past deadline with no reaction from user
    const missedTasks = tasks.filter((task: Task) => {
      const expiresAt = getExpiresAt(task);
      const isExpired =
        expiresAt < now ||
        String(task.status).toLowerCase() === TaskStatus.EXPIRED;
      const hasNoReaction = task.assigneeReaction == null;

      return (
        isExpired &&
        hasNoReaction &&
        String(task.status).toLowerCase() !== TaskStatus.COMPLETED
      );
    });

    // Expired tasks: user reacted (on_it or running_late) but didn't complete before deadline
    const expiredTasks = tasks.filter((task: Task) => {
      const expiresAt = getExpiresAt(task);
      const isExpired =
        expiresAt < now ||
        String(task.status).toLowerCase() === TaskStatus.EXPIRED;
      const reaction = String(task.assigneeReaction).toLowerCase();
      const hasReacted =
        reaction === TaskReaction.ON_IT ||
        reaction === TaskReaction.RUNNING_LATE;

      return (
        isExpired &&
        hasReacted &&
        String(task.status).toLowerCase() !== TaskStatus.COMPLETED
      );
    });

    return {
      new: newTasks,
      missed: missedTasks,
      expired: expiredTasks,
    };
  }, [tasks]);
};
