// app/_layout.tsx
// Layout racine de l'application Expo Router.
//
// Responsabilités :
//   1. Charger les polices (DM Serif Display + DM Sans)
//   2. Maintenir le Splash Screen visible pendant le chargement
//   3. Détecter le thème système et choisir le bon splash screen
//   4. Injecter le ThemeProvider global
//   5. Configurer la Stack de navigation racine

import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from "@expo-google-fonts/dm-serif-display";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../constants/theme";

import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

// Empêche le splash screen de disparaître automatiquement.
// On le cachera manuellement une fois les polices chargées.
SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

// ─────────────────────────────────────────────
// Layout racine
// ─────────────────────────────────────────────
export default function RootLayout() {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  // Chargement des polices
  const [fontsLoaded, fontError] = Font.useFonts({
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });


  // ✅ TOUS LES useEffect ICI (avant return)
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("Deep link received:", event.url);
    });

    return () => subscription.remove();
  }, []);

  // ❗ ensuite seulement le return conditionnel
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* StatusBar adaptée au thème */}
        <StatusBar style={isDark ? "light" : "dark"} />

        <Stack
          screenOptions={{
            // Fond de la navigation aligné sur le thème
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
            // Pas d'en-tête par défaut sur le layout racine
            headerShown: false,
          }}
        >
          {/*
            Les groupes de routes sont définis dans leurs dossiers respectifs :
              app/(auth)/        → login, register
              app/(onboarding)/  → onboarding invité
              app/(main)/        → catalogue, panier, profil, commandes
            
            Expo Router les détecte automatiquement.
            La redirection initiale est gérée dans app/index.tsx.
          */}
          <Stack.Screen name="index" />
          <Stack.Screen name="expo-auth-session" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
