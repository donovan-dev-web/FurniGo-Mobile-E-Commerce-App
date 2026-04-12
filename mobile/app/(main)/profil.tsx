import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import { radius, spacing, typography } from "../../constants/theme";
import { MainTopBar } from "@/components/navigation/MainTopBar";
import { deleteAccount, exportUserData, fetchOrderCount } from "@/services/userService";

type IconName = keyof typeof Ionicons.glyphMap;

export default function ProfilScreen() {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);

  useEffect(() => {
    fetchOrderCount().then(setOrderCount).catch(() => {});
  }, []);

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

  async function handleExport() {
    try {
      const data = await exportUserData();
      await Share.share({
        message: JSON.stringify(data, null, 2),
        title: "Mes données FurniGo",
      });
    } catch {
      Alert.alert("Erreur", "Impossible d'exporter vos données.");
    }
  }

  function handleDelete() {
    Alert.alert(
      "Supprimer mon compte",
      "Cette action est irréversible. Toutes vos données seront supprimées définitivement.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              await logout();
              router.replace("/(auth)/login");
            } catch {
              Alert.alert("Erreur", "Impossible de supprimer le compte.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        <MainTopBar />

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.backgroundSecondary }]}>
              <Text style={[styles.avatarInitials, { color: theme.colors.textPrimary }]}>
                {(user?.name ?? "FG")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
            {user?.name ?? "Utilisateur FurniGo"}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
            {user?.email ?? "invite@furnigo.local"}
          </Text>
        </View>

        {/* Stat commandes uniquement */}
        <View style={[styles.statCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.statValue, { color: theme.colors.accent }]}>
            {String(orderCount).padStart(2, "0")}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Commandes</Text>
        </View>

        {/* Section profil */}
        <View style={styles.section}>
          <ActionRow
            icon="person-outline"
            label="Mes informations personnelles"
            onPress={() => router.push("/profil/informations")}
          />
          <ActionRow
            icon="location-outline"
            label="Adresse de livraison"
            onPress={() => router.push("/profil/adresse")}
          />
        </View>

        {/* Section RGPD */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHeaderText, { color: theme.colors.textTertiary }]}>
            Sécurité & Confidentialité
          </Text>
        </View>

        <View style={styles.section}>
          <ActionRow
            icon="download-outline"
            label="Exporter mes données (RGPD)"
            onPress={handleExport}
          />
          <ActionRow
            icon="trash-outline"
            label="Supprimer mon compte (RGPD)"
            destructive
            onPress={handleDelete}
          />
        </View>

        {/* Déconnexion */}
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
            <View style={[styles.logoutIconWrap, { backgroundColor: "rgba(254,137,131,0.18)" }]}>
              <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
            </View>
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
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
  onPress,
}: {
  icon: IconName;
  label: string;
  destructive?: boolean;
  onPress?: () => void;
}) {
  const { theme, isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.actionRow,
        {
          backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.04)",
        },
      ]}
    >
      <View style={styles.actionLeading}>
        <View style={[styles.actionIconWrap, { backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}>
          <Ionicons name={icon} size={18} color={destructive ? theme.colors.error : theme.colors.textSecondary} />
        </View>
        <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  profileHeader: { alignItems: "center", marginBottom: spacing.xl },
  avatarWrap: { marginBottom: spacing.lg },
  avatar: { width: 112, height: 112, borderRadius: 56, alignItems: "center", justifyContent: "center" },
  avatarInitials: { fontFamily: typography.displayMd.fontFamily, fontSize: 32, lineHeight: 36, fontWeight: "800" },
  name: { fontFamily: typography.displayLg.fontFamily, fontSize: 32, lineHeight: 36, fontWeight: "800" },
  email: { ...typography.bodyMd, marginTop: spacing.xs },
  statCard: { borderRadius: radius.lg, paddingVertical: spacing.xl, alignItems: "center", marginBottom: spacing.xl },
  statValue: { fontFamily: typography.displaySm.fontFamily, fontSize: 28, lineHeight: 30, fontWeight: "800" },
  statLabel: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1.3, marginTop: spacing.xs },
  section: { gap: spacing.sm },
  sectionHeader: { paddingHorizontal: spacing.xs, marginTop: spacing.xl, marginBottom: spacing.md },
  sectionHeaderText: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1.8 },
  actionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1 },
  actionLeading: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  actionIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { ...typography.bodyMd, fontFamily: typography.labelLg.fontFamily, flex: 1 },
  logoutRow: { marginTop: spacing.xl, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1 },
  logoutContent: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  logoutIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  logoutText: { ...typography.labelLg },
});
