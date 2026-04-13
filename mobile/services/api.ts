// services/api.ts
// Client HTTP centralisé — Axios configuré pour FurniGo.
//
// Responsabilités :
//   - base URL depuis les variables d'environnement Expo
//   - injection automatique du JWT dans les headers
//   - gestion des erreurs 401 (token expiré → logout)

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────
// Instance Axios
// ─────────────────────────────────────────────
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Fonction pour mettre à jour la baseURL dynamiquement
export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
}

export function getApiBaseUrl(): string {
  return (api.defaults.baseURL ?? "http://localhost:8080").replace(/\/+$/, "");
}

export function buildUploadUrl(pathOrFileName: string | null | undefined): string | null {
  if (!pathOrFileName) return null;

  if (/^https?:\/\//i.test(pathOrFileName)) {
    return pathOrFileName;
  }

  const normalizedPath = pathOrFileName.startsWith("/uploads/")
    ? pathOrFileName
    : `/uploads/products/${pathOrFileName.replace(/^\/+/, "")}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
}


export async function pingBackend(url: string): Promise<boolean> {
  try {
    await axios.get(`${url}/actuator/health`, { timeout: 5_000 });
    return true;
  } catch {
    // Fallback — essaie /products si actuator non dispo
    try {
      await axios.get(`${url}/products`, { timeout: 5_000 });
      return true;
    } catch {
      return false;
    }
  }
}

// ─────────────────────────────────────────────
// Intercepteur requête — injecte le JWT
// ─────────────────────────────────────────────
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("@furnigo:jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// Intercepteur réponse — gère le 401
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide — on nettoie et on laisse
      // authStore.initialize() gérer la redirection au prochain montage
      await AsyncStorage.multiRemove(["@furnigo:jwt", "@furnigo:user"]);
    }
    return Promise.reject(error);
  }
);
