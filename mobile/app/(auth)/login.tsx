import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTheme } from "@/context/ThemeContext";
import { spacing, typography, radius } from "@/constants/theme";
import { Loader } from "@/components/ui/Loader";

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const { setGuest } = useAuthStore();
  const { signIn, state, error } = useGoogleAuth();
  const insets = useSafeAreaInsets();
  const isLoading = state === "loading";

  if (isLoading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: theme.colors.background }]}>
        <Loader />
        <View style={styles.loadingCopy}>
          <Text style={[styles.loadingTitle, { color: theme.colors.textPrimary }]}>
            Connexion en cours
          </Text>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Nous finalisons votre session Google avant de vous ouvrir le catalogue.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: Math.max(insets.bottom, spacing.xl),
          },
        ]}
      >
        <View style={styles.branding}>
          <Text style={[styles.logo, { color: theme.colors.textPrimary }]}>FurniGo</Text>
          <View style={[styles.brandLine, { backgroundColor: theme.colors.accent }]} />
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>Bienvenue chez FurniGo</Text>
          <Text style={[styles.subheadline, { color: theme.colors.textSecondary }]}>
            Connectez-vous pour commencer votre experience.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? "rgba(7,9,9,0.45)" : "rgba(255,255,255,0.82)",
              borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(45,52,53,0.06)",
            },
          ]}
        >
          {error && (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: isDark ? "rgba(254,137,131,0.16)" : "rgba(254,137,131,0.18)",
                  borderColor: theme.colors.error,
                },
              ]}
            >
              <Text style={[typography.bodyMd, { color: theme.colors.error }]}>{error}</Text>
            </View>
          )}

          <Pressable
            style={[
              styles.googleButton,
              { backgroundColor: theme.colors.backgroundCTA },
            ]}
            onPress={() => void signIn()}
          >
            <>
              <Text style={styles.googleG}>G</Text>
              <Text style={[styles.googleLabel, { color: theme.colors.background }]}>
                Se connecter avec Google
              </Text>
            </>
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>Ou</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>


          <Pressable onPress={setGuest} style={styles.guestButton}>
            <Text style={[styles.guestLabel, { color: theme.colors.textSecondary }]}>
              Continuer en tant qu&apos;invite
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>

          <View style={styles.footerLinks}>
            {["Confidentialite", "Conditions", "Aide"].map((item) => (
              <Text key={item} style={[styles.footerLink, { color: theme.colors.textTertiary }]}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
  },
  loadingCopy: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  loadingTitle: {
    ...typography.displaySm,
    textAlign: "center",
  },
  loadingText: {
    ...typography.bodyMd,
    textAlign: "center",
    maxWidth: 320,
  },
  backgroundImage: {
    transform: [{ scale: 1 }],
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
  },
  branding: {
    alignItems: "center",
    marginTop: spacing.xxxl,
  },
  logo: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "900",
    fontStyle: "italic",
  },
  brandLine: {
    width: 32,
    height: 2,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  headline: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 40,
    lineHeight: 44,
    textAlign: "center",
    fontWeight: "800",
  },
  subheadline: {
    ...typography.bodyLg,
    textAlign: "center",
    marginTop: spacing.md,
    maxWidth: 280,
  },
  card: {
    borderRadius: 28,
    padding: spacing.xl,
    borderWidth: 1,
  },
  errorBanner: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  googleButton: {
    minHeight: 56,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  googleG: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4285F4",
  },
  googleLabel: {
    ...typography.labelLg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  secondaryLabel: {
    ...typography.labelLg,
  },
  guestButton: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  guestLabel: {
    ...typography.labelMd,
  },
  footer: {
    alignItems: "center",
  },
  footerLinks: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
  },
  footerLink: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});
