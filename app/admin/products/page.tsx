import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import ProductsTable from "@/components/admin/ProductsTable"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      id, model_code, name, is_active,
      categories ( name ),
      product_variants ( id )
    `)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500">
            {products?.length ?? 0} products · drafts shown at top
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-neutral-900 text-white text-sm font-medium
            px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          + New product
        </Link>
      </div>

      <ProductsTable products={products ?? []} />
    </div>
  )
}
