// components/ui/GoogleButton.tsx
// Bouton Google réutilisable — gère les états idle, loading, error.
// Utilisé sur l'écran login pour "Se connecter" et "Créer un compte".

import { Pressable, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { typography, spacing, radius, shadows } from "@/constants/theme";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface GoogleButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

// ─────────────────────────────────────────────
// Icône Google (SVG simplifié en View)
// ─────────────────────────────────────────────
function GoogleIcon() {
  return (
    <View style={styles.iconWrapper}>
      {/* G stylisé avec les 4 couleurs Google */}
      <Text style={styles.googleG}>G</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────
export function GoogleButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  variant = "primary",
}: GoogleButtonProps) {
  const { theme } = useTheme();

  const isPrimary = variant === "primary";
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? {
              backgroundColor: theme.colors.accent,
              ...shadows.sm,
            }
          : {
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
        pressed && { opacity: 0.85 },
        isDisabled && { opacity: 0.55 },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? theme.colors.textOnAccent : theme.colors.accent}
        />
      ) : (
        <View style={styles.content}>
          <GoogleIcon />
          <Text
            style={[
              typography.labelLg,
              {
                color: isPrimary
                  ? theme.colors.textOnAccent
                  : theme.colors.textPrimary,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4285F4",
  },
});