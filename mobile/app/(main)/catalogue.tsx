// app/(main)/catalogue.tsx
// Shell — sera développé à l'Epic 3 (US-6)

import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography, spacing } from "../../constants/theme";

export default function CatalogueScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[typography.displaySm, { color: theme.colors.textPrimary }]}>
        Catalogue
      </Text>
      <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>
        Epic 3 — à venir
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});