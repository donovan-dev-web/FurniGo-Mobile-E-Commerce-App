import { Image, Pressable, ScrollView, StyleSheet, Text, View, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";
import { buildUploadUrl } from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import { formatProductPrice } from "@/services/productService";
import { MainTopBar } from "@/components/navigation/MainTopBar";
import { useState } from "react";
import { createOrder, createCheckoutSession } from "@/services/orderService";

export default function PanierScreen() {
  const { theme, isDark } = useTheme();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const totalItems = useCartStore((state) => state.getTotalItems());
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasItems = items.length > 0;
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
  if (!hasItems || isCheckingOut) return;
  setIsCheckingOut(true);

  try {
    // 1. Créer la commande
    const order = await createOrder(items);

    // 2. Créer la session Stripe
    const session = await createCheckoutSession(order.id);

    // 3. Ouvrir Stripe dans le navigateur
    await Linking.openURL(session.checkoutUrl);


  } catch (error) {
    Alert.alert("Erreur", "Impossible de lancer le paiement." + (error instanceof Error ? ` (${error.message})` : ""));
  } finally {
    setIsCheckingOut(false);
  }
}

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        <MainTopBar />

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mon Panier</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {hasItems
              ? `Vous avez ${totalItems} article${totalItems > 1 ? "s" : ""} soigneusement selectionne${totalItems > 1 ? "s" : ""}.`
              : "Votre selection est vide pour le moment."}
          </Text>
        </View>

        {hasItems ? (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.04)",
                  },
                ]}
              >
                <Image
                  source={{ uri: buildUploadUrl(item.image) ?? "https://via.placeholder.com/400x400?text=FurniGo" }}
                  style={styles.itemImage}
                />
                <View style={styles.itemContent}>
                  <View style={styles.rowBetween}>
                    <View style={styles.itemText}>
                      <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                      <Text style={[styles.itemMeta, { color: theme.colors.textTertiary }]}>
                        {item.category ?? "Collection FurniGo"}
                      </Text>
                    </View>
                    <Pressable onPress={() => removeItem(item.id)} hitSlop={10}>
                      <Ionicons name="close" size={20} color={theme.colors.textTertiary} />
                    </Pressable>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.itemPrice, { color: theme.colors.textPrimary }]}>
                      {formatProductPrice(item.price)}
                    </Text>
                    <View
                      style={[
                        styles.qtyWrap,
                        { backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary },
                      ]}
                    >
                      <Pressable onPress={() => decrementItem(item.id)} hitSlop={8}>
                        <Ionicons name="remove" size={14} color={theme.colors.textPrimary} />
                      </Pressable>
                      <Text style={[styles.qtyText, { color: theme.colors.textPrimary }]}>{item.quantity}</Text>
                      <Pressable onPress={() => incrementItem(item.id)} hitSlop={8}>
                        <Ionicons name="add" size={14} color={theme.colors.textPrimary} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.04)",
              },
            ]}
          >
            <View
              style={[
                styles.emptyIconWrap,
                { backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary },
              ]}
            >
              <Ionicons name="cart-outline" size={26} color={theme.colors.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>Panier vide</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Ajoute un produit depuis le catalogue pour commencer ta commande.
            </Text>
          </View>
        )}

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: isDark ? theme.colors.backgroundSecondary : theme.colors.backgroundSecondary },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={[typography.bodyMd, { color: theme.colors.textSecondary }]}>Sous-total</Text>
            <Text style={[typography.bodyMd, { color: theme.colors.textPrimary }]}>{formatProductPrice(subtotal)}</Text>
          </View>
          <View style={[styles.rowBetween, styles.summaryRow]}>
            <Text style={[typography.bodyMd, { color: theme.colors.textSecondary }]}>Livraison</Text>
            <Text style={[typography.labelMd, { color: theme.colors.accent }]}>Gratuit</Text>
          </View>
          <View style={[styles.rowBetween, styles.totalRow, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.totalLabel, { color: theme.colors.textPrimary }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: theme.colors.textPrimary }]}>{formatProductPrice(subtotal)}</Text>
          </View>
            <Pressable
              style={[
                styles.checkoutButton,
                {
                  backgroundColor: isDark ? theme.colors.textPrimary : theme.colors.accent,
                  opacity: hasItems && !isCheckingOut ? 1 : 0.45,
                },
              ]}
              disabled={!hasItems || isCheckingOut}
              onPress={handleCheckout}
            >
              <Text style={[typography.labelLg, { color: isDark ? theme.colors.background : theme.colors.textOnAccent }]}>
                {isCheckingOut ? "Chargement..." : "Passer à la commande"}
              </Text>
            </Pressable>
          {hasItems ? (
            <Pressable style={styles.clearButton} onPress={clearCart}>
              <Text style={[typography.labelMd, { color: theme.colors.textSecondary }]}>Vider le panier</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: {
    ...typography.bodyMd,
    marginTop: spacing.sm,
  },
  itemsList: {
    gap: spacing.md,
  },
  emptyState: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headingMd,
  },
  emptyText: {
    ...typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  itemCard: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  itemImage: {
    width: 112,
    height: 112,
    borderRadius: radius.lg,
  },
  itemContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  itemText: { flex: 1 },
  itemName: {
    ...typography.headingMd,
  },
  itemMeta: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 4,
  },
  itemPrice: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "700",
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  qtyText: {
    ...typography.labelMd,
    minWidth: 16,
    textAlign: "center",
  },
  summaryCard: {
    marginTop: spacing.xxl,
    borderRadius: 32,
    padding: spacing.xl,
  },
  summaryRow: {
    marginTop: spacing.sm,
  },
  totalRow: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
  },
  totalPrice: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
  },
  checkoutButton: {
    marginTop: spacing.xl,
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    marginTop: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
