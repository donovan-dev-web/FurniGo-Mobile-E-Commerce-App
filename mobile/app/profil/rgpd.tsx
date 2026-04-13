import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../constants/theme";
import { exportUserData, UserExportData } from "@/services/userService";

type SectionKey = "locales" | "personnelles" | "pseudonymisees" | "anonymisees";

const SECTIONS: {
  key: SectionKey;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  retention: string;
}[] = [
  {
    key: "locales",
    icon: "phone-portrait-outline",
    title: "Données locales",
    subtitle: "Stockées uniquement sur votre appareil, jamais transmises à nos serveurs.",
    color: "#6366F1",
    retention: "Supprimées à la désinstallation de l'app",
  },
  {
    key: "personnelles",
    icon: "person-outline",
    title: "Données personnelles",
    subtitle: "Votre identité récupérée via Google OAuth2 et stockée sur nos serveurs.",
    color: "#F59E0B",
    retention: "Supprimées immédiatement sur demande",
  },
  {
    key: "pseudonymisees",
    icon: "shield-half-outline",
    title: "Données pseudonymisées",
    subtitle: "Vos commandes liées à votre identifiant. Dissociées de votre profil à la suppression.",
    color: "#8B5CF6",
    retention: "Anonymisées à la suppression du compte",
  },
  {
    key: "anonymisees",
    icon: "stats-chart-outline",
    title: "Données anonymisées",
    subtitle: "Statistiques agrégées sans lien avec votre identité. Conservées à des fins analytiques.",
    color: "#10B981",
    retention: "Conservées indéfiniment",
  },
];

export default function RgpdScreen() {
  const { theme, isDark } = useTheme();
  const [expanded, setExpanded] = useState<SectionKey | null>(null);
  const [data, setData] = useState<UserExportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  function toggle(key: SectionKey) {
    if (!hasLoaded && !isLoading) {
      loadData();
    }
    setExpanded((prev) => (prev === key ? null : key));
  }

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await exportUserData();
      setData(result);
      setHasLoaded(true);
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExport() {
    try {
      const result = data ?? (await exportUserData());
      const json = JSON.stringify(
        {
          export_furnigo: {
            date: new Date().toISOString(),
            donnees_locales: {
              description: "Panier stocké sur votre appareil uniquement",
              contenu: "Non inclus dans cet export (données locales)",
            },
            donnees_personnelles: result.donneesPersonnelles,
            donnees_pseudonymisees: result.donneesPseudonymisees,
            donnees_anonymisees: result.donneesAnonymisees,
          },
        },
        null,
        2
      );
      await Share.share({ message: json, title: "Export RGPD — FurniGo" });
    } catch {
      // silencieux
    }
  }

  function renderContent(key: SectionKey) {
    if (isLoading) {
      return <ActivityIndicator color={theme.colors.accent} style={{ marginVertical: spacing.md }} />;
    }

    if (!data) return null;

    switch (key) {
      case "locales":
        return (
          <View style={styles.dataBlock}>
            <DataRow label="Panier" value="Stocké dans AsyncStorage sur votre appareil" />
            <DataRow label="Token JWT" value="Stocké dans AsyncStorage, supprimé à la déconnexion" />
            <DataRow label="Préférences UI" value="Thème clair/sombre — local uniquement" />
          </View>
        );

      case "personnelles":
        return (
          <View style={styles.dataBlock}>
            <DataRow label="Nom" value={data.donneesPersonnelles.nom} />
            <DataRow label="Email" value={data.donneesPersonnelles.email} />
            <DataRow label="Connexion" value={data.donneesPersonnelles.provider} />
            <DataRow
              label="Inscrit le"
              value={new Date(data.donneesPersonnelles.dateCreation).toLocaleDateString("fr-FR")}
            />
          </View>
        );

      case "pseudonymisees":
        return (
          <View style={styles.dataBlock}>
            {data.donneesPseudonymisees.length === 0 ? (
              <Text style={[typography.bodySm, { color: theme.colors.textSecondary }]}>
                Aucune commande enregistrée.
              </Text>
            ) : (
              data.donneesPseudonymisees.map((order) => (
                <View key={order.orderId} style={[styles.orderRow, { borderColor: theme.colors.border }]}>
                  <DataRow label="ID" value={`#${order.orderId.slice(0, 8).toUpperCase()}`} />
                  <DataRow label="Statut" value={order.status} />
                  <DataRow
                    label="Montant"
                    value={order.totalAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  />
                  <DataRow
                    label="Date"
                    value={new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  />
                </View>
              ))
            )}
          </View>
        );

      case "anonymisees":
        return (
          <View style={styles.dataBlock}>
            <DataRow
              label="Nombre de commandes"
              value={String(data.donneesAnonymisees.nombreCommandes)}
            />
            <DataRow
              label="Montant total historique"
              value={data.donneesAnonymisees.montantTotalHistorique.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            />
            <Text style={[typography.bodySm, { color: theme.colors.textTertiary, marginTop: spacing.sm }]}>
              Ces données sont conservées après suppression du compte à des fins statistiques anonymes.
            </Text>
          </View>
        );
    }
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mes données</Text>
        </View>

        <Text style={[typography.bodyMd, { color: theme.colors.textSecondary, marginBottom: spacing.xl }]}>
          Conformément au RGPD, vous avez le droit de consulter, exporter et supprimer vos données. Appuyez sur une catégorie pour voir les données associées.
        </Text>

        {/* Sections accordéon */}
        {SECTIONS.map((section) => {
          const isOpen = expanded === section.key;
          return (
            <Pressable
              key={section.key}
              onPress={() => toggle(section.key)}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                  borderColor: isOpen ? section.color + "55" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.05)"),
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: section.color + "22" }]}>
                  <Ionicons name={section.icon as any} size={20} color={section.color} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                    {section.title}
                  </Text>
                  <Text style={[styles.cardRetention, { color: section.color }]}>
                    {section.retention}
                  </Text>
                </View>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.colors.textTertiary}
                />
              </View>

              {!isOpen && (
                <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                  {section.subtitle}
                </Text>
              )}

              {isOpen && renderContent(section.key)}
            </Pressable>
          );
        })}

        {/* Bouton export JSON */}
        <Pressable
          style={[styles.exportButton, { backgroundColor: theme.colors.accentMuted }]}
          onPress={handleExport}
        >
          <Ionicons name="download-outline" size={18} color={theme.colors.accent} />
          <Text style={[typography.labelMd, { color: theme.colors.accent }]}>
            Exporter toutes mes données (JSON)
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.dataRow}>
      <Text style={[typography.caption, { color: theme.colors.textTertiary, flex: 1 }]}>{label}</Text>
      <Text style={[typography.bodySm, { color: theme.colors.textPrimary, flex: 2, textAlign: "right" }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg },
  backButton: { padding: spacing.xs },
  title: { fontFamily: typography.displayLg.fontFamily, fontSize: 28, fontWeight: "800" },
  card: { borderRadius: 20, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardText: { flex: 1 },
  cardTitle: { ...typography.headingMd },
  cardRetention: { ...typography.caption, marginTop: 2 },
  cardSubtitle: { ...typography.bodySm, marginTop: spacing.sm },
  dataBlock: { marginTop: spacing.md, gap: spacing.sm },
  dataRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: spacing.xs },
  orderRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.sm, marginTop: spacing.sm, gap: spacing.xs },
  exportButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderRadius: 16, padding: spacing.lg, marginTop: spacing.lg },
});