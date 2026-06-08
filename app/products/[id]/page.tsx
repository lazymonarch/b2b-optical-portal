import { notFound } from "next/navigation";

import ProductDetail from "@/components/products/ProductDetail";
import { createClient } from "@/lib/supabase/server";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      model_code,
      material,
      size_mm,
      per_packet_pcs,
      std_packing_pcs,
      description,
      is_active,
      categories ( name ),
      product_variants ( id, color_name, color_hex, image_url, in_stock )
    `,
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <ProductDetail product={product} />
    </main>
  );
}
