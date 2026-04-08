// app/(main)/_layout.tsx
// Layout du groupe "main" — écrans accessibles après authentification
// ou en mode invité après l'onboarding.
//
// Structure :
//   Tab bar en bas avec les onglets principaux :
//     catalogue  → liste des produits
//     panier     → panier local (Epic 4)
//     commandes  → historique (Epic 5)
//     profil     → compte utilisateur (Epic 5)
//
// Protection :
//   Si l'utilisateur n'est ni authenticated ni guest, redirige vers (auth).

import { useEffect } from "react";
import { Platform } from "react-native";
import { Tabs, router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../constants/theme";

// ─────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────
export default function MainLayout() {
  const { theme } = useTheme();
  const status = useAuthStore((s) => s.status);

  // Protection — redirige si pas du tout connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/(auth)/login");
    }
  }, [status]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          ...typography.caption,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="catalogue"
        options={{
          title: "Catalogue",
          tabBarLabel: "Catalogue",
        }}
      />
      <Tabs.Screen
        name="panier"
        options={{
          title: "Panier",
          tabBarLabel: "Panier",
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{
          title: "Commandes",
          tabBarLabel: "Commandes",
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
        }}
      />
    </Tabs>
  );
}
