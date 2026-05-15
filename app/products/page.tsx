import Link from "next/link";

import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid, { type CatalogProduct } from "@/components/products/ProductGrid";
import { createClient } from "@/lib/supabase/server";

interface SearchParams {
  category?: string;
  search?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, search } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  let query = supabase
    .from("products")
    .select(
      `
      id,
      name,
      model_code,
      material,
      size_mm,
      per_packet_pcs,
      is_active,
      categories ( id, name, slug ),
      product_variants ( id, color_name, color_hex, image_url, in_stock )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    const matchedCategory = categories?.find((item) => item.slug === category);

    if (matchedCategory) {
      query = query.eq("category_id", matchedCategory.id);
    }
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,model_code.ilike.%${search}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Products fetch error:", error);
  }

  const catalogProducts = (products ?? []) as CatalogProduct[];

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-medium text-neutral-900">Product catalog</h1>
              <p className="text-sm text-neutral-500">
                {catalogProducts.length} products available
              </p>
            </div>

            <form method="GET" className="flex gap-2">
              {category && <input type="hidden" name="category" value={category} />}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  name="search"
                  type="text"
                  defaultValue={search ?? ""}
                  placeholder="Search products, model codes..."
                  className="w-64 rounded-lg border border-neutral-200 py-2 pr-4 pl-9 text-sm transition-colors focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800"
              >
                Search
              </button>
            </form>
          </div>

          <CategoryFilter
            categories={categories ?? []}
            activeCategory={category ?? "all"}
            activeSearch={search}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {catalogProducts.length > 0 ? (
          <ProductGrid products={catalogProducts} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-neutral-400">
              No products found{search ? ` for "${search}"` : ""}.
            </p>
            <Link
              href="/products"
              className="mt-2 inline-block text-sm text-neutral-900 underline"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
