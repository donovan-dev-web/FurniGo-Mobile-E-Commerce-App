// store/guestStore.ts
// Store Zustand — état du mode invité.
//
// Séparé de authStore volontairement :
//   authStore  → token, user, session
//   guestStore → préférences onboarding, flag hasSeenOnboarding
//
// Permet de ne pas re-déclencher l'onboarding si l'invité
// navigue vers login puis revient.

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface GuestState {
  /** L'invité a-t-il déjà vu l'onboarding lors de cette session ? */
  hasSeenOnboarding: boolean;

  /** Marque l'onboarding comme vu */
  markOnboardingDone: () => Promise<void>;

  /** Réinitialise (utile pour les tests / debug) */
  reset: () => Promise<void>;

  /** Charge l'état persisté depuis AsyncStorage au démarrage */
  initialize: () => Promise<void>;
}

const STORAGE_KEY = "@furnigo:onboarding_done";

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
export const useGuestStore = create<GuestState>((set) => ({
  hasSeenOnboarding: false,

  initialize: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      set({ hasSeenOnboarding: value === "true" });
    } catch {
      set({ hasSeenOnboarding: false });
    }
  },

  markOnboardingDone: async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "true");
    set({ hasSeenOnboarding: true });
  },

  reset: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ hasSeenOnboarding: false });
  },
}));