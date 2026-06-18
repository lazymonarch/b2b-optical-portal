import { createClient } from "@/lib/supabase/server"
import ProductForm from "@/components/admin/ProductForm"

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-medium text-neutral-900">New product</h1>
        <p className="text-sm text-neutral-500">
          Create the product first, then add color variants and photos on the next screen.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm mode="create" categories={categories ?? []} />
      </div>
    </div>
  )
}
