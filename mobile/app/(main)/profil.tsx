import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import { radius, spacing, typography } from "../../constants/theme";

const profileActions = [
  { id: "info", icon: "person-outline", label: "Mes informations personnelles" },
  { id: "address", icon: "location-outline", label: "Adresses de livraison" },
  { id: "payment", icon: "card-outline", label: "Modes de paiement" },
];

const securityActions = [
  { id: "export", icon: "download-outline", label: "Exporter mes donnees (GDPR)" },
  { id: "delete", icon: "trash-outline", label: "Supprimer mon compte (GDPR)", destructive: true },
];

type IconName = keyof typeof Ionicons.glyphMap;

export default function ProfilScreen() {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/(auth)/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Ionicons name="menu-outline" size={22} color={theme.colors.textPrimary} />
          <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>FurniGo</Text>
          <Ionicons name="search-outline" size={22} color={theme.colors.textPrimary} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: isDark ? theme.colors.backgroundSecondary : theme.colors.backgroundSecondary },
              ]}
            >
              <Text style={[styles.avatarInitials, { color: theme.colors.textPrimary }]}>
                {(user?.name ?? "FG")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={[styles.editBadge, { backgroundColor: theme.colors.accent }]}>
              <Ionicons name="create-outline" size={14} color={theme.colors.textOnAccent} />
            </View>
          </View>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{user?.name ?? "Utilisateur FurniGo"}</Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
            {user?.email ?? "invite@furnigo.local"}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Text style={[styles.statValue, { color: theme.colors.accent }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Commandes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? "#4A3A22" : "#FEDDB3" }]}>
            <Text style={[styles.statValue, { color: isDark ? "#EFD0A6" : "#644E2E" }]}>04</Text>
            <Text style={[styles.statLabel, { color: isDark ? "#EFD0A6" : "#644E2E" }]}>Favoris</Text>
          </View>
        </View>

        <View style={styles.section}>
          {profileActions.map((action) => (
            <ActionRow key={action.id} icon={action.icon as IconName} label={action.label} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHeaderText, { color: theme.colors.textTertiary }]}>
            Securite & Confidentialite
          </Text>
        </View>

        <View style={styles.section}>
          {securityActions.map((action) => (
            <ActionRow
              key={action.id}
              icon={action.icon as IconName}
              label={action.label}
              destructive={action.destructive}
            />
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={[
            styles.logoutRow,
            {
              backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
              borderColor: isDark ? "rgba(254,137,131,0.30)" : "rgba(159,64,61,0.10)",
              opacity: isLoggingOut ? 0.7 : 1,
            },
          ]}
        >
          <View style={styles.logoutContent}>
            <View style={[styles.logoutIconWrap, { backgroundColor: isDark ? "rgba(254,137,131,0.20)" : "rgba(254,137,131,0.18)" }]}>
              <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
            </View>
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              {isLoggingOut ? "Deconnexion..." : "Se deconnecter"}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionRow({
  icon,
  label,
  destructive = false,
}: {
  icon: IconName;
  label: string;
  destructive?: boolean;
}) {
  const { theme, isDark } = useTheme();

  return (
    <Pressable
      style={[
        styles.actionRow,
        {
          backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.04)",
        },
      ]}
    >
      <View style={styles.actionLeading}>
        <View
          style={[
            styles.actionIconWrap,
            {
              backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={destructive ? theme.colors.error : theme.colors.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.actionLabel,
            { color: destructive ? theme.colors.textPrimary : theme.colors.textPrimary },
          ]}
        >
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  brand: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "900",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  avatarWrap: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: typography.displayMd.fontFamily,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  editBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  email: {
    ...typography.bodyMd,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  statValue: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  statLabel: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    marginTop: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionHeaderText: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  actionLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    ...typography.bodyMd,
    fontFamily: typography.labelLg.fontFamily,
    flex: 1,
  },
  logoutRow: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logoutIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    ...typography.labelLg,
  },
});
