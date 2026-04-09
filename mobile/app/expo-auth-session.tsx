import { useEffect } from "react";
import { router } from "expo-router";
import { Loader } from "@/components/ui/Loader";
import { useAuthStore } from "@/store/authStore";

export default function ExpoAuthSessionScreen() {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/(main)/catalogue");
      return;
    }

    if (status === "guest") {
      router.replace("/(onboarding)/");
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/(auth)/login");
    }
  }, [status]);

  return <Loader />;
}
