import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/orders";

type ShopOrder = {
  id: string;
  status: OrderStatus;
  created_at: string;
  order_items: { quantity: number }[];
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  dispatched: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

export default async function ShopOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/shop/orders");

  const { data: shop } = await supabase
    .from("shops")
    .select("id, shop_name")
    .eq("user_id", user.id)
    .single();

  if (!shop) redirect("/auth/register");

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      created_at,
      order_items ( quantity )
    `,
    )
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Shop orders fetch error:", error);
  }

  const shopOrders = (orders ?? []) as unknown as ShopOrder[];

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-xl font-medium text-neutral-900">Your orders</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Order history and status for {shop.shop_name}
          </p>
        </div>

        {shopOrders.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <p className="mb-4 text-sm text-neutral-500">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-block rounded-lg bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-neutral-700"
            >
              Browse catalog
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {shopOrders.map((order) => {
              const totalPkts = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
              const createdAt = new Date(order.created_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <Link
                  key={order.id}
                  href={`/shop/orders/${order.id}`}
                  className="block rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-neutral-800">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">{createdAt}</p>
                      <p className="mt-2 text-xs text-neutral-600">{totalPkts} pkts</p>
                    </div>
                    <span
                      className={`rounded border px-2 py-1 text-[11px] font-medium uppercase ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Link
            href="/products"
            className="flex-1 rounded-lg border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-700 transition-colors hover:bg-white"
          >
            Browse catalog
          </Link>
          <Link
            href="/shop/order"
            className="flex-1 rounded-lg bg-neutral-900 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Current order
          </Link>
        </div>
      </div>
    </main>
  );
}
