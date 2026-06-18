"use client"

import { useState } from "react"
import ImageUploadField from "./ImageUploadField"

export interface VariantDraft {
  id?: string
  color_name: string
  color_hex: string
  image_url: string | null
  in_stock: boolean
}

interface VariantEditorProps {
  productId: string
  initialVariants: VariantDraft[]
}

export default function VariantEditor({
  productId,
  initialVariants,
}: VariantEditorProps) {
  const [variants, setVariants] = useState<VariantDraft[]>(initialVariants)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function addBlankVariant() {
    setVariants((v) => [
      ...v,
      { color_name: "", color_hex: "#cccccc", image_url: null, in_stock: true },
    ])
  }

  function updateLocal(index: number, patch: Partial<VariantDraft>) {
    setVariants((v) => v.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  async function saveVariant(index: number) {
    const variant = variants[index]
    if (!variant.color_name.trim()) {
      setError("Color name is required.")
      return
    }

    setError(null)
    const key = variant.id ?? `new-${index}`
    setSavingKey(key)

    try {
      if (variant.id) {
        const res = await fetch(`/api/admin/variants/${variant.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            color_name: variant.color_name,
            color_hex: variant.color_hex,
            image_url: variant.image_url,
            in_stock: variant.in_stock,
          }),
        })
        if (!res.ok) throw new Error((await res.json()).error)
      } else {
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            color_name: variant.color_name,
            color_hex: variant.color_hex,
            image_url: variant.image_url,
            in_stock: variant.in_stock,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        updateLocal(index, { id: data.id })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save variant.")
    } finally {
      setSavingKey(null)
    }
  }

  async function removeVariant(index: number) {
    const variant = variants[index]

    if (!variant.id) {
      setVariants((v) => v.filter((_, i) => i !== index))
      return
    }

    if (!confirm("Mark this color as out of stock? It will be hidden from the catalog.")) return

    setSavingKey(variant.id)
    try {
      const res = await fetch(`/api/admin/variants/${variant.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error)
      updateLocal(index, { in_stock: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update variant.")
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {variants.map((variant, index) => {
        const key = variant.id ?? `new-${index}`
        const isSaving = savingKey === key

        return (
          <div key={key} className="border border-neutral-200 rounded-xl p-4
            flex flex-col gap-3 bg-white">

            <div className="flex items-start gap-3">
              <ImageUploadField
                productId={productId}
                currentImageUrl={variant.image_url}
                onUploaded={(url) => updateLocal(index, { image_url: url })}
              />

              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Color name</label>
                  <input
                    value={variant.color_name}
                    onChange={(e) => updateLocal(index, { color_name: e.target.value })}
                    placeholder="e.g. Red"
                    className="w-full text-sm border border-neutral-200 rounded-lg
                      px-2.5 py-1.5 focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Color swatch</label>
                  <input
                    type="color"
                    value={variant.color_hex}
                    onChange={(e) => updateLocal(index, { color_hex: e.target.value })}
                    className="w-full h-8 rounded-lg border border-neutral-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  checked={variant.in_stock}
                  onChange={(e) => updateLocal(index, { in_stock: e.target.checked })}
                />
                In stock
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => removeVariant(index)}
                  disabled={isSaving}
                  className="text-xs text-red-500 hover:underline disabled:opacity-50"
                >
                  {variant.id ? "Mark out of stock" : "Remove"}
                </button>
                <button
                  onClick={() => saveVariant(index)}
                  disabled={isSaving}
                  className="text-xs font-medium bg-neutral-900 text-white
                    px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors
                    disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : variant.id ? "Update" : "Save variant"}
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={addBlankVariant}
        className="text-sm font-medium text-neutral-600 border border-dashed
          border-neutral-300 rounded-xl py-2.5 hover:bg-neutral-50 transition-colors"
      >
        + Add color variant
      </button>
    </div>
  )
}
