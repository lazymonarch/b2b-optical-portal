import Link from "next/link";

import ProductsTable from "@/components/admin/ProductsTable";
import { createClient } from "@/lib/supabase/server";

type SearchParams = {
  status?: string;
};

type AdminProduct = {
  id: string;
  name: string;
  model_code: string;
  material: string | null;
  size_mm: string | null;
  is_active: boolean;
  created_at: string;
  categories: { name: string } | null;
  product_variants: { id: string; in_stock: boolean }[];
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      model_code,
      material,
      size_mm,
      is_active,
      created_at,
      categories ( name ),
      product_variants ( id, in_stock )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin products fetch error:", error);
  }

  const productRows = (products ?? []) as unknown as AdminProduct[];
  const filteredRows = productRows.filter((product) => {
    if (status === "published") return product.is_active;
    if (status === "draft") return !product.is_active;
    return true;
  });
  const publishedCount = productRows.filter((product) => product.is_active).length;
  const draftCount = productRows.filter((product) => !product.is_active).length;
  const filters = [
    { label: "All", href: "/admin/products", active: !status || status === "all" },
    {
      label: `Published (${publishedCount})`,
      href: "/admin/products?status=published",
      active: status === "published",
    },
    {
      label: `Draft (${draftCount})`,
      href: "/admin/products?status=draft",
      active: status === "draft",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500">
            Create models, manage variants, and publish items to the catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          New product
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.href}
            href={filter.href}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter.active
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <ProductsTable products={filteredRows} />
    </main>
  );
}
