import { ProductCard } from "@/components/products/product-card";
import type { ProductWithVariants } from "@/types/catalog";

type ProductGridProps = {
  products: ProductWithVariants[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Products will appear here after the Supabase catalog is connected.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
