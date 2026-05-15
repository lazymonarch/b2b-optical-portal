import { CategoryFilter } from "@/components/products/category-filter";
import { ProductGrid } from "@/components/products/product-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const categories = [
  { id: "boxes", name: "Optical Boxes", slug: "optical-boxes", description: null },
  { id: "pouches", name: "Pouches", slug: "pouches", description: null },
  { id: "cloths", name: "Cleaning Cloths", slug: "cleaning-cloths", description: null },
];

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Catalog</p>
          <h1 className="text-3xl font-semibold tracking-tight">Browse products</h1>
          <p className="max-w-2xl text-muted-foreground">
            This page is ready for Supabase product data in the next step.
          </p>
        </div>
        <CategoryFilter categories={categories} />
        <ProductGrid products={[]} />
      </main>
      <SiteFooter />
    </div>
  );
}
