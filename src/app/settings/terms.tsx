import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

type ActiveTab = "terms" | "privacy";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

const BulletPoint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.bulletContainer}>
    <View style={styles.bullet} />
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

export default function TermsScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("terms");

  const renderTermsOfService = () => (
    <>
      <Section title="1. Acceptance of Terms">
        <Paragraph>
          By accessing and using Get This ("the App"), you accept and agree to
          be bound by the terms and provisions of this agreement. If you do not
          agree to these terms, please do not use the App.
        </Paragraph>
      </Section>

      <Section title="2. Description of Service">
        <Paragraph>
          Get This is a task management application that allows users to:
        </Paragraph>
        <BulletPoint>Create and assign tasks to other users</BulletPoint>
        <BulletPoint>Receive and respond to assigned tasks</BulletPoint>
        <BulletPoint>Track task completion and deadlines</BulletPoint>
        <BulletPoint>Receive notifications about task updates</BulletPoint>
      </Section>

      <Section title="3. User Accounts">
        <Paragraph>
          To use Get This, you must sign in with a valid Google account. You are
          responsible for maintaining the confidentiality of your account and
          for all activities that occur under your account.
        </Paragraph>
        <Paragraph>
          You agree to immediately notify us of any unauthorized use of your
          account or any other breach of security.
        </Paragraph>
      </Section>

      <Section title="4. User Conduct">
        <Paragraph>You agree not to:</Paragraph>
        <BulletPoint>
          Use the App for any unlawful purpose or in violation of these Terms
        </BulletPoint>
        <BulletPoint>
          Harass, abuse, or harm other users through task assignments
        </BulletPoint>
        <BulletPoint>
          Attempt to gain unauthorized access to other user accounts
        </BulletPoint>
        <BulletPoint>
          Interfere with or disrupt the App's servers or networks
        </BulletPoint>
        <BulletPoint>
          Use automated systems to access the App without permission
        </BulletPoint>
      </Section>

      <Section title="5. Content Ownership">
        <Paragraph>
          You retain ownership of all content you create within the App,
          including task titles, descriptions, and notes. By using the App, you
          grant us a limited license to store and display this content as
          necessary to provide the service.
        </Paragraph>
      </Section>

      <Section title="6. Limitation of Liability">
        <Paragraph>
          Get This is provided "as is" without warranties of any kind. We are
          not liable for any damages arising from your use of the App, including
          but not limited to lost data, missed deadlines, or communication
          failures.
        </Paragraph>
      </Section>

      <Section title="7. Changes to Terms">
        <Paragraph>
          We reserve the right to modify these terms at any time. We will notify
          users of significant changes through the App. Your continued use after
          changes constitutes acceptance of the new terms.
        </Paragraph>
      </Section>

      <Section title="8. Contact">
        <Paragraph>
          If you have any questions about these Terms, please contact us at
          legal@getthis.app.
        </Paragraph>
      </Section>
    </>
  );

  const renderPrivacyPolicy = () => (
    <>
      <Section title="1. Information We Collect">
        <Paragraph>
          When you use Get This, we collect the following information:
        </Paragraph>
        <BulletPoint>
          Account information from Google Sign-In (name, email, profile photo)
        </BulletPoint>
        <BulletPoint>
          Task content you create (titles, descriptions, notes)
        </BulletPoint>
        <BulletPoint>
          Device information for push notifications (device tokens)
        </BulletPoint>
        <BulletPoint>
          Usage data (app interactions, feature usage patterns)
        </BulletPoint>
      </Section>

      <Section title="2. How We Use Your Information">
        <Paragraph>We use your information to:</Paragraph>
        <BulletPoint>Provide and maintain the Get This service</BulletPoint>
        <BulletPoint>Send push notifications about your tasks</BulletPoint>
        <BulletPoint>Improve and personalize your experience</BulletPoint>
        <BulletPoint>Communicate with you about service updates</BulletPoint>
        <BulletPoint>Ensure security and prevent fraud</BulletPoint>
      </Section>

      <Section title="3. Data Sharing">
        <Paragraph>
          We do not sell your personal information. We share data only:
        </Paragraph>
        <BulletPoint>
          With other users as necessary for task assignments (name, email)
        </BulletPoint>
        <BulletPoint>
          With service providers who help us operate the App (cloud hosting,
          analytics)
        </BulletPoint>
        <BulletPoint>When required by law or to protect our rights</BulletPoint>
      </Section>

      <Section title="4. Data Storage & Security">
        <Paragraph>
          Your data is stored securely on Google Cloud Platform with encryption
          at rest and in transit. We implement industry-standard security
          measures to protect your information from unauthorized access,
          alteration, or destruction.
        </Paragraph>
      </Section>

      <Section title="5. Your Rights">
        <Paragraph>You have the right to:</Paragraph>
        <BulletPoint>Access and download your personal data</BulletPoint>
        <BulletPoint>Request correction of inaccurate data</BulletPoint>
        <BulletPoint>Request deletion of your account and data</BulletPoint>
        <BulletPoint>Opt out of non-essential communications</BulletPoint>
        <BulletPoint>Withdraw consent at any time</BulletPoint>
      </Section>

      <Section title="6. Data Retention">
        <Paragraph>
          We retain your data for as long as your account is active. Task data
          is automatically deleted after expiration or completion according to
          our retention policies. When you delete your account, we remove your
          personal data within 30 days.
        </Paragraph>
      </Section>

      <Section title="7. Cookies & Tracking">
        <Paragraph>
          The App may use analytics tools to understand usage patterns. We do
          not use third-party advertising trackers. You can disable analytics in
          your device settings.
        </Paragraph>
      </Section>

      <Section title="8. Children's Privacy">
        <Paragraph>
          Get This is not intended for children under 13. We do not knowingly
          collect personal information from children. If you believe a child has
          provided us with personal information, please contact us.
        </Paragraph>
      </Section>

      <Section title="9. International Transfers">
        <Paragraph>
          Your information may be transferred to and processed in countries
          other than your own. We ensure appropriate safeguards are in place for
          such transfers.
        </Paragraph>
      </Section>

      <Section title="10. Contact Us">
        <Paragraph>
          For privacy-related questions or to exercise your rights, contact us
          at privacy@getthis.app.
        </Paragraph>
      </Section>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <LinearGradient
        colors={["#34495E", "#2C3E50"]}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerIconContainer}>
          <Feather name="shield" size={32} color={COLORS.text.white} />
        </View>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <Text style={styles.headerSubtitle}>
          Last updated: February 1, 2026
        </Text>
      </LinearGradient>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "terms" && styles.tabActive]}
          onPress={() => setActiveTab("terms")}
        >
          <Feather
            name="file-text"
            size={16}
            color={activeTab === "terms" ? COLORS.secondary : COLORS.text.light}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "terms" && styles.tabTextActive,
            ]}
          >
            Terms of Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "privacy" && styles.tabActive]}
          onPress={() => setActiveTab("privacy")}
        >
          <Feather
            name="lock"
            size={16}
            color={
              activeTab === "privacy" ? COLORS.secondary : COLORS.text.light
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "privacy" && styles.tabTextActive,
            ]}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentCard, SHADOWS.sm]}>
          {activeTab === "terms"
            ? renderTermsOfService()
            : renderPrivacyPolicy()}
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Feather name="info" size={14} color={COLORS.text.light} />
          <Text style={styles.footerText}>
            By using Get This, you agree to these terms. If you have questions,
            please contact our legal team.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    alignItems: "center",
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
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
    color: "rgba(255,255,255,0.7)",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    ...SHADOWS.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  tabActive: {
    backgroundColor: `${COLORS.secondary}15`,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.light,
  },
  tabTextActive: {
    color: COLORS.secondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginTop: 8,
    marginRight: SPACING.md,
  },
  bulletText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  footerText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.light,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: SPACING.xxl,
  },
});
