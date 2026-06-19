"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductFormValues = {
  id?: string;
  category_id: string | null;
  model_code: string;
  name: string;
  material: string | null;
  size_mm: string | null;
  per_packet_pcs: number | null;
  std_packing_pcs: number | null;
  description: string | null;
  is_active: boolean;
};

type ProductFormProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  initialProduct?: ProductFormValues;
};

const emptyProduct: ProductFormValues = {
  category_id: null,
  model_code: "",
  name: "",
  material: "",
  size_mm: "",
  per_packet_pcs: null,
  std_packing_pcs: null,
  description: "",
  is_active: false,
};

function toNullableNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function ProductForm({ mode, categories, initialProduct }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>(initialProduct ?? emptyProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function updateForm(patch: Partial<ProductFormValues>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        category_id: form.category_id,
        model_code: form.model_code,
        name: form.name,
        material: form.material,
        size_mm: form.size_mm,
        per_packet_pcs: form.per_packet_pcs,
        std_packing_pcs: form.std_packing_pcs,
        description: form.description,
        is_active: form.is_active,
      };

      const endpoint =
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${initialProduct?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { productId?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save product.");
      }

      if (mode === "create" && data.productId) {
        router.push(`/admin/products/${data.productId}/edit`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-900">Product details</h2>
          <p className="text-xs text-neutral-500">
            Draft products stay hidden until you publish them.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => updateForm({ is_active: event.target.checked })}
            className="size-4 rounded border-neutral-300"
          />
          Published
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Product name</label>
          <input
            value={form.name}
            onChange={(event) => updateForm({ name: event.target.value })}
            required
            placeholder="Premium hard case"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Model code</label>
          <input
            value={form.model_code}
            onChange={(event) => updateForm({ model_code: event.target.value.toUpperCase() })}
            required
            placeholder="I SEE 180"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Category</label>
          <div className="relative">
            <select
              value={form.category_id ?? ""}
              onChange={(event) => updateForm({ category_id: event.target.value || null })}
              className="h-[38px] w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-9 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Material</label>
          <input
            value={form.material ?? ""}
            onChange={(event) => updateForm({ material: event.target.value })}
            placeholder="Metal, PU, Plastic..."
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Size</label>
          <input
            value={form.size_mm ?? ""}
            onChange={(event) => updateForm({ size_mm: event.target.value })}
            placeholder="154 x 55 x 38 mm"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-neutral-500">Pcs / packet</label>
            <input
              type="number"
              min="0"
              value={form.per_packet_pcs ?? ""}
              onChange={(event) =>
                updateForm({ per_packet_pcs: toNullableNumber(event.target.value) })
              }
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-neutral-500">Std. packing</label>
            <input
              type="number"
              min="0"
              value={form.std_packing_pcs ?? ""}
              onChange={(event) =>
                updateForm({ std_packing_pcs: toNullableNumber(event.target.value) })
              }
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs text-neutral-500">Description</label>
          <textarea
            value={form.description ?? ""}
            onChange={(event) => updateForm({ description: event.target.value })}
            rows={4}
            placeholder="Short internal/public note about this model..."
            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          <Save className="size-4" aria-hidden="true" />
          {loading ? "Saving..." : mode === "create" ? "Create draft" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
