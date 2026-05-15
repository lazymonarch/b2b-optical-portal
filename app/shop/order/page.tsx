import { redirect } from "next/navigation";

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
    redirect("/auth/login");
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
