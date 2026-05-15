import Link from "next/link";

import { CartSummary } from "@/components/cart/cart-summary";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function ShopOrderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-4xl flex-1 gap-6 px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Shop</p>
            <h1 className="text-3xl font-semibold tracking-tight">Order request</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">Continue browsing</Link>
          </Button>
        </div>
        <CartSummary />
      </main>
      <SiteFooter />
    </div>
  );
}
