import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../constants/theme";

export default function AdresseScreen() {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Adresse de livraison
          </Text>
        </View>

        <View style={[styles.emptyState, { backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF", borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.04)" }]}>
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentMuted }]}>
            <Ionicons name="location-outline" size={28} color={theme.colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
            Aucune adresse enregistrée
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            La gestion des adresses de livraison sera disponible prochainement.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xxl },
  backButton: { padding: spacing.xs },
  title: { fontFamily: typography.displayLg.fontFamily, fontSize: 28, fontWeight: "800" },
  emptyState: { borderRadius: 28, borderWidth: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl, alignItems: "center" },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: { ...typography.headingMd },
  emptyText: { ...typography.bodyMd, textAlign: "center", marginTop: spacing.sm },
});