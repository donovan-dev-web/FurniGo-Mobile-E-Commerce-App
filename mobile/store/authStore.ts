// store/authStore.ts
// Store Zustand — état global d'authentification.
//
// Contient :
//   - le token JWT
//   - les infos utilisateur
//   - les états de chargement et d'erreur
//   - les actions (setToken, setUser, logout, etc.)

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  /** URL de l'avatar Google */
  avatarUrl?: string;
}

export type AuthStatus =
  | "idle"       // état initial, vérification pas encore lancée
  | "loading"    // vérification du token en cours
  | "authenticated" // token valide, utilisateur connecté
  | "unauthenticated" // pas de token ou token expiré
  | "guest";     // mode invité (pas de compte)

interface AuthState {
  // ── État ──────────────────────────────────
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;

  // ── Actions ───────────────────────────────
  /** Appelée au démarrage de l'app pour vérifier le token stocké */
  initialize: () => Promise<void>;
  /** Stocke le token et l'utilisateur après login Google */
  setAuth: (token: string, user: AuthUser) => Promise<void>;
  /** Passe en mode invité */
  setGuest: () => void;
  /** Quitte le mode invite et revient a l'etat non authentifie */
  setUnauthenticated: () => Promise<void>;
  /** Déconnexion — supprime token et user */
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Clé AsyncStorage
// ─────────────────────────────────────────────
const STORAGE_KEY_TOKEN = "@furnigo:jwt";
const STORAGE_KEY_USER = "@furnigo:user";

// ─────────────────────────────────────────────
// Utilitaire — vérifie si un JWT est expiré
// ─────────────────────────────────────────────
function isTokenExpired(token: string): boolean {
  try {
    // Le payload JWT est la 2e partie (base64url)
    const payload = token.split(".")[1];
    if (!payload) return true;

    // base64url → base64 standard
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));

    if (!json.exp) return false; // pas d'expiration = valide indéfiniment

    // exp est en secondes, Date.now() en ms
    return Date.now() >= json.exp * 1000;
  } catch {
    // Malformé → considéré expiré
    return true;
  }
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set) => ({
  status: "idle",
  token: null,
  user: null,

  // ── initialize ────────────────────────────
  // Lit AsyncStorage, vérifie l'expiration du JWT,
  // puis met à jour le status en conséquence.
  initialize: async () => {
    set({ status: "loading" });

    try {
      const [storedToken, storedUser] = await AsyncStorage.multiGet([
        STORAGE_KEY_TOKEN,
        STORAGE_KEY_USER,
      ]);

      const token = storedToken[1];
      const userRaw = storedUser[1];

      if (!token || isTokenExpired(token)) {
        // Pas de token ou expiré → on nettoie et on redirige vers login
        await AsyncStorage.multiRemove([STORAGE_KEY_TOKEN, STORAGE_KEY_USER]);
        set({ status: "unauthenticated", token: null, user: null });
        return;
      }

      const user: AuthUser = userRaw ? JSON.parse(userRaw) : null;

      set({ status: "authenticated", token, user });
    } catch {
      // Erreur de lecture AsyncStorage → traité comme non authentifié
      set({ status: "unauthenticated", token: null, user: null });
    }
  },

  // ── setAuth ───────────────────────────────
  // Persisté en AsyncStorage après le login Google (Epic 2)
  setAuth: async (token, user) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEY_TOKEN, token],
      [STORAGE_KEY_USER, JSON.stringify(user)],
    ]);
    set({ status: "authenticated", token, user });
  },

  // ── setGuest ──────────────────────────────
  setGuest: () => {
    set({ status: "guest", token: null, user: null });
  },

  setUnauthenticated: async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY_TOKEN, STORAGE_KEY_USER]);
    set({ status: "unauthenticated", token: null, user: null });
  },

  // ── logout ────────────────────────────────
  logout: async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY_TOKEN, STORAGE_KEY_USER]);
    set({ status: "unauthenticated", token: null, user: null });
  },
}));
