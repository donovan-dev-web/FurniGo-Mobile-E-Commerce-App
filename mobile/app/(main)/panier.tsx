import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";

const items = [
  {
    id: "1",
    name: "Fauteuil Velours Olive",
    subtitle: "Serie Signature",
    price: "749,00 €",
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDIkCzszMjqF1u7bpl0AomtOi6nJuZiOTrv7jpIw04HRg2wpTOs53KEFIjjDGoEKLuzNM-1kbT2FImGRUXNgqrrsyj0msSRUd8LtgTf4NzwpyPEm-OiWsarUPFGNtCQYC2xm9x9j1W2ZBQtY1e7D1ggtL718TjacUJxIGjSJNMtRmQrMpC2wUkjPO9XUdvqui5xP39ShOFX4x7H8r-m3COBN3mDclxDHhqmsv6J8zIr_xNuxv0zJ9DEVY5fxV-gnLuxZMmTTI7fwk",
  },
  {
    id: "2",
    name: "Table de Chevet Chene",
    subtitle: "Artisanat Nordic",
    price: "285,00 €",
    quantity: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6eEaH5kMaXmTArMX6yXhlXQvwauMDA2vKGRIGwe2oODP8Ktvc0eCOJX30gpItXe80TxDRMYl1pthygCfnVoHJyNLVyAn9iCjb7nlx-wo65mdHQD8W3-eyUsq9DiR_5L0nMf7A83ekV9lQxNGvPyasJ50X00ik-fIPuBYSz0K8wdmdYcUJ7q29ugOV1gMzgOVjQCywgQsvvHmQlgP7iU1J-TAvkPalR1x3g9ma9yAaJa8-WobUWCD48V5SBlbaTJTbK9oziZljlXc",
  },
  {
    id: "3",
    name: "Vase Organique Luna",
    subtitle: "Accessoires Deco",
    price: "59,00 €",
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLhY4yyLaSzsyvtmuoLskfpt301ZDKJFmO57w--2D_G4bby35vKPNdyUcLpJNYjO11wQYqDn-KuvnS0-jlmnzf0xEtNWQ3P0UpX5MD6nwReF2UwSmfztkFdBRzCzybidxR0aFkDjaSDFc-feGer3wSbxtyQqnl9uu_5aLHb2vlFfiDd8sVvqqfHmnTR5LheT0f1dmKObDL4jMH1NhNHpMq48EoWfNv0lofFvdc9ltmQ9oHzpdx8PmS91X918RbCuNGBXKL_TBuDMc",
  },
];

export default function PanierScreen() {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Mon Panier</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Vous avez {items.length} articles soigneusement selectionnes.
          </Text>
        </View>

        <View style={styles.itemsList}>
          {items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isDark ? theme.colors.backgroundSecondary : "#FFFFFF",
                  borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(45,52,53,0.04)",
                },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemContent}>
                <View style={styles.rowBetween}>
                  <View style={styles.itemText}>
                    <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                    <Text style={[styles.itemMeta, { color: theme.colors.textTertiary }]}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="close" size={20} color={theme.colors.textTertiary} />
                </View>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemPrice, { color: theme.colors.textPrimary }]}>{item.price}</Text>
                  <View
                    style={[
                      styles.qtyWrap,
                      { backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary },
                    ]}
                  >
                    <Ionicons name="remove" size={14} color={theme.colors.textPrimary} />
                    <Text style={[styles.qtyText, { color: theme.colors.textPrimary }]}>{item.quantity}</Text>
                    <Ionicons name="add" size={14} color={theme.colors.textPrimary} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: isDark ? theme.colors.backgroundSecondary : theme.colors.backgroundSecondary },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={[typography.bodyMd, { color: theme.colors.textSecondary }]}>Sous-total</Text>
            <Text style={[typography.bodyMd, { color: theme.colors.textPrimary }]}>1 378,00 €</Text>
          </View>
          <View style={[styles.rowBetween, styles.summaryRow]}>
            <Text style={[typography.bodyMd, { color: theme.colors.textSecondary }]}>Livraison</Text>
            <Text style={[typography.labelMd, { color: theme.colors.accent }]}>Gratuit</Text>
          </View>
          <View style={[styles.rowBetween, styles.totalRow, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.totalLabel, { color: theme.colors.textPrimary }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: theme.colors.textPrimary }]}>1 378,00 €</Text>
          </View>
          <Pressable
            style={[
              styles.checkoutButton,
              { backgroundColor: isDark ? theme.colors.textPrimary : theme.colors.accent },
            ]}
          >
            <Text
              style={[
                typography.labelLg,
                { color: isDark ? theme.colors.background : theme.colors.textOnAccent },
              ]}
            >
              Passer a la commande
            </Text>
          </Pressable>
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
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: {
    ...typography.bodyMd,
    marginTop: spacing.sm,
  },
  itemsList: {
    gap: spacing.md,
  },
  itemCard: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  itemImage: {
    width: 112,
    height: 112,
    borderRadius: radius.lg,
  },
  itemContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  itemText: { flex: 1 },
  itemName: {
    ...typography.headingMd,
  },
  itemMeta: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 4,
  },
  itemPrice: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "700",
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  qtyText: {
    ...typography.labelMd,
    minWidth: 16,
    textAlign: "center",
  },
  summaryCard: {
    marginTop: spacing.xxl,
    borderRadius: 32,
    padding: spacing.xl,
  },
  summaryRow: {
    marginTop: spacing.sm,
  },
  totalRow: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
  },
  totalPrice: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
  },
  checkoutButton: {
    marginTop: spacing.xl,
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
