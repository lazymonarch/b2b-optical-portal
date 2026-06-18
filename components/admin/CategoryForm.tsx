"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CategoryForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function slugify(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Category name is required.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slugify(name) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setName("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cleaning cloths"
          className="w-full text-sm border border-neutral-200 rounded-lg
            px-3 py-2 focus:outline-none focus:border-neutral-400"
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-neutral-900 text-white text-sm font-medium px-4 py-2
          rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add category"}
      </button>
    </form>
  )
}
