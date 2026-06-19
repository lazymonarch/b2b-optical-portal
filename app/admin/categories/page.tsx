import CategoryForm from "@/components/admin/CategoryForm";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  if (error) {
    console.error("Admin categories fetch error:", error);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Categories</h1>
        <p className="text-sm text-neutral-500">
          Manage the catalog groups shops use for browsing.
        </p>
      </div>

      <CategoryForm categories={categories ?? []} />
    </main>
  );
}
