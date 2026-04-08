// app/index.tsx
// Point d'entrée de l'application.
//
// Responsabilités :
//   1. Lancer la vérification du token JWT (authStore.initialize)
//   2. Afficher le Loader pendant la vérification
//   3. Rediriger vers le bon groupe de routes selon le statut :
//        authenticated → /(main)/catalogue
//        unauthenticated / idle → /(auth)/login
//        guest → /(onboarding)/
//
// Ce fichier ne contient aucune UI visible en dehors du Loader —


import { useEffect } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { Loader } from "../components/ui/Loader";

export default function Index() {
  const { status, initialize } = useAuthStore();

  // Lance la vérification du token au montage
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirige dès que le status est résolu
  useEffect(() => {
    if (status === "idle" || status === "loading") return;

    switch (status) {
      case "authenticated":
        // Remplace l'entrée courante pour éviter de revenir ici via le bouton retour
        router.replace("/(main)/catalogue");
        break;
      case "guest":
        router.replace("/(onboarding)/");
        break;
      case "unauthenticated":
      default:
        router.replace("/(auth)/login");
        break;
    }
  }, [status]);

  // Pendant idle et loading, on affiche le spinner
  return <Loader />;
}