"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  modelCode: string;
  colorName: string;
  colorHex: string | null;
  imageUrl: string | null;
  quantity: number;
  itemNote?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, quantity: number) => void;
  updateNote: (variantId: string, note: string) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const existing = get().items.find((item) => item.variantId === newItem.variantId);

        if (existing) {
          set((state) => ({
            items: state.items.map((item) =>
              item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),

      updateQty: (variantId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          ),
        }));
      },

      updateNote: (variantId, note) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, itemNote: note } : item,
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "lakshan-cart",
    },
  ),
);
