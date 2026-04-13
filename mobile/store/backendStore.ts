import { create } from "zustand";

export const BACKENDS = {
  local: "http://192.168.11.113:8080", // ← remplace par ton IP locale
  online: "https://furnigo-api.onrender.com", // ← ton URL Render
};

type BackendKey = keyof typeof BACKENDS;

interface BackendState {
  selectedKey: BackendKey;
  selectedUrl: string;
  isConfirmed: boolean;
  setBackend: (key: BackendKey) => void;
  confirm: () => void;
  reset: () => void;
}

export const useBackendStore = create<BackendState>((set) => ({
  selectedKey: "online",
  selectedUrl: BACKENDS.online,
  isConfirmed: false,

  setBackend: (key) => set({ selectedKey: key, selectedUrl: BACKENDS[key] }),
  confirm: () => set({ isConfirmed: true }),
  reset: () => set({ isConfirmed: false }),
}));