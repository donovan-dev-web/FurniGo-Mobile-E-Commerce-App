// hooks/useAppTheme.ts
// Détecte le colorScheme du système (light / dark) et retourne
// le thème FurniGo correspondant ainsi que des utilitaires pratiques.

import { useColorScheme } from "react-native";
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
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useAppTheme(): UseAppThemeReturn {
  // useColorScheme retourne "light" | "dark" | null | undefined
  // On normalise vers "light" par défaut si la valeur est absente.
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme = systemScheme === "dark" ? "dark" : "light";

const theme: AppTheme =
  colorScheme === "dark" ? darkTheme : lightTheme;
  
  return {
    theme,
    colorScheme,
    isDark: colorScheme === "dark",
    splashImage: theme.splash.image,
  };
}