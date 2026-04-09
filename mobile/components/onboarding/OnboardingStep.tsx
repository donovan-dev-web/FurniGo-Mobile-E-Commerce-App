// components/onboarding/OnboardingStep.tsx
// Composant générique représentant une étape de l'onboarding.
//
// Reçoit :
//   - illustration  : nom de l'illustration (à mapper vers un SVG / image)
//   - title         : titre principal (serif)
//   - description   : texte descriptif
//   - isActive      : si cette étape est visible (pour l'animation)

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { typography, spacing } from "@/constants/theme";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface OnboardingStepData {
  id: string;
  /** Emoji temporaire — sera remplacé par une vraie illustration */
  illustration: string;
  title: string;
  description: string;
}

interface OnboardingStepProps {
  step: OnboardingStepData;
  isActive: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────
export function OnboardingStep({ step, isActive }: OnboardingStepProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(16);
    }
  }, [isActive, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {/* Illustration — placeholder emoji, à remplacer par Image/SVG */}
      <View
        style={[
          styles.illustrationWrapper,
          { backgroundColor: theme.colors.accentMuted },
        ]}
      >
        <Text style={styles.illustration}>{step.illustration}</Text>
      </View>

      {/* Texte */}
      <View style={styles.textWrapper}>
        <Text
          style={[
            typography.displaySm,
            { color: theme.colors.textPrimary, textAlign: "center" },
          ]}
        >
          {step.title}
        </Text>
        <Text
          style={[
            typography.bodyLg,
            {
              color: theme.colors.textSecondary,
              textAlign: "center",
              marginTop: spacing.md,
              lineHeight: 26,
            },
          ]}
        >
          {step.description}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  illustrationWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxxl,
  },
  illustration: {
    fontSize: 80,
  },
  textWrapper: {
    alignItems: "center",
    maxWidth: 320,
  },
});
