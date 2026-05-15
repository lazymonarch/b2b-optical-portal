"use client";

import Image from "next/image";
import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQty, updateNote } = useCart();
  const [showNote, setShowNote] = useState(!!item.itemNote);

  return (
    <div className="border-b border-neutral-100 p-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="relative size-14 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.productName} fill className="object-contain p-1" />
          ) : (
            <div
              className="size-full rounded-lg"
              style={{ backgroundColor: item.colorHex ?? "#e5e5e5" }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900">{item.productName}</p>
          <p className="mt-0.5 text-xs text-neutral-400">
            {item.modelCode} · {item.colorName}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => updateQty(item.variantId, item.quantity - 1)}
              className="flex size-6 items-center justify-center rounded border border-neutral-200 text-sm text-neutral-500 transition-colors hover:bg-neutral-100"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.variantId, item.quantity + 1)}
              className="flex size-6 items-center justify-center rounded border border-neutral-200 text-sm text-neutral-500 transition-colors hover:bg-neutral-100"
            >
              +
            </button>
            <span className="ml-1 text-xs text-neutral-400">pkts</span>
          </div>

          {!showNote ? (
            <button
              onClick={() => setShowNote(true)}
              className="mt-2 text-xs text-neutral-400 underline hover:text-neutral-600"
            >
              Add item note
            </button>
          ) : (
            <textarea
              value={item.itemNote ?? ""}
              onChange={(event) => updateNote(item.variantId, event.target.value)}
              placeholder="Note for this item..."
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs transition-colors focus:border-neutral-400 focus:outline-none"
            />
          )}
        </div>

        <button
          onClick={() => removeItem(item.variantId)}
          aria-label="Remove item"
          className="mt-0.5 text-neutral-300 transition-colors hover:text-red-400"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
