// import { useCreateTaskMutation } from "../../store/api/task.api";
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   Animated,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Feather from "@expo/vector-icons/Feather";
// import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "../../config/theme";
// import {
//   TASK_DURATION,
//   VALIDATION,
//   ANIMATIONS,
//   ERROR_MESSAGES,
// } from "../../config/constants";
// import { logError } from "../../config/env";

// interface FormErrors {
//   title?: string;
//   durationMinutes?: string;
//   assignToEmail?: string;
// }

// const FormInput = ({
//   label,
//   placeholder,
//   value,
//   onChangeText,
//   error,
//   multiline,
//   numberOfLines,
//   keyboardType,
//   autoCapitalize,
//   required = false,
//   helpText,
//   icon,
// }: any) => {
//   return (
//     <View style={styles.inputGroup}>
//       <View style={styles.labelContainer}>
//         <Text style={styles.label}>{label}</Text>
//         {required && <Text style={styles.requiredDot}>*</Text>}
//       </View>
//       <View style={styles.inputWrapper}>
//         {icon && (
//           <View style={styles.inputIconContainer}>
//             <Feather name={icon} size={18} color={COLORS.secondary} />
//           </View>
//         )}
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           multiline={multiline}
//           numberOfLines={numberOfLines}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           textAlignVertical={multiline ? "top" : "center"}
//           style={[
//             styles.input,
//             {
//               borderColor: error ? COLORS.error : COLORS.border,
//               minHeight: multiline ? 100 : 48,
//               paddingLeft: icon ? 45 : SPACING.md,
//             },
//           ]}
//           placeholderTextColor={COLORS.text.light}
//         />
//       </View>
//       {error && (
//         <View style={styles.errorContainer}>
//           <Feather name="alert-circle" size={14} color={COLORS.error} />
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       )}
//       {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
//     </View>
//   );
// };

// const SuccessModal = ({ visible }: { visible: boolean }) => {
//   const scaleAnim = React.useRef(new Animated.Value(0)).current;
//   const opacityAnim = React.useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           tension: 10,
//           friction: 7,
//           useNativeDriver: true,
//         }),
//         Animated.timing(opacityAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <View style={styles.successOverlay}>
//       <Animated.View
//         style={[
//           styles.successModalContent,
//           {
//             transform: [{ scale: scaleAnim }],
//             opacity: opacityAnim,
//           },
//         ]}
//       >
//         <LinearGradient
//           colors={[COLORS.success, `${COLORS.success}DD`]}
//           style={styles.successGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <Feather name="check-circle" size={64} color={COLORS.text.white} />
//           <Text style={styles.successTitle}>Task Created!</Text>
//           <Text style={styles.successMessage}>
//             Your task has been assigned successfully
//           </Text>
//         </LinearGradient>
//       </Animated.View>
//     </View>
//   );
// };

// export default function CreateTaskPage() {
//   const [title, setTitle] = useState<string>("");
//   const [note, setNote] = useState<string>("");
//   const [durationMinutes, setDurationMinutes] = useState<string>("");
//   const [assignToEmail, setAssignToEmail] = useState<string>("");
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showSuccess, setShowSuccess] = useState(false);

//   const [createTask, { isLoading }] = useCreateTaskMutation();

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!title.trim()) {
//       newErrors.title = "Title is required";
//     }

//     const duration = parseInt(durationMinutes);
//     if (!durationMinutes || isNaN(duration)) {
//       newErrors.durationMinutes = "Duration is required";
//     } else if (duration < TASK_DURATION.MIN_MINUTES) {
//       newErrors.durationMinutes = `Duration must be at least ${TASK_DURATION.MIN_MINUTES} minutes`;
//     } else if (duration > TASK_DURATION.MAX_MINUTES) {
//       newErrors.durationMinutes = `Duration cannot exceed 30 days (${TASK_DURATION.MAX_MINUTES} minutes)`;
//     }

//     if (!assignToEmail.trim()) {
//       newErrors.assignToEmail = "Email is required";
//     } else if (!VALIDATION.EMAIL_REGEX.test(assignToEmail)) {
//       newErrors.assignToEmail = "Please enter a valid email address";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (): Promise<void> => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const createTaskDto = {
//         title: title.trim(),
//         note: note.trim() || undefined,
//         durationMinutes: parseInt(durationMinutes),
//         assignToEmail: assignToEmail.trim(),
//       };

//       await createTask(createTaskDto).unwrap();

//       setShowSuccess(true);

//       // Reset form
//       setTitle("");
//       setNote("");
//       setDurationMinutes("");
//       setAssignToEmail("");
//       setErrors({});

//       // Hide success message after animation duration
//       setTimeout(() => {
//         setShowSuccess(false);
//       }, ANIMATIONS.SUCCESS_DISPLAY);
//     } catch (error: unknown) {
//       logError("CreateTask", error);
//       const errorMessage =
//         (error as { data?: { message?: string } })?.data?.message ||
//         ERROR_MESSAGES.SERVER_ERROR;
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <LinearGradient
//         colors={["#FFFFFF", "#FFF8F3"]}
//         style={styles.gradientBg}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.headerIconContainer}>
//               <LinearGradient
//                 colors={[COLORS.secondary, `${COLORS.secondary}DD`]}
//                 style={styles.headerIcon}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//               >
//                 <Feather
//                   name="plus-circle"
//                   size={32}
//                   color={COLORS.text.white}
//                 />
//               </LinearGradient>
//             </View>
//             <Text style={styles.headerTitle}>Create New Task</Text>
//             <Text style={styles.headerSubtitle}>
//               Assign work to your team and track progress
//             </Text>
//           </View>

//           {/* Form Card */}
//           <View style={[styles.formCard, SHADOWS.md]}>
//             <FormInput
//               label="Task Title"
//               placeholder="e.g., Review project proposal"
//               value={title}
//               onChangeText={setTitle}
//               error={errors.title}
//               required
//               icon="edit-3"
//             />

//             <FormInput
//               label="Description"
//               placeholder="Add task details and context"
//               value={note}
//               onChangeText={setNote}
//               multiline
//               numberOfLines={4}
//               helpText="Keep it concise but informative"
//               icon="message-square"
//             />

//             <FormInput
//               label="Duration (minutes)"
//               placeholder="e.g., 60"
//               value={durationMinutes}
//               onChangeText={setDurationMinutes}
//               keyboardType="numeric"
//               error={errors.durationMinutes}
//               required
//               helpText="Between 30 and 43,200 minutes (30 days)"
//               icon="clock"
//             />

//             <FormInput
//               label="Assign To Email"
//               placeholder="colleague@company.com"
//               value={assignToEmail}
//               onChangeText={setAssignToEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               error={errors.assignToEmail}
//               required
//               icon="user"
//             />

//             {/* Quick Tips */}
//             <View style={styles.tipsContainer}>
//               <View style={styles.tipIcon}>
//                 <Feather name="zap" size={16} color={COLORS.secondary} />
//               </View>
//               <View style={styles.tipContent}>
//                 <Text style={styles.tipTitle}>💡 Quick Tip</Text>
//                 <Text style={styles.tipText}>
//                   Clear and specific tasks get completed faster. Include
//                   deadlines and context!
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Submit Button */}
//           <LinearGradient
//             colors={
//               isLoading
//                 ? [COLORS.text.light, COLORS.text.light]
//                 : [COLORS.secondary, COLORS.secondaryDark]
//             }
//             style={[styles.submitButton, SHADOWS.lg]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             <TouchableOpacity
//               onPress={handleSubmit}
//               disabled={isLoading}
//               activeOpacity={0.8}
//               style={styles.submitButtonContent}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color={COLORS.text.white} size="small" />
//               ) : (
//                 <>
//                   <Feather name="send" size={18} color={COLORS.text.white} />
//                   <Text style={styles.submitButtonText}>Create Task</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </LinearGradient>

//           <View style={styles.bottomSpacer} />
//         </ScrollView>

//         {/* Success Modal */}
//         <SuccessModal visible={showSuccess} />
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradientBg: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: SPACING.lg,
//   },
//   header: {
//     marginBottom: SPACING.xxl,
//     paddingTop: SPACING.lg,
//     alignItems: "center",
//   },
//   headerIconContainer: {
//     marginBottom: SPACING.lg,
//   },
//   headerIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: COLORS.secondary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: COLORS.text.primary,
//     marginBottom: SPACING.sm,
//     textAlign: "center",
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: COLORS.text.secondary,
//     fontWeight: "500",
//     lineHeight: 24,
//     textAlign: "center",
//   },
//   formCard: {
//     backgroundColor: COLORS.surface,
//     borderRadius: BORDER_RADIUS.lg,
//     padding: SPACING.xl,
//     marginBottom: SPACING.xl,
//   },
//   inputGroup: {
//     marginBottom: SPACING.xl,
//   },
//   labelContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: SPACING.sm,
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.text.primary,
//   },
//   requiredDot: {
//     fontSize: 16,
//     color: COLORS.error,
//     marginLeft: SPACING.xs,
//   },
//   inputWrapper: {
//     position: "relative",
//   },
//   inputIconContainer: {
//     position: "absolute",
//     left: SPACING.md,
//     top: 15,
//     zIndex: 10,
//   },
//   input: {
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: BORDER_RADIUS.md,
//     paddingHorizontal: SPACING.md,
//     paddingVertical: SPACING.md,
//     fontSize: 16,
//     backgroundColor: COLORS.background,
//     fontWeight: "500",
//     color: COLORS.text.primary,
//   },
//   errorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: SPACING.xs,
//     marginTop: SPACING.sm,
//   },
//   errorText: {
//     fontSize: 13,
//     color: COLORS.error,
//     fontWeight: "600",
//     flex: 1,
//   },
//   helpText: {
//     fontSize: 13,
//     color: COLORS.text.light,
//     marginTop: SPACING.sm,
//     fontWeight: "500",
//   },
//   tipsContainer: {
//     flexDirection: "row",
//     backgroundColor: "#FFF8F3",
//     borderRadius: BORDER_RADIUS.md,
//     padding: SPACING.md,
//     alignItems: "flex-start",
//     gap: SPACING.md,
//   },
//   tipIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: COLORS.surface,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tipContent: {
//     flex: 1,
//   },
//   tipTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.secondary,
//     marginBottom: SPACING.xs,
//   },
//   tipText: {
//     fontSize: 13,
//     color: COLORS.text.secondary,
//     lineHeight: 20,
//     fontWeight: "500",
//   },
//   submitButton: {
//     borderRadius: BORDER_RADIUS.lg,
//     overflow: "hidden",
//     marginBottom: SPACING.xl,
//   },
//   submitButtonContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: SPACING.md,
//     paddingVertical: SPACING.lg,
//   },
//   submitButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.text.white,
//   },
//   bottomSpacer: {
//     height: SPACING.xxxl,
//   },
//   // Success Modal Styles
//   successOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   successModalContent: {
//     width: "80%",
//     maxWidth: 300,
//     borderRadius: BORDER_RADIUS.xl,
//     overflow: "hidden",
//   },
//   successGradient: {
//     paddingVertical: SPACING.xxl,
//     alignItems: "center",
//     gap: SPACING.md,
//   },
//   successTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: COLORS.text.white,
//   },
//   successMessage: {
//     fontSize: 14,
//     color: COLORS.text.white,
//     fontWeight: "500",
//     textAlign: "center",
//     opacity: 0.95,
//   },
// });
import { useCreateTaskMutation } from "../../store/api/task.api";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from "../../config/theme";
import {
  TASK_DURATION,
  VALIDATION,
  ANIMATIONS,
  ERROR_MESSAGES,
} from "../../config/constants";
import { logError } from "../../config/env";

interface FormErrors {
  title?: string;
  durationMinutes?: string;
  assignToEmail?: string;
}

const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline,
  numberOfLines,
  keyboardType,
  autoCapitalize,
  required = false,
  helpText,
  icon,
}: any) => {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredDot}>*</Text>}
      </View>
      <View style={styles.inputWrapper}>
        {icon && (
          <View style={styles.inputIconContainer}>
            <Feather name={icon} size={18} color={COLORS.secondary} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? "top" : "center"}
          style={[
            styles.input,
            {
              borderColor: error ? COLORS.error : COLORS.border,
              minHeight: multiline ? 100 : 48,
              paddingLeft: icon ? 45 : SPACING.md,
            },
          ]}
          placeholderTextColor={COLORS.text.light}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const SuccessModal = ({ visible }: { visible: boolean }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when hidden so they replay next time
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.successOverlay}>
      <Animated.View
        style={[
          styles.successModalContent,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.success, `${COLORS.success}DD`]}
          style={styles.successGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="check-circle" size={64} color={COLORS.text.white} />
          <Text style={styles.successTitle}>Task Created!</Text>
          <Text style={styles.successMessage}>
            Your task has been assigned successfully
          </Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default function CreateTaskPage() {
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [assignToEmail, setAssignToEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    const duration = parseInt(durationMinutes);
    if (!durationMinutes || isNaN(duration)) {
      newErrors.durationMinutes = "Duration is required";
    } else if (duration < TASK_DURATION.MIN_MINUTES) {
      newErrors.durationMinutes = `Duration must be at least ${TASK_DURATION.MIN_MINUTES} minutes`;
    } else if (duration > TASK_DURATION.MAX_MINUTES) {
      newErrors.durationMinutes = `Duration cannot exceed 30 days (${TASK_DURATION.MAX_MINUTES} minutes)`;
    }

    if (!assignToEmail.trim()) {
      newErrors.assignToEmail = "Email is required";
    } else if (!VALIDATION.EMAIL_REGEX.test(assignToEmail)) {
      newErrors.assignToEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      const createTaskDto = {
        title: title.trim(),
        note: note.trim() || undefined,
        durationMinutes: parseInt(durationMinutes),
        assignToEmail: assignToEmail.trim(),
      };

      await createTask(createTaskDto).unwrap();

      setShowSuccess(true);
      setTitle("");
      setNote("");
      setDurationMinutes("");
      setAssignToEmail("");
      setErrors({});

      setTimeout(() => {
        setShowSuccess(false);
      }, ANIMATIONS.SUCCESS_DISPLAY);
    } catch (error: unknown) {
      logError("CreateTask", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        ERROR_MESSAGES.SERVER_ERROR;
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#FFFFFF", "#FFF8F3"]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              // ✅ Accounts for home indicator on iOS and
              // gesture nav bar on Android
              paddingBottom: insets.bottom + SPACING.xxxl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                // ✅ Clears notch / Dynamic Island on iOS
                // and translucent status bar on Android
                paddingTop: insets.top + SPACING.lg,
              },
            ]}
          >
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={[COLORS.secondary, `${COLORS.secondary}DD`]}
                style={styles.headerIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather
                  name="plus-circle"
                  size={32}
                  color={COLORS.text.white}
                />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>Create New Task</Text>
            <Text style={styles.headerSubtitle}>
              Assign work to your team and track progress
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, SHADOWS.md]}>
            <FormInput
              label="Task Title"
              placeholder="e.g., Review project proposal"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              required
              icon="edit-3"
            />

            <FormInput
              label="Description"
              placeholder="Add task details and context"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              helpText="Keep it concise but informative"
              icon="message-square"
            />

            <FormInput
              label="Duration (minutes)"
              placeholder="e.g., 60"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
              keyboardType="numeric"
              error={errors.durationMinutes}
              required
              helpText="Between 30 and 43,200 minutes (30 days)"
              icon="clock"
            />

            <FormInput
              label="Assign To Email"
              placeholder="colleague@company.com"
              value={assignToEmail}
              onChangeText={setAssignToEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.assignToEmail}
              required
              icon="user"
            />

            {/* Quick Tips */}
            <View style={styles.tipsContainer}>
              <View style={styles.tipIcon}>
                <Feather name="zap" size={16} color={COLORS.secondary} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>💡 Quick Tip</Text>
                <Text style={styles.tipText}>
                  Clear and specific tasks get completed faster. Include
                  deadlines and context!
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <LinearGradient
            colors={
              isLoading
                ? [COLORS.text.light, COLORS.text.light]
                : [COLORS.secondary, COLORS.secondaryDark]
            }
            style={[styles.submitButton, SHADOWS.lg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
              style={styles.submitButtonContent}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text.white} size="small" />
              ) : (
                <>
                  <Feather name="send" size={18} color={COLORS.text.white} />
                  <Text style={styles.submitButtonText}>Create Task</Text>
                </>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>

        <SuccessModal visible={showSuccess} />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    // base paddingBottom is overridden inline with insets.bottom
  },
  header: {
    marginBottom: SPACING.xxl,
    // base paddingTop is overridden inline with insets.top
    alignItems: "center",
  },
  headerIconContainer: {
    marginBottom: SPACING.lg,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: "500",
    lineHeight: 24,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  requiredDot: {
    fontSize: 16,
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIconContainer: {
    position: "absolute",
    left: SPACING.md,
    top: 15,
    zIndex: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    backgroundColor: COLORS.background,
    fontWeight: "500",
    color: COLORS.text.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: "600",
    flex: 1,
  },
  helpText: {
    fontSize: 13,
    color: COLORS.text.light,
    marginTop: SPACING.sm,
    fontWeight: "500",
  },
  tipsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF8F3",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  submitButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.xl,
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.white,
  },
  // Success Modal
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  successModalContent: {
    width: "80%",
    maxWidth: 300,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  successGradient: {
    paddingVertical: SPACING.xxl,
    alignItems: "center",
    gap: SPACING.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text.white,
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.text.white,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.95,
  },
});
