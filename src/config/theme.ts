// /**
//  * Design System - Theme Configuration
//  *
//  * Centralized theme for consistent styling across the application.
//  * All colors, spacing, typography, and styling primitives are defined here.
//  */

// import { Platform, TextStyle, ViewStyle } from "react-native";

// // Color Palette
// export const COLORS = {
//   // Brand Colors
//   primary: "#3D4E6F",
//   primaryDark: "#2D3A52",
//   primaryLight: "#5A6B8A",
//   secondary: "#F57C00",
//   secondaryDark: "#D97D54",
//   secondaryLight: "#F0A080",

//   // Accent Colors
//   accent: "#667eea",
//   accentPurple: "#764ba2",

//   // Semantic Colors
//   success: "#4CAF50",
//   successLight: "#E8F5E9",
//   successDark: "#388E3C",
//   error: "#F44336",
//   errorLight: "#FFEBEE",
//   errorDark: "#D32F2F",
//   warning: "#FF9800",
//   warningLight: "#FFF3E0",
//   warningDark: "#F57C00",
//   info: "#2196F3",
//   infoLight: "#E3F2FD",
//   infoDark: "#1976D2",

//   // Neutrals
//   background: "#FAF8F6",
//   backgroundLight: "#FFFFFF",
//   backgroundDark: "#F5F1ED",
//   surface: "#FFFFFF",
//   surfaceAlt: "#FFF8F3",
//   border: "#E8DED3",
//   borderLight: "#F5F1ED",
//   borderDark: "#D4C4B5",
//   divider: "#E0E0E0",

//   // Text Colors
//   text: {
//     primary: "#2C2419",
//     secondary: "#6B5E52",
//     tertiary: "#9D8B7A",
//     light: "#A89B8E",
//     disabled: "#C4B8AB",
//     white: "#FFFFFF",
//     inverse: "#FFFFFF",
//   },

//   // Status Colors (for task states)
//   status: {
//     pending: "#FF9800",
//     pendingBg: "#FFF8E1",
//     completed: "#4CAF50",
//     completedBg: "#E8F5E9",
//     inProgress: "#2196F3",
//     inProgressBg: "#E3F2FD",
//     cancelled: "#9E9E9E",
//     cancelledBg: "#F5F5F5",
//     expired: "#F44336",
//     expiredBg: "#FFEBEE",
//     missed: "#546E7A",
//     missedBg: "#ECEFF1",
//   },

//   // Gradient Presets
//   gradient: {
//     primary: ["#667eea", "#764ba2"] as const,
//     secondary: ["#E88B63", "#D97D54"] as const,
//     success: ["#4CAF50", "#388E3C"] as const,
//     warning: ["#FF9800", "#F57C00"] as const,
//     danger: ["#F44336", "#D32F2F"] as const,
//     background: ["#FFFFFF", "#FFF8F3", "#FFF0E6"] as const,
//     fab: ["#E88B63", "#D97D54", "#C96D44"] as const,
//   },

//   // Overlay Colors
//   overlay: {
//     light: "rgba(255, 255, 255, 0.9)",
//     medium: "rgba(0, 0, 0, 0.5)",
//     dark: "rgba(0, 0, 0, 0.7)",
//   },
// } as const;

// // Spacing Scale
// export const SPACING = {
//   xxs: 2,
//   xs: 4,
//   sm: 8,
//   md: 12,
//   lg: 16,
//   xl: 20,
//   xxl: 24,
//   xxxl: 32,
//   huge: 40,
//   massive: 48,
// } as const;

// // Border Radius Scale
// export const BORDER_RADIUS = {
//   none: 0,
//   xs: 4,
//   sm: 8,
//   md: 12,
//   lg: 16,
//   xl: 20,
//   xxl: 24,
//   full: 999,
// } as const;

// // Typography
// export const TYPOGRAPHY = {
//   // Font Families
//   fontFamily: {
//     regular: Platform.select({ ios: "System", android: "Roboto" }),
//     medium: Platform.select({ ios: "System", android: "Roboto-Medium" }),
//     bold: Platform.select({ ios: "System", android: "Roboto-Bold" }),
//   },

//   // Font Sizes
//   fontSize: {
//     xs: 11,
//     sm: 13,
//     md: 15,
//     lg: 17,
//     xl: 20,
//     xxl: 24,
//     xxxl: 32,
//     display: 36,
//   },

//   // Line Heights
//   lineHeight: {
//     tight: 1.2,
//     normal: 1.5,
//     relaxed: 1.75,
//   },

//   // Letter Spacing
//   letterSpacing: {
//     tight: -1,
//     normal: 0,
//     wide: 0.5,
//     wider: 1,
//   },

//   // Font Weights
//   fontWeight: {
//     regular: "400" as const,
//     medium: "500" as const,
//     semibold: "600" as const,
//     bold: "700" as const,
//   },
// } as const;

// // Text Style Presets
// export const TEXT_STYLES: Record<string, TextStyle> = {
//   // Headings
//   h1: {
//     fontSize: TYPOGRAPHY.fontSize.display,
//     fontWeight: TYPOGRAPHY.fontWeight.regular,
//     letterSpacing: TYPOGRAPHY.letterSpacing.tight,
//     color: COLORS.text.primary,
//   },
//   h2: {
//     fontSize: TYPOGRAPHY.fontSize.xxxl,
//     fontWeight: TYPOGRAPHY.fontWeight.semibold,
//     letterSpacing: TYPOGRAPHY.letterSpacing.tight,
//     color: COLORS.text.primary,
//   },
//   h3: {
//     fontSize: TYPOGRAPHY.fontSize.xxl,
//     fontWeight: TYPOGRAPHY.fontWeight.semibold,
//     color: COLORS.text.primary,
//   },
//   h4: {
//     fontSize: TYPOGRAPHY.fontSize.xl,
//     fontWeight: TYPOGRAPHY.fontWeight.semibold,
//     color: COLORS.text.primary,
//   },

//   // Body Text
//   body: {
//     fontSize: TYPOGRAPHY.fontSize.md,
//     fontWeight: TYPOGRAPHY.fontWeight.regular,
//     lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
//     color: COLORS.text.primary,
//   },
//   bodySmall: {
//     fontSize: TYPOGRAPHY.fontSize.sm,
//     fontWeight: TYPOGRAPHY.fontWeight.regular,
//     lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
//     color: COLORS.text.secondary,
//   },
//   bodyLarge: {
//     fontSize: TYPOGRAPHY.fontSize.lg,
//     fontWeight: TYPOGRAPHY.fontWeight.regular,
//     lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
//     color: COLORS.text.primary,
//   },

//   // Labels & Captions
//   label: {
//     fontSize: TYPOGRAPHY.fontSize.sm,
//     fontWeight: TYPOGRAPHY.fontWeight.medium,
//     color: COLORS.text.secondary,
//   },
//   caption: {
//     fontSize: TYPOGRAPHY.fontSize.xs,
//     fontWeight: TYPOGRAPHY.fontWeight.regular,
//     color: COLORS.text.tertiary,
//   },

//   // Buttons
//   button: {
//     fontSize: TYPOGRAPHY.fontSize.md,
//     fontWeight: TYPOGRAPHY.fontWeight.semibold,
//     letterSpacing: TYPOGRAPHY.letterSpacing.wide,
//   },
//   buttonSmall: {
//     fontSize: TYPOGRAPHY.fontSize.sm,
//     fontWeight: TYPOGRAPHY.fontWeight.semibold,
//   },
// };

// // Shadow Presets
// export const SHADOWS = {
//   none: {
//     shadowColor: "transparent",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0,
//     shadowRadius: 0,
//     elevation: 0,
//   } as ViewStyle,
//   sm: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   } as ViewStyle,
//   md: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 4,
//   } as ViewStyle,
//   lg: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 8,
//   } as ViewStyle,
//   xl: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.25,
//     shadowRadius: 12,
//     elevation: 12,
//   } as ViewStyle,
//   // Colored shadows
//   primary: {
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   } as ViewStyle,
//   secondary: {
//     shadowColor: COLORS.secondary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 1,
//     shadowRadius: 8,
//     elevation: 8,
//   } as ViewStyle,
// };

// // Common Component Styles
// export const COMMON_STYLES = {
//   // Containers
//   screenContainer: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   } as ViewStyle,
//   contentContainer: {
//     paddingHorizontal: SPACING.xxl,
//   } as ViewStyle,
//   centerContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   } as ViewStyle,

//   // Cards
//   card: {
//     backgroundColor: COLORS.surface,
//     borderRadius: BORDER_RADIUS.lg,
//     padding: SPACING.xl,
//     ...SHADOWS.sm,
//   } as ViewStyle,
//   cardElevated: {
//     backgroundColor: COLORS.surface,
//     borderRadius: BORDER_RADIUS.lg,
//     padding: SPACING.xl,
//     ...SHADOWS.md,
//   } as ViewStyle,

//   // Buttons
//   buttonPrimary: {
//     backgroundColor: COLORS.secondary,
//     borderRadius: BORDER_RADIUS.md,
//     paddingVertical: SPACING.md,
//     paddingHorizontal: SPACING.xl,
//     alignItems: "center",
//     justifyContent: "center",
//   } as ViewStyle,
//   buttonSecondary: {
//     backgroundColor: COLORS.surface,
//     borderRadius: BORDER_RADIUS.md,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingVertical: SPACING.md,
//     paddingHorizontal: SPACING.xl,
//     alignItems: "center",
//     justifyContent: "center",
//   } as ViewStyle,

//   // Inputs
//   input: {
//     backgroundColor: COLORS.surface,
//     borderRadius: BORDER_RADIUS.md,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingVertical: SPACING.md,
//     paddingHorizontal: SPACING.lg,
//     fontSize: TYPOGRAPHY.fontSize.md,
//     color: COLORS.text.primary,
//   } as ViewStyle,

//   // Rows
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   } as ViewStyle,
//   rowSpaceBetween: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   } as ViewStyle,
// } as const;

// // Animation Configs
// export const ANIMATION_CONFIG = {
//   spring: {
//     tension: 12,
//     friction: 4,
//   },
//   timing: {
//     fast: 150,
//     normal: 300,
//     slow: 500,
//   },
// } as const;

// // Platform-specific values
// export const PLATFORM_STYLES = {
//   tabBarHeight: Platform.select({ ios: 88, android: 68 }) ?? 68,
//   tabBarPadding: Platform.select({ ios: 28, android: 10 }) ?? 10,
//   statusBarHeight: Platform.select({ ios: 44, android: 24 }) ?? 24,
// } as const;

// // Export everything as a single theme object for convenience
// export const theme = {
//   colors: COLORS,
//   spacing: SPACING,
//   borderRadius: BORDER_RADIUS,
//   typography: TYPOGRAPHY,
//   textStyles: TEXT_STYLES,
//   shadows: SHADOWS,
//   commonStyles: COMMON_STYLES,
//   animation: ANIMATION_CONFIG,
//   platform: PLATFORM_STYLES,
// } as const;

// export default theme;
/**
 * Design System - Theme Configuration
 *
 * Centralized theme for consistent styling across the application.
 * All colors, spacing, typography, and styling primitives are defined here.
 */
import { Platform, TextStyle, ViewStyle } from "react-native";

// Color Palette
export const COLORS = {
  // Brand Colors — punchy indigo-to-electric shifted from muted navy
  primary: "#4F46E5", // electric indigo (was dull #3D4E6F)
  primaryDark: "#3730A3", // deep indigo
  primaryLight: "#818CF8", // lavender pop

  secondary: "#F97316", // vivid orange (was muddy #F57C00)
  secondaryDark: "#EA580C", // burnt orange
  secondaryLight: "#FB923C", // bright tangerine

  // Accent Colors — neon-electric pop
  accent: "#06B6D4", // electric cyan (was muted #667eea)
  accentPurple: "#A855F7", // vivid violet (was dusty #764ba2)

  // Semantic Colors — punched up saturation
  success: "#22C55E", // vivid green
  successLight: "#DCFCE7",
  successDark: "#16A34A",

  error: "#EF4444", // bright red
  errorLight: "#FEE2E2",
  errorDark: "#DC2626",

  warning: "#F59E0B", // vivid amber
  warningLight: "#FEF3C7",
  warningDark: "#D97706",

  info: "#3B82F6", // bright blue
  infoLight: "#DBEAFE",
  infoDark: "#2563EB",

  // Neutrals — cleaner, crisper whites with a hint of warmth
  background: "#FAFAFA",
  backgroundLight: "#FFFFFF",
  backgroundDark: "#F4F4F5",
  surface: "#FFFFFF",
  surfaceAlt: "#FFF7ED", // warm tinted surface
  border: "#E4E4E7",
  borderLight: "#F4F4F5",
  borderDark: "#D4D4D8",
  divider: "#E4E4E7",

  // Text Colors — higher contrast, snappier
  text: {
    primary: "#09090B", // near-black zinc (was warm brown — higher contrast)
    secondary: "#52525B", // zinc-600
    tertiary: "#A1A1AA", // zinc-400
    light: "#D4D4D8",
    disabled: "#E4E4E7",
    white: "#FFFFFF",
    inverse: "#FFFFFF",
  },

  // Status Colors
  status: {
    pending: "#F59E0B",
    pendingBg: "#FEF3C7",
    completed: "#22C55E",
    completedBg: "#DCFCE7",
    inProgress: "#3B82F6",
    inProgressBg: "#DBEAFE",
    cancelled: "#71717A",
    cancelledBg: "#F4F4F5",
    expired: "#EF4444",
    expiredBg: "#FEE2E2",
    missed: "#475569",
    missedBg: "#F1F5F9",
  },

  // Gradient Presets — vivid, high-energy
  gradient: {
    primary: ["#4F46E5", "#7C3AED"] as const, // indigo → purple
    secondary: ["#F97316", "#EF4444"] as const, // orange → red
    success: ["#22C55E", "#16A34A"] as const,
    warning: ["#F59E0B", "#F97316"] as const,
    danger: ["#EF4444", "#DC2626"] as const,
    background: ["#FFFFFF", "#F0FEFF", "#EDE9FE"] as const, // crisp white → cyan → lavender
    fab: ["#F97316", "#EF4444", "#DC2626"] as const, // hot gradient FAB
  },

  // Overlay Colors
  overlay: {
    light: "rgba(255, 255, 255, 0.92)",
    medium: "rgba(9, 9, 11, 0.5)",
    dark: "rgba(9, 9, 11, 0.75)",
  },
} as const;

// Spacing Scale (unchanged — solid)
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
} as const;

// Border Radius Scale (unchanged)
export const BORDER_RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

// Typography (unchanged structure, tighter letter-spacing for punch)
export const TYPOGRAPHY = {
  fontFamily: {
    regular: Platform.select({ ios: "System", android: "Roboto" }),
    medium: Platform.select({ ios: "System", android: "Roboto-Medium" }),
    bold: Platform.select({ ios: "System", android: "Roboto-Bold" }),
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: -1,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

// Text Style Presets
export const TEXT_STYLES: Record<string, TextStyle> = {
  h1: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.bold, // bolder for punch
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
    color: COLORS.text.primary,
  },
  h2: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
    color: COLORS.text.primary,
  },
  h3: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  h4: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  body: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.primary,
  },
  bodySmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.secondary,
  },
  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text.primary,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold, // bumped to semibold for clarity
    color: COLORS.text.secondary,
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.text.tertiary,
  },
  button: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold, // bold for impact
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
};

// Shadow Presets — more vivid with subtle colour tint
export const SHADOWS = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  sm: {
    shadowColor: "#09090B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: "#09090B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,
  lg: {
    shadowColor: "#09090B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  xl: {
    shadowColor: "#09090B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 12,
  } as ViewStyle,
  // Colored shadows — vivid brand tints
  primary: {
    shadowColor: COLORS.primary, // electric indigo glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  secondary: {
    shadowColor: COLORS.secondary, // vivid orange glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
};

// Common Component Styles
export const COMMON_STYLES = {
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  contentContainer: {
    paddingHorizontal: SPACING.xxl,
  } as ViewStyle,
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.sm,
  } as ViewStyle,
  cardElevated: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  } as ViewStyle,
  // Primary button — vivid electric indigo (was muted orange)
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5, // slightly thicker for crispness
    borderColor: COLORS.primary, // indigo border instead of neutral grey
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  } as ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,
} as const;

// Animation Configs (unchanged)
export const ANIMATION_CONFIG = {
  spring: {
    tension: 12,
    friction: 4,
  },
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
} as const;

// Platform-specific values (unchanged)
export const PLATFORM_STYLES = {
  tabBarHeight: Platform.select({ ios: 88, android: 68 }) ?? 68,
  tabBarPadding: Platform.select({ ios: 28, android: 10 }) ?? 10,
  statusBarHeight: Platform.select({ ios: 44, android: 24 }) ?? 24,
} as const;

export const theme = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
  textStyles: TEXT_STYLES,
  shadows: SHADOWS,
  commonStyles: COMMON_STYLES,
  animation: ANIMATION_CONFIG,
  platform: PLATFORM_STYLES,
} as const;

export default theme;
