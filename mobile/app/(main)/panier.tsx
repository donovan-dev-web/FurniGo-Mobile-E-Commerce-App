// app/(main)/panier.tsx
// Shell — sera développé à l'Epic 4 (US-9/10/11/12)

import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography, spacing } from "../../constants/theme";

export default function PanierScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[typography.displaySm, { color: theme.colors.textPrimary }]}>
        Panier
      </Text>
      <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>
        Epic 4 — à venir
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});