/**
 * Environment Configuration
 *
 * This file centralizes all environment-specific configuration.
 * Values are loaded from expo-constants which reads from app.config.ts
 * and the .env file at build time.
 */

import Constants from "expo-constants";

export type Environment = "development" | "staging" | "production";

interface EnvironmentConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  environment: Environment;
  debug: boolean;
}

interface FirebaseConfig {
  webClientId: string;
  projectId: string;
  apiKey: string;
  storageBucket: string;
  appId: string;
}

interface ExpoConfig {
  projectId: string;
}

interface AppConfig {
  name: string;
  version: string;
  buildNumber: number;
}

// Get extra config from app.config.ts
const extra = Constants.expoConfig?.extra || {};

// Determine current environment from config
const getCurrentEnvironment = (): Environment => {
  const appEnv = extra.appEnv as Environment;
  if (appEnv && ["development", "staging", "production"].includes(appEnv)) {
    return appEnv;
  }
  // Fallback to __DEV__ flag
  if (__DEV__) {
    return "development";
  }
  return "production";
};

const currentEnvironment = getCurrentEnvironment();

// Build environment config from expo-constants
const ENV: EnvironmentConfig = {
  apiBaseUrl: extra.apiBaseUrl || "https://bring-up-server.onrender.com/api/v1",
  wsBaseUrl: extra.wsBaseUrl || "wss://bring-up-server.onrender.com",
  environment: currentEnvironment,
  debug: currentEnvironment !== "production",
};

// Firebase configuration from environment
const firebaseExtra = extra.firebase || {};
export const FIREBASE_CONFIG: FirebaseConfig = {
  webClientId: firebaseExtra.webClientId || "",
  projectId: firebaseExtra.projectId || "",
  apiKey: firebaseExtra.apiKey || "",
  storageBucket: firebaseExtra.storageBucket || "",
  appId: firebaseExtra.appId || "",
};

// Expo configuration from environment
export const EXPO_CONFIG: ExpoConfig = {
  projectId: extra.eas?.projectId || "",
};

// App configuration
export const APP_CONFIG: AppConfig = {
  name: Constants.expoConfig?.name || "BringUp",
  version: Constants.expoConfig?.version || "1.0.0",
  buildNumber: 1,
};

// Export ENV for direct access
export { ENV };

// Export individual values for convenience
export const API_BASE_URL = ENV.apiBaseUrl;
export const WS_BASE_URL = ENV.wsBaseUrl;
export const IS_DEV = ENV.environment === "development";
export const IS_PROD = ENV.environment === "production";
export const DEBUG_MODE = ENV.debug;

// Logging helper
export const logDebug = (...args: unknown[]): void => {
  if (DEBUG_MODE) {
    console.log("[DEBUG]", ...args);
  }
};

export const logError = (context: string, error: unknown): void => {
  console.error(`[ERROR] ${context}:`, error);
};

export const logInfo = (...args: unknown[]): void => {
  if (DEBUG_MODE) {
    console.info("[INFO]", ...args);
  }
};
