import { Stack } from "expo-router";
import { COLORS } from "../../config/theme";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="appearance"
        options={{
          title: "Appearance",
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Help & FAQ",
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: "Contact Us",
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms & Privacy",
        }}
      />
    </Stack>
  );
}
