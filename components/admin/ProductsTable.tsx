"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  model_code: string
  name: string
  is_active: boolean
  categories: { name: string } | null
  product_variants: { id: string }[]
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [localProducts, setLocalProducts] = useState(products)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const sorted = useMemo(
    () =>
      [...localProducts].sort((a, b) => {
        if (a.is_active === b.is_active) return 0
        return a.is_active ? 1 : -1
      }),
    [localProducts]
  )

  async function toggleActive(product: Product) {
    const nextValue = !product.is_active

    setLocalProducts((list) =>
      list.map((p) => (p.id === product.id ? { ...p, is_active: nextValue } : p))
    )
    setUpdatingId(product.id)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextValue }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      setLocalProducts((list) =>
        list.map((p) => (p.id === product.id ? { ...p, is_active: !nextValue } : p))
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (sorted.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl px-6 py-16 text-center">
        <p className="text-neutral-400 text-sm">No products yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500">Product</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500">Category</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500">Variants</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500">Status</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500">Edit</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((product) => (
            <tr key={product.id}
              className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
              <td className="px-5 py-4">
                <p className="font-medium text-neutral-800">{product.name}</p>
                <p className="text-xs text-neutral-400">{product.model_code}</p>
              </td>
              <td className="px-5 py-4 text-neutral-600">
                {product.categories?.name ?? "—"}
              </td>
              <td className="px-5 py-4 text-neutral-600">
                {product.product_variants.length}
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={() => toggleActive(product)}
                  disabled={updatingId === product.id}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium
                    transition-colors disabled:opacity-50 ${
                    product.is_active
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {product.is_active ? "Published" : "Draft"}
                </button>
              </td>
              <td className="px-5 py-4">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-xs text-neutral-500 underline hover:text-neutral-800"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
