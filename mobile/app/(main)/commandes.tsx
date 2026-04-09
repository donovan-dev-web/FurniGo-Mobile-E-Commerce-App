import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";

const orders = [
  {
    id: "FG-8829",
    date: "Passee le 14 Octobre 2023",
    status: "En transit",
    title: "Fauteuil Sculptural Nordic",
    subtitle: "Velours Vert Foret & Chene",
    price: "890,00 €",
    action: "Details",
    highlight: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAz2Vyfy1nLVlOhmuaKWnzr_rGSS8ic1Kw7v_ccXJ5nLhUU0WhHkg113REmIycag2a9M15hAROSQyG7RM-ZP1f6GwWYR1mnvZbsxXAR3TQMgHt0x8m0st_wd0wj12M9AgiGxWj1t-S1OajBZcJv2MX5-3x_AdNqR1c9bRMYxvy3lSdZRRUAnhLzfF7ntyEjd6MYjkZ4a82MDxYbwzLq-kskZxXhP9toYkFD59lPH_yROu-s8aXRPz0GPw7MwSPWv5jISspSn2IGbNE",
  },
  {
    id: "FG-7712",
    date: "Passee le 28 Septembre 2023",
    status: "Livre",
    title: "Table Basse Marbre Blanc",
    subtitle: "Marbre de Carrare & Acier",
    price: "1 245,00 €",
    action: "Facture",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3LL7cc_sgE0glJKLuZS86xh_Rzv69odP8049HM5HGQleLoJCIX7j3AT68HIutR4uHbUEifxgpYdnb4Vzy8wneZGxKEaGoMNJF-tvgedTcdDp4ZXwyiQhHP-YSlIXTusMtzKL2QDeynXi8cUfdM_e-l-QB1sPM0HiGBfaVlyxOM_9S-cR_unjxjwI5Vxi8qslMBIArud2hx8PR8CRM9Wv3OCkF33nBnbq857o_gwFZkkAq9JXE8dakEL7T87A_-h0c9TzA_2Egl-g",
  },
  {
    id: "FG-6540",
    date: "Passee le 05 Septembre 2023",
    status: "Livre",
    title: "Suspension Laiton Brosse",
    subtitle: "Edition Limitee - Artisanat",
    price: "320,00 €",
    action: "Recommander",
    highlight: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg-Z5Vy8r4RsKizfawuEgbmlDG7vyY9aAUdCVj27acTEP5NI4etYUc4OWoCLspcAhLS4ecAnwtcg2Y6mJ4dwdlJYQ4OkpkChwSr9DX0N0sLGiRQI4xDJu9EfKO6-bpNAZu7hkWcA7BL_QZCZXcldVThxxgUUVStTBNpN45UtwAmKoyPhVttpBnhLtHUOtrSQfgrXjt3V5_G8GctI6K3_g0HYTinkkIumCGGWKeeaDx9Wr4gUtt4os9PGxSehjTLv9xoL6cOc9goYw",
  },
];

export default function CommandesScreen() {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 170 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mes Commandes</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Suivez vos acquisitions et l&apos;histoire de votre interieur.
          </Text>
        </View>

        <View style={styles.list}>
          {orders.map((order) => {
            const transit = order.status === "En transit";

            return (
              <View
                key={order.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: order.highlight
                      ? isDark
                        ? theme.colors.backgroundSecondary
                        : "#FFFFFF"
                      : theme.colors.backgroundSecondary,
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.05)",
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.orderId, { color: theme.colors.textTertiary }]}>
                      Commande #{order.id}
                    </Text>
                    <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>{order.date}</Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: transit
                          ? isDark
                            ? "rgba(143,179,156,0.18)"
                            : theme.colors.accentMuted
                          : isDark
                            ? "rgba(255,255,255,0.08)"
                            : theme.colors.backgroundTertiary,
                        borderColor: transit
                          ? "rgba(143,179,156,0.30)"
                          : isDark
                            ? "rgba(255,255,255,0.10)"
                            : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: transit ? theme.colors.accent : theme.colors.textSecondary },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderBody}>
                  <Image source={{ uri: order.image }} style={styles.orderImage} />
                  <View style={styles.orderText}>
                    <Text style={[styles.orderTitle, { color: theme.colors.textPrimary }]}>{order.title}</Text>
                    <Text style={[styles.orderSubtitle, { color: theme.colors.textSecondary }]}>
                      {order.subtitle}
                    </Text>
                    <View style={[styles.cardHeader, { marginTop: spacing.md }]}>
                      <Text style={[styles.orderPrice, { color: theme.colors.textPrimary }]}>{order.price}</Text>
                      <Pressable>
                        <Text style={[styles.actionText, { color: theme.colors.accent }]}>{order.action}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  header: { marginBottom: spacing.xl },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: {
    ...typography.bodyMd,
    marginTop: spacing.xs,
  },
  list: { gap: spacing.lg },
  card: {
    borderRadius: 22,
    padding: spacing.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  orderId: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  orderDate: {
    ...typography.bodySm,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  badgeText: {
    ...typography.caption,
    fontFamily: typography.labelMd.fontFamily,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  orderBody: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  orderImage: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
  },
  orderText: {
    flex: 1,
  },
  orderTitle: {
    ...typography.headingMd,
  },
  orderSubtitle: {
    ...typography.bodySm,
    marginTop: spacing.xs,
  },
  orderPrice: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
  },
  actionText: {
    ...typography.labelMd,
  },
});
