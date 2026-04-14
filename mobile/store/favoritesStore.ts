import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types/product";

const STORAGE_KEY = "@furnigo:favorites";

export interface FavoriteProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  coverImage: string;
  galleryImages: string[];
  category: string | null;
  addedAt: string;
}

interface FavoritesState {
  items: FavoriteProduct[];
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

function toFavoriteProduct(product: Product): FavoriteProduct {
  return {
    ...product,
    addedAt: new Date().toISOString(),
  };
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleFavorite: (product) => {
        set((state) => {
          const alreadyFavorite = state.items.some((item) => item.id === product.id);

          if (alreadyFavorite) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            };
          }

          return {
            items: [toFavoriteProduct(product), ...state.items],
          };
        });
      },

      removeFavorite: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
