import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <div className="relative aspect-[4/3] max-h-[520px] min-h-[260px] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <div className="flex size-full items-center justify-center p-8">
            <svg
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="1.5"
              aria-hidden="true"
              className="h-24 w-24 max-w-full"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
        </div>
        <section className="min-w-0 space-y-5">
          <div>
            <p className="text-sm text-neutral-500">Product ID</p>
            <h1 className="break-words text-3xl font-semibold tracking-tight text-neutral-900">
              {id}
            </h1>
          </div>
          <p className="max-w-prose leading-7 text-neutral-500">
            Product specifications, color variants, packing quantity, and order controls will be
            connected here after the catalog query is added.
          </p>
          <div className="flex flex-wrap gap-2">
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
