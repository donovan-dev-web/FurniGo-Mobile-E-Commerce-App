import { create } from "zustand";

export const BACKENDS = {
  local: process.env.EXPO_LOCAL_API_BASE_URL ?? "http://192.168.11.113:8080",
  online: process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://furnigo-api.onrender.com",
};

type BackendKey = keyof typeof BACKENDS;

interface BackendState {
  selectedKey: BackendKey;
  ip: string;
  port: string;
  selectedUrl: string;
  isConfirmed: boolean;

  setBackend: (key: BackendKey) => void;
  setLocalConfig: (ip: string, port: string) => void;
  confirm: () => void;
  reset: () => void;
}

export const useBackendStore = create<BackendState>((set, get) => ({
  selectedKey: "online",
  ip: "192.168.1.1",
  port: "8080",
  selectedUrl: BACKENDS.online,
  isConfirmed: false,

  setBackend: (key) => {
    if (key === "online") {
      set({
        selectedKey: key,
        selectedUrl: BACKENDS.online,
      });
    } else {
      const { ip, port } = get();
      set({
        selectedKey: key,
        selectedUrl: `http://${ip}:${port}`,
      });
    }
  },

  setLocalConfig: (ip, port) => {
    set({
      ip,
      port,
      selectedUrl: `http://${ip}:${port}`,
    });
  },

  confirm: () => set({ isConfirmed: true }),
  reset: () => set({ isConfirmed: false }),
}));