"use client";

import { create } from "zustand";

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
  hydrateCart: () => void;
}

const cartStorageKey = "lakshan-cart";

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const storage = window.localStorage;

  if (
    !storage ||
    typeof storage.getItem !== "function" ||
    typeof storage.setItem !== "function" ||
    typeof storage.removeItem !== "function"
  ) {
    return null;
  }

  return storage;
}

function readStoredCart() {
  const storage = getBrowserStorage();
  if (!storage) return [];

  try {
    const value = storage.getItem(cartStorageKey);
    if (!value) return [];

    const parsed = JSON.parse(value) as { state?: { items?: CartItem[] } } | CartItem[];
    return Array.isArray(parsed) ? parsed : (parsed.state?.items ?? []);
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  const storage = getBrowserStorage();
  if (!storage) return;

  try {
    storage.setItem(cartStorageKey, JSON.stringify({ state: { items }, version: 0 }));
  } catch {
    // Storage can be unavailable in private mode or non-browser runtimes.
  }
}

export const useCart = create<CartStore>()((set, get) => ({
  items: [],

  addItem: (newItem) => {
    const existing = get().items.find((item) => item.variantId === newItem.variantId);
    const items = existing
      ? get().items.map((item) =>
          item.variantId === newItem.variantId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...get().items, newItem];

    set({ items });
    writeStoredCart(items);
  },

  removeItem: (variantId) => {
    const items = get().items.filter((item) => item.variantId !== variantId);
    set({ items });
    writeStoredCart(items);
  },

  updateQty: (variantId, quantity) => {
    if (quantity < 1) {
      get().removeItem(variantId);
      return;
    }

    const items = get().items.map((item) =>
      item.variantId === variantId ? { ...item, quantity } : item,
    );
    set({ items });
    writeStoredCart(items);
  },

  updateNote: (variantId, note) => {
    const items = get().items.map((item) =>
      item.variantId === variantId ? { ...item, itemNote: note } : item,
    );
    set({ items });
    writeStoredCart(items);
  },

  clearCart: () => {
    set({ items: [] });
    writeStoredCart([]);
  },

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  hydrateCart: () => set({ items: readStoredCart() }),
}));
