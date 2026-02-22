import { Stack, useRouter, SplashScreen } from "expo-router";
import { Providers } from "../provider/store-provider";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useInvalidateTasks } from "../hooks/useRealtimeTasks";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ToastProvider } from "../components/Toast";
import { logDebug, logError } from "../config/env";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before fonts are ready
SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded, fontError] = useFonts({
    // ── Display / Brand fonts
    Cameliya: require("../../assets/fonts/Cameliya.ttf"),
    Moralana: require("../../assets/fonts/Moralana.otf"),
    Rockybilly: require("../../assets/fonts/Rockybilly.ttf"),
    RushDriver: require("../../assets/fonts/RushDriver.otf"),
    Sprintura: require("../../assets/fonts/Sprintura.otf"),
  });

  useEffect(() => {
    // Hide splash once fonts are loaded (or if loading errored)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Keep splash visible while fonts are loading
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <ToastProvider />
    </SafeAreaProvider>
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
