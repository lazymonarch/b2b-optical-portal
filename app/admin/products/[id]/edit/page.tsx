import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProductForm from "@/components/admin/ProductForm"
import VariantEditor from "@/components/admin/VariantEditor"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  const response = await supabase
    .from("products")
    .select(`
      id, model_code, name, material, size_mm, per_packet_pcs,
      std_packing_pcs, description, category_id, is_active,
      product_variants ( id, color_name, color_hex, image_url, in_stock )
    `)
    .eq("id", id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = response.data as any

  if (!product) redirect("/admin/products")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-medium text-neutral-900">{product.name}</h1>
        <p className="text-sm text-neutral-500">{product.model_code}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-neutral-900 mb-3">Product details</p>
          <ProductForm
            mode="edit"
            productId={product.id}
            categories={categories ?? []}
            initial={{
              model_code: product.model_code,
              name: product.name,
              material: product.material ?? "",
              size_mm: product.size_mm ?? "",
              per_packet_pcs: product.per_packet_pcs,
              std_packing_pcs: product.std_packing_pcs,
              description: product.description ?? "",
              category_id: product.category_id,
              is_active: product.is_active,
            }}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-900 mb-3">Color variants</p>
          <VariantEditor
            productId={product.id}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialVariants={product.product_variants.map((v: any) => ({
              id: v.id,
              color_name: v.color_name,
              color_hex: v.color_hex ?? "#cccccc",
              image_url: v.image_url,
              in_stock: v.in_stock,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
