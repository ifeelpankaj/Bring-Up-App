import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { taskApi } from "../store/api/task.api";
import { FEATURE_FLAGS } from "../config/constants";

/**
 * Polling interval for real-time updates (in milliseconds)
 * Using optimized polling for battery efficiency
 */
const POLLING_INTERVAL = {
  ACTIVE: 10000, // 10 seconds when app is active
  BACKGROUND: 30000, // 30 seconds when in background
};

interface UseRealTimeTasksOptions {
  /** Type of tasks to fetch: 'assigned' or 'created' */
  type: "assigned" | "created";
  /** Enable/disable real-time updates */
  enabled?: boolean;
  /** Custom polling interval in milliseconds */
  pollingInterval?: number;
}

/**
 * Custom hook for real-time task updates
 *
 * This hook provides optimized polling for task updates with:
 * - Automatic polling when enabled
 * - Manual refresh capability
 * - Smart cache invalidation
 *
 * @example
 * ```tsx
 * const { refetch, isPolling, startPolling, stopPolling } = useRealTimeTasks({
 *   type: 'assigned',
 *   enabled: true,
 * });
 * ```
 */
export function useRealTimeTasks({
  type,
  enabled = true,
  pollingInterval = POLLING_INTERVAL.ACTIVE,
}: UseRealTimeTasksOptions) {
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  /**
   * Manually refresh tasks
   */
  const refetch = useCallback(() => {
    // Invalidate the cache to force refetch
    dispatch(
      taskApi.util.invalidateTags([
        { type: "Task", id: "LIST" },
        { type: "MyTasks", id: type },
      ]),
    );
  }, [dispatch, type]);

  /**
   * Start polling for updates
   */
  const startPolling = useCallback(() => {
    if (
      intervalRef.current ||
      !enabled ||
      !FEATURE_FLAGS.enableRealTimeUpdates
    ) {
      return;
    }

    isPollingRef.current = true;
    intervalRef.current = setInterval(() => {
      refetch();
    }, pollingInterval);
  }, [enabled, pollingInterval, refetch]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled && FEATURE_FLAGS.enableRealTimeUpdates) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    refetch,
    isPolling: isPollingRef.current,
    startPolling,
    stopPolling,
  };
}

/**
 * Hook to invalidate all task caches
 * Useful when receiving push notifications
 */
export function useInvalidateTasks() {
  const dispatch = useAppDispatch();

  const invalidateAll = useCallback(() => {
    dispatch(taskApi.util.invalidateTags(["Task", "MyTasks"]));
  }, [dispatch]);

  const invalidateAssigned = useCallback(() => {
    dispatch(
      taskApi.util.invalidateTags([
        { type: "Task", id: "LIST" },
        { type: "MyTasks", id: "assigned" },
      ]),
    );
  }, [dispatch]);

  const invalidateCreated = useCallback(() => {
    dispatch(
      taskApi.util.invalidateTags([
        { type: "Task", id: "LIST" },
        { type: "MyTasks", id: "created" },
      ]),
    );
  }, [dispatch]);

  return {
    invalidateAll,
    invalidateAssigned,
    invalidateCreated,
  };
}

export default useRealTimeTasks;
