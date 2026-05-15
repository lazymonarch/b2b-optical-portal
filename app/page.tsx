import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Store } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm text-muted-foreground">
              <Store className="size-4" aria-hidden="true" />
              Built for optical shops
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Optical accessories ordering without the manual back-and-forth.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Shops can browse spectacle boxes, pouches, cleaning cloths, and
                frame accessories, then send order requests directly from the catalog.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse catalog
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/register">Register shop</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
            {[
              ["Catalog", "Products grouped by category, model, color, and packing."],
              ["Orders", "Authenticated shops can submit quantity requests."],
              ["Admin", "Incoming orders are managed from one dashboard."],
            ].map(([title, description], index) => (
              <div key={title} className="rounded-md border bg-background p-4">
                <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  {index === 0 ? <Package className="size-4" /> : <ShieldCheck className="size-4" />}
                </div>
                <h2 className="font-medium">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
