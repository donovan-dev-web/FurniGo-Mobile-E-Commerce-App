import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { radius, spacing, typography } from "../../constants/theme";

const categories = ["Tout", "Salon", "Chambre", "Bureau", "Cuisine"];

const products = [
  {
    id: "1",
    name: "Sofa Nordique",
    subtitle: "Tissu gris perle",
    price: "499€",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9uZdT1dq3lZu-JzRgivrdLre1RkxIxAeWN1GGgEkhODpztNqL1b3avsE6-Wwydu_GDZ28fdYPG5cvTzN-F21EGkezjSXBLxa9chxp_ER5PJU9ynK2NrHfUfauA0_iw6qdF_IwxO4m1USQU5_oMOrUfyOA7Nck43WQVCMKtVTroFWLGZXTvIG_sNB_cgsTPhrljQiKfRyVJA5z2IajN0Mc2rXB0-9A7o_0rbU0HU_8YXXOnBVitXj39SXynaN10sKXFVAlOW3YiyQ",
  },
  {
    id: "2",
    name: "Table Oslo",
    subtitle: "Chene massif",
    price: "345€",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC25x69wOfyc_2nISCQH6V6CbtoPesfU9QFIUNhy4OK0Ann-7aHyrMkFYaI19uN3LGUu4pujfQMEzYyqfYMBpQGg6Ke2emCs9yTeCUg7ruEkRQRPFyc5obMy4LI2ABlZyuyX4nfK0yL6fGSErO1JeCiwjqqgWQds9Po1CqYTuKeXnnLjiyIoZGMn2fcbgtiXSRPg4djMcifAvD8mvjQ_TNE_ECaZ6DIk3xeE5gpAmHK_nDkhIBn74RZSRyqu7myaz2Snb6uma0vdxM",
  },
  {
    id: "3",
    name: "Fauteuil Velvet",
    subtitle: "Vert sapin",
    price: "220€",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAt6aKOmWQdvdZ4rYDoLl-y2FY4LfS1Tdy2vjtLadMbyYo0xX3zO6heSMwBHPaa1dJnXFE_Jbjnj_28VnC8EPKZiZD98ii-b2pqQMpP8utMHTE9cl8PnlxldXfNfeRGUoLdAD9gyOjxtY9aFdFymkUR6nH8PGBY8DiZ0xxIlmAOk5ESJ9tEsg2pMpWcW_gKfwDU-21TUChYA2Omcqt8W_mHEdIhEmpb-AAqH4cW9TafXfFUucvamJNvuW0hw7yLHETT7vMmDWK5vQY",
  },
  {
    id: "4",
    name: "Lampe Lumi",
    subtitle: "Noir mat",
    price: "89€",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqZX57vQBOJ7c3pmxcNw-gnrac0NVfiDepFCVSbxd5z0M3_STJMi2iMQEAKkNlROl13dgNA83-JaBR7B3pXNmWvYwlr1OZVwLeQeymcE_r8Vq7L_1PhuVQDaNZpYEv-lsSZCdhgBLw-vBn447Dfw_eHj4wUBm0s26rTFbzCzxUurANbkdoJK5zwrLscp0Lwky6LMuI_uh8NVkV1GvwFRfonU3QohqfUT0nBhUB-l-LqgfedN_jc5CmMdhjL7Pjuhrz5pUKQBwucLE",
  },
];

export default function CatalogueScreen() {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 160 }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.topBar,
            {
              backgroundColor: isDark ? "rgba(12,15,15,0.78)" : "rgba(249,249,249,0.82)",
              borderBottomColor: isDark ? "rgba(255,255,255,0.06)" : "transparent",
            },
          ]}
        >
          <Ionicons name="menu-outline" size={22} color={theme.colors.textPrimary} />
          <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>FurniGo</Text>
          <Ionicons name="search-outline" size={22} color={theme.colors.textPrimary} />
        </View>

        <View
          style={[
            styles.hero,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
        >
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuACAG5SPkL_H57DnCMUaUfx5s10GZIAzRI4Drepnt9tlJMZRzHxHqehQ_31Z9zwFxgD0L3fj_UebyeHFcn78PFUyu8wF2bkPOs0JOFUlmj0NXRAAcrO6lRGNrRwVrZ_UvBQ3ruK6DyIFL8fqi6sPtQQuRE_r5tzA2gCuk5O-YEuuxMDd1GeNhWhndHQ-hVTF-i_eltHqDDSMvTcRoJQ5OaHZzTlC4rrASm_J6DGGzH-3xeb2037qYluV0wBQ78aLjMK6_aKTIJNDoU",
            }}
            style={[styles.heroImage, { opacity: isDark ? 0.55 : 0.82 }]}
          />
          <View
            style={[
              styles.heroOverlay,
              {
                backgroundColor: isDark ? "rgba(12,15,15,0.22)" : "rgba(249,249,249,0.18)",
              },
            ]}
          />
          <View style={styles.heroContent}>
            <Text style={[styles.heroCaption, { color: theme.colors.textTertiary }]}>
              Collection 2024
            </Text>
            <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
              Epure &{"\n"}Confort.
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((category, index) => {
            const active = index === 0;
            return (
              <View
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active
                      ? theme.colors.accent
                      : isDark
                        ? theme.colors.backgroundSecondary
                        : "#FFFFFF",
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: active
                        ? theme.colors.textOnAccent
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {category}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Nouveautes</Text>
          <Text style={[styles.sectionAction, { color: theme.colors.accent }]}>Voir tout</Text>
        </View>

        <View style={styles.grid}>
          {products.map((product, index) => (
            <View key={product.id} style={[styles.productCard, index % 2 === 1 && styles.offsetCard]}>
              <View
                style={[
                  styles.productImageWrap,
                  { backgroundColor: theme.colors.backgroundSecondary },
                ]}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <Pressable
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: isDark ? "rgba(12,15,15,0.88)" : "rgba(255,255,255,0.92)",
                    },
                  ]}
                >
                  <Ionicons name="add" size={18} color={theme.colors.accent} />
                </Pressable>
              </View>
              <Text style={[styles.productName, { color: theme.colors.textPrimary }]}>{product.name}</Text>
              <Text style={[styles.productSubtitle, { color: theme.colors.textSecondary }]}>
                {product.subtitle}
              </Text>
              <Text style={[styles.productPrice, { color: theme.colors.accent }]}>{product.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    marginBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brand: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "900",
  },
  hero: {
    height: 240,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    zIndex: 1,
  },
  heroCaption: {
    ...typography.labelMd,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 40,
    lineHeight: 40,
    fontWeight: "800",
  },
  categoriesRow: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  sectionAction: {
    ...typography.labelMd,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "47%",
    marginBottom: spacing.xl,
  },
  offsetCard: {
    marginTop: spacing.xl,
  },
  productImageWrap: {
    aspectRatio: 0.8,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    ...typography.headingSm,
    marginBottom: 2,
  },
  productSubtitle: {
    ...typography.bodySm,
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: typography.displaySm.fontFamily,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
  },
});
