// context/ThemeContext.tsx
// Fournit le thème FurniGo à toute l'arborescence de composants.
// Usage dans n'importe quel composant : const { theme, isDark } = useTheme()

import React, { createContext, useContext, type ReactNode } from "react";
import { useAppTheme, UseAppThemeReturn } from "../hooks/useAppTheme";

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const ThemeContext = createContext<UseAppThemeReturn | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useAppTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook consommateur
// ─────────────────────────────────────────────
export function useTheme(): UseAppThemeReturn {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme doit être utilisé à l'intérieur de <ThemeProvider>");
  }
  return ctx;
}