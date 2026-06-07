import Link from "next/link";
import { headers } from "next/headers";

import HeaderAuth from "@/components/layout/HeaderAuth";
import { createClient } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("next-url") || "";

  if (pathname.startsWith("/admin")) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let shopName = null;
  let isAdmin = false;

  if (user) {
    isAdmin = user.user_metadata?.role === "admin";

    if (!isAdmin) {
      const { data: shop } = await supabase
        .from("shops")
        .select("shop_name")
        .eq("user_id", user.id)
        .single();

      if (shop) shopName = shop.shop_name;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-medium tracking-wide text-neutral-900"
        >
          <div className="flex size-8 items-center justify-center rounded bg-neutral-900">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          LAKSHAN<span className="text-neutral-400">ENT.</span>
        </Link>

        <HeaderAuth userEmail={user?.email} shopName={shopName} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
