import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";

interface AppDrawerProps {
  visible: boolean;
  onClose: () => void;
}

type DrawerRoute = "/(main)/catalogue" | "/(main)/panier" | "/(main)/commandes" | "/(main)/profil";

const DRAWER_WIDTH = 318;

export function AppDrawer({ visible, onClose }: AppDrawerProps) {
  const { theme, isDark, setTheme } = useTheme();
  const pathname = usePathname();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [translateX, visible]);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    }
  }

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    );
  }, [products]);

  function navigateTo(pathnameValue: DrawerRoute, params?: Record<string, string>) {
    onClose();
    router.push({
      pathname: pathnameValue,
      params,
    });
  }

  const isCatalogue = pathname === "/(main)/catalogue";
  const activeCategory = category?.trim();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]} onPress={onClose} />

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX }],
              backgroundColor: isDark ? theme.colors.backgroundSecondary : "#F7F1E8",
              borderRightColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.08)",
            },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.08)" }]}>
            <View>
              <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>FurniGo</Text>
              <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>Maison, style et douceur.</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <DrawerButton
                label="Catalogue"
                icon="grid-outline"
                active={isCatalogue}
                onPress={() => navigateTo("/(main)/catalogue")}
              />

              <View style={styles.submenu}>
                <DrawerSubButton
                  label="Tout"
                  active={isCatalogue && !activeCategory}
                  onPress={() => navigateTo("/(main)/catalogue")}
                />
                {categories.map((category) => (
                  <DrawerSubButton
                    key={category}
                    label={category}
                    active={isCatalogue && activeCategory === category}
                    onPress={() => navigateTo("/(main)/catalogue", { category })}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <DrawerButton
                label="Panier"
                icon="cart-outline"
                active={pathname === "/(main)/panier"}
                onPress={() => navigateTo("/(main)/panier")}
              />
              <DrawerButton
                label="Commandes"
                icon="cube-outline"
                active={pathname === "/(main)/commandes"}
                onPress={() => navigateTo("/(main)/commandes")}
              />
              <DrawerButton
                label="Profil"
                icon="person-outline"
                active={pathname === "/(main)/profil"}
                onPress={() => navigateTo("/(main)/profil")}
              />
            </View>
            <View style={[styles.section, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.08)" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>Light</Text>
                <Switch
                  value={isDark}
                  onValueChange={(value) => setTheme(value ? "dark" : "light")}
                />
                <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}> Dark</Text>
              </View>
          </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function DrawerButton({
  label,
  icon,
  active = false,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme, isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: active
            ? isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(168,78,34,0.10)"
            : "transparent",
        },
      ]}
    >
      <View style={styles.buttonInner}>
        <Ionicons name={icon} size={18} color={active ? theme.colors.accent : theme.colors.textSecondary} />
        <Text style={[styles.buttonLabel, { color: active ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

function DrawerSubButton({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.subButton}>
      <View style={[styles.subDot, { backgroundColor: active ? theme.colors.accent : theme.colors.textTertiary }]} />
      <Text style={[styles.subLabel, { color: active ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    width: DRAWER_WIDTH,
    maxWidth: "86%",
    height: "100%",
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brand: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 30,
    lineHeight: 32,
    fontStyle: "italic",
    fontWeight: "900",
  },
  tagline: {
    ...typography.bodySm,
    marginTop: spacing.xs,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  submenu: {
    marginLeft: spacing.lg,
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  button: {
    minHeight: 50,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  buttonLabel: {
    ...typography.headingSm,
  },
  subButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 32,
  },
  subDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subLabel: {
    ...typography.bodyMd,
  },
});
