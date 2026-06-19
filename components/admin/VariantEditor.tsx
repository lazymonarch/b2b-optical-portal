"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import ImageUploadField from "@/components/admin/ImageUploadField";

export type VariantDraft = {
  id?: string;
  color_name: string;
  color_hex: string | null;
  image_url: string | null;
  in_stock: boolean;
};

type VariantEditorProps = {
  productId: string;
  initialVariants: VariantDraft[];
};

export default function VariantEditor({ productId, initialVariants }: VariantEditorProps) {
  const [variants, setVariants] = useState<VariantDraft[]>(initialVariants);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addBlankVariant() {
    setVariants((current) => [
      ...current,
      {
        color_name: "",
        color_hex: "#cccccc",
        image_url: null,
        in_stock: true,
      },
    ]);
  }

  function updateLocal(index: number, patch: Partial<VariantDraft>) {
    setVariants((current) =>
      current.map((variant, itemIndex) =>
        itemIndex === index ? { ...variant, ...patch } : variant,
      ),
    );
  }

  async function saveVariant(index: number) {
    const variant = variants[index];

    if (!variant.color_name.trim()) {
      setError("Color name is required.");
      return;
    }

    setError(null);
    const key = variant.id ?? `new-${index}`;
    setSavingKey(key);

    try {
      const payload = {
        color_name: variant.color_name,
        color_hex: variant.color_hex,
        image_url: variant.image_url,
        in_stock: variant.in_stock,
      };

      if (variant.id) {
        const res = await fetch(`/api/admin/variants/${variant.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Failed to save variant.");
      } else {
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, product_id: productId }),
        });
        const data = (await res.json()) as { variantId?: string; error?: string };
        if (!res.ok || !data.variantId) throw new Error(data.error ?? "Failed to add variant.");
        updateLocal(index, { id: data.variantId });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSavingKey(null);
    }
  }

  async function softDeleteVariant(index: number) {
    const variant = variants[index];

    if (!variant.id) {
      setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index));
      return;
    }

    setSavingKey(variant.id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/variants/${variant.id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to mark variant unavailable.");
      updateLocal(index, { in_stock: false });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-neutral-900">Color variants</h2>
          <p className="text-xs text-neutral-500">
            Add colors, images, and availability for this product.
          </p>
        </div>
        <button
          type="button"
          onClick={addBlankVariant}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add variant
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {variants.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-400">
          No variants yet. Add the first color to make this product orderable.
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {variants.map((variant, index) => {
            const key = variant.id ?? `new-${index}`;
            const isSaving = savingKey === key;

            return (
              <div key={key} className="grid gap-4 py-4 lg:grid-cols-[1.2fr_1fr_auto]">
                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <div>
                    <label className="mb-1 block text-xs text-neutral-500">Color name</label>
                    <input
                      value={variant.color_name}
                      onChange={(event) => updateLocal(index, { color_name: event.target.value })}
                      placeholder="Red, Black, Transparent..."
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-500">Color</label>
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1.5">
                      <input
                        type="color"
                        value={variant.color_hex ?? "#cccccc"}
                        onChange={(event) => updateLocal(index, { color_hex: event.target.value })}
                        className="size-7 cursor-pointer border-0 bg-transparent p-0"
                        aria-label="Variant color"
                      />
                      <span className="text-xs text-neutral-500">{variant.color_hex}</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      checked={variant.in_stock}
                      onChange={(event) => updateLocal(index, { in_stock: event.target.checked })}
                      className="size-4 rounded border-neutral-300"
                    />
                    Available for orders
                  </label>
                </div>

                <ImageUploadField
                  productId={productId}
                  currentImageUrl={variant.image_url}
                  onUploaded={(url) => updateLocal(index, { image_url: url })}
                />

                <div className="flex items-start gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => saveVariant(index)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
                  >
                    <Save className="size-3.5" aria-hidden="true" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => softDeleteVariant(index)}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-2.5 py-2 text-neutral-500 transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                    aria-label="Mark variant unavailable"
                    title="Mark unavailable"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
