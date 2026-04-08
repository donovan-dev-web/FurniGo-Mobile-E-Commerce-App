// app/(main)/commandes.tsx
// Shell — sera développé à l'Epic 5 (US-16)

import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography, spacing } from "../../constants/theme";

export default function CommandesScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[typography.displaySm, { color: theme.colors.textPrimary }]}>
        Commandes
      </Text>
      <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>
        Epic 5 — à venir
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});