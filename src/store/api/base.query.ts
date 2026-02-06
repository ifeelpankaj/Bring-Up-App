import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getAuth, getIdToken } from "@react-native-firebase/auth";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  API_BASE_URL,
  EXPO_CONFIG,
  logError,
  logDebug,
} from "../../config/env";
import { NOTIFICATION_CHANNELS } from "../../config/constants";

/**
 * Get FCM push notification token
 * Handles permission requests and channel setup for Android
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      logDebug("Push notification permission denied");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: EXPO_CONFIG.projectId,
    });

    // Setup Android notification channels
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.TASK_NOTIFICATIONS,
        {
          name: "Task Notifications",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        },
      );
    }

    logDebug("FCM Token obtained:", tokenData.data);
    return tokenData.data;
  } catch (error) {
    logError("getFcmToken", error);
    return null;
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await getIdToken(user, false);
        headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        logError("prepareHeaders", error);
      }
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const newToken = await getIdToken(user, true);
        const fcmToken = await getFcmToken();

        await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify({ fcmToken }),
        });

        result = await baseQuery(args, api, extraOptions);
      } catch (error) {
        logError("baseQueryWithReauth", error);
      }
    }
  }

  return result;
};
