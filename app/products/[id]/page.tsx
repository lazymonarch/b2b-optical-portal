import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-10 md:grid-cols-[1fr_1fr]">
        <div className="aspect-[4/3] rounded-lg border bg-muted" />
        <section className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Product ID</p>
            <h1 className="text-3xl font-semibold tracking-tight">{id}</h1>
          </div>
          <p className="leading-7 text-muted-foreground">
            Product specifications, color variants, packing quantity, and order controls will be
            connected here after the catalog query is added.
          </p>
          <div className="flex gap-2">
            <Button>Add to order</Button>
            <Button asChild variant="outline">
              <Link href="/products">Back to catalog</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
