import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";
import { MainTopBar } from "@/components/navigation/MainTopBar";
import { useFavoritesStore } from "@/store/favoritesStore";
import { formatProductPrice, getCachedProductImageSource } from "@/services/productService";

export default function FavoritesScreen() {
  const { theme, isDark } = useTheme();
  const favorites = useFavoritesStore((state) => state.items);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        <MainTopBar />

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mes Favoris</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Retrouvez les pieces que vous avez mises de cote pour plus tard.
          </Text>
        </View>

        {favorites.length === 0 ? (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.04)",
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>Aucun favori pour le moment</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Ajoutez vos produits preferes depuis le catalogue ou leur fiche detail.
            </Text>
            <Pressable
              style={[styles.emptyButton, { backgroundColor: theme.colors.accent }]}
              onPress={() => router.push("/(main)/catalogue")}
            >
              <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>
                Explorer le catalogue
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {favorites.map((product) => (
              <Pressable
                key={product.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.04)",
                  },
                ]}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Image source={getCachedProductImageSource(product.coverImage)} style={styles.image} />

                <View style={styles.cardContent}>
                  <Text style={[styles.productName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productCategory, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {product.category ?? "Collection FurniGo"}
                  </Text>
                  <Text style={[styles.price, { color: theme.colors.accent }]}>
                    {formatProductPrice(product.price)}
                  </Text>
                </View>

                <Pressable
                  style={styles.removeButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    removeFavorite(product.id);
                  }}
                >
                  <Text style={[styles.removeText, { color: theme.colors.error }]}>Retirer</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  header: { marginBottom: spacing.xl },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: {
    ...typography.bodyMd,
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  emptyState: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyTitle: {
    ...typography.displaySm,
    textAlign: "center",
  },
  emptyText: {
    ...typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  emptyButton: {
    marginTop: spacing.xl,
    minHeight: 54,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 18,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  productName: {
    ...typography.labelLg,
  },
  productCategory: {
    ...typography.bodySm,
  },
  price: {
    ...typography.labelLg,
    marginTop: spacing.sm,
  },
  removeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  removeText: {
    ...typography.labelMd,
  },
});
