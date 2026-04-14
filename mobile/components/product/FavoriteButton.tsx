import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { radius } from "@/constants/theme";
import { Product } from "@/types/product";
import { useFavoritesStore } from "@/store/favoritesStore";

interface FavoriteButtonProps {
  product: Product;
  size?: number;
}

export function FavoriteButton({ product, size = 18 }: FavoriteButtonProps) {
  const { theme, isDark } = useTheme();
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <Pressable
      onPress={() => toggleFavorite(product)}
      style={[
        styles.button,
        {
          backgroundColor: isDark ? "rgba(12,15,15,0.88)" : "rgba(255,255,255,0.92)",
        },
      ]}
      hitSlop={10}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={size}
        color={isFavorite ? theme.colors.accent : theme.colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
