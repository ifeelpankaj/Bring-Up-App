/**
 * Application Constants
 *
 * Centralized location for all magic numbers, strings, and configuration values.
 */

// Task duration limits (in minutes)
export const TASK_DURATION = {
  MIN_MINUTES: 30,
  MAX_MINUTES: 43200, // 30 days
  DEFAULT_MINUTES: 60,
} as const;

// API request timeouts (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000,
  TOKEN_REFRESH: 10000,
  NOTIFICATION: 5000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  NOTIFICATIONS_LIMIT: 50,
} as const;

// Notification channels
export const NOTIFICATION_CHANNELS = {
  DEFAULT: "default",
  TASK_NOTIFICATIONS: "task_notifications",
} as const;

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SUCCESS_DISPLAY: 2000,
  CAROUSEL_INTERVAL: 4000,
  CAROUSEL_SCROLL_DURATION: 800,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "@auth_token",
  USER_DATA: "@user_data",
  FCM_TOKEN: "@fcm_token",
  ONBOARDING_COMPLETE: "@onboarding_complete",
  THEME_PREFERENCE: "@theme_preference",
} as const;

// Validation patterns
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  MAX_NOTE_LENGTH: 1000,
} as const;

// Platform-specific values
export const PLATFORM = {
  IOS_TAB_BAR_HEIGHT: 88,
  ANDROID_TAB_BAR_HEIGHT: 68,
  IOS_TAB_BAR_PADDING: 28,
  ANDROID_TAB_BAR_PADDING: 10,
} as const;

// Date/Time formatting
export const DATE_FORMATS = {
  DISPLAY_DATE: "MMM dd, yyyy",
  DISPLAY_TIME: "HH:mm",
  DISPLAY_DATETIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// Task status display names
export const TASK_STATUS_LABELS = {
  pending: "Pending",
  completed: "Completed",
  expired: "Expired",
  cancelled: "Cancelled",
} as const;

// Reaction display names
export const REACTION_LABELS = {
  on_it: "On it",
  running_late: "Running late",
  need_help: "Need help",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  TASK_NOT_FOUND: "Task not found.",
  USER_NOT_FOUND: "User not found.",
  SELF_ASSIGN_ERROR: "Cannot assign task to yourself.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  TOKEN_EXPIRED: "Authentication token expired.",
  INVALID_TOKEN: "Invalid authentication token.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: "Task created successfully!",
  TASK_COMPLETED: "Task marked as completed!",
  TASK_DELETED: "Task deleted successfully.",
  REACTION_RECORDED: "Response recorded!",
  SIGNED_OUT: "You have been signed out.",
} as const;

// Feature flags (can be controlled remotely in production)
export const FEATURES = {
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
} as const;

// Feature flags for runtime control
export const FEATURE_FLAGS = {
  enableRealTimeUpdates: true,
  enablePolling: true,
  pollingIntervalMs: 10000, // 10 seconds
} as const;
