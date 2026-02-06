import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
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

interface ContactMethodProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  iconColor: string;
}

const ContactMethod: React.FC<ContactMethodProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  iconColor,
}) => (
  <TouchableOpacity
    style={[styles.contactMethod, SHADOWS.sm]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.contactIcon, { backgroundColor: `${iconColor}15` }]}>
      <Feather name={icon} size={22} color={iconColor} />
    </View>
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactSubtitle}>{subtitle}</Text>
    </View>
    <Feather name="arrow-right" size={18} color={COLORS.text.light} />
  </TouchableOpacity>
);

export default function ContactScreen() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);

    const mailtoUrl = `mailto:officalmasterpankaj@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        setSubject("");
        setMessage("");
        Toast.show({
          type: "success",
          text1: "Email App Opened",
          text2: "Complete sending your message in your email app",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Email Not Available",
          text2: "Please email us at officalmasterpankaj@gmail.com",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not open email app",
      });
    }

    setIsSubmitting(false);
  };

  const handleEmail = () => {
    Linking.openURL(
      "mailto:officalmasterpankaj@gmail.com?subject=Bring Up Support Request",
    );
  };

  const handleTwitter = () => {
    Linking.openURL("https://twitter.com/getthisapp");
  };

  const handleWebsite = () => {
    Linking.openURL("https://getthis.app");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Card */}
      <LinearGradient
        colors={[COLORS.info, COLORS.infoDark]}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerIconContainer}>
          <Feather name="message-circle" size={32} color={COLORS.text.white} />
        </View>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <Text style={styles.headerSubtitle}>
          We'd love to hear from you! Get in touch with our team.
        </Text>
      </LinearGradient>

      {/* Contact Methods */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Contact</Text>
      </View>

      <ContactMethod
        icon="mail"
        title="Email Us"
        subtitle="officalmasterpankaj@gmail.com"
        onPress={handleEmail}
        iconColor={COLORS.secondary}
      />

      <ContactMethod
        icon="twitter"
        title="Twitter"
        subtitle="@bringupapp"
        onPress={handleTwitter}
        iconColor="#1DA1F2"
      />

      <ContactMethod
        icon="globe"
        title="Visit Website"
        subtitle="getthis.app"
        onPress={handleWebsite}
        iconColor={COLORS.accent}
      />

      {/* Send Message Form */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Send a Message</Text>
      </View>

      <View style={[styles.formContainer, SHADOWS.sm]}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="What can we help you with?"
            placeholderTextColor={COLORS.text.light}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us more about your question or feedback..."
            placeholderTextColor={COLORS.text.light}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!subject.trim() || !message.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !subject.trim() || !message.trim()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              subject.trim() && message.trim()
                ? [COLORS.secondary, COLORS.secondaryDark]
                : [COLORS.border, COLORS.borderDark]
            }
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={COLORS.text.white} />
            ) : (
              <>
                <Feather name="send" size={18} color={COLORS.text.white} />
                <Text style={styles.submitButtonText}>Send Message</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Response Time Info */}
      <View style={styles.infoCard}>
        <Feather name="clock" size={16} color={COLORS.success} />
        <Text style={styles.infoText}>
          We typically respond within 24-48 hours during business days.
        </Text>
      </View>

      {/* Office Info */}
      <View style={[styles.officeCard, SHADOWS.sm]}>
        <View style={styles.officeHeader}>
          <View style={styles.officeIconContainer}>
            <Feather name="map-pin" size={20} color={COLORS.secondary} />
          </View>
          <Text style={styles.officeTitle}>Our Office</Text>
        </View>
        <View style={styles.officeContent}>
          <Text style={styles.officeAddress}>
            Bring Up Co.{"\n"}
            House No 86{"\n"}
            MIDC Butibori Nagpur, Nirmal Nagar Bharkas{"\n"}
            Maharashtra India - 441122
          </Text>
          <View style={styles.officeHours}>
            <Feather name="clock" size={14} color={COLORS.text.light} />
            <Text style={styles.officeHoursText}>
              Mon - Fri: 9:00 AM - 6:00 PM IST
            </Text>
          </View>
        </View>
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
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  contactSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  textArea: {
    minHeight: 120,
    paddingTop: SPACING.md,
  },
  submitButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "700",
    color: COLORS.text.white,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.successLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    lineHeight: 20,
  },
  officeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  officeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  officeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.secondary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  officeTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  officeContent: {
    padding: SPACING.lg,
  },
  officeAddress: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  officeHours: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  officeHoursText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.light,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
