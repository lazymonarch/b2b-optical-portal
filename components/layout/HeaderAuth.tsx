"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/hooks/useCart";
import { createClient } from "@/lib/supabase/client";

export default function HeaderAuth({
  userEmail,
  shopName,
  isAdmin,
}: {
  userEmail?: string;
  shopName?: string | null;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const { hydrateCart, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      hydrateCart();
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hydrateCart]);

  const itemsCount = mounted ? totalItems() : 0;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-6">
      {!isAdmin && userEmail && (
        <Link
          href="/shop/orders"
          className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          My Orders
        </Link>
      )}

      {!isAdmin && (
        <Link
          href="/shop/order"
          className="relative flex items-center text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {mounted && itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              {itemsCount}
            </span>
          )}
        </Link>
      )}

      {userEmail ? (
        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-medium text-neutral-900">
              {isAdmin ? "Admin Dashboard" : (shopName ?? "Shop Account")}
            </span>
            <span className="text-xs text-neutral-500">{userEmail}</span>
          </div>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
