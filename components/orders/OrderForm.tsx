"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CartItem from "@/components/orders/CartItem";
import { useCart } from "@/hooks/useCart";

interface Shop {
  id: string;
  shop_name: string;
  owner_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
}

interface OrderFormProps {
  shop: Shop;
}

export default function OrderForm({ shop }: OrderFormProps) {
  const { items, clearCart, totalItems } = useCart();
  const [orderNote, setOrderNote] = useState("");
  const [address, setAddress] = useState(shop.address ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handlePlaceOrder() {
    if (items.length === 0) return;

    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shop.id,
          shopName: shop.shop_name,
          phone: shop.phone,
          address,
          notes: orderNote,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            itemNote: item.itemNote ?? "",
            productName: item.productName,
            colorName: item.colorName,
          })),
        }),
      });

      const data = (await res.json()) as { orderId?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to place order.");
      }

      clearCart();
      router.push(`/shop/orders/${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-neutral-100">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="mb-4 text-sm text-neutral-500">Your order is empty.</p>
        <Link
          href="/products"
          className="inline-block rounded-lg bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-neutral-700"
        >
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-medium text-neutral-900">Items ({totalItems()} pkts)</p>
            <Link
              href="/products"
              className="text-xs text-neutral-400 underline transition-colors hover:text-neutral-600"
            >
              Add more
            </Link>
          </div>

          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}

          <div className="border-t border-neutral-100 px-4 py-3">
            <label className="mb-1.5 block text-xs text-neutral-500">Order note (optional)</label>
            <textarea
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              placeholder="Any special instructions for this order..."
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm transition-colors focus:border-neutral-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5">
          <p className="mb-4 text-sm font-medium text-neutral-900">Shop details</p>

          <div className="mb-4 flex flex-col gap-3">
            <div>
              <p className="mb-1 text-xs text-neutral-400">Shop name</p>
              <p className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
                {shop.shop_name}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-neutral-400">Contact</p>
              <p className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
                {shop.phone ?? "-"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-neutral-400">
                Delivery address
                <span className="ml-0.5 text-red-400">*</span>
              </p>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter delivery address..."
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm transition-colors focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex justify-between">
              <span className="text-xs text-neutral-500">Total items</span>
              <span className="text-xs font-medium text-neutral-800">
                {items.length} product{items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-neutral-500">Total packets</span>
              <span className="text-xs font-medium text-neutral-800">{totalItems()} pkts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-neutral-500">Order type</span>
              <span className="text-xs font-medium text-neutral-800">Enquiry only</span>
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Place order"}
          </button>

          <p className="mt-3 text-center text-xs leading-relaxed text-neutral-400">
            No payment required. Your order will be reviewed and confirmed directly.
          </p>
        </div>
      </div>
    </div>
  );
}
