import { redirect } from "next/navigation";
import Link from "next/link";

import OrderForm from "@/components/orders/OrderForm";
import { createClient } from "@/lib/supabase/server";

export default async function OrderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/shop/order");

  const { data: shop, error } = await supabase
    .from("shops")
    .select("id, shop_name, owner_name, phone, address, city")
    .eq("user_id", user.id)
    .single();

  if (error || !shop) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="rounded-xl border border-amber-200 bg-white p-6">
            <h1 className="text-lg font-medium text-neutral-900">Shop profile not found</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              You are signed in, but this account is not linked to a shop profile yet. Register as
              a shop account or ask the admin to create your shop profile before placing orders.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                href="/products"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Back to catalog
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Register shop
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-medium text-neutral-900">Your order</h1>
          <p className="text-sm text-neutral-500">
            Review your items and place your order. No payment required.
          </p>
        </div>
        <OrderForm shop={shop} />
      </div>
    </main>
  );
}
