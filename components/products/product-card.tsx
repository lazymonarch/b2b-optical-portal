import Link from "next/link";
import { PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductWithVariants } from "@/types/catalog";

type ProductCardProps = {
  product: ProductWithVariants;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="grid gap-4 rounded-lg border bg-background p-4">
      <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-muted">
        <PackageOpen className="size-10 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.model_code}
            </p>
            <h2 className="font-medium">{product.name}</h2>
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {product.variants.length} colors
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.description ?? "Optical accessory product ready for shop orders."}
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href={`/products/${product.id}`}>View details</Link>
      </Button>
    </article>
  );
}
