import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import { radius, spacing, typography } from "../../constants/theme";

export default function InformationsScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuthStore();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Mes informations
          </Text>
        </View>

        <View style={styles.form}>
          <Field label="Nom complet" value={user?.name ?? ""} editable={false} theme={theme} isDark={isDark} />
          <Field label="Adresse email" value={user?.email ?? ""} editable={false} theme={theme} isDark={isDark} />
          <Field label="Connexion via" value="Google" editable={false} theme={theme} isDark={isDark} />
        </View>

        <Text style={[styles.note, { color: theme.colors.textTertiary }]}>
          Ces informations proviennent de votre compte Google et ne peuvent pas être modifiées directement.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, editable, theme, isDark }: {
  label: string;
  value: string;
  editable: boolean;
  theme: any;
  isDark: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.colors.textTertiary }]}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        style={[
          styles.fieldInput,
          {
            backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.08)",
            color: theme.colors.textPrimary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xxl },
  backButton: { padding: spacing.xs },
  title: { fontFamily: typography.displayLg.fontFamily, fontSize: 28, fontWeight: "800" },
  form: { gap: spacing.lg },
  fieldWrap: { gap: spacing.sm },
  fieldLabel: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1.2 },
  fieldInput: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, ...typography.bodyMd },
  note: { ...typography.bodySm, marginTop: spacing.xl, textAlign: "center" },
});