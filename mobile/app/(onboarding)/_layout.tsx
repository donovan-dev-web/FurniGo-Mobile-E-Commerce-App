// app/(onboarding)/_layout.tsx
// Layout du groupe "onboarding" — parcours 3 étapes pour les invités.
//
// Protection :
//   Si l'utilisateur est authentifié, redirige vers (main).
//   Si l'utilisateur n'est ni guest ni authenticated, redirige vers (auth).

import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

export default function OnboardingLayout() {
  const { theme } = useTheme();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/(main)/catalogue");
    }
    if (status === "unauthenticated") {
      router.replace("/(auth)/login");
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