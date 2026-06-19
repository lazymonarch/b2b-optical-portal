import Link from "next/link";
import { redirect } from "next/navigation";

import ShopProfileForm from "@/components/shop/ShopProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function ShopProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/shop/profile");
  }

  const { data: shop, error } = await supabase
    .from("shops")
    .select("id, shop_name, owner_name, phone, address, city")
    .eq("user_id", user.id)
    .single();

  if (error || !shop) {
    redirect("/auth/register");
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-medium text-neutral-900">Shop profile</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Keep your contact and delivery information up to date.
            </p>
          </div>
          <Link
            href="/shop/orders"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            View orders
          </Link>
        </div>

        <ShopProfileForm shop={shop} />
      </div>
    </main>
  );
}
