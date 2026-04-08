// app/(auth)/login.tsx
// Écran de connexion — shell visuel pour l'étape 3.
// La logique Google OAuth2 sera branchée à l'Epic 2.
//
// Affiche les 3 options :
//   1. Se connecter avec Google
//   2. Créer un compte avec Google
//   3. Continuer en tant qu'invité → onboarding

import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography, radius } from "../../constants/theme";

export default function LoginScreen() {
  const { theme } = useTheme();
  const setGuest = useAuthStore((s) => s.setGuest);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* ── Branding ── */}
      <View style={styles.branding}>
        <Text style={[typography.displayMd, { color: theme.colors.textPrimary }]}>
          FurniGo
        </Text>
        <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>
          Le mobilier moderne, à portée de main.
        </Text>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actions}>

        {/* Bouton Google — connexion (Epic 2) */}
        <Pressable
          style={[
            styles.buttonPrimary,
            { backgroundColor: theme.colors.accent },
          ]}
          onPress={() => {
            // TODO Epic 2 — expo-auth-session Google login
          }}
        >
          <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>
            Se connecter avec Google
          </Text>
        </Pressable>

        {/* Bouton Google — créer un compte (Epic 2) */}
        <Pressable
          style={[
            styles.buttonSecondary,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            },
          ]}
          onPress={() => {
            // TODO Epic 2 — même flux OAuth2, premier login = création auto
          }}
        >
          <Text style={[typography.labelLg, { color: theme.colors.textPrimary }]}>
            Créer un compte avec Google
          </Text>
        </Pressable>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
          <Text style={[typography.caption, { color: theme.colors.textTertiary, marginHorizontal: spacing.md }]}>
            ou
          </Text>
          <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Continuer en invité */}
        <Pressable
          style={styles.buttonGhost}
          onPress={setGuest}
        >
          <Text style={[typography.labelMd, { color: theme.colors.textSecondary }]}>
            Se connecter plus tard
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "space-between",
    paddingTop: spacing.section,
    paddingBottom: spacing.xxxl,
  },
  branding: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  actions: {
    gap: spacing.md,
  },
  buttonPrimary: {
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondary: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGhost: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xs,
  },
  line: {
    flex: 1,
    height: 1,
  },
});