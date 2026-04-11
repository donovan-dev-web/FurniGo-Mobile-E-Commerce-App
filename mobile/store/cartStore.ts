import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types/product";

const STORAGE_KEY = "@furnigo:cart";
const GUEST_CART_KEY = "guest";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  ownerKey: string;
  cartsByOwner: Record<string, CartItem[]>;
  setOwner: (ownerKey?: string | null) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.coverImage,
    category: product.category,
    quantity,
  };
}

function normalizeOwnerKey(ownerKey?: string | null): string {
  return ownerKey?.trim() ? ownerKey : GUEST_CART_KEY;
}

function updateOwnerCart(
  state: Pick<CartState, "ownerKey" | "cartsByOwner">,
  items: CartItem[]
): Pick<CartState, "items" | "cartsByOwner"> {
  return {
    items,
    cartsByOwner: {
      ...state.cartsByOwner,
      [state.ownerKey]: items,
    },
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      ownerKey: GUEST_CART_KEY,
      cartsByOwner: {},

      setOwner: (ownerKey) => {
        const nextOwnerKey = normalizeOwnerKey(ownerKey);

        set((state) => ({
          ownerKey: nextOwnerKey,
          items: state.cartsByOwner[nextOwnerKey] ?? [],
        }));
      },

      addItem: (product, quantity = 1) => {
        const normalizedQuantity = Math.max(1, quantity);

        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            const nextItems = state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + normalizedQuantity }
                  : item
              );

            return updateOwnerCart(state, nextItems);
          }

          return updateOwnerCart(state, [...state.items, toCartItem(product, normalizedQuantity)]);
        });
      },

      removeItem: (productId) => {
        set((state) => updateOwnerCart(state, state.items.filter((item) => item.id !== productId)));
      },

      incrementItem: (productId) => {
        set((state) =>
          updateOwnerCart(
            state,
            state.items.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
          )
        );
      },

      decrementItem: (productId) => {
        set((state) =>
          updateOwnerCart(
            state,
            state.items.flatMap((item) => {
              if (item.id !== productId) {
                return [item];
              }

              if (item.quantity <= 1) {
                return [];
              }

              return [{ ...item, quantity: item.quantity - 1 }];
            })
          )
        );
      },

      clearCart: () => {
        set((state) => updateOwnerCart(state, []));
      },

      getItemQuantity: (productId) => {
        return get().items.find((item) => item.id === productId)?.quantity ?? 0;
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        ownerKey: state.ownerKey,
        cartsByOwner: state.cartsByOwner,
      }),
      migrate: (persistedState: unknown, version) => {
        if (version < 2) {
          const legacyState = persistedState as { items?: CartItem[] } | undefined;
          const legacyItems = legacyState?.items ?? [];

          return {
            items: legacyItems,
            ownerKey: GUEST_CART_KEY,
            cartsByOwner: { [GUEST_CART_KEY]: legacyItems },
          };
        }

        return persistedState as CartState;
      },
    }
  )
);
