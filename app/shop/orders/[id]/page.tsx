import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type OrderItemView = {
  quantity: number;
  item_note: string | null;
  products: { name: string; model_code: string } | null;
  product_variants: { color_name: string; color_hex: string | null } | null;
};

type OrderView = {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  shops: { shop_name: string; phone: string | null; city: string | null } | null;
  order_items: OrderItemView[];
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      notes,
      created_at,
      shops ( shop_name, phone, city ),
      order_items (
        quantity,
        item_note,
        products ( name, model_code ),
        product_variants ( color_name, color_hex )
      )
    `,
    )
    .eq("id", id)
    .single();

  const order = data as unknown as OrderView | null;

  if (!order) redirect("/shop/orders");

  const createdAt = new Date(order.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-100">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="mb-1 text-xl font-medium text-neutral-900">
            Order placed successfully
          </h1>
          <p className="text-sm text-neutral-500">
            Order #{order.id.slice(0, 8).toUpperCase()} · {createdAt}
          </p>
        </div>

        <div className="mb-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <p className="text-sm font-medium text-neutral-900">Items ordered</p>
          </div>

          {order.order_items.map((item, index) => (
            <div
              key={`${item.products?.model_code ?? "item"}-${index}`}
              className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3 last:border-0"
            >
              <div>
                <p className="text-sm text-neutral-800">{item.products?.name}</p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {item.product_variants?.color_name}
                  {item.item_note ? ` · ${item.item_note}` : ""}
                </p>
              </div>
              <span className="flex-shrink-0 text-sm font-medium text-neutral-700">
                x{item.quantity} pkts
              </span>
            </div>
          ))}

          {order.notes && (
            <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3">
              <p className="mb-1 text-xs text-neutral-400">Order note</p>
              <p className="text-sm text-neutral-700">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
          <p className="mb-1 text-sm font-medium text-amber-800">Pending confirmation</p>
          <p className="text-xs leading-relaxed text-amber-700">
            Your order has been received. You will be contacted directly on{" "}
            {order.shops?.phone ?? "your registered number"} to confirm availability and delivery
            details.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/products"
            className="flex-1 rounded-lg bg-neutral-900 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Continue browsing
          </Link>
          <Link
            href="/shop/orders"
            className="flex-1 rounded-lg border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            View all orders
          </Link>
        </div>
      </div>
    </main>
  );
}
