import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loader } from "@/components/ui/Loader";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";
import {
  fetchOrderById,
  formatOrderDate,
  getOrderStatusLabel,
  Order,
} from "@/services/orderService";
import { formatProductPrice, getProductById } from "@/services/productService";
import { buildUploadUrl } from "@/services/api";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const [order, setOrder] = useState<Order | null>(null);
  const [productCovers, setProductCovers] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Commande introuvable.");
      setIsLoading(false);
      return;
    }

    void loadOrder(id);
  }, [id]);

  async function loadOrder(orderId: string) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOrderById(orderId);

      if (!data) {
        setError("Cette commande n'a pas pu etre retrouvee.");
        return;
      }

      setOrder(data);
      const coverEntries = await Promise.all(
        data.items.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            return [item.productId, product.coverImage ?? null] as const;
          } catch {
            return [item.productId, null] as const;
          }
        })
      );

      setProductCovers(Object.fromEntries(coverEntries));
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        apiError.response?.data?.message ??
          apiError.message ??
          "Impossible de charger cette commande pour le moment."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!order || error) {
    return (
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        style={[styles.safe, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.errorState}>
          <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>
            Details indisponibles
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error ?? "La commande demandee est introuvable."}
          </Text>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.colors.accent }]}
            onPress={() => router.back()}
          >
            <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = order.status === "PAID";
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[
          styles.topBar,
          {
            backgroundColor: isDark ? "rgba(20,23,23,0.82)" : "rgba(249,249,249,0.84)",
            borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.05)",
          },
        ]}
      >
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.topBarTitle, { color: theme.colors.textPrimary }]}>Commande</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: theme.colors.textTertiary }]}>
            Commande #{order.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Vos details de commande
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Retrouvez le recapitulatif complet et accedez rapidement aux fiches produit.
          </Text>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.06)",
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.colors.textTertiary }]}>Statut</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isPaid
                      ? isDark
                        ? "rgba(143,179,156,0.18)"
                        : theme.colors.accentMuted
                      : isDark
                        ? "rgba(255,255,255,0.08)"
                        : theme.colors.backgroundTertiary,
                    borderColor: isPaid
                      ? "rgba(143,179,156,0.30)"
                      : isDark
                        ? "rgba(255,255,255,0.10)"
                        : "transparent",
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

            <View style={styles.summaryAmount}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textTertiary }]}>Total</Text>
              <Text style={[styles.price, { color: theme.colors.textPrimary }]}>
                {formatProductPrice(order.totalAmount)}
              </Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <InfoBlock
              label="Date"
              value={formatOrderDate(order.createdAt)}
              themeColor={theme.colors.textPrimary}
              captionColor={theme.colors.textTertiary}
            />
            <InfoBlock
              label="Articles"
              value={`${totalItems}`}
              themeColor={theme.colors.textPrimary}
              captionColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Produits</Text>
          <Text style={[styles.sectionMeta, { color: theme.colors.textSecondary }]}>
            {order.items.length} reference{order.items.length > 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.itemsList}>
          {order.items.map((item) => (
            <View
              key={`${order.id}-${item.productId}`}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                  borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.06)",
                },
              ]}
            >
              <View style={styles.itemHeader}>
                <View
                  style={[
                    styles.itemImageFrame,
                    {
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : theme.colors.backgroundSecondary,
                    },
                  ]}
                >
                  {productCovers[item.productId] ? (
                    <Image
                      source={{
                        uri:
                          buildUploadUrl(productCovers[item.productId]) ??
                          "https://via.placeholder.com/160?text=FurniGo",
                      }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <View style={styles.itemImageFallback}>
                      <Ionicons name="image-outline" size={22} color={theme.colors.textTertiary} />
                    </View>
                  )}
                </View>

                <View style={styles.itemTitleBlock}>
                  <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
                    {item.productName}
                  </Text>
                  <Text style={[styles.itemMeta, { color: theme.colors.textSecondary }]}>
                    {item.quantity} x {formatProductPrice(item.unitPrice)}
                  </Text>
                </View>
                <Text style={[styles.itemTotal, { color: theme.colors.textPrimary }]}>
                  {formatProductPrice(item.lineTotal)}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.linkButton,
                  {
                    backgroundColor: isDark ? "rgba(255,255,255,0.06)" : theme.colors.backgroundSecondary,
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(45,52,53,0.06)",
                  },
                ]}
                onPress={() => router.push(`/product/${item.productId}`)}
              >
                <Text style={[styles.linkButtonText, { color: theme.colors.accent }]}>
                  Voir le produit
                </Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.accent} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoBlock({
  label,
  value,
  themeColor,
  captionColor,
}: {
  label: string;
  value: string;
  themeColor: string;
  captionColor: string;
}) {
  return (
    <View style={styles.infoBlock}>
      <Text style={[styles.summaryLabel, { color: captionColor }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: themeColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    ...typography.labelLg,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  eyebrow: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
  },
  subtitle: {
    ...typography.bodyMd,
    maxWidth: 320,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  summaryAmount: {
    alignItems: "flex-end",
  },
  summaryLabel: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeText: {
    ...typography.caption,
    fontFamily: typography.labelMd.fontFamily,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  price: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  infoBlock: {
    flex: 1,
    gap: 6,
  },
  infoValue: {
    ...typography.bodyLg,
    fontFamily: typography.labelLg.fontFamily,
  },
  sectionHeader: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.displaySm,
  },
  sectionMeta: {
    ...typography.bodySm,
  },
  itemsList: {
    gap: spacing.md,
  },
  itemCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  itemImageFrame: {
    width: 84,
    height: 84,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemImageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitleBlock: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    ...typography.labelLg,
  },
  itemMeta: {
    ...typography.bodySm,
  },
  itemTotal: {
    ...typography.labelLg,
  },
  linkButton: {
    minHeight: 48,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkButtonText: {
    ...typography.labelMd,
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.displaySm,
    textAlign: "center",
  },
  errorText: {
    ...typography.bodyMd,
    textAlign: "center",
    maxWidth: 320,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
});
