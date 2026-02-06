import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TEXT_STYLES,
} from "../config/theme";
import { logError } from "../config/env";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError("ErrorBoundary", { error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Feather name="alert-triangle" size={64} color={COLORS.error} />
            </View>

            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleRetry}
              activeOpacity={0.8}
            >
              <Feather name="refresh-cw" size={20} color={COLORS.text.white} />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.errorLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  title: {
    ...TEXT_STYLES.h3,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  message: {
    ...TEXT_STYLES.body,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: SPACING.xxxl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  buttonText: {
    ...TEXT_STYLES.button,
    color: COLORS.text.white,
  },
});

export default ErrorBoundary;
