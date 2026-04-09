// components/ui/Loader.tsx
// Écran de chargement affiché pendant la vérification du token JWT.
// S'adapte automatiquement au thème light / dark.

import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { useTheme } from "../../context/ThemeContext";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface LoaderProps {
  /** Taille du spinner en px (défaut : 40) */
  size?: number;
}

// ─────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────
export function Loader({ size = 40 }: LoaderProps) {
  const { theme } = useTheme();
  const rotation = useRef(new Animated.Value(0)).current;

  // Animation de rotation infinie
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Logo "FG" minimaliste au centre */}
      <View style={styles.logoWrapper}>
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: theme.colors.accent,
              borderTopColor: "transparent",
              transform: [{ rotate }],
            },
          ]}
        />
        {/* Petit point d'accent au centre */}
        <View
          style={[
            styles.dot,
            { backgroundColor: theme.colors.accent },
          ]}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderWidth: 2.5,
    position: "absolute",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});