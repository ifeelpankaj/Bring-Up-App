import { useEffect, useRef, useCallback } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

import { EXPO_CONFIG, logDebug, logError } from "../config/env";
import { NOTIFICATION_CHANNELS, FEATURES } from "../config/constants";

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationData {
  type?: string;
  taskId?: string;
  [key: string]: unknown;
}

type TokenCallback = (token: string) => void;
type NotificationTapCallback = (data: NotificationData) => void;

/**
 * Custom hook for handling push notifications
 *
 * @param onToken - Callback when push token is obtained
 * @param onNotificationTap - Callback when user taps a notification
 */
export function usePushNotifications(
  onToken: TokenCallback,
  onNotificationTap: NotificationTapCallback,
): void {
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );

  const registerForPushNotifications = useCallback(async () => {
    if (!FEATURES.ENABLE_PUSH_NOTIFICATIONS) {
      logDebug("Push notifications disabled via feature flag");
      return;
    }

    if (!Device.isDevice) {
      logDebug("Push notifications only work on physical devices");
      return;
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        logDebug("Push notification permission not granted");
        return;
      }

      // Get push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_CONFIG.projectId,
      });

      onToken(tokenData.data);

      // Setup Android notification channels
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          NOTIFICATION_CHANNELS.DEFAULT,
          {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
          },
        );

        await Notifications.setNotificationChannelAsync(
          NOTIFICATION_CHANNELS.TASK_NOTIFICATIONS,
          {
            name: "Task Notifications",
            importance: Notifications.AndroidImportance.MAX,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
          },
        );
      }
    } catch (error) {
      logError("registerForPushNotifications", error);
    }
  }, [onToken]);

  useEffect(() => {
    registerForPushNotifications();

    // Listen for incoming notifications while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        logDebug("Notification received:", notification.request.content);
      });

    // Listen for notification taps
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content
          .data as NotificationData;
        onNotificationTap(data);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [registerForPushNotifications, onNotificationTap]);
}
