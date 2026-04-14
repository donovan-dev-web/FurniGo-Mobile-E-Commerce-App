import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";
import { MainTopBar } from "@/components/navigation/MainTopBar";
import { fetchOrders, formatOrderDate, getOrderStatusLabel, Order } from "@/services/orderService";

export default function CommandesScreen() {
  const { theme, isDark } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 170 }]}
        showsVerticalScrollIndicator={false}
      >
        <MainTopBar />

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mes Commandes</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Suivez vos acquisitions et l&apos;histoire de votre interieur.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 40 }} />
        ) : orders.length === 0 ? (
          <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, textAlign: "center", marginTop: 40 }]}>
            Aucune commande pour le moment.
          </Text>
        ) : (
          <View style={styles.list}>
            {orders.map((order) => {
              const isPaid = order.status === "PAID";

              return (
                <View
                  key={order.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                      borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.05)",
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[styles.orderId, { color: theme.colors.textTertiary }]}>
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </Text>
                      <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
                        {formatOrderDate(order.createdAt)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isPaid
                            ? isDark ? "rgba(143,179,156,0.18)" : theme.colors.accentMuted
                            : isDark ? "rgba(255,255,255,0.08)" : theme.colors.backgroundTertiary,
                          borderColor: isPaid
                            ? "rgba(143,179,156,0.30)"
                            : isDark ? "rgba(255,255,255,0.10)" : "transparent",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isPaid ? theme.colors.accent : theme.colors.textSecondary },
                        ]}
                      >
                        {getOrderStatusLabel(order.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
                    {order.items.map((item) => (
                      <Text key={item.productId} style={[typography.bodySm, { color: theme.colors.textSecondary }]}>
                        {item.quantity}× {item.productName}
                      </Text>
                    ))}
                  </View>

                  <View style={[styles.cardHeader, { marginTop: spacing.md }]}>
                    <Text style={[styles.orderPrice, { color: theme.colors.textPrimary }]}>
                      {order.totalAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </Text>
                    <Pressable onPress={() => router.push(`/order/${order.id}`)}>
                      <Text style={[styles.actionText, { color: theme.colors.accent }]}>Détails</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  header: { marginBottom: spacing.xl },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: { ...typography.bodyMd, marginTop: spacing.xs },
  list: { gap: spacing.lg },
  card: { borderRadius: 22, padding: spacing.lg, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  orderId: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1.3 },
  orderDate: { ...typography.bodySm, marginTop: 4 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1 },
  badgeText: {
    ...typography.caption,
    fontFamily: typography.labelMd.fontFamily,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  orderPrice: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
  },
  actionText: { ...typography.labelMd },
});
