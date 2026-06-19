import Link from "next/link";

import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Admin categories fetch error:", error);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="mb-3 inline-block text-sm text-neutral-500 underline"
        >
          Back to products
        </Link>
        <h1 className="text-2xl font-medium text-neutral-900">New product</h1>
        <p className="text-sm text-neutral-500">
          Start with core details. You can add color variants and images after creation.
        </p>
      </div>

      <ProductForm mode="create" categories={categories ?? []} />
    </main>
  );
}
