// app/(main)/profil.tsx
// Shell — sera développé à l'Epic 5 (US-4)

import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import { typography, spacing, radius } from "../../constants/theme";

export default function ProfilScreen() {
  const { theme } = useTheme();
  const { user, status, logout } = useAuthStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[typography.displaySm, { color: theme.colors.textPrimary }]}>
        Profil
      </Text>

      {status === "guest" && (
        <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>
          Mode invité
        </Text>
      )}

      {user && (
        <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>
          {user.name} — {user.email}
        </Text>
      )}

      {/* Bouton déconnexion — disponible dès maintenant */}
      <Pressable
        style={[
          styles.logoutBtn,
          { borderColor: theme.colors.border },
        ]}
        onPress={logout}
      >
        <Text style={[typography.labelMd, { color: theme.colors.textSecondary }]}>
          Se déconnecter
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  logoutBtn: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderRadius: radius.md,
  },
});