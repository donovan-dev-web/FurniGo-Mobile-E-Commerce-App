import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";
import { Loader } from "@/components/ui/Loader";
import { Product } from "@/types/product";
import {
  formatProductPrice,
  getCachedProductImageSource,
  getProducts,
} from "@/services/productService";
import { MainTopBar } from "@/components/navigation/MainTopBar";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
import { useCartStore } from "@/store/cartStore";
import { FavoriteButton } from "@/components/product/FavoriteButton";

export default function CatalogueScreen() {
  const { theme, isDark } = useTheme();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        apiError.response?.data?.message ??
          apiError.message ??
          "Impossible de charger le catalogue pour le moment."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    );

    return ["Tout", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Tout") {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("Tout");
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const requestedCategory = category?.trim();

    if (!requestedCategory) {
      setSelectedCategory("Tout");
      return;
    }

    if (categories.includes(requestedCategory)) {
      setSelectedCategory(requestedCategory);
    }
  }, [categories, category]);

  function handleQuickAdd(product: Product) {
    addItem(product, 1);
    setAddedProduct(product);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerState}>
          <Text style={[styles.stateTitle, { color: theme.colors.textPrimary }]}>Catalogue indisponible</Text>
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>{error}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: theme.colors.accent }]} onPress={() => void loadProducts()}>
            <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>Reessayer</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 160 }]}
        showsVerticalScrollIndicator={false}
      >
        <MainTopBar />

        <View
          style={[
            styles.hero,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
        >
          <Image
            source={getCachedProductImageSource(filteredProducts[0]?.coverImage)}
            style={[styles.heroImage, { opacity: isDark ? 0.55 : 0.82 }]}
          />
          <View
            style={[
              styles.heroOverlay,
              {
                backgroundColor: isDark ? "rgba(12,15,15,0.22)" : "rgba(249,249,249,0.18)",
              },
            ]}
          />
          <View style={styles.heroContent}>
            <Text style={[styles.heroCaption, { color: theme.colors.textTertiary }]}>
              Collection 2024
            </Text>
            <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
              Epure &{"\n"}Confort.
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active
                      ? theme.colors.accent
                      : isDark
                        ? theme.colors.backgroundSecondary
                        : "#FFFFFF",
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: active
                        ? theme.colors.textOnAccent
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Nouveautes</Text>
          <Text style={[styles.sectionAction, { color: theme.colors.accent }]}>
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          </Text>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Text style={[styles.stateTitle, { color: theme.colors.textPrimary }]}>Aucun produit</Text>
            <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
              Aucun produit ne correspond a cette categorie pour le moment.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((product, index) => (
              <Pressable
                key={product.id}
                style={[styles.productCard, index % 2 === 1 && styles.offsetCard]}
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: product.id },
                  })
                }
              >
                <View
                  style={[
                    styles.productImageWrap,
                    { backgroundColor: theme.colors.backgroundSecondary },
                  ]}
                >
                  <Image
                    source={getCachedProductImageSource(product.coverImage)}
                    style={styles.productImage}
                  />
                  <View style={styles.productActions}>
                    <FavoriteButton product={product} />
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        handleQuickAdd(product);
                      }}
                      style={[
                        styles.addButton,
                        {
                          backgroundColor: isDark ? "rgba(12,15,15,0.88)" : "rgba(255,255,255,0.92)",
                        },
                      ]}
                    >
                      <Ionicons name="add" size={18} color={theme.colors.accent} />
                    </Pressable>
                  </View>
                </View>
                <Text style={[styles.productName, { color: theme.colors.textPrimary }]}>{product.name}</Text>
                <Text style={[styles.productSubtitle, { color: theme.colors.textSecondary }]}>
                  {product.category ?? "Collection FurniGo"}
                </Text>
                <Text style={[styles.productPrice, { color: theme.colors.accent }]}>
                  {formatProductPrice(product.price)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <AddToCartModal
        visible={Boolean(addedProduct)}
        productName={addedProduct?.name}
        quantity={1}
        onClose={() => setAddedProduct(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  hero: {
    height: 240,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    zIndex: 1,
  },
  heroCaption: {
    ...typography.labelMd,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 40,
    lineHeight: 40,
    fontWeight: "800",
  },
  categoriesRow: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  sectionAction: {
    ...typography.labelMd,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "47%",
    marginBottom: spacing.xl,
  },
  offsetCard: {
    marginTop: spacing.xl,
  },
  productImageWrap: {
    aspectRatio: 0.8,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  productActions: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    gap: spacing.sm,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    ...typography.headingSm,
    marginBottom: 2,
  },
  productSubtitle: {
    ...typography.bodySm,
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyState: {
    borderRadius: 24,
    padding: spacing.xl,
  },
  stateTitle: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 24,
    lineHeight: 28,
    textAlign: "center",
  },
  stateText: {
    ...typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  retryButton: {
    marginTop: spacing.xl,
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
});
