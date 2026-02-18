import {
  Dimensions,
  Text,
  View,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  FadeIn,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import GoogleSignInButton from "../components/google-auth";

import { useRouter } from "expo-router";
import { useMeQuery } from "../store/api/auth.api";

const { width, height } = Dimensions.get("window");

type Slide = {
  title: string;
  subtitle: string;
  icon: string;
};

const slides: Slide[] = [
  {
    title: "Delegate with ease",
    subtitle: "Assign tasks to anyone, instantly",
    icon: "📤",
  },
  {
    title: "Real-time responses",
    subtitle: "Know exactly when they've seen it",
    icon: "⚡",
  },
  {
    title: "Smart expiration",
    subtitle: "Tasks auto-expire. Zero clutter",
    icon: "✨",
  },
];

export default function Index() {
  const router = useRouter();
  const { data, isSuccess } = useMeQuery({});
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Floating animation for decorative elements
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value * -10 }],
  }));

  useEffect(() => {
    if (data && isSuccess) {
      router.replace("/(tabs)/assigned");
    }
  }, [data, isSuccess]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F6" />
      <View style={styles.container}>
        <LinearGradient
          colors={["#FAF8F6", "#FFF8F3", "#FFF4EE"]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Decorative Background Elements */}
        <Animated.View style={[styles.decorCircle1, floatStyle]} />
        <Animated.View style={[styles.decorCircle2, floatStyle]} />
        <Animated.View style={[styles.decorCircle3, floatStyle]} />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={styles.logoSection}
            entering={FadeInDown.duration(800).delay(200)}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/images/app-icon-1024.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.slogan}>Ask. Get. Done.</Text>
          </Animated.View>

          {/* Feature Cards */}
          <Animated.View
            style={styles.carouselSection}
            entering={FadeIn.duration(600).delay(400)}
          >
            <Carousel
              loop
              width={width}
              height={200}
              autoPlay
              autoPlayInterval={4000}
              data={slides}
              scrollAnimationDuration={600}
              onSnapToItem={(index) => setActiveIndex(index)}
              renderItem={({ item }: { item: Slide }) => (
                <View style={styles.slide}>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>{item.icon}</Text>
                    <Text style={styles.featureTitle}>{item.title}</Text>
                    <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              )}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Bottom Section */}
          <Animated.View
            style={styles.bottomSection}
            entering={FadeInUp.duration(600).delay(600)}
          >
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.signInPrompt}>
              Sign in to start delegating tasks
            </Text>

            <View style={styles.buttonContainer}>
              <GoogleSignInButton />
            </View>

            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F6",
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  decorCircle1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(232, 139, 99, 0.08)",
  },
  decorCircle2: {
    position: "absolute",
    top: height * 0.35,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(232, 139, 99, 0.05)",
  },
  decorCircle3: {
    position: "absolute",
    bottom: 100,
    right: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(232, 139, 99, 0.06)",
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  logoWrapper: {
    shadowColor: "#E88B63",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  slogan: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E88B63",
    marginTop: 16,
    letterSpacing: 2,
    textAlign: "center",
  },
  carouselSection: {
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  featureCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#E88B63",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(232, 139, 99, 0.1)",
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2419",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  featureSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B5E52",
    textAlign: "center",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(232, 139, 99, 0.25)",
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: "#E88B63",
  },
  bottomSection: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C2419",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  signInPrompt: {
    fontSize: 15,
    color: "#6B5E52",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#9D8B7A",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: "#E88B63",
    fontWeight: "600",
  },
});
