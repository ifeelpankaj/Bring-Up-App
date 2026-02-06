import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../../config/theme";
import Toast from "../../components/Toast";

interface NotificationSettingProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  iconColor = COLORS.secondary,
}) => (
  <View style={styles.settingItem}>
    <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
      <Feather name={icon} size={20} color={iconColor} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingDescription}>{description}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: `${COLORS.secondary}60` }}
      thumbColor={value ? COLORS.secondary : COLORS.text.light}
      ios_backgroundColor={COLORS.border}
    />
  </View>
);

export default function NotificationsScreen() {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    taskAssigned: true,
    taskCompleted: true,
    taskReactions: true,
    deadlineReminders: true,
    sound: true,
    vibration: true,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    Toast.show({
      type: "success",
      text1: "Setting Updated",
      text2: `${key.replace(/([A-Z])/g, " $1").trim()} ${value ? "enabled" : "disabled"}`,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <LinearGradient
        colors={[COLORS.secondary, COLORS.secondaryDark]}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerIconContainer}>
          <Feather name="bell" size={32} color={COLORS.text.white} />
        </View>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <Text style={styles.headerSubtitle}>
          Control how and when you receive notifications
        </Text>
      </LinearGradient>

      {/* Main Toggle */}
      <View style={[styles.section, SHADOWS.sm]}>
        <View style={styles.mainToggle}>
          <View style={styles.mainToggleLeft}>
            <LinearGradient
              colors={[COLORS.secondary, COLORS.secondaryDark]}
              style={styles.mainToggleIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="bell" size={24} color={COLORS.text.white} />
            </LinearGradient>
            <View>
              <Text style={styles.mainToggleTitle}>Push Notifications</Text>
              <Text style={styles.mainToggleSubtitle}>
                {settings.pushEnabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.pushEnabled}
            onValueChange={(value) => updateSetting("pushEnabled", value)}
            trackColor={{ false: COLORS.border, true: `${COLORS.secondary}60` }}
            thumbColor={
              settings.pushEnabled ? COLORS.secondary : COLORS.text.light
            }
            ios_backgroundColor={COLORS.border}
          />
        </View>
      </View>

      {/* Task Notifications */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Task Notifications</Text>
      </View>
      <View style={[styles.section, SHADOWS.sm]}>
        <NotificationSetting
          icon="inbox"
          title="Task Assigned"
          description="When someone assigns you a task"
          value={settings.taskAssigned}
          onValueChange={(value) => updateSetting("taskAssigned", value)}
          iconColor={COLORS.info}
        />
        <View style={styles.divider} />
        <NotificationSetting
          icon="check-circle"
          title="Task Completed"
          description="When your assigned tasks are completed"
          value={settings.taskCompleted}
          onValueChange={(value) => updateSetting("taskCompleted", value)}
          iconColor={COLORS.success}
        />
        <View style={styles.divider} />
        <NotificationSetting
          icon="message-circle"
          title="Task Reactions"
          description="When someone reacts to your task"
          value={settings.taskReactions}
          onValueChange={(value) => updateSetting("taskReactions", value)}
          iconColor={COLORS.secondary}
        />
        <View style={styles.divider} />
        <NotificationSetting
          icon="clock"
          title="Deadline Reminders"
          description="Reminders before task deadlines"
          value={settings.deadlineReminders}
          onValueChange={(value) => updateSetting("deadlineReminders", value)}
          iconColor={COLORS.warning}
        />
      </View>

      {/* Sound & Vibration */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sound & Vibration</Text>
      </View>
      <View style={[styles.section, SHADOWS.sm]}>
        <NotificationSetting
          icon="volume-2"
          title="Sound"
          description="Play sound for notifications"
          value={settings.sound}
          onValueChange={(value) => updateSetting("sound", value)}
        />
        <View style={styles.divider} />
        <NotificationSetting
          icon="smartphone"
          title="Vibration"
          description="Vibrate for notifications"
          value={settings.vibration}
          onValueChange={(value) => updateSetting("vibration", value)}
        />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Feather name="info" size={16} color={COLORS.info} />
        <Text style={styles.infoText}>
          You can also manage notification permissions in your device settings.
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  headerCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: "700",
    color: COLORS.text.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  mainToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
  },
  mainToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  mainToggleIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  mainToggleTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  mainToggleSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.lg,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.infoLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.info,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
