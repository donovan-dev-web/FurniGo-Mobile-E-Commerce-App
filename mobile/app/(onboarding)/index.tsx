// app/(onboarding)/index.tsx
// Écran d'onboarding — 3 étapes pour les invités.
//
// Flux :
//   Étape 1 → Étape 2 → Étape 3 → Catalogue
//
// Navigation :
//   - Bouton "Suivant" pour progresser
//   - Bouton "Passer" pour sauter tout l'onboarding
//   - Sur la dernière étape, "Suivant" devient "Découvrir"
//
// À la fin, marque l'onboarding comme vu (guestStore)
// et redirige vers le catalogue.

import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useGuestStore } from "../../store/guestStore";
import { OnboardingStep, OnboardingStepData } from "@/components/onboarding/OnboardingStep";
import { OnboardingDots } from "../../components/onboarding/OnboardingDots";
import { typography, spacing, radius } from "@/constants/theme";

// ─────────────────────────────────────────────
// Contenu des 3 étapes
// ─────────────────────────────────────────────
const STEPS: OnboardingStepData[] = [
  {
    id: "discover",
    illustration: "🛋️",
    title: "Du mobilier pensé pour vous",
    description:
      "Explorez une sélection de meubles modernes, soigneusement choisis pour s'adapter à chaque intérieur.",
  },
  {
    id: "cart",
    illustration: "🛒",
    title: "Un panier, sans friction",
    description:
      "Ajoutez vos coups de cœur en un geste. Votre panier vous attend, même sans compte.",
  },
  {
    id: "checkout",
    illustration: "✨",
    title: "Commandez en toute confiance",
    description:
      "Paiement sécurisé, historique de commandes et gestion de vos données — tout est là.",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─────────────────────────────────────────────
// Écran
// ─────────────────────────────────────────────
export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { markOnboardingDone } = useGuestStore();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastStep = currentIndex === STEPS.length - 1;

  // ── Navigation ────────────────────────────
  const goToStep = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleFinish();
    } else {
      goToStep(currentIndex + 1);
    }
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  const handleFinish = async () => {
    await markOnboardingDone();
    router.replace("/(main)/catalogue");
  };

  // ── Render ────────────────────────────────
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Bouton Passer — toujours visible sauf dernière étape */}
      {!isLastStep && (
        <Pressable
          style={styles.skipButton}
          onPress={handleSkip}
          hitSlop={12}
        >
          <Text
            style={[
              typography.labelMd,
              { color: theme.colors.textTertiary },
            ]}
          >
            Passer
          </Text>
        </Pressable>
      )}

      {/* Scroll horizontal des étapes */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false} // Navigation uniquement via les boutons
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {STEPS.map((step, index) => (
          <OnboardingStep
            key={step.id}
            step={step}
            isActive={index === currentIndex}
          />
        ))}
      </ScrollView>

      {/* Footer — dots + boutons */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Platform.OS === "ios" ? 48 : 32 },
        ]}
      >
        {/* Indicateur de progression */}
        <OnboardingDots total={STEPS.length} currentIndex={currentIndex} />

        {/* Bouton principal */}
        <Pressable
          style={[
            styles.nextButton,
            { backgroundColor: theme.colors.accent },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              typography.labelLg,
              { color: theme.colors.textOnAccent },
            ]}
          >
            {isLastStep ? "Découvrir le catalogue" : "Suivant"}
          </Text>
        </Pressable>

        {/* Lien vers login — toujours visible */}
        <Pressable
          style={styles.loginLink}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text
            style={[
              typography.bodyMd,
              { color: theme.colors.textSecondary },
            ]}
          >
            Déjà un compte ?{" "}
            <Text style={{ color: theme.colors.accent }}>
              Se connecter
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: spacing.xl,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  nextButton: {
    width: "100%",
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  loginLink: {
    paddingVertical: spacing.sm,
  },
});