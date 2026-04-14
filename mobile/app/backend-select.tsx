import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography, radius } from "../constants/theme";
import { BACKENDS, useBackendStore } from "@/store/backendStore";
import { pingBackend, setApiBaseUrl } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";

type BackendKey = keyof typeof BACKENDS;
type Status = "idle" | "loading" | "up" | "error";

export default function BackendSelectScreen() {
  const { theme, isDark, setTheme } = useTheme();
  const { selectedKey, setBackend, confirm, ip, port, setLocalConfig  } = useBackendStore();
  const [backendStatus, setBackendStatus] = useState<Status>("idle");
  const [connectionStatus, setConnectionStatus] = useState<Status>("idle");

  const isReady = backendStatus === "up" && connectionStatus === "up";
  const isTesting = backendStatus === "loading";

  async function handleWakeUp() {
    setBackendStatus("loading");
    setConnectionStatus("idle");

    const url = BACKENDS[selectedKey];

    // Test 1 — backend répondant
    const isUp = await pingBackend(url);
    if (!isUp) {
      setBackendStatus("error");
      return;
    }
    setBackendStatus("up");

    // Test 2 — connexion Axios configurée
    setConnectionStatus("loading");
    try {
      setApiBaseUrl(url);
      setConnectionStatus("up");
    } catch {
      setConnectionStatus("error");
    }
  }

// Remplace handleLaunch par :
async function handleLaunch() {
  confirm();
  await initialize(); // authStore.initialize
  // La redirection est gérée par authStore via index.tsx
  // mais comme on bypass index, on redirige manuellement :
  router.replace("/(auth)/login");
}

// Importe initialize depuis authStore :
const { initialize } = useAuthStore();

  function handleSelectBackend(key: BackendKey) {
    setBackend(key);
    setBackendStatus("idle");
    setConnectionStatus("idle");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.colors.textPrimary }]}>FurniGo</Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Sélectionnez un backend pour démarrer
          </Text>
        </View>

        {/* Sélecteur backend */}
        <View style={[styles.card, { backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.06)" }]}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>
            Environnement
          </Text>
          <View style={[styles.toggle, { backgroundColor: theme.colors.backgroundTertiary }]}>
            {(Object.keys(BACKENDS) as BackendKey[]).map((key) => {
              const isSelected = selectedKey === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => handleSelectBackend(key)}
                  style={[
                    styles.toggleOption,
                    isSelected && { backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF" },
                  ]}
                >
                  <Ionicons
                    name={key === "local" ? "laptop-outline" : "cloud-outline"}
                    size={16}
                    color={isSelected ? theme.colors.accent : theme.colors.textTertiary}
                  />
                  <Text style={[styles.toggleLabel, { color: isSelected ? theme.colors.textPrimary : theme.colors.textTertiary }]}>
                    {key === "local" ? "Local" : "En ligne"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.urlText, { color: theme.colors.textTertiary }]} numberOfLines={1}>
            {BACKENDS[selectedKey]}
          </Text>
        </View>

        {selectedKey === "local" && (
        <View style={{ gap: spacing.sm }}>
          <TextInput
            placeholder="Adresse IP (ex: 192.168.11.113)"
            value={ip}
            onChangeText={(value) => setLocalConfig(value, port)}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.textPrimary,
              },
            ]}
            placeholderTextColor={theme.colors.textTertiary}
          />

          <TextInput
            placeholder="Port (ex: 8080)"
            value={port}
            onChangeText={(value) => setLocalConfig(ip, value)}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.textPrimary,
              },
            ]}
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>
      )}

        {/* Statuts */}
        <View style={[styles.card, { backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.06)" }]}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary }]}>
            Diagnostics
          </Text>
          <StatusRow
            label="Backend"
            description={selectedKey === "local" ? "Serveur Spring Boot local" : "Serveur Render"}
            status={backendStatus}
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <StatusRow
            label="Connexion"
            description="Configuration Axios"
            status={connectionStatus}
            theme={theme}
          />
        </View>

        {/* Bouton Wake up */}
        <Pressable
          onPress={handleWakeUp}
          disabled={isTesting}
          style={[
            styles.wakeButton,
            {
              backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
              borderColor: theme.colors.accent + "55",
              opacity: isTesting ? 0.7 : 1,
            },
          ]}
        >
          {isTesting
            ? <ActivityIndicator size="small" color={theme.colors.accent} />
            : <Ionicons name="pulse-outline" size={20} color={theme.colors.accent} />
          }
          <Text style={[styles.wakeButtonText, { color: theme.colors.accent }]}>
            {isTesting ? "Test en cours..." : "Wake up & tester"}
          </Text>
        </Pressable>

        {/* Bouton Lancer */}
        <Pressable
          onPress={handleLaunch}
          disabled={!isReady}
          style={[
            styles.launchButton,
            {
              backgroundColor: theme.colors.accent,
              opacity: isReady ? 1 : 0.35,
            },
          ]}
        >
          <Text style={[typography.labelLg, { color: theme.colors.textOnAccent }]}>
            Lancer l&lsquo;application
          </Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.textOnAccent} />
        </Pressable>

        <Text style={[styles.note, { color: theme.colors.textTertiary }]}>
          Cet écran est présent à des fins de démonstration portfolio.
        </Text>

        <Switch
          value={isDark}
          onValueChange={(value) => setTheme(value ? "dark" : "light")}
        />

      </View>
    </SafeAreaView>
  );
}

function StatusRow({ label, description, status, theme }: {
  label: string;
  description: string;
  status: Status;
  theme: any;
}) {
  const color =
    status === "up" ? "#10B981" :
    status === "error" ? theme.colors.error :
    status === "loading" ? theme.colors.accent :
    theme.colors.textTertiary;

  const icon =
    status === "up" ? "checkmark-circle" :
    status === "error" ? "close-circle" :
    status === "loading" ? "time-outline" :
    "ellipse-outline";

  const statusLabel =
    status === "up" ? "Opérationnel" :
    status === "error" ? "Inaccessible" :
    status === "loading" ? "Test en cours..." :
    "En attente";

  return (
    <View style={styles.statusRow}>
      <View style={styles.statusLeft}>
        <Text style={[styles.statusLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.statusDesc, { color: theme.colors.textTertiary }]}>{description}</Text>
      </View>
      <View style={styles.statusRight}>
        {status === "loading"
          ? <ActivityIndicator size="small" color={color} />
          : <Ionicons name={icon as any} size={20} color={color} />
        }
        <Text style={[styles.statusText, { color }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    gap: spacing.lg,
  },
  header: { alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  logo: { fontFamily: typography.displayLg.fontFamily, fontSize: 44, fontWeight: "900" },
  tagline: { ...typography.bodyMd, textAlign: "center" },
  card: { borderRadius: 20, borderWidth: 1, padding: spacing.lg, gap: spacing.md },
  sectionLabel: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1.4 },
  toggle: { flexDirection: "row", borderRadius: radius.lg, padding: 4 },
  toggleOption: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingVertical: spacing.sm, borderRadius: radius.md },
  toggleLabel: { ...typography.labelMd },
  urlText: { ...typography.caption, textAlign: "center" },
  divider: { height: StyleSheet.hairlineWidth },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statusLeft: { gap: 2 },
  statusLabel: { ...typography.labelMd },
  statusDesc: { ...typography.caption },
  statusRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  statusText: { ...typography.caption, fontFamily: typography.labelMd.fontFamily },
  wakeButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.md, borderRadius: 16, padding: spacing.lg, borderWidth: 1 },
  wakeButtonText: { ...typography.labelLg },
  launchButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.md, borderRadius: 18, minHeight: 56 },
  note: { ...typography.caption, textAlign: "center" },
  input: {
  borderRadius: 12,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  fontSize: 14,
},
});