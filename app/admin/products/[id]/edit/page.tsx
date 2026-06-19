import Link from "next/link";
import { redirect } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import VariantEditor, { type VariantDraft } from "@/components/admin/VariantEditor";
import { createClient } from "@/lib/supabase/server";

type ProductView = {
  id: string;
  category_id: string | null;
  model_code: string;
  name: string;
  material: string | null;
  size_mm: string | null;
  per_packet_pcs: number | null;
  std_packing_pcs: number | null;
  description: string | null;
  is_active: boolean;
  product_variants: VariantDraft[];
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories, error: categoriesError }, { data: product, error: productError }] =
    await Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase
        .from("products")
        .select(
          `
          id,
          category_id,
          model_code,
          name,
          material,
          size_mm,
          per_packet_pcs,
          std_packing_pcs,
          description,
          is_active,
          product_variants ( id, color_name, color_hex, image_url, in_stock )
        `,
        )
        .eq("id", id)
        .single(),
    ]);

  if (categoriesError) {
    console.error("Admin categories fetch error:", categoriesError);
  }

  if (productError || !product) {
    redirect("/admin/products");
  }

  const productView = product as unknown as ProductView;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-3 inline-block text-sm text-neutral-500 underline"
          >
            Back to products
          </Link>
          <h1 className="text-2xl font-medium text-neutral-900">Edit product</h1>
          <p className="text-sm text-neutral-500">
            {productView.model_code} · {productView.is_active ? "Published" : "Draft"}
          </p>
        </div>
        <Link
          href={`/products/${productView.id}`}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-white"
        >
          View public page
        </Link>
      </div>

      <div className="space-y-6">
        <ProductForm
          mode="edit"
          categories={categories ?? []}
          initialProduct={{
            id: productView.id,
            category_id: productView.category_id,
            model_code: productView.model_code,
            name: productView.name,
            material: productView.material,
            size_mm: productView.size_mm,
            per_packet_pcs: productView.per_packet_pcs,
            std_packing_pcs: productView.std_packing_pcs,
            description: productView.description,
            is_active: productView.is_active,
          }}
        />
        <VariantEditor
          productId={productView.id}
          initialVariants={productView.product_variants ?? []}
        />
      </div>
    </main>
  );
}
