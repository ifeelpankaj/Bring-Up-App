import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Animated,
  StatusBar,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCreateTaskMutation } from "../../store/api/task.api";
import { useLazySearchUsersQuery } from "../../store/api/auth.api";
import Toast from "../../components/Toast";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  PLATFORM_STYLES,
} from "../../config/theme";
import {
  TASK_DURATION,
  VALIDATION,
  ERROR_MESSAGES,
} from "../../config/constants";
import { logError } from "../../config/env";
import { FONTS } from "@/components/fonts";
import type { UserResponseData } from "../../types";

// ─────────────────── Types ────────────────────────────────────
interface FormErrors {
  title?: string;
  durationMinutes?: string;
  assignToEmail?: string;
}

// ─────────────────── Success Overlay ──────────────────────────
function SuccessOverlay({ visible }: { visible: boolean }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 10,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={s.successOverlay}>
      <Animated.View
        style={[s.successCard, { transform: [{ scale }], opacity }]}
      >
        <LinearGradient
          colors={[COLORS.success, `${COLORS.success}CC`]}
          style={s.successGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={s.successIconRing}>
            <Feather name="check" size={36} color={COLORS.success} />
          </View>
          <Text style={s.successTitle}>Task Created!</Text>
          <Text style={s.successMsg}>
            Successfully assigned to your teammate
          </Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

// ─────────────────── User Search Dropdown ─────────────────────
function UserSuggestion({
  user,
  onSelect,
}: {
  user: UserResponseData;
  onSelect: (u: UserResponseData) => void;
}) {
  const initials = (user.name || user.email)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <TouchableOpacity
      style={s.suggestionRow}
      onPress={() => onSelect(user)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[COLORS.secondaryLight, COLORS.secondary]}
        style={s.avatar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={s.avatarText}>{initials}</Text>
      </LinearGradient>
      <View style={s.suggestionInfo}>
        <Text style={s.suggestionName} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={s.suggestionEmail} numberOfLines={1}>
          {user.email}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={COLORS.text.tertiary} />
    </TouchableOpacity>
  );
}

// ─────────────────── Main Screen ──────────────────────────────
export default function CreateTaskPage() {
  const insets = useSafeAreaInsets();

  // ── Form state
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [assignQuery, setAssignQuery] = useState(""); // what user types
  const [assignToEmail, setAssignToEmail] = useState(""); // resolved email
  const [selectedUser, setSelectedUser] = useState<UserResponseData | null>(
    null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ── Animations
  const scrollY = useRef(new Animated.Value(0)).current;

  // ── RTK Query
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [triggerSearch, { data: searchData, isFetching: isSearching }] =
    useLazySearchUsersQuery();

  // ── Debounced user search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAssignQueryChange = useCallback(
    (text: string) => {
      setAssignQuery(text);
      setSelectedUser(null);
      setAssignToEmail(text.includes("@") ? text : "");

      if (searchTimer.current) clearTimeout(searchTimer.current);

      if (text.trim().length >= 2) {
        searchTimer.current = setTimeout(() => {
          triggerSearch(text.trim());
          setShowDropdown(true);
        }, 350);
      } else {
        setShowDropdown(false);
      }
    },
    [triggerSearch],
  );

  const handleSelectUser = useCallback((user: UserResponseData) => {
    setSelectedUser(user);
    setAssignQuery(user.name ? `${user.name} (${user.email})` : user.email);
    setAssignToEmail(user.email);
    setShowDropdown(false);
    setErrors((prev) => ({ ...prev, assignToEmail: undefined }));
    Keyboard.dismiss();
  }, []);

  const suggestions = useMemo(
    () => (showDropdown ? (searchData?.users ?? []) : []),
    [showDropdown, searchData],
  );

  // ── Validation
  const validate = useCallback((): boolean => {
    const next: FormErrors = {};

    if (!title.trim()) next.title = "Title is required";

    const dur = parseInt(durationMinutes, 10);
    if (!durationMinutes || isNaN(dur)) {
      next.durationMinutes = "Duration is required";
    } else if (dur < TASK_DURATION.MIN_MINUTES) {
      next.durationMinutes = `Minimum ${TASK_DURATION.MIN_MINUTES} min`;
    } else if (dur > TASK_DURATION.MAX_MINUTES) {
      next.durationMinutes = `Maximum 43,200 min (30 days)`;
    }

    const email = assignToEmail.trim();
    if (!email) {
      next.assignToEmail = "Please select or enter an assignee";
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      next.assignToEmail = "Enter a valid email address";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [title, durationMinutes, assignToEmail]);

  // ── Submit
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    Keyboard.dismiss();

    try {
      await createTask({
        title: title.trim(),
        note: note.trim() || undefined,
        durationMinutes: parseInt(durationMinutes, 10),
        assignToEmail: assignToEmail.trim(),
      }).unwrap();

      setShowSuccess(true);
      setTitle("");
      setNote("");
      setDurationMinutes("");
      setAssignQuery("");
      setAssignToEmail("");
      setSelectedUser(null);
      setErrors({});

      setTimeout(() => setShowSuccess(false), 2800);
    } catch (error: unknown) {
      logError("CreateTask", error);
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        ERROR_MESSAGES.SERVER_ERROR;
      Toast.show({ type: "error", text1: "Error", text2: msg });
    }
  }, [validate, createTask, title, note, durationMinutes, assignToEmail]);

  // ── Scroll-driven header animations
  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.82],
    extrapolate: "clamp",
  });
  const headerSubtitleOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const themedStyles = makeStyles(insets);

  // ── Render
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={themedStyles.root}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <Animated.View
          style={[themedStyles.header, { paddingTop: insets.top + SPACING.lg }]}
        >
          <View style={themedStyles.headerRow}>
            <View style={themedStyles.accentBar} />
            <Animated.View style={{ transform: [{ scale: headerTitleScale }] }}>
              <Text style={themedStyles.headerTitle}>CREATE</Text>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              themedStyles.subtitleRow,
              { opacity: headerSubtitleOpacity },
            ]}
          >
            <View style={themedStyles.countPill}>
              <LinearGradient
                colors={[COLORS.secondaryLight, COLORS.secondary]}
                style={themedStyles.countPillGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="plus" size={12} color={COLORS.text.white} />
              </LinearGradient>
            </View>
            <Text style={themedStyles.headerSubtitle}>new task assignment</Text>
          </Animated.View>
        </Animated.View>

        {/* ── Scrollable Form ─────────────────────────────────── */}
        <Animated.ScrollView
          contentContainerStyle={themedStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
        >
          {/* ── TITLE ──────────────────────────────────────────── */}
          <View style={themedStyles.section}>
            <FieldLabel label="Task Title" required />
            <View
              style={[
                themedStyles.inputBox,
                errors.title ? themedStyles.inputBoxError : null,
              ]}
            >
              <Feather
                name="edit-3"
                size={17}
                color={errors.title ? COLORS.error : COLORS.secondary}
                style={themedStyles.inputIcon}
              />
              <TextInput
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  setErrors((p) => ({ ...p, title: undefined }));
                }}
                placeholder="e.g., Review project proposal"
                placeholderTextColor={COLORS.text.light}
                style={themedStyles.input}
                returnKeyType="next"
              />
              {title.length > 0 && (
                <TouchableOpacity
                  onPress={() => setTitle("")}
                  style={themedStyles.clearBtn}
                >
                  <Feather name="x" size={14} color={COLORS.text.tertiary} />
                </TouchableOpacity>
              )}
            </View>
            {errors.title && <InlineError msg={errors.title} />}
          </View>

          {/* ── NOTE ───────────────────────────────────────────── */}
          <View style={themedStyles.section}>
            <FieldLabel label="Description" />
            <View
              style={[themedStyles.inputBox, themedStyles.inputBoxMultiline]}
            >
              <Feather
                name="message-square"
                size={17}
                color={COLORS.secondary}
                style={[themedStyles.inputIcon, { marginTop: 14 }]}
              />
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add task details and context..."
                placeholderTextColor={COLORS.text.light}
                style={[themedStyles.input, themedStyles.multilineInput]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <Text style={themedStyles.helpText}>
              Optional — keep it concise but informative
            </Text>
          </View>

          {/* ── DURATION ───────────────────────────────────────── */}
          <View style={themedStyles.section}>
            <FieldLabel label="Duration" required />
            <View
              style={[
                themedStyles.inputBox,
                errors.durationMinutes ? themedStyles.inputBoxError : null,
              ]}
            >
              <Feather
                name="clock"
                size={17}
                color={errors.durationMinutes ? COLORS.error : COLORS.secondary}
                style={themedStyles.inputIcon}
              />
              <TextInput
                value={durationMinutes}
                onChangeText={(t) => {
                  setDurationMinutes(t);
                  setErrors((p) => ({ ...p, durationMinutes: undefined }));
                }}
                placeholder="e.g., 60"
                placeholderTextColor={COLORS.text.light}
                style={themedStyles.input}
                keyboardType="numeric"
                returnKeyType="next"
              />
              {durationMinutes.length > 0 && (
                <View style={themedStyles.unitBadge}>
                  <Text style={themedStyles.unitText}>min</Text>
                </View>
              )}
            </View>
            {errors.durationMinutes ? (
              <InlineError msg={errors.durationMinutes} />
            ) : (
              <Text style={themedStyles.helpText}>
                Between 30 – 43,200 minutes
              </Text>
            )}

            {/* Quick duration chips */}
            <View style={themedStyles.chipRow}>
              {QUICK_DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  style={[
                    themedStyles.chip,
                    durationMinutes === String(d.value) &&
                      themedStyles.chipActive,
                  ]}
                  onPress={() => {
                    setDurationMinutes(String(d.value));
                    setErrors((p) => ({ ...p, durationMinutes: undefined }));
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      themedStyles.chipText,
                      durationMinutes === String(d.value) &&
                        themedStyles.chipTextActive,
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── ASSIGN TO ──────────────────────────────────────── */}
          <View style={themedStyles.section}>
            <FieldLabel label="Assign To" required />

            {/* Selected user chip */}
            {selectedUser ? (
              <View style={themedStyles.selectedUserRow}>
                <LinearGradient
                  colors={[COLORS.secondaryLight, COLORS.secondary]}
                  style={themedStyles.avatarSm}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={themedStyles.avatarSmText}>
                    {(selectedUser.name || selectedUser.email)
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase() ?? "")
                      .join("")}
                  </Text>
                </LinearGradient>
                <View style={themedStyles.selectedUserInfo}>
                  <Text style={themedStyles.selectedUserName}>
                    {selectedUser.name}
                  </Text>
                  <Text style={themedStyles.selectedUserEmail}>
                    {selectedUser.email}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUser(null);
                    setAssignQuery("");
                    setAssignToEmail("");
                  }}
                  style={themedStyles.clearBtn}
                >
                  <Feather name="x-circle" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View
                  style={[
                    themedStyles.inputBox,
                    errors.assignToEmail ? themedStyles.inputBoxError : null,
                  ]}
                >
                  <Feather
                    name={assignQuery.length > 0 ? "search" : "user"}
                    size={17}
                    color={
                      errors.assignToEmail ? COLORS.error : COLORS.secondary
                    }
                    style={themedStyles.inputIcon}
                  />
                  <TextInput
                    value={assignQuery}
                    onChangeText={handleAssignQueryChange}
                    placeholder="Search by name or email…"
                    placeholderTextColor={COLORS.text.light}
                    style={themedStyles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                  {isSearching && (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.secondary}
                      style={{ marginRight: SPACING.sm }}
                    />
                  )}
                  {assignQuery.length > 0 && !isSearching && (
                    <TouchableOpacity
                      onPress={() => {
                        setAssignQuery("");
                        setAssignToEmail("");
                        setShowDropdown(false);
                      }}
                      style={themedStyles.clearBtn}
                    >
                      <Feather
                        name="x"
                        size={14}
                        color={COLORS.text.tertiary}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Suggestions dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <View style={[themedStyles.dropdown, SHADOWS.md]}>
                    {suggestions.slice(0, 6).map((user) => (
                      <UserSuggestion
                        key={user.uid}
                        user={user}
                        onSelect={handleSelectUser}
                      />
                    ))}
                  </View>
                )}

                {showDropdown &&
                  !isSearching &&
                  suggestions.length === 0 &&
                  assignQuery.length >= 2 && (
                    <View style={themedStyles.noResultsBox}>
                      <Feather
                        name="user-x"
                        size={18}
                        color={COLORS.text.tertiary}
                      />
                      <Text style={themedStyles.noResultsText}>
                        No users found for "{assignQuery}"
                      </Text>
                    </View>
                  )}
              </>
            )}

            {errors.assignToEmail && <InlineError msg={errors.assignToEmail} />}
          </View>

          {/* ── INFO CARD ─────────────────────────────────────── */}
          <View style={themedStyles.infoCard}>
            <LinearGradient
              colors={[`${COLORS.secondary}18`, `${COLORS.secondary}08`]}
              style={themedStyles.infoCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="zap" size={16} color={COLORS.secondary} />
              <Text style={themedStyles.infoText}>
                Specific tasks get done faster — add clear context and a
                realistic duration.
              </Text>
            </LinearGradient>
          </View>

          {/* ── SUBMIT BUTTON ─────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isCreating}
            activeOpacity={0.85}
            style={themedStyles.submitWrapper}
          >
            <LinearGradient
              colors={
                isCreating
                  ? [COLORS.text.disabled, COLORS.text.disabled]
                  : [COLORS.secondary, COLORS.secondaryDark]
              }
              style={themedStyles.submitBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isCreating ? (
                <ActivityIndicator color={COLORS.text.white} size="small" />
              ) : (
                <>
                  <Feather name="send" size={18} color={COLORS.text.white} />
                  <Text style={themedStyles.submitText}>
                    Create & Assign Task
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.ScrollView>

        <SuccessOverlay visible={showSuccess} />
      </KeyboardAvoidingView>
    </>
  );
}

// ─────────────────── Small helpers ────────────────────────────
function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.sm,
        gap: 4,
      }}
    >
      <Text style={s.fieldLabel}>{label}</Text>
      {required && <Text style={s.requiredStar}>*</Text>}
    </View>
  );
}

function InlineError({ msg }: { msg: string }) {
  return (
    <View style={s.errorRow}>
      <Feather name="alert-circle" size={13} color={COLORS.error} />
      <Text style={s.errorText}>{msg}</Text>
    </View>
  );
}

const QUICK_DURATIONS = [
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "4h", value: 240 },
  { label: "1d", value: 480 },
  { label: "1w", value: 2880 },
];

// ─────────────────── Static styles (for small helpers) ────────
const s = StyleSheet.create({
  fieldLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "700",
    color: COLORS.text.primary,
    letterSpacing: 0.3,
  },
  requiredStar: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "700",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    fontWeight: "600",
    flex: 1,
  },
  // UserSuggestion
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "700",
    color: COLORS.text.white,
  },
  suggestionInfo: { flex: 1 },
  suggestionName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  suggestionEmail: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.tertiary,
    marginTop: 1,
  },
  // SuccessOverlay
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  successCard: {
    width: "78%",
    maxWidth: 320,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  successGradient: {
    paddingVertical: SPACING.xxxl,
    alignItems: "center",
    gap: SPACING.md,
  },
  successIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.text.white,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: "800",
    color: COLORS.text.white,
    marginTop: SPACING.xs,
  },
  successMsg: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.white,
    opacity: 0.9,
    textAlign: "center",
    paddingHorizontal: SPACING.xl,
  },
});

// ─────────────────── Dynamic styles ───────────────────────────
const makeStyles = (insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    // ── Header (mirrors Outbox)
    header: {
      paddingHorizontal: SPACING.xxl,
      paddingBottom: SPACING.lg,
      backgroundColor: COLORS.background,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      paddingTop: 4,
    },
    accentBar: {
      width: 4,
      height: 32,
      borderRadius: 2,
      backgroundColor: COLORS.secondary,
      marginRight: SPACING.xs,
    },
    headerTitle: {
      fontSize: 34,
      fontFamily: FONTS.sprintura,
      color: COLORS.text.primary,
      letterSpacing: 1.5,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    subtitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: SPACING.sm,
      gap: SPACING.sm,
    },
    countPill: {
      borderRadius: BORDER_RADIUS.full,
      overflow: "hidden",
    },
    countPillGradient: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      borderRadius: BORDER_RADIUS.full,
      minWidth: 26,
      alignItems: "center",
    },
    headerSubtitle: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.tertiary,
      fontWeight: "500",
    },

    // ── Scroll content
    scrollContent: {
      paddingHorizontal: SPACING.xxl,
      paddingBottom: insets.bottom + PLATFORM_STYLES.tabBarHeight + SPACING.xl,
      paddingTop: SPACING.md,
    },

    // ── Section wrapper
    section: {
      marginBottom: SPACING.xl,
    },

    // ── Input box
    inputBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.surface,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      minHeight: 50,
    },
    inputBoxError: {
      borderColor: COLORS.error,
    },
    inputBoxMultiline: {
      alignItems: "flex-start",
      minHeight: 110,
    },
    inputIcon: {
      marginHorizontal: SPACING.md,
    },
    input: {
      flex: 1,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: COLORS.text.primary,
      fontWeight: "500",
      paddingVertical: SPACING.md,
      paddingRight: SPACING.md,
    },
    multilineInput: {
      paddingTop: SPACING.md,
    },
    clearBtn: {
      padding: SPACING.sm,
      marginRight: SPACING.xs,
    },
    unitBadge: {
      backgroundColor: `${COLORS.secondary}18`,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 3,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.sm,
    },
    unitText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.secondary,
      fontWeight: "700",
    },
    helpText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.text.tertiary,
      marginTop: SPACING.xs,
    },

    // ── Quick duration chips
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.sm,
      marginTop: SPACING.sm,
    },
    chip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: 6,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      backgroundColor: COLORS.surface,
    },
    chipActive: {
      borderColor: COLORS.secondary,
      backgroundColor: `${COLORS.secondary}15`,
    },
    chipText: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.text.secondary,
      fontWeight: "600",
    },
    chipTextActive: {
      color: COLORS.secondary,
    },

    // ── User search dropdown
    dropdown: {
      marginTop: SPACING.xs,
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: "hidden",
    },
    noResultsBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      marginTop: SPACING.sm,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    noResultsText: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.tertiary,
      fontStyle: "italic",
    },

    // ── Selected user card
    selectedUserRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor: COLORS.surface,
      borderWidth: 1.5,
      borderColor: `${COLORS.secondary}55`,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    avatarSm: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarSmText: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: "700",
      color: COLORS.text.white,
    },
    selectedUserInfo: { flex: 1 },
    selectedUserName: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: "700",
      color: COLORS.text.primary,
    },
    selectedUserEmail: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.text.tertiary,
      marginTop: 1,
    },

    // ── Info card
    infoCard: {
      borderRadius: BORDER_RADIUS.md,
      overflow: "hidden",
      marginBottom: SPACING.xl,
    },
    infoCardGradient: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: `${COLORS.secondary}30`,
    },
    infoText: {
      flex: 1,
      fontSize: TYPOGRAPHY.fontSize.xs,
      color: COLORS.text.secondary,
      lineHeight: 18,
      fontWeight: "500",
    },

    // ── Submit
    submitWrapper: {
      borderRadius: BORDER_RADIUS.lg,
      overflow: "hidden",
      marginBottom: SPACING.sm,
      ...SHADOWS.lg,
    },
    submitBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      paddingVertical: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
    },
    submitText: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontWeight: "700",
      color: COLORS.text.white,
      letterSpacing: 0.3,
    },
  });
