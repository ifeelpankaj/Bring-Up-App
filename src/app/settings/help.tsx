import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
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

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I create my first task?",
    answer:
      "To create a task, tap the '+' button at the bottom of the screen. Fill in the task title, add an optional description, select an assignee by entering their email, and set a deadline. Once done, tap 'Create Task' to send it to the assignee.",
  },
  {
    id: "2",
    category: "Getting Started",
    question: "How do I respond to a task assigned to me?",
    answer:
      "When someone assigns you a task, you'll receive a notification. Open the task and choose your response: 'Got it' (accepted), 'Running late' (will complete but delayed), or 'Can't' (unable to complete). After responding, you can mark the task as complete when finished.",
  },
  {
    id: "3",
    category: "Tasks",
    question: "What happens when a task expires?",
    answer:
      "If you don't respond to a task before its deadline, it will automatically expire. Expired tasks are moved to the 'Expired' section and cannot be completed. The task creator will be notified when a task expires.",
  },
  {
    id: "4",
    category: "Tasks",
    question: "Can I delete a task I created?",
    answer:
      "Yes, you can delete tasks you've created. Go to the 'Created' tab, find the task, and tap on it to open the details. You'll see a 'Delete' option at the bottom. Note that this action cannot be undone.",
  },
  {
    id: "5",
    category: "Tasks",
    question: "How do deadline reminders work?",
    answer:
      "Bring Up sends automatic reminders as deadlines approach. You'll receive notifications at key intervals before the task expires.",
  },
  {
    id: "6",
    category: "Notifications",
    question: "Why am I not receiving notifications?",
    answer:
      "First, ensure notifications are enabled in your device settings for Bring Up. Then check that you've granted notification permissions when prompted. You can also check your device's notification settings to make sure Bring Up is allowed to send notifications.",
  },
  {
    id: "7",
    category: "Notifications",
    question: "What types of notifications will I receive?",
    answer:
      "You'll receive notifications for: new tasks assigned to you, responses to tasks you created, task completions, and deadline reminders.",
  },
  {
    id: "8",
    category: "Account",
    question: "How do I update my profile information?",
    answer:
      "Your profile information (name, email, photo) is linked to your Google account. To update these details, update your Google account profile and the changes will be reflected in Bring Up on your next login.",
  },
  {
    id: "9",
    category: "Account",
    question: "How do I log out or switch accounts?",
    answer:
      "Go to Profile > Logout at the bottom of the screen. This will sign you out of both the app and your Google account. You can then sign in with a different Google account if needed.",
  },
  {
    id: "10",
    category: "Privacy & Security",
    question: "Who can see my tasks?",
    answer:
      "Tasks are only visible to the creator and the assignee. No other users can see your tasks. We use secure, encrypted connections to protect your data.",
  },
];

interface FAQAccordionProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  item,
  isExpanded,
  onToggle,
}) => (
  <TouchableOpacity
    style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={styles.faqHeader}>
      <Text
        style={[styles.faqQuestion, isExpanded && styles.faqQuestionExpanded]}
      >
        {item.question}
      </Text>
      <View
        style={[styles.chevronContainer, isExpanded && styles.chevronExpanded]}
      >
        <Feather
          name="chevron-down"
          size={18}
          color={isExpanded ? COLORS.secondary : COLORS.text.light}
        />
      </View>
    </View>
    {isExpanded && <Text style={styles.faqAnswer}>{item.answer}</Text>}
  </TouchableOpacity>
);

export default function HelpScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...new Set(faqData.map((item) => item.category))];

  const filteredFAQs =
    activeCategory === "All"
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
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
          <Feather name="help-circle" size={32} color={COLORS.text.white} />
        </View>
        <Text style={styles.headerTitle}>Bring Up Help</Text>
        <Text style={styles.headerSubtitle}>
          Find answers to commonly asked questions about Bring Up
        </Text>
      </LinearGradient>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              activeCategory === category && styles.categoryPillActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAQ Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionCount}>{filteredFAQs.length} questions</Text>
      </View>

      <View style={[styles.faqContainer, SHADOWS.sm]}>
        {filteredFAQs.map((item, index) => (
          <View key={item.id}>
            <FAQAccordion
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
            {index < filteredFAQs.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Still Need Help Card */}
      <View style={[styles.helpCard, SHADOWS.sm]}>
        <View style={styles.helpCardContent}>
          <View style={styles.helpIconContainer}>
            <Feather name="message-circle" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.helpTextContent}>
            <Text style={styles.helpTitle}>Still need help?</Text>
            <Text style={styles.helpDescription}>
              Our support team is ready to assist you
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Support</Text>
          <Feather name="arrow-right" size={16} color={COLORS.secondary} />
        </TouchableOpacity>
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
  quickLinks: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  quickLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  categoryScroll: {
    marginBottom: SPACING.lg,
  },
  categoryContainer: {
    paddingRight: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  categoryTextActive: {
    color: COLORS.text.white,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.light,
  },
  faqContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.xl,
  },
  faqItem: {
    padding: SPACING.lg,
  },
  faqItemExpanded: {
    backgroundColor: `${COLORS.secondary}08`,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  faqQuestionExpanded: {
    color: COLORS.secondary,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronExpanded: {
    backgroundColor: `${COLORS.secondary}15`,
    transform: [{ rotate: "180deg" }],
  },
  faqAnswer: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.lg,
  },
  helpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  helpCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.secondary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  helpTextContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  helpDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: `${COLORS.secondary}15`,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  contactButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
