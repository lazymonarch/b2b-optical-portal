"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { type CartItem, useCart } from "@/hooks/useCart";

type ReorderResponse = {
  available?: CartItem[];
  unavailable?: string[];
  error?: string;
};

export default function ReorderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  async function handleReorder() {
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/reorder`, { method: "POST" });
      const data = (await res.json()) as ReorderResponse;

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to reorder.");
      }

      if (data.unavailable?.length) {
        window.alert(
          `Some items could not be added because they are discontinued or out of stock:\n\n${data.unavailable.join("\n")}`,
        );
      }

      if (data.available?.length) {
        data.available.forEach((item) => addItem(item));
        router.push("/shop/order");
      } else {
        window.alert("None of the items in this order are currently available.");
      }
    } catch (err) {
      console.error(err);
      window.alert("Failed to reorder.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      disabled={loading}
      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
    >
      <RotateCcw className="size-4" aria-hidden="true" />
      {loading ? "Checking..." : "Reorder"}
    </button>
  );
}
