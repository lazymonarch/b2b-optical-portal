"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type CategoryFormProps = {
  categories: Category[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryForm({ categories }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          description,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to create category.");
      setName("");
      setDescription("");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(categoryId: string) {
    const draft = editing[categoryId];
    if (!draft) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to update category.");
      setEditing((current) => {
        const next = { ...current };
        delete next[categoryId];
        return next;
      });
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <form
        onSubmit={createCategory}
        className="h-fit rounded-xl border border-neutral-200 bg-white p-5"
      >
        <h2 className="text-sm font-medium text-neutral-900">Add category</h2>
        <p className="mb-4 text-xs text-neutral-500">Used for catalog filtering.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs text-neutral-500">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Spectacle cases"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-neutral-500">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create category"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-medium text-neutral-900">Categories</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {categories.map((category) => {
            const draft = editing[category.id] ?? category;

            return (
              <div key={category.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_1fr_auto]">
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      [category.id]: {
                        ...draft,
                        name: event.target.value,
                        slug: slugify(event.target.value),
                      },
                    }))
                  }
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
                />
                <input
                  value={draft.description ?? ""}
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      [category.id]: { ...draft, description: event.target.value },
                    }))
                  }
                  placeholder="Description"
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveCategory(category.id)}
                  disabled={loading || !editing[category.id]}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            );
          })}

          {categories.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-neutral-400">
              No categories yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
