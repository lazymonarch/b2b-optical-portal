import { createClient } from "@/lib/supabase/server"
import CategoryForm from "@/components/admin/CategoryForm"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-medium text-neutral-900">Categories</h1>
        <p className="text-sm text-neutral-500">{categories?.length ?? 0} categories</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-4">
        <CategoryForm />
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {categories?.map((cat) => (
          <div key={cat.id}
            className="px-5 py-3 border-b border-neutral-100 last:border-0
              flex justify-between items-center">
            <span className="text-sm text-neutral-800">{cat.name}</span>
            <span className="text-xs text-neutral-400">{cat.slug}</span>
          </div>
        ))}
        {(!categories || categories.length === 0) && (
          <div className="px-5 py-12 text-center">
            <p className="text-neutral-400 text-sm">No categories yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
