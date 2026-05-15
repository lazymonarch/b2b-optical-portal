import Link from "next/link";

import type { Category } from "@/types/catalog";

type CategoryFilterProps = {
  categories: Category[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/products">
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          href={`/products?category=${category.slug}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
