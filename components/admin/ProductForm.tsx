"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  mode: "create" | "edit"
  productId?: string
  categories: Category[]
  initial?: {
    model_code: string
    name: string
    material: string
    size_mm: string
    per_packet_pcs: number | null
    std_packing_pcs: number | null
    description: string
    category_id: string | null
    is_active: boolean
  }
}

export default function ProductForm({
  mode,
  productId,
  categories,
  initial,
}: ProductFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    model_code: initial?.model_code ?? "",
    name: initial?.name ?? "",
    material: initial?.material ?? "",
    size_mm: initial?.size_mm ?? "",
    per_packet_pcs: initial?.per_packet_pcs?.toString() ?? "",
    std_packing_pcs: initial?.std_packing_pcs?.toString() ?? "",
    description: initial?.description ?? "",
    category_id: initial?.category_id ?? (categories[0]?.id ?? ""),
    is_active: initial?.is_active ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      model_code: form.model_code.trim(),
      name: form.name.trim(),
      material: form.material.trim() || null,
      size_mm: form.size_mm.trim() || null,
      per_packet_pcs: form.per_packet_pcs ? parseInt(form.per_packet_pcs) : null,
      std_packing_pcs: form.std_packing_pcs ? parseInt(form.std_packing_pcs) : null,
      description: form.description.trim() || null,
      category_id: form.category_id || null,
      is_active: form.is_active,
    }

    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        router.push(`/admin/products/${data.id}/edit`)
      } else {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200
      rounded-xl p-5 flex flex-col gap-4">

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Model code <span className="text-red-400">*</span>
          </label>
          <input
            required
            value={form.model_code}
            onChange={(e) => update("model_code", e.target.value)}
            placeholder="e.g. I SEE 180"
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            Product name <span className="text-red-400">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Hard spectacle case"
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Material</label>
          <input
            value={form.material}
            onChange={(e) => update("material", e.target.value)}
            placeholder="e.g. P.P."
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Size (mm)</label>
          <input
            value={form.size_mm}
            onChange={(e) => update("size_mm", e.target.value)}
            placeholder="e.g. 154x55x38"
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => update("category_id", e.target.value)}
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Per packet (pcs)</label>
          <input
            type="number"
            min="1"
            value={form.per_packet_pcs}
            onChange={(e) => update("per_packet_pcs", e.target.value)}
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 block mb-1">Std packing (pcs)</label>
          <input
            type="number"
            min="1"
            value={form.std_packing_pcs}
            onChange={(e) => update("std_packing_pcs", e.target.value)}
            className="w-full text-sm border border-neutral-200 rounded-lg
              px-3 py-2 focus:outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-500 block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="w-full text-sm border border-neutral-200 rounded-lg
            px-3 py-2 resize-none focus:outline-none focus:border-neutral-400"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => update("is_active", e.target.checked)}
        />
        Published — visible in the public catalog
      </label>
      {!form.is_active && (
        <p className="text-xs text-amber-600 -mt-2">
          This product is a draft. Shops will not see it until you publish it.
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-neutral-900 text-white text-sm font-medium
          px-5 py-2.5 rounded-lg hover:bg-neutral-700 transition-colors
          disabled:opacity-50"
      >
        {loading ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
      </button>
    </form>
  )
}
