import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../constants/theme";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutSuccessScreen() {
  const { theme } = useTheme();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentMuted }]}>
          <Ionicons name="checkmark-circle" size={64} color={theme.colors.accent} />
        </View>

        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Commande confirmée !
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Votre paiement a bien été reçu. Vous pouvez suivre votre commande dans l&apos;historique.
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.accent }]}
          onPress={() => router.replace("/(main)/commandes")}
        >
          <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>
            Voir mes commandes
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/(main)/catalogue")}
        >
          <Text style={[typography.labelMd, { color: theme.colors.textSecondary }]}>
            Continuer mes achats
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    ...typography.bodyMd,
    textAlign: "center",
  },
  button: {
    width: "100%",
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});