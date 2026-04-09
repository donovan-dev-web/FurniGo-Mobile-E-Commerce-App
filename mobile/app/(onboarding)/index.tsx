import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useGuestStore } from "../../store/guestStore";
import { radius, spacing, typography } from "@/constants/theme";

const STEPS = [
  {
    id: "discover",
    title: "Decouvrez notre collection",
    description: "Une selection exclusive de meubles pour votre maison.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADsqn8-rK790CYAyOo6nj-_A-jYeTxUPAzd5lOkN4dz9eQXClJzO0rolTx6keJFBxsROjfmirY2cJXKaPPnAbNWW9U4r2cY1QAxgcu_6zpPjCAqam0UnqvsU6XRor1Z4ATQUNWikXuGFnl9rwXLD9rVw8eyABOOkvrEs9rUmCuN9RN2XDbh9fJ_R7gSkNAFtVeoljPZzMgFVzUtLF5Fhn2Ocs5foBHHKOgKTm1w0KwZTw9yRE6VfMFuFTmmmyt1fEDIm-EQfKjks0",
    cta: "Suivant",
  },
  {
    id: "cart",
    title: "Ajout au panier simplifie",
    description: "Ajoutez vos articles preferes en un clic.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd2zoZcW3dbzgVYZJM3jw7tsvp-lpLtbbcLl2SzvxD_44bJ2UOKZAqCcK-xm30hHPNH7-LTCrI5UiXDL7BmGBOd1XLSB1wUgv35FfgLMbiLPLW2o6yvWC3eZO-RD-9Lm2CZvURczZuXaodjzNLFnmdvVfJAyitqZYgNZ9mNYpl9yGIC--q4ELcMcQr01ol9_UqEpg5COy9v7-QIalebw4kgabNHDRVo48eOWsbJlc6VHk6feEqtLGFIInNkbHGOvEKHssh9YtfTDU",
    cta: "Continuer",
  },
  {
    id: "secure",
    title: "Paiement en ligne securise",
    description: "Payez en toute confiance avec Stripe.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnT6mgQLCtlEXS3ST37Jsa7Xqc6Ws8b420fEWuq6MEK5-iBE7W27M_w1TZa0AkkZrdOzgk6FAO_71irCXWiZThyK9lKoTBontF2FK7iVLBiHN62t8QTYvLt2A6-5Z3bz5T0Q9tLKkLmfj_U42O7ywZ6Cj_vc7zUkzVjO3309079QQXuIfK7pD_ANrUD9nKkAUd2ZflLtKGWG_6QWbbnmcfKBq3JvhX_KTl6KkUBCwawN66sYhe5d5imAbTHjAD63T7yGRtWdj8AuA",
    cta: "Commencer mon shopping",
  },
];

export default function OnboardingScreen() {
  const { theme, isDark } = useTheme();
  const { markOnboardingDone } = useGuestStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = STEPS[currentIndex];
  const isLastStep = currentIndex === STEPS.length - 1;

  async function finish() {
    await markOnboardingDone();
    router.replace("/(main)/catalogue");
  }

  async function handleNext() {
    if (isLastStep) {
      await finish();
      return;
    }
    setCurrentIndex((value) => value + 1);
  }

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>FurniGo</Text>
          {!isLastStep ? (
            <Pressable onPress={() => void finish()}>
              <Text style={[styles.skip, { color: theme.colors.textSecondary }]}>Passer</Text>
            </Pressable>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        <View style={styles.visualWrap}>
          <View style={[styles.frameShadow, { backgroundColor: isDark ? "rgba(73,97,82,0.24)" : "rgba(192,219,201,0.28)" }]} />
          <Image source={{ uri: current.image }} style={styles.visual} />

          {current.id === "cart" ? (
            <View
              style={[
                styles.floatingCard,
                {
                  backgroundColor: isDark ? "rgba(45,52,53,0.92)" : "rgba(255,255,255,0.94)",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(45,52,53,0.05)",
                },
              ]}
            >
              <View style={[styles.floatingIcon, { backgroundColor: theme.colors.accentMuted }]}>
                <Ionicons name="cart" size={18} color={theme.colors.accent} />
              </View>
              <View>
                <Text style={[styles.floatingTitle, { color: theme.colors.textPrimary }]}>Ajoute au panier</Text>
                <Text style={[styles.floatingSubtitle, { color: theme.colors.textSecondary }]}>Vase en gres</Text>
              </View>
            </View>
          ) : null}

          {current.id === "secure" ? (
            <View
              style={[
                styles.floatingBadge,
                {
                  backgroundColor: isDark ? "rgba(45,52,53,0.86)" : "rgba(255,255,255,0.90)",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(45,52,53,0.05)",
                },
              ]}
            >
              <Ionicons name="lock-closed" size={14} color={theme.colors.accent} />
              <Text style={[styles.floatingBadgeText, { color: theme.colors.textPrimary }]}>
                Transactions cryptees par Stripe
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.copyBlock}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{current.title}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{current.description}</Text>
        </View>

        <View style={styles.dotsRow}>
          {STEPS.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.dot,
                {
                  width: index === currentIndex ? 32 : 8,
                  backgroundColor: index === currentIndex ? theme.colors.accent : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={() => void handleNext()}
          style={[
            styles.primaryButton,
            { backgroundColor: isLastStep ? theme.colors.textPrimary : theme.colors.accent },
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: isLastStep ? theme.colors.background : theme.colors.textOnAccent },
            ]}
          >
            {current.cta}
          </Text>
          <Ionicons
            name={isLastStep ? "rocket-outline" : "arrow-forward"}
            size={18}
            color={isLastStep ? theme.colors.background : theme.colors.textOnAccent}
          />
        </Pressable>

        <Text style={[styles.bottomHint, { color: theme.colors.textTertiary }]}>
          Aucun frais cache • Annulation gratuite
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  brand: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "900",
  },
  skip: {
    ...typography.labelMd,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  skipPlaceholder: {
    width: 50,
  },
  visualWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },
  frameShadow: {
    position: "absolute",
    top: -10,
    left: 6,
    right: 6,
    bottom: 10,
    borderRadius: 32,
    transform: [{ rotate: "-3deg" }],
  },
  visual: {
    width: "100%",
    height: 360,
    borderRadius: 26,
  },
  floatingCard: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.md,
  },
  floatingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingTitle: {
    ...typography.labelMd,
  },
  floatingSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  floatingBadge: {
    position: "absolute",
    bottom: spacing.xxl,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  floatingBadgeText: {
    ...typography.caption,
    fontFamily: typography.labelMd.fontFamily,
  },
  copyBlock: {
    gap: spacing.md,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "800",
  },
  description: {
    ...typography.bodyLg,
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.labelLg,
  },
  bottomHint: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
