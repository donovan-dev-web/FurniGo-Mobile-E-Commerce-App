import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";

interface AddToCartModalProps {
  visible: boolean;
  productName?: string;
  quantity?: number;
  onClose: () => void;
}

export function AddToCartModal({
  visible,
  productName,
  quantity = 1,
  onClose,
}: AddToCartModalProps) {
  const { theme, isDark } = useTheme();

  function handleViewCart() {
    onClose();
    router.push("/(main)/panier");
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]} onPress={onClose} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFDF9",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.08)",
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentMuted }]}>
            <Ionicons name="checkmark" size={24} color={theme.colors.accent} />
          </View>

          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Ajoute au panier</Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            {productName
              ? `${quantity} x ${productName} a bien ete ajoute au panier.`
              : "Votre selection a bien ete ajoutee au panier."}
          </Text>

          <Pressable
            style={[
              styles.primaryButton,
              { backgroundColor: isDark ? theme.colors.textPrimary : theme.colors.accent },
            ]}
            onPress={onClose}
          >
            <Text style={[typography.labelLg, { color: isDark ? theme.colors.background : theme.colors.textOnAccent }]}>
              Continuer mes achats
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              {
                borderColor: theme.colors.accent,
                backgroundColor: isDark ? "transparent" : "rgba(196,98,45,0.06)",
              },
            ]}
            onPress={handleViewCart}
          >
            <Text style={[typography.labelLg, { color: theme.colors.accent }]}>Voir le panier</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: "center",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 32,
    textAlign: "center",
  },
  text: {
    ...typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
});
