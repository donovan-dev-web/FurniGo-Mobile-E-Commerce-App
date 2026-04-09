// app/(auth)/_layout.tsx
// Layout du groupe "auth" — écrans accessibles sans être connecté.
//
// Contenu du groupe :
//   login.tsx  → écran de connexion (Google, invité)
//
// Protection :
//   Si l'utilisateur est déjà authentifié, il est renvoyé vers (main).
//   Cela évite qu'un utilisateur connecté puisse revenir sur le login
//   via la navigation.

import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

export default function AuthLayout() {
  const { theme } = useTheme();
  const status = useAuthStore((s) => s.status);

  // Redirige si déjà connecté
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/(main)/catalogue");
    }
    if (status === "guest") {
      router.replace("/(onboarding)/");
    }
  }, [status]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );
}
