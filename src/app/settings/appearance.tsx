import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
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

type ThemeOption = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

interface ThemeCardProps {
  theme: ThemeOption;
  isSelected: boolean;
  onSelect: () => void;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  colors: readonly [string, string];
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  isSelected,
  onSelect,
  icon,
  label,
  colors,
}) => (
  <TouchableOpacity
    style={[styles.themeCard, isSelected && styles.themeCardSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={colors}
      style={styles.themePreview}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Feather
        name={icon}
        size={24}
        color={isSelected ? COLORS.text.white : COLORS.text.secondary}
      />
    </LinearGradient>
    <Text style={[styles.themeLabel, isSelected && styles.themeLabelSelected]}>
      {label}
    </Text>
    {isSelected && (
      <View style={styles.checkMark}>
        <Feather name="check" size={14} color={COLORS.text.white} />
      </View>
    )}
  </TouchableOpacity>
);

interface FontSizeOptionProps {
  size: FontSize;
  isSelected: boolean;
  onSelect: () => void;
  label: string;
  sampleSize: number;
}

const FontSizeOption: React.FC<FontSizeOptionProps> = ({
  isSelected,
  onSelect,
  label,
  sampleSize,
}) => (
  <TouchableOpacity
    style={[styles.fontSizeOption, isSelected && styles.fontSizeOptionSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <Text style={[styles.fontSizeSample, { fontSize: sampleSize }]}>Aa</Text>
    <Text
      style={[styles.fontSizeLabel, isSelected && styles.fontSizeLabelSelected]}
    >
      {label}
    </Text>
    {isSelected && (
      <View style={styles.fontSizeCheck}>
        <Feather name="check" size={12} color={COLORS.secondary} />
      </View>
    )}
  </TouchableOpacity>
);

export default function AppearanceScreen() {
  const [theme, setTheme] = useState<ThemeOption>("light");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    Toast.show({
      type: "success",
      text1: "Theme Updated",
      text2: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
    });
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    Toast.show({
      type: "success",
      text1: "Font Size Updated",
      text2: `${newSize.charAt(0).toUpperCase() + newSize.slice(1)} font size selected`,
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
        colors={[COLORS.accent, COLORS.accentPurple]}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerIconContainer}>
          <Feather name="eye" size={32} color={COLORS.text.white} />
        </View>
        <Text style={styles.headerTitle}>Appearance</Text>
        <Text style={styles.headerSubtitle}>
          Customize the look and feel of your app
        </Text>
      </LinearGradient>

      {/* Theme Selection */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Theme</Text>
      </View>
      <View style={styles.themeContainer}>
        <ThemeCard
          theme="light"
          isSelected={theme === "light"}
          onSelect={() => handleThemeChange("light")}
          icon="sun"
          label="Light"
          colors={["#FFFFFF", "#F5F5F5"]}
        />
        <ThemeCard
          theme="dark"
          isSelected={theme === "dark"}
          onSelect={() => handleThemeChange("dark")}
          icon="moon"
          label="Dark"
          colors={["#2C3E50", "#1A252F"]}
        />
        <ThemeCard
          theme="system"
          isSelected={theme === "system"}
          onSelect={() => handleThemeChange("system")}
          icon="smartphone"
          label="System"
          colors={[COLORS.secondary, COLORS.secondaryDark]}
        />
      </View>

      {/* Font Size */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Font Size</Text>
      </View>
      <View style={[styles.section, SHADOWS.sm]}>
        <View style={styles.fontSizeContainer}>
          <FontSizeOption
            size="small"
            isSelected={fontSize === "small"}
            onSelect={() => handleFontSizeChange("small")}
            label="Small"
            sampleSize={14}
          />
          <FontSizeOption
            size="medium"
            isSelected={fontSize === "medium"}
            onSelect={() => handleFontSizeChange("medium")}
            label="Medium"
            sampleSize={18}
          />
          <FontSizeOption
            size="large"
            isSelected={fontSize === "large"}
            onSelect={() => handleFontSizeChange("large")}
            label="Large"
            sampleSize={22}
          />
        </View>
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview</Text>
          <Text
            style={[
              styles.previewText,
              {
                fontSize:
                  fontSize === "small" ? 14 : fontSize === "medium" ? 16 : 20,
              },
            ]}
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>
      </View>

      {/* Accessibility */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
      </View>
      <View style={[styles.section, SHADOWS.sm]}>
        <View style={styles.accessibilityItem}>
          <View style={styles.accessibilityLeft}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${COLORS.warning}15` },
              ]}
            >
              <Feather name="zap-off" size={20} color={COLORS.warning} />
            </View>
            <View style={styles.accessibilityContent}>
              <Text style={styles.accessibilityTitle}>Reduce Motion</Text>
              <Text style={styles.accessibilityDescription}>
                Minimize animations throughout the app
              </Text>
            </View>
          </View>
          <Switch
            value={reducedMotion}
            onValueChange={(value) => {
              setReducedMotion(value);
              Toast.show({
                type: "success",
                text1: "Setting Updated",
                text2: `Reduced motion ${value ? "enabled" : "disabled"}`,
              });
            }}
            trackColor={{ false: COLORS.border, true: `${COLORS.secondary}60` }}
            thumbColor={reducedMotion ? COLORS.secondary : COLORS.text.light}
            ios_backgroundColor={COLORS.border}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.accessibilityItem}>
          <View style={styles.accessibilityLeft}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${COLORS.info}15` },
              ]}
            >
              <Feather name="maximize" size={20} color={COLORS.info} />
            </View>
            <View style={styles.accessibilityContent}>
              <Text style={styles.accessibilityTitle}>High Contrast</Text>
              <Text style={styles.accessibilityDescription}>
                Increase contrast for better visibility
              </Text>
            </View>
          </View>
          <Switch
            value={highContrast}
            onValueChange={(value) => {
              setHighContrast(value);
              Toast.show({
                type: "success",
                text1: "Setting Updated",
                text2: `High contrast ${value ? "enabled" : "disabled"}`,
              });
            }}
            trackColor={{ false: COLORS.border, true: `${COLORS.secondary}60` }}
            thumbColor={highContrast ? COLORS.secondary : COLORS.text.light}
            ios_backgroundColor={COLORS.border}
          />
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Feather name="info" size={16} color={COLORS.info} />
        <Text style={styles.infoText}>
          Dark mode and some accessibility features are coming soon. Stay tuned!
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
  themeContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  themeCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  themeCardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: `${COLORS.secondary}10`,
  },
  themePreview: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  themeLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  themeLabelSelected: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  checkMark: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  fontSizeContainer: {
    flexDirection: "row",
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  fontSizeOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    position: "relative",
  },
  fontSizeOptionSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: `${COLORS.secondary}10`,
  },
  fontSizeSample: {
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  fontSizeLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  fontSizeLabelSelected: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  fontSizeCheck: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
  },
  previewContainer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  previewLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "600",
    color: COLORS.text.tertiary,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
  },
  previewText: {
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  accessibilityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
  },
  accessibilityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  accessibilityContent: {
    flex: 1,
  },
  accessibilityTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  accessibilityDescription: {
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
