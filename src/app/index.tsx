// import {
//   Dimensions,
//   Text,
//   View,
//   Image,
//   StyleSheet,
//   StatusBar,
// } from "react-native";
// import React, { useEffect } from "react";
// import Carousel from "react-native-reanimated-carousel";
// import { LinearGradient } from "expo-linear-gradient";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withTiming,
//   FadeIn,
//   FadeInUp,
//   FadeInDown,
// } from "react-native-reanimated";
// import GoogleSignInButton from "../components/google-auth";

// import { useRouter } from "expo-router";
// import { useMeQuery } from "../store/api/auth.api";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { FONTS } from "@/components/fonts";
// const { width, height } = Dimensions.get("window");

// type Slide = {
//   title: string;
//   subtitle: string;
//   icon: string;
// };

// const slides: Slide[] = [
//   {
//     title: "Delegate with ease",
//     subtitle: "Assign tasks to anyone, instantly",
//     icon: "📤",
//   },
//   {
//     title: "Real-time responses",
//     subtitle: "Know exactly when they've seen it",
//     icon: "⚡",
//   },
//   {
//     title: "Smart expiration",
//     subtitle: "Tasks auto-expire. Zero clutter",
//     icon: "✨",
//   },
// ];

// export default function Index() {
//   const router = useRouter();
//   const { data, isSuccess } = useMeQuery();
//   const [activeIndex, setActiveIndex] = React.useState(0);

//   // Floating animation for decorative elements
//   const floatAnim = useSharedValue(0);

//   useEffect(() => {
//     floatAnim.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
//   }, []);

//   const floatStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: floatAnim.value * -10 }],
//   }));

//   useEffect(() => {
//     if (data && isSuccess) {
//       router.replace("/(tabs)/assigned");
//     }
//   }, [data, isSuccess]);

//   return (
//     <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
//       <View style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FAF8F6" />
//         <LinearGradient
//           colors={["#FAF8F6", "#FFF8F3", "#FFF4EE"]}
//           style={styles.backgroundGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 0, y: 1 }}
//         />

//         {/* Decorative Background Elements */}
//         <Animated.View style={[styles.decorCircle1, floatStyle]} />
//         <Animated.View style={[styles.decorCircle2, floatStyle]} />
//         <Animated.View style={[styles.decorCircle3, floatStyle]} />

//         {/* Main Content */}
//         <View style={styles.content}>
//           {/* Logo Section */}
//           <Animated.View
//             style={styles.logoSection}
//             entering={FadeInDown.duration(800).delay(200)}
//           >
//             <View style={styles.logoWrapper}>
//               <Image
//                 source={require("../../assets/images/bringuplogo.png")}
//                 style={styles.logo}
//               />
//             </View>
//             <Text style={styles.slogan}>Ask. Get. Done.</Text>
//           </Animated.View>

//           {/* Feature Cards */}
//           <Animated.View
//             style={styles.carouselSection}
//             entering={FadeIn.duration(600).delay(400)}
//           >
//             <Carousel
//               loop
//               width={width}
//               height={200}
//               autoPlay
//               autoPlayInterval={4000}
//               data={slides}
//               scrollAnimationDuration={600}
//               onSnapToItem={(index) => setActiveIndex(index)}
//               renderItem={({ item }: { item: Slide }) => (
//                 <View style={styles.slide}>
//                   <View style={styles.featureCard}>
//                     <Text style={styles.featureIcon}>{item.icon}</Text>
//                     <Text style={styles.featureTitle}>{item.title}</Text>
//                     <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
//                   </View>
//                 </View>
//               )}
//             />

//             {/* Pagination Dots */}
//             <View style={styles.pagination}>
//               {slides.map((_, index) => (
//                 <View
//                   key={index}
//                   style={[
//                     styles.paginationDot,
//                     activeIndex === index && styles.paginationDotActive,
//                   ]}
//                 />
//               ))}
//             </View>
//           </Animated.View>

//           {/* Bottom Section */}
//           <Animated.View
//             style={styles.bottomSection}
//             entering={FadeInUp.duration(600).delay(600)}
//           >
//             <Text style={styles.welcomeText}>Welcome</Text>
//             <Text style={styles.signInPrompt}>
//               Sign in to start delegating tasks
//             </Text>

//             <View style={styles.buttonContainer}>
//               <GoogleSignInButton />
//             </View>

//             <Text style={styles.termsText}>
//               By continuing, you agree to our{" "}
//               <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
//               <Text style={styles.termsLink}>Privacy Policy</Text>
//             </Text>
//           </Animated.View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FAF8F6",
//   },
//   backgroundGradient: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   decorCircle1: {
//     position: "absolute",
//     top: -80,
//     right: -60,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: "rgba(232, 139, 99, 0.08)",
//   },
//   decorCircle2: {
//     position: "absolute",
//     top: height * 0.35,
//     left: -100,
//     width: 250,
//     height: 250,
//     borderRadius: 125,
//     backgroundColor: "rgba(232, 139, 99, 0.05)",
//   },
//   decorCircle3: {
//     position: "absolute",
//     bottom: 100,
//     right: -80,
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: "rgba(232, 139, 99, 0.06)",
//   },
//   content: {
//     flex: 1,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
//   logoSection: {
//     alignItems: "center",
//     paddingTop: 20,
//   },
//   logoWrapper: {
//     shadowColor: "#E88B63",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 20,
//     elevation: 8,
//   },
//   logo: {
//     width: 160,
//     height: 160,
//     resizeMode: "contain",
//   },
//   slogan: {
//     fontSize: 20,
//     fontFamily: "Slogan",
//     color: "#E88B63",
//     marginTop: 16,
//     letterSpacing: 1.5,
//     textAlign: "center",
//   },
//   carouselSection: {
//     flex: 1,
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   slide: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   featureCard: {
//     width: "100%",
//     maxWidth: 320,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 24,
//     padding: 32,
//     alignItems: "center",
//     shadowColor: "#E88B63",
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.1,
//     shadowRadius: 24,
//     elevation: 6,
//     borderWidth: 1,
//     borderColor: "rgba(232, 139, 99, 0.1)",
//   },
//   featureIcon: {
//     fontSize: 40,
//     marginBottom: 16,
//   },
//   featureTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#2C2419",
//     textAlign: "center",
//     letterSpacing: -0.3,
//   },
//   featureSubtitle: {
//     marginTop: 8,
//     fontSize: 15,
//     color: "#6B5E52",
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   pagination: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//     gap: 8,
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "rgba(232, 139, 99, 0.25)",
//   },
//   paginationDotActive: {
//     width: 24,
//     backgroundColor: "#E88B63",
//   },
//   bottomSection: {
//     paddingHorizontal: 32,
//     alignItems: "center",
//   },
//   welcomeText: {
//     fontSize: 22,
//     fontFamily: FONTS.rockybilly,
//     color: "#4A4036",

//     letterSpacing: 1.2,
//   },
//   signInPrompt: {
//     fontSize: 12,
//     fontFamily: FONTS.sprintura,
//     color: "#6B5E52",
//     marginBottom: 24,
//     textAlign: "center",
//   },
//   buttonContainer: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   termsText: {
//     fontSize: 12,
//     color: "#9D8B7A",
//     textAlign: "center",
//     lineHeight: 18,
//     paddingHorizontal: 20,
//   },
//   termsLink: {
//     color: "#E88B63",
//     fontWeight: "600",
//   },
// });
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
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS } from "@/components/fonts";

const { width, height } = Dimensions.get("window");

// ── Responsive helpers ──────────────────────────────────────────────────────
// Base design was made for a 390 × 844 screen (iPhone 14)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const scaleW = (size: number) => (width / BASE_WIDTH) * size;
const scaleH = (size: number) => (height / BASE_HEIGHT) * size;

/**
 * Scale a font size and then cap it so it never exceeds the original
 * design value on large phones / tablets.
 */
const scaleFont = (size: number) => {
  const scaled = scaleW(size);
  const maxScale = 1.15; // allow at most 15 % growth on wide screens
  return Math.min(scaled, size * maxScale);
};

// Is this a small device? (e.g. iPhone SE / Android compact)
const isSmallDevice = height < 700;
// Is this a large device? (e.g. iPad)
const isTablet = width >= 768;

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
  const { data, isSuccess } = useMeQuery();
  const [activeIndex, setActiveIndex] = React.useState(0);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative Background */}
      <LinearGradient
        colors={["#FFF9F5", "#FAF8F6", "#F5F0EB"]}
        style={styles.backgroundGradient}
      />
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* ── Logo Section ── */}
        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.logoSection}
        >
          <Animated.View style={[styles.logoWrapper, floatStyle]}>
            <Image
              source={require("../../assets/images/bringuplogo.png")}
              style={styles.logo}
            />
          </Animated.View>
          <Text style={styles.slogan}>Ask. Get. Done.</Text>
        </Animated.View>

        {/* ── Carousel ── */}
        <Animated.View
          entering={FadeIn.duration(1000).delay(300)}
          style={styles.carouselSection}
        >
          <Carousel
            loop
            width={width}
            height={isSmallDevice ? scaleH(190) : scaleH(210)}
            autoPlay
            autoPlayInterval={3000}
            data={slides}
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
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Bottom Section ── */}
        <Animated.View
          entering={FadeInUp.duration(800).delay(500)}
          style={styles.bottomSection}
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
    </SafeAreaView>
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

  // Decorative circles — keep visual feel but don't interfere with layout
  decorCircle1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: scaleW(200),
    height: scaleW(200),
    borderRadius: scaleW(100),
    backgroundColor: "rgba(232, 139, 99, 0.08)",
  },
  decorCircle2: {
    position: "absolute",
    top: height * 0.35,
    left: -100,
    width: scaleW(250),
    height: scaleW(250),
    borderRadius: scaleW(125),
    backgroundColor: "rgba(232, 139, 99, 0.05)",
  },
  decorCircle3: {
    position: "absolute",
    bottom: 100,
    right: -80,
    width: scaleW(180),
    height: scaleW(180),
    borderRadius: scaleW(90),
    backgroundColor: "rgba(232, 139, 99, 0.06)",
  },

  content: {
    flex: 1,
    // Use paddingTop/Bottom that shrink on small devices
    paddingTop: isSmallDevice ? scaleH(20) : scaleH(40),
    paddingBottom: isSmallDevice ? scaleH(16) : scaleH(32),
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoSection: {
    alignItems: "center",
  },
  logoWrapper: {
    shadowColor: "#E88B63",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    // Shrink logo proportionally; cap so it never dominates on tablets
    width: Math.min(scaleW(140), 160),
    height: Math.min(scaleW(140), 160),
    resizeMode: "contain",
  },
  slogan: {
    fontSize: scaleFont(18),
    fontFamily: "Slogan",
    color: "#E88B63",
    marginTop: scaleH(10),
    letterSpacing: 1.5,
    textAlign: "center",
  },

  // ── Carousel ──────────────────────────────────────────────────────────────
  carouselSection: {
    flex: 1,
    justifyContent: "center",
    // Small top margin so it breathes without pushing the bottom off-screen
    marginTop: isSmallDevice ? scaleH(8) : scaleH(16),
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scaleW(24),
  },
  featureCard: {
    width: "100%",
    maxWidth: isTablet ? 420 : 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    // Tighter vertical padding on small screens
    paddingVertical: isSmallDevice ? scaleH(20) : scaleH(28),
    paddingHorizontal: scaleW(28),
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
    fontSize: scaleFont(isSmallDevice ? 30 : 36),
    marginBottom: scaleH(10),
  },
  featureTitle: {
    fontSize: scaleFont(isSmallDevice ? 17 : 20),
    fontWeight: "700",
    color: "#2C2419",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  featureSubtitle: {
    marginTop: scaleH(6),
    fontSize: scaleFont(isSmallDevice ? 12 : 14),
    color: "#6B5E52",
    textAlign: "center",
    lineHeight: scaleFont(isSmallDevice ? 18 : 21),
  },

  // ── Pagination ─────────────────────────────────────────────────────────────
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleH(12),
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

  // ── Bottom Section ─────────────────────────────────────────────────────────
  bottomSection: {
    paddingHorizontal: scaleW(32),
    alignItems: "center",
    // Small gap above so it never floats too close to carousel
    paddingTop: isSmallDevice ? scaleH(8) : scaleH(12),
  },
  welcomeText: {
    fontSize: scaleFont(isSmallDevice ? 18 : 22),
    fontFamily: FONTS.rockybilly,
    color: "#4A4036",
    letterSpacing: 1.2,
  },
  signInPrompt: {
    fontSize: scaleFont(isSmallDevice ? 11 : 12),
    fontFamily: FONTS.sprintura,
    color: "#6B5E52",
    marginBottom: scaleH(isSmallDevice ? 14 : 20),
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: scaleH(isSmallDevice ? 10 : 16),
  },
  termsText: {
    fontSize: scaleFont(isSmallDevice ? 10 : 12),
    color: "#9D8B7A",
    textAlign: "center",
    lineHeight: scaleFont(isSmallDevice ? 15 : 18),
    paddingHorizontal: scaleW(20),
  },
  termsLink: {
    color: "#E88B63",
    fontWeight: "600",
  },
});
