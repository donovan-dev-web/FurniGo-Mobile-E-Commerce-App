import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";
import { useCartStore } from "@/store/cartStore";
import { AppDrawer } from "@/components/navigation/AppDrawer";

export function MainTopBar() {
  const { theme, isDark } = useTheme();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: isDark ? "rgba(12,15,15,0.78)" : "rgba(249,249,249,0.82)",
            borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "transparent",
          },
        ]}
      >
        <Pressable style={styles.iconButton} onPress={() => setIsDrawerOpen(true)}>
          <Ionicons name="menu-outline" size={22} color={theme.colors.textPrimary} />
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

      <AppDrawer visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    marginBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "900",
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
