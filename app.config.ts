import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

// Get environment from .env or default to development
const APP_ENV = process.env.APP_ENV || "development";

// Environment-specific API URLs
const getApiBaseUrl = (): string => {
  switch (APP_ENV) {
    case "production":
      return process.env.API_BASE_URL_PROD || "https://api.bringup.app/api/v1";
    case "staging":
      return (
        process.env.API_BASE_URL_STAGING ||
        "https://staging-api.bringup.app/api/v1"
      );
    default:
      return process.env.API_BASE_URL_DEV || "http://localhost:4000/api/v1";
  }
};

const getWsBaseUrl = (): string => {
  switch (APP_ENV) {
    case "production":
      return process.env.WS_BASE_URL_PROD || "wss://api.bringup.app";
    case "staging":
      return process.env.WS_BASE_URL_STAGING || "wss://staging-api.bringup.app";
    default:
      return process.env.WS_BASE_URL_DEV || "ws://localhost:4000";
  }
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "BringUp",
  slug: "bringup",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "bringup",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.bringup.app",
    buildNumber: "1",
    infoPlist: {
      NSCameraUsageDescription:
        "Allow BringUp to access your camera for profile photos.",
      NSPhotoLibraryUsageDescription:
        "Allow BringUp to access your photos for profile photos.",
    },
  },
  android: {
    package: "com.bringup.app",
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/logo.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/logo.png",
    },
    permissions: [
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.VIBRATE",
    ],
    googleServicesFile: "./google-services.json",
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-notifications",
    "expo-router",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-google-signin/google-signin",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          podfileProperties: {
            "use_modular_headers!": true,
          },
        },
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId:
        process.env.EXPO_PROJECT_ID || "b8287b25-91ae-4968-afe1-bece82d6e65d",
    },
    // Environment configuration - accessible via expo-constants
    appEnv: APP_ENV,
    apiBaseUrl: getApiBaseUrl(),
    wsBaseUrl: getWsBaseUrl(),
    firebase: {
      webClientId: process.env.FIREBASE_WEB_CLIENT_ID || "",
      projectId: process.env.FIREBASE_PROJECT_ID || "",
      apiKey: process.env.FIREBASE_API_KEY || "",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      appId: process.env.FIREBASE_APP_ID || "",
    },
  },
  updates: {
    url: `https://u.expo.dev/${process.env.EXPO_PROJECT_ID || "b8287b25-91ae-4968-afe1-bece82d6e65d"}`,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  owner: "itsmepankaj",
});
