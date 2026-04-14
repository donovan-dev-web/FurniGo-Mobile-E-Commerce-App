import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

type LockedFeature = "profil" | "commandes" | "checkout";

interface AuthRequiredModalProps {
  visible: boolean;
  feature: LockedFeature;
  onClose: () => void;
}

const FEATURE_COPY: Record<LockedFeature, { title: string; text: string }> = {
  profil: {
    title: "Connexion requise",
    text: "Connectez-vous pour acceder a votre profil, vos donnees personnelles et vos reglages.",
  },
  commandes: {
    title: "Historique reserve aux comptes",
    text: "Connectez-vous pour consulter vos commandes et suivre vos achats dans le temps.",
  },
  checkout: {
    title: "Finalisez votre commande",
    text: "Vous pouvez explorer l'application en invite, mais il faut un compte pour passer commande.",
  },
};

export function AuthRequiredModal({
  visible,
  feature,
  onClose,
}: AuthRequiredModalProps) {
  const { theme, isDark } = useTheme();
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const copy = FEATURE_COPY[feature];

  async function handleLogin() {
    onClose();
    await setUnauthenticated();
    router.replace("/(auth)/login");
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
          onPress={onClose}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFDF9",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(45,52,53,0.08)",
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentMuted }]}>
            <Ionicons name="lock-closed" size={22} color={theme.colors.accent} />
          </View>

          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{copy.title}</Text>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{copy.text}</Text>

          <Pressable
            style={[
              styles.primaryButton,
              { backgroundColor: isDark ? theme.colors.textPrimary : theme.colors.accent },
            ]}
            onPress={() => void handleLogin()}
          >
            <Text
              style={[
                typography.labelLg,
                { color: isDark ? theme.colors.background : theme.colors.textOnAccent },
              ]}
            >
              Se connecter
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              {
                borderColor: theme.colors.border,
                backgroundColor: isDark ? "transparent" : theme.colors.backgroundSecondary,
              },
            ]}
            onPress={onClose}
          >
            <Text style={[typography.labelLg, { color: theme.colors.textPrimary }]}>
              Continuer en invite
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: "center",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 32,
    textAlign: "center",
  },
  text: {
    ...typography.bodyMd,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
});
