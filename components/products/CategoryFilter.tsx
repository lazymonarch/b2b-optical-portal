"use client";

import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  activeSearch?: string;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  activeSearch,
}: CategoryFilterProps) {
  const router = useRouter();

  function navigate(slug: string) {
    const params = new URLSearchParams();
    if (slug !== "all") params.set("category", slug);
    if (activeSearch) params.set("search", activeSearch);
    const query = params.toString();

    router.push(query ? `/products?${query}` : "/products");
  }

  const allCategories = [{ id: "all", name: "All products", slug: "all" }, ...categories];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {allCategories.map((cat) => {
        const isActive = activeCategory === cat.slug;

        return (
          <button
            key={cat.id}
            onClick={() => navigate(cat.slug)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
