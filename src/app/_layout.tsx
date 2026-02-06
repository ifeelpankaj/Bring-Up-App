import { Stack, useRouter } from "expo-router";
import { Providers } from "../provider/store-provider";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useInvalidateTasks } from "../hooks/useRealtimeTasks";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ToastProvider } from "../components/Toast";
import { logDebug, logError } from "../config/env";

function RootLayoutContent() {
  const router = useRouter();
  const { invalidateAssigned, invalidateCreated } = useInvalidateTasks();

  usePushNotifications(
    // Send push token to backend
    async (token) => {
      try {
        logDebug("Push token obtained:", token);
        // Token will be sent during login/auth flow
      } catch (error) {
        logError("Push token registration", error);
      }
    },

    // Handle notification tap
    (data) => {
      logDebug("Notification tapped:", data);

      // Invalidate caches based on notification type for instant updates
      if (data?.type === "task_assigned") {
        invalidateAssigned();
        router.push("/(tabs)/assigned");
      } else if (data?.type === "task_reaction") {
        invalidateCreated();
        router.push("/(tabs)/created");
      } else if (data?.taskId) {
        invalidateAssigned();
        router.push("/(tabs)/assigned");
      }
    },
  );

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <ToastProvider />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Providers>
        <RootLayoutContent />
      </Providers>
    </ErrorBoundary>
  );
}
