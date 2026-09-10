"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteItem, Product } from "@/types";

interface FavoritesState {
  items: FavoriteItem[];
  toggleFavorite: (product: Product) => boolean;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getCount: () => number;
}

function toFavoriteItem(product: Product): FavoriteItem {
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    image: product.mainImage,
    category: product.category,
  };
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleFavorite: (product) => {
        const exists = get().items.some((item) => item.productId === product.id);

        if (exists) {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== product.id),
          }));
          return false;
        }

        set((state) => ({
          items: [...state.items, toFavoriteItem(product)],
        }));
        return true;
      },

      removeFavorite: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getCount: () => get().items.length,
    }),
    {
      name: "favorites-storage",
    }
  )
);
