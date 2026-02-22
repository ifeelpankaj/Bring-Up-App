/**
 * Task Types
 *
 * TypeScript type definitions for tasks and related entities.
 * Matches backend response types from @get-this/shared.
 */

// ============================================================================
// Enums (matching backend exactly)
// ============================================================================

/**
 * Task reaction options for assignees
 * Matches backend: on_it, running_late, need_help
 */
export enum TaskReaction {
  ON_IT = "on_it",
  RUNNING_LATE = "running_late",
  CANT_DO = `can't_complete`,
}

/**
 * Task status values
 * Matches: @get-this/shared TaskStatus
 */
export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

/**
 * Task query type for filtering
 * Matches: @get-this/shared TaskQueryType
 */
export enum TaskQueryType {
  CREATED = "created",
  ASSIGNED = "assigned",
}

/**
 * Task sort field options
 * Matches: @get-this/shared TaskSortField
 */
export enum TaskSortField {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  EXPIRES_AT = "urgency.expiresAt",
}

/**
 * Sort order direction
 * Matches: @get-this/shared SortOrder
 */
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// ============================================================================
// Tab Types
// ============================================================================

/** Inbox tab types */
export type TabType = "new" | "missed" | "expired";

/** Outbox tab types */
export type OutboxTabType = "pending" | "inProgress" | "closed";

/** Combined empty state type */
export type EmptyStateType = TabType | OutboxTabType;

/** Task card mode */
export type TaskCardMode = "inbox" | "outbox";

// ============================================================================
// Legacy/Compat Types (for backward compatibility)
// ============================================================================

/** Firebase Timestamp type (handles different formats from API) */
export interface FirebaseTimestamp {
  _seconds?: number;
  _nanoseconds?: number;
  toDate?: () => Date;
}

/** Timestamp that can be various formats */
export type TimestampLike = FirebaseTimestamp | Date | string | number;

// ============================================================================
// User Types
// ============================================================================

/**
 * User information in task context
 * Matches: @get-this/shared TaskUser
 */
export interface TaskUser {
  uid: string;
  name: string;
  email: string;
}

// ============================================================================
// Task Urgency Types
// ============================================================================

/**
 * Task urgency information from API response
 * Matches: @get-this/shared TaskUrgencyResponse
 */
export interface TaskUrgencyResponse {
  /** When the task expires (ISO string) */
  expiresAt: string;
  /** Original duration in minutes */
  durationMinutes: number;
  /** Remaining time in minutes (calculated) */
  remainingMinutes: number;
  /** Whether task is expired */
  isExpired: boolean;
}

/**
 * @deprecated Use TaskUrgencyResponse instead
 */
export interface TaskUrgency {
  expiresAt: TimestampLike;
  durationMinutes: number;
}

// ============================================================================
// Task Notification Types
// ============================================================================

/**
 * Task notification status from API response
 * Matches: @get-this/shared TaskNotificationResponse
 */
export interface TaskNotificationResponse {
  /** Whether notification was sent */
  sent: boolean;
  /** When notification was sent (ISO string) */
  sentAt: string | null;
  /** Error message if notification failed */
  error?: string | null;
}

/**
 * @deprecated Use TaskNotificationResponse instead
 */
export interface TaskNotification {
  sent: boolean;
  sentAt?: TimestampLike;
}

// ============================================================================
// Task Response Types (matching server API responses)
// ============================================================================

/**
 * Complete task response from API
 * Matches: @get-this/shared TaskResponse
 */
export interface TaskResponse {
  /** Unique task ID */
  id: string;
  /** Task title */
  title: string;
  /** Optional task note/description */
  note: string | null;
  /** User who created the task */
  createdBy: TaskUser;
  /** User assigned to the task */
  assignedTo: TaskUser;
  /** Current task status */
  status: TaskStatus;
  /** Assignee's reaction to the task */
  assigneeReaction: TaskReaction | null;
  /** Urgency information */
  urgency: TaskUrgencyResponse;
  /** Notification status */
  notification: TaskNotificationResponse;
  /** When task was created (ISO string) */
  createdAt: string;
  /** When task was last updated (ISO string) */
  updatedAt: string;
  /** Number of time extensions applied */
  extensionCount: number;
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination metadata from server
 * Matches: @get-this/shared PaginationMeta
 */
export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response wrapper
 * Matches: @get-this/shared PaginatedResponse
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// ============================================================================
// Task Alias (for backward compatibility)
// ============================================================================

/**
 * Task alias - now uses TaskResponse from server
 * @deprecated Use TaskResponse directly for new code
 */
export type Task = TaskResponse;

// ============================================================================
// Component Props
// ============================================================================

/** Unified task card props */
export interface TaskCardProps {
  task: TaskResponse;
  mode: TaskCardMode;
  tabType?: TabType | OutboxTabType;
  onReaction?: (reaction: TaskReaction) => void;
  onMarkDone?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

// ============================================================================
// Categorized Tasks
// ============================================================================

/** Inbox categorized tasks */
export interface InboxCategorizedTasks {
  new: TaskResponse[];
  missed: TaskResponse[];
  expired: TaskResponse[];
}

/** Outbox categorized tasks */
export interface OutboxCategorizedTasks {
  pending: TaskResponse[];
  inProgress: TaskResponse[];
  closed: TaskResponse[];
}

// ============================================================================
// API DTOs
// ============================================================================

/** Create task DTO */
export interface CreateTaskDto {
  title: string;
  note?: string;
  durationMinutes: number;
  assignToEmail: string;
}

/** Update task status DTO */
export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

/** Update task reaction DTO */
export interface UpdateTaskReactionDto {
  reaction: TaskReaction;
}
