import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";
import { useCartStore } from "@/store/cartStore";

type TabIconName = keyof typeof Ionicons.glyphMap;

interface TabBarIconProps {
  color: string;
  focused: boolean;
  name: TabIconName;
}

function TabBarIcon({ color, focused, name }: TabBarIconProps) {
  return (
    <View
      style={[
        styles.iconChip,
        focused && { backgroundColor: "rgba(255,255,255,0.10)" },
      ]}
    >
      <Ionicons name={name} size={20} color={color} />
    </View>
  );
}

export default function MainLayout() {
  const { theme, isDark } = useTheme();
  const status = useAuthStore((s) => s.status);
  const userId = useAuthStore((s) => s.user?.id);
  const insets = useSafeAreaInsets();
  const setCartOwner = useCartStore((s) => s.setOwner);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/(auth)/login");
    }
  }, [status]);

  useEffect(() => {
    setCartOwner(status === "authenticated" ? userId : null);
  }, [setCartOwner, status, userId]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarStyle: {
          position: "absolute",
          left: spacing.lg,
          right: spacing.lg,
          bottom: 8,
          height: (Platform.OS === "ios" ? 68 : 62) + Math.max(insets.bottom - 6, 0),
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: spacing.sm,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(45,52,53,0.08)",
          borderRadius: 24,
          backgroundColor: isDark ? "rgba(12,15,15,0.92)" : "rgba(217, 226, 215, 0.94)",
          elevation: 0,
          shadowColor: isDark ? "#000000" : "#2D3435",
          shadowOpacity: isDark ? 0.4 : 0.08,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: -6 },
        },
        tabBarActiveTintColor: isDark ? "#F9F9F9" : "#2D3435",
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          ...typography.caption,
          fontFamily: typography.labelMd.fontFamily,
          fontSize: 10,
          lineHeight: 12,
          letterSpacing: 1.3,
          textTransform: "uppercase",
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: radius.lg,
        },
      }}
    >
      <Tabs.Screen
        name="catalogue"
        options={{
          title: "Catalogue",
          tabBarLabel: "Catalogue",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name={focused ? "home" : "home-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="panier"
        options={{
          title: "Panier",
          tabBarLabel: "Panier",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={focused ? "cart" : "cart-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{
          title: "Commandes",
          tabBarLabel: "Commandes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={focused ? "cube" : "cube-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={focused ? "person" : "person-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconChip: {
    minWidth: 34,
    height: 28,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
