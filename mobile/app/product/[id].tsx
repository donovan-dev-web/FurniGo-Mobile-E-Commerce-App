import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loader } from "@/components/ui/Loader";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";
import { formatProductPrice, getProductById } from "@/services/productService";
import { Product } from "@/types/product";
import { buildUploadUrl } from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import { AddToCartModal } from "@/components/cart/AddToCartModal";

  const { width } = Dimensions.get("window");
  const ITEM_WIDTH = 320;
  const SPACING = 16;
  const SNAP_INTERVAL = ITEM_WIDTH + SPACING;
  const SIDE_PADDING = (width - ITEM_WIDTH) / 2;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    if (!id) return;
    void loadProduct(id);
  }, [id]);

  async function loadProduct(productId: string) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProductById(productId);
      setProduct(data);
      setSelectedImageIndex(0);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        apiError.response?.data?.message ??
          apiError.message ??
          "Impossible de charger ce produit pour le moment."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    addItem(product, quantity);
    setIsAddToCartModalVisible(true);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!product || error) {
    return (
      <SafeAreaView edges={["top", "left", "right", "bottom"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorState}>
          <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>Produit indisponible</Text>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error ?? "Le produit demande est introuvable."}
          </Text>
          <Pressable style={[styles.backButton, { backgroundColor: theme.colors.accent }]} onPress={() => router.back()}>
            <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[
          styles.topBar,
          {
            backgroundColor: isDark ? "rgba(20,23,23,0.82)" : "rgba(249,249,249,0.84)",
            borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "transparent",
          },
        ]}
      >
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>FurniGo</Text>
        <Pressable style={styles.iconButton} onPress={() => router.push("/(main)/panier")}>
          <Ionicons name="cart-outline" size={22} color={theme.colors.textPrimary} />
          {totalItems > 0 ? (
            <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.badgeText, { color: theme.colors.textOnAccent }]}>
                {totalItems > 99 ? "99+" : totalItems}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            disableIntervalMomentum
            snapToAlignment="start"
            contentContainerStyle={{
              paddingHorizontal: SIDE_PADDING,
            }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SNAP_INTERVAL
              );
              setSelectedImageIndex(index);
            }}
          >
          {getProductGallery(product).map((image, index, array) => (
            <View
              key={image}
              style={[
                styles.heroCard,
                styles.heroSlide,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  marginRight: index === array.length - 1 ? 0 : SPACING,
                },
              ]}
            >
                <Image
                  source={{
                    uri: buildUploadUrl(image) ?? "https://via.placeholder.com/800x1000?text=FurniGo",
                  }}
                  style={styles.heroImage}
                />
              </View>
            ))}
          </ScrollView>
          <View
            style={[
              styles.heroIndicators,
              {
                backgroundColor: isDark ? "rgba(12,15,15,0.60)" : "rgba(255,255,255,0.45)",
              },
            ]}
          >
            {getProductGallery(product).map((image, index) => (
              <View
                key={image}
                style={[
                  styles.heroDot,
                  {
                    opacity: selectedImageIndex === index ? 1 : 0.28,
                    backgroundColor: theme.colors.textPrimary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.infoHeader}>
          <View style={styles.titleColumn}>
            <Text style={[styles.collectionLabel, { color: theme.colors.textTertiary }]}>
              {product.category ?? "Collection FurniGo"}
            </Text>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{product.name}</Text>
          </View>
          <View style={styles.priceColumn}>
            <Text style={[styles.price, { color: theme.colors.accent }]}>{formatProductPrice(product.price)}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color={isDark ? "#DBC2A1" : "#735B3A"} />
              <Text style={[styles.ratingValue, { color: theme.colors.textPrimary }]}>4.9</Text>
              <Text style={[styles.ratingMeta, { color: theme.colors.textSecondary }]}>(124)</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionBlock}>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{product.description}</Text>
        </View>

        <View style={styles.featureGrid}>
          <FeatureCard icon="leaf-outline" title="Durable" subtitle="Bois certifie FSC" />
          <FeatureCard icon="construct-outline" title="Montage" subtitle="Livre assemble" />
        </View>

        <View style={styles.quantityRow}>
          <Text style={[styles.quantityLabel, { color: theme.colors.textPrimary }]}>Quantite</Text>
          <View
            style={[
              styles.quantityControl,
              { backgroundColor: isDark ? theme.colors.backgroundSecondary : theme.colors.backgroundSecondary },
            ]}
          >
            <Pressable
              style={[styles.quantityButton, { backgroundColor: isDark ? theme.colors.backgroundTertiary : "#FFFFFF" }]}
              onPress={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Ionicons name="remove" size={18} color={theme.colors.textPrimary} />
            </Pressable>
            <Text style={[styles.quantityValue, { color: theme.colors.textPrimary }]}>{quantity}</Text>
            <Pressable
              style={[styles.quantityButton, { backgroundColor: isDark ? theme.colors.backgroundTertiary : "#FFFFFF" }]}
              onPress={() => setQuantity((value) => value + 1)}
            >
              <Ionicons name="add" size={18} color={theme.colors.textPrimary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: isDark ? "rgba(20,23,23,0.84)" : "rgba(249,249,249,0.86)",
            borderTopColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.05)",
          },
        ]}
      >
        <Pressable
          style={[styles.outlineAction, { borderColor: theme.colors.accent }]}
          onPress={handleAddToCart}
        >
          <Text style={[typography.labelLg, { color: theme.colors.accent }]}>Ajouter au panier</Text>
        </Pressable>
      </View>

      <AddToCartModal
        visible={isAddToCartModalVisible}
        productName={product.name}
        quantity={quantity}
        onClose={() => setIsAddToCartModalVisible(false)}
      />
    </SafeAreaView>
  );
}

function getProductGallery(product: Product): string[] {
  if (product.galleryImages.length > 0) {
    return product.galleryImages;
  }

  return [product.coverImage];
}

function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.featureCard,
        {
          backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.05)",
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.accent} style={styles.featureIcon} />
      <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.featureSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    ...typography.headingSm,
    fontFamily: typography.displaySm.fontFamily,
  },
    brand: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "900",
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: 140,
  },
  heroSection: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xl,
  },
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
  },
  heroSlide: {
    width: ITEM_WIDTH,
    marginRight: SPACING,
  },
  heroImage: {
    width: "100%",
    aspectRatio: 0.8,
  },
  heroIndicators: {
    alignSelf: "center",
    marginTop: -34,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  titleColumn: {
    flex: 1,
  },
  collectionLabel: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.8,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  price: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  ratingValue: {
    ...typography.bodySm,
    fontFamily: typography.labelMd.fontFamily,
  },
  ratingMeta: {
    ...typography.bodySm,
  },
  materialCard: {
    marginHorizontal: spacing.xl,
    borderRadius: 24,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  materialInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  swatchWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D4C3B2",
  },
  modifyLabel: {
    ...typography.labelMd,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  descriptionBlock: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  description: {
    ...typography.bodyLg,
    lineHeight: 28,
  },
  featureGrid: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  featureCard: {
    flex: 1,
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
  },
  featureIcon: {
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.headingSm,
  },
  featureSubtitle: {
    ...typography.bodySm,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  quantityLabel: {
    ...typography.headingMd,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.full,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    ...typography.headingMd,
    minWidth: 24,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  outlineAction: {
    flex: 1,
    minHeight: 56,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryAction: {
    flex: 1.4,
    minHeight: 56,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 32,
  },
  errorText: {
    ...typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  backButton: {
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
    badge: {
    position: "absolute",
    top: 3,
    right: 1,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 10,
    lineHeight: 10,
  },
});
