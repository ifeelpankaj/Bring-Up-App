import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Svg, { Path } from "react-native-svg";

import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  getIdToken,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useLoginMutation } from "../store/api/auth.api";
import { useRouter } from "expo-router";
import { getFcmToken } from "../store/api/base.query";
import { FIREBASE_CONFIG, logError, logDebug } from "../config/env";
import { ERROR_MESSAGES } from "../config/constants";
import Toast from "react-native-toast-message";

// Google G Logo SVG Component
const GoogleLogo = () => (
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <Path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <Path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </Svg>
);

GoogleSignin.configure({
  webClientId: FIREBASE_CONFIG.webClientId,
});

const GoogleSignInButton = () => {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  async function onGoogleButtonPress() {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token from Google
      const signInResult = await GoogleSignin.signIn();

      // Debug: Show the full signInResult in a Toast (stringified, truncated if too long)
      try {
        const resultString = JSON.stringify(signInResult);
        Toast.show({
          type: "info",
          text1: "signInResult",
          text2:
            resultString.length > 200
              ? resultString.substring(0, 200) + "..."
              : resultString,
        });
      } catch (e) {
        Toast.show({
          type: "info",
          text1: "signInResult",
          text2: "[Could not stringify result]",
        });
      }

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Get auth instance
      const auth = getAuth();

      // Create a Google credential with the token (modular API)
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);

      // Get the Firebase ID token using modular API
      const firebaseToken = await getIdToken(userCredential.user);

      const fcmToken = await getFcmToken();

      if (!fcmToken) {
        logDebug(
          "⚠️ Warning: No FCM token obtained. Push notifications may not work.",
        );
      } else {
        logDebug("✓ FCM Token obtained:", fcmToken.substring(0, 20) + "...");
      }

      // Send the Firebase token to your backend
      await login({ firebaseToken, fcmToken }).unwrap();
      router.navigate("/(tabs)/assigned");
    } catch (error) {
      logError("GoogleSignIn", error);
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
      Toast.show({
        type: "error",
        text1: "Sign In Failed",
        text2: errorMessage,
      });
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isPressed && styles.buttonPressed,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={onGoogleButtonPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={isLoading}
        activeOpacity={0.9}
      >
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <GoogleLogo />
          )}
          <Text style={styles.buttonText}>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.04,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C4043",
    letterSpacing: 0.2,
  },
});

export default GoogleSignInButton;
