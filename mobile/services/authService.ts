// services/authService.ts
// Couche service pour l'authentification.
//
// Fait le lien entre :
//   - le idToken Google (reçu via expo-auth-session)
//   - l'endpoint backend POST /auth/google
//   - le store Zustand (authStore.setAuth)

import { api } from "./api";
import { AuthUser } from "@/store/authStore";

// ─────────────────────────────────────────────
// Types — réponse backend
// ─────────────────────────────────────────────
interface GoogleAuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
}

interface AuthResult {
  token: string;
  user: AuthUser;
}

// ─────────────────────────────────────────────
// loginWithGoogle
// ─────────────────────────────────────────────
// Envoie le idToken Google au backend,
// reçoit le JWT applicatif + infos utilisateur,
// et retourne un objet prêt à être passé à authStore.setAuth().
export async function loginWithGoogle(idToken: string): Promise<AuthResult> {
  const response = await api.post<GoogleAuthResponse>("/auth/google", {
    idToken,
  });

  const { token, userId, email, name } = response.data;

  // Mapping vers le type AuthUser du store
  const user: AuthUser = {
    id: userId,
    email,
    name,
    // avatarUrl n'est pas retourné par le backend actuellement
    // → sera récupéré directement depuis le profil Google via expo-auth-session
  };

  return { token, user };
}