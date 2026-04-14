// hooks/useAppTheme.ts
// Détecte le colorScheme du système (light / dark) et retourne
// le thème FurniGo correspondant ainsi que des utilitaires pratiques.

import { useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, AppTheme, ColorScheme } from "../constants/theme";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface UseAppThemeReturn {
  /** Le thème complet (couleurs, splash…) */
  theme: AppTheme;
  /** "light" ou "dark" */
  colorScheme: ColorScheme;
  /** true si le thème actuel est dark */
  isDark: boolean;
  /** Clé à passer au composant SplashScreen pour choisir la bonne image */
  splashImage: "light" | "dark";

  setTheme: (scheme: ColorScheme | "system") => void;
  preference: ColorScheme | "system";
}

const STORAGE_KEY = "user-theme-preference";

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useAppTheme(): UseAppThemeReturn {
  const systemScheme = useColorScheme();

  const [preference, setPreference] = useState<ColorScheme | "system">("system");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreference(stored);
      }
    })();
  }, []);

  const setTheme = async (scheme: ColorScheme | "system") => {
    setPreference(scheme);
    await AsyncStorage.setItem(STORAGE_KEY, scheme);
  };

  const effectiveScheme: ColorScheme =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const theme: AppTheme =
    effectiveScheme === "dark" ? darkTheme : lightTheme;

  return {
    theme,
    colorScheme: effectiveScheme,
    isDark: effectiveScheme === "dark",
    splashImage: theme.splash.image,

    setTheme,
    preference,
  };
}