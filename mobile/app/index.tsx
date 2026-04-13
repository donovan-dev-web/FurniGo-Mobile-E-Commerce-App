import { useEffect } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useBackendStore } from "../store/backendStore";
import { Loader } from "../components/ui/Loader";

export default function Index() {
  const { status, initialize } = useAuthStore();
  const { isConfirmed } = useBackendStore();

  // Toujours rediriger vers backend-select au démarrage
  useEffect(() => {
    router.replace("/backend-select");
  }, []);

  return <Loader />;
}