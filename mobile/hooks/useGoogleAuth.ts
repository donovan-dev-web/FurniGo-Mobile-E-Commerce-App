import { useMemo, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useAuthStore } from "@/store/authStore";
import { loginWithGoogle } from "@/services/authService";

WebBrowser.maybeCompleteAuthSession();

const EXPO_PROJECT_FULL_NAME = "@donodevweb/furnigo";
const proxyRedirectUri = `https://auth.expo.io/${EXPO_PROJECT_FULL_NAME}`;

export type GoogleAuthState = "idle" | "loading" | "success" | "error";

interface UseGoogleAuthReturn {
  signIn: () => Promise<void>;
  state: GoogleAuthState;
  error: string | null;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const { setAuth } = useAuthStore();
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const [state, setState] = useState<GoogleAuthState>("idle");
  const [error, setError] = useState<string | null>(null);

  const returnUrl = useMemo(
    () =>
      AuthSession.makeRedirectUri({
        scheme: "furnigo",
        path: "expo-auth-session",
      }),
    []
  );

  const [request] = Google.useAuthRequest({
    clientId: webClientId,
    webClientId,
    redirectUri: proxyRedirectUri,
    scopes: ["openid", "profile", "email"],
    responseType: "id_token",
    selectAccount: true,
  });

  async function signIn() {
    if (!request?.url) {
      setState("error");
      setError("La connexion Google n'est pas encore prete. Reessaie dans un instant.");
      return;
    }

    setState("loading");
    setError(null);

    try {
      const startUrl =
        `${proxyRedirectUri}/start?authUrl=${encodeURIComponent(request.url)}` +
        `&returnUrl=${encodeURIComponent(returnUrl)}`;

      const browserResult = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl, {
        showInRecents: true,
      });

      if (browserResult.type === "cancel" || browserResult.type === "dismiss") {
        setState("idle");
        return;
      }

      if (browserResult.type !== "success") {
        setState("error");
        setError("La connexion Google a ete interrompue.");
        return;
      }

      const parsedResult = request.parseReturnUrl(browserResult.url);

      if (parsedResult.type !== "success") {
        setState("error");
        setError(
          ("error" in parsedResult ? parsedResult.error?.message : undefined) ??
            "Google a repondu, mais la session n'a pas pu etre finalisee."
        );
        return;
      }

      const idToken = parsedResult.authentication?.idToken ?? parsedResult.params.id_token;

      if (!idToken) {
        setState("error");
        setError("Google n'a pas renvoye de idToken exploitable.");
        return;
      }

      const { token, user } = await loginWithGoogle(idToken);

      await setAuth(token, user);
      setState("success");
    } catch (err: unknown) {
      setState("error");

      const axiosError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Une erreur est survenue. Reessaie.";

      setError(message);
    }
  }

  return {
    signIn,
    state,
    error,
  };
}
