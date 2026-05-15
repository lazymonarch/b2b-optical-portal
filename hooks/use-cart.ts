"use client";

import { create } from "zustand";

export type CartItem = {
  productId: string;
  variantId: string;
  modelCode: string;
  productName: string;
  colorName: string;
  quantity: number;
  note?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((cartItem) => cartItem.variantId === item.variantId);

      if (!existing) {
        return { items: [...state.items, item] };
      }

      return {
        items: state.items.map((cartItem) =>
          cartItem.variantId === item.variantId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        ),
      };
    }),
  updateQuantity: (variantId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    })),
  removeItem: (variantId) =>
    set((state) => ({
      items: state.items.filter((item) => item.variantId !== variantId),
    })),
  clearCart: () => set({ items: [] }),
}));
