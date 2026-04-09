// constants/theme.ts
// FurniGo — Design tokens
// Source unique de vérité pour toutes les valeurs visuelles de l'app.

import { TextStyle } from "react-native";

// ─────────────────────────────────────────────
// Palette de base (non exposée directement)
// ─────────────────────────────────────────────
const palette = {
  // Naturals — ivoire chaud & bois foncé
  ivory50: "#FAF8F5",
  ivory100: "#F2EDE5",
  ivory200: "#E8DFD1",
  ivory300: "#D6C9B5",

  walnut900: "#1C1612",
  walnut800: "#2E2419",
  walnut700: "#3F3222",
  walnut600: "#56432E",
  walnut500: "#7A6147",

  // Accent — terre cuite chaude
  terracotta400: "#C4622D",
  terracotta500: "#A84E22",
  terracotta600: "#8C3E18",

  // Succès, Erreur, Warning
  sage300: "#43664e",
  sage400: "#5A8A6A",
  sage600: "#3D6B50",
  red400: "#C0392B",
  red600: "#962D22",
  amber400: "#D4A017",
  amber600: "#A87C10",

  // Blanc & noir purs
  white: "#FFFFFF",
  black: "#000000",

  // Gris neutres
  gray100: "#F5F5F5",
  gray200: "#E8E8E8",
  gray300: "#D1D1D1",
  gray400: "#A8A8A8",
  gray500: "#717171",
  gray600: "#4A4A4A",
  gray700: "#2E2E2E",
  gray800: "#1A1A1A",
} as const;

// ─────────────────────────────────────────────
// Thème LIGHT
// ─────────────────────────────────────────────
export const lightTheme = {
  dark: false,

  colors: {
    // Fond
    background: palette.ivory50,
    backgroundCTA: palette.sage400,
    backgroundSecondary: palette.ivory100,
    backgroundTertiary: palette.ivory200,
    surface: palette.white,

    // Texte
    textPrimary: palette.walnut900,
    textSecondary: palette.walnut600,
    textTertiary: palette.gray500,
    textInverse: palette.ivory50,
    textOnAccent: palette.white,

    // Accent
    accent: palette.terracotta400,
    accentHover: palette.terracotta500,
    accentMuted: "#F0D5C8",

    // Bordures
    border: palette.ivory300,
    borderStrong: palette.gray300,

    // Statuts
    success: palette.sage400,
    error: palette.red400,
    warning: palette.amber400,

    // Overlay
    overlay: "rgba(28, 22, 18, 0.45)",
    overlayLight: "rgba(28, 22, 18, 0.12)",

    // Skeleton / placeholder
    skeleton: palette.ivory200,
    skeletonHighlight: palette.ivory100,
  },

  // SplashScreen
  splash: {
    background: palette.ivory50,
    image: "light" as const, // clé pour choisir l'image
  },
} as const;

// ─────────────────────────────────────────────
// Thème DARK
// ─────────────────────────────────────────────
export const darkTheme = {
  dark: true,

  colors: {
    // Fond
    background: palette.walnut900,
    backgroundCTA: palette.sage400,
    backgroundSecondary: palette.walnut800,
    backgroundTertiary: palette.walnut700,
    surface: palette.walnut800,

    // Texte
    textPrimary: palette.ivory50,
    textSecondary: palette.ivory200,
    textTertiary: palette.gray400,
    textInverse: palette.walnut900,
    textOnAccent: palette.white,

    // Accent
    accent: palette.terracotta400,
    accentHover: palette.terracotta500,
    accentMuted: "rgba(196, 98, 45, 0.20)",

    // Bordures
    border: palette.walnut600,
    borderStrong: palette.walnut500,

    // Statuts
    success: palette.sage600,
    error: palette.red400,
    warning: palette.amber400,

    // Overlay
    overlay: "rgba(0, 0, 0, 0.60)",
    overlayLight: "rgba(0, 0, 0, 0.25)",

    // Skeleton / placeholder
    skeleton: palette.walnut700,
    skeletonHighlight: palette.walnut600,
  },

  // SplashScreen
  splash: {
    background: palette.walnut900,
    image: "dark" as const,
  },
} as const;

// ─────────────────────────────────────────────
// Types exportés
// ─────────────────────────────────────────────
export type AppTheme = typeof lightTheme | typeof darkTheme;
export type ThemeColors = AppTheme["colors"];
export type ColorScheme = "light" | "dark";

// ─────────────────────────────────────────────
// Espacement (base 4px)
// ─────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  section: 64,
} as const;

// ─────────────────────────────────────────────
// Rayon de bordure
// ─────────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ─────────────────────────────────────────────
// Typographie
// ─────────────────────────────────────────────
// Police display : DM Serif Display (élégant, mobilier haut de gamme)
// Police body    : DM Sans (lisible, moderne)
export const fontFamily = {
  displayRegular: "DMSerifDisplay_400Regular",
  displayItalic: "DMSerifDisplay_400Regular_Italic",
  sansRegular: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansBold: "DMSans_700Bold",
} as const;

export const typography = {
  // Titres display (serif)
  displayLg: {
    fontFamily: fontFamily.displayRegular,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.5,
  } satisfies TextStyle,
  displayMd: {
    fontFamily: fontFamily.displayRegular,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  displaySm: {
    fontFamily: fontFamily.displayRegular,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  } satisfies TextStyle,

  // Titres UI (sans-serif)
  headingLg: {
    fontFamily: fontFamily.sansBold,
    fontSize: 22,
    lineHeight: 28,
  } satisfies TextStyle,
  headingMd: {
    fontFamily: fontFamily.sansBold,
    fontSize: 18,
    lineHeight: 24,
  } satisfies TextStyle,
  headingSm: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 15,
    lineHeight: 20,
  } satisfies TextStyle,

  // Corps de texte
  bodyLg: {
    fontFamily: fontFamily.sansRegular,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  bodyMd: {
    fontFamily: fontFamily.sansRegular,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  bodySm: {
    fontFamily: fontFamily.sansRegular,
    fontSize: 12,
    lineHeight: 16,
  } satisfies TextStyle,

  // Labels & UI
  labelLg: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
  } satisfies TextStyle,
  labelMd: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamily.sansRegular,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.3,
  } satisfies TextStyle,
} as const;

// ─────────────────────────────────────────────
// Ombres
// ─────────────────────────────────────────────
export const shadows = {
  sm: {
    shadowColor: palette.walnut900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: palette.walnut900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: palette.walnut900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ─────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────
export const animation = {
  durationFast: 150,
  durationBase: 250,
  durationSlow: 400,
} as const;