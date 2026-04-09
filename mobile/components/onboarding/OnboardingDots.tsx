// components/onboarding/OnboardingDots.tsx
// Indicateur de progression — points animés.

import { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { spacing, radius } from "@/constants/theme";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface OnboardingDotsProps {
  total: number;
  currentIndex: number;
}

// ─────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────
export function OnboardingDots({ total, currentIndex }: OnboardingDotsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot
          key={index}
          isActive={index === currentIndex}
          activeColor={theme.colors.accent}
          inactiveColor={theme.colors.border}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Dot individuel avec animation de largeur
// ─────────────────────────────────────────────
interface DotProps {
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
}

function Dot({ isActive, activeColor, inactiveColor }: DotProps) {
  const width = useRef(new Animated.Value(isActive ? 24 : 8)).current;
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(width, {
        toValue: isActive ? 24 : 8,
        useNativeDriver: false,
        damping: 15,
        stiffness: 200,
      }),
      Animated.timing(opacity, {
        toValue: isActive ? 1 : 0.4,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive, opacity, width]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width,
          opacity,
          backgroundColor: isActive ? activeColor : inactiveColor,
        },
      ]}
    />
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
});
