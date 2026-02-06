/**
 * API Types
 *
 * All API response types matching the backend exactly.
 * Backend: @bringup/shared
 */

import type { TaskResponse, PaginatedResponse } from "./task.types";

// ============================================================================
// USER TYPES (matching server UserResponseData)
// ============================================================================

/**
 * User data in API responses
 * Matches: @bringup/shared UserResponseData
 */
export interface UserResponseData {
  uid: string;
  email: string;
  name: string;
  photo: string;
  emailVerified: boolean;
  createdAt: string | null;
}

// ============================================================================
// AUTH API RESPONSES (matching server exactly)
// ============================================================================

/**
 * Login response (simplified - no wrapper)
 * Matches: @bringup/shared LoginResponse
 */
export interface LoginResponse {
  user: UserResponseData;
  isNewUser: boolean;
}

/**
 * Logout response
 * Matches: @bringup/shared LogoutResponse
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Get user profile response (me endpoint)
 * Matches: @bringup/shared UserProfileResponse
 */
export interface UserProfileResponse {
  user: UserResponseData;
}

/**
 * User search response
 * Matches: @bringup/shared UserSearchResponse
 */
export interface UserSearchResponse {
  users: UserResponseData[];
  count: number;
  message?: string;
}

// ============================================================================
// TASK API RESPONSES (matching server exactly)
// ============================================================================

/**
 * Single task response (create, get by id, update)
 * Matches: @bringup/shared TaskApiResponse
 */
export interface TaskApiResponse {
  task: TaskResponse;
  message?: string;
}

/**
 * Paginated tasks response (my-tasks)
 * Matches: @bringup/shared TasksApiResponse
 */
export interface TasksApiResponse {
  items: TaskResponse[];
  meta: PaginatedResponse<TaskResponse>["meta"];
  message?: string;
}

/**
 * Task deletion response
 * Matches: @bringup/shared TaskDeleteResponse
 */
export interface TaskDeleteResponse {
  message: string;
}

// ============================================================================
// NOTIFICATION TYPES (matching server exactly)
// ============================================================================

/**
 * Types of notifications
 * Matches: @bringup/shared NotificationType
 */
export enum NotificationType {
  TASK_ASSIGNED = "task_assigned",
  TASK_REACTION = "task_reaction",
  TASK_COMPLETED = "task_completed",
  TASK_REMINDER = "task_reminder",
  TASK_UPDATED = "task_updated",
  TASK_DELETED = "task_deleted",
  SYSTEM_ALERT = "system_alert",
}

/**
 * Status of a notification
 * Matches: @bringup/shared NotificationStatus
 */
export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

/**
 * Notification data payload
 * Matches: @bringup/shared INotificationData
 */
export interface NotificationData {
  taskId: string;
  type: string;
  [key: string]: unknown;
}

/**
 * Notification response from server
 * Matches: @bringup/shared INotificationResponse
 */
export interface NotificationResponse {
  id: string;
  type: NotificationType;
  recipientUid: string;
  senderUid: string;
  taskId: string;
  title: string;
  body: string;
  data: NotificationData;
  status: NotificationStatus;
  isRead: boolean;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
}

/**
 * Notification pagination
 */
export interface NotificationPagination {
  total: number;
  count: number;
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

/**
 * Paginated notifications response
 */
export interface NotificationsApiResponse {
  notifications: NotificationResponse[];
  pagination: NotificationPagination;
}

/**
 * Mark notification read response
 * Matches: @bringup/shared IMarkReadResponse
 */
export interface MarkReadResponse {
  message: string;
}

// ============================================================================
// REQUEST DTOS
// ============================================================================

/**
 * Login credentials
 */
export interface LoginCredentials {
  firebaseToken: string;
  fcmToken: string | null;
}

/**
 * Get notifications params
 */
export interface GetNotificationsParams {
  limit?: number;
  unreadOnly?: boolean;
  cursor?: string;
}

/**
 * Create task DTO
 */
export interface CreateTaskDto {
  title: string;
  note?: string;
  durationMinutes: number;
  assignToEmail: string;
}

/**
 * Update task status DTO
 */
export interface UpdateTaskStatusDto {
  taskId: string;
  status: string;
}

/**
 * Update task reaction DTO
 */
export interface UpdateTaskReactionDto {
  taskId: string;
  reaction: string;
}

/**
 * Get my tasks params
 */
export interface GetMyTasksParams {
  type: string;
  page?: number;
  limit?: number;
}
