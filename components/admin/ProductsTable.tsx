"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminProduct = {
  id: string;
  name: string;
  model_code: string;
  material: string | null;
  size_mm: string | null;
  is_active: boolean;
  created_at: string;
  categories: { name: string } | null;
  product_variants: { id: string; in_stock: boolean }[];
};

type ProductsTableProps = {
  products: AdminProduct[];
};

export default function ProductsTable({ products }: ProductsTableProps) {
  const [activeById, setActiveById] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((product) => [product.id, product.is_active])),
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  async function setProductActive(productId: string, isActive: boolean) {
    setActiveById((current) => ({ ...current, [productId]: isActive }));
    setUpdatingId(productId);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to update product.");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      setActiveById((current) => ({ ...current, [productId]: !isActive }));
    } finally {
      setUpdatingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
        <p className="mb-4 text-sm text-neutral-500">No products yet.</p>
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Create first product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
          <tr>
            <th className="px-5 py-3 text-xs font-medium">Product</th>
            <th className="px-5 py-3 text-xs font-medium">Category</th>
            <th className="px-5 py-3 text-xs font-medium">Variants</th>
            <th className="px-5 py-3 text-xs font-medium">Status</th>
            <th className="px-5 py-3 text-xs font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.map((product) => {
            const isActive = activeById[product.id] ?? product.is_active;
            const inStockVariants = product.product_variants.filter((variant) => variant.in_stock)
              .length;

            return (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-neutral-900">{product.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-neutral-500">
                    {product.model_code}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {[product.material, product.size_mm].filter(Boolean).join(" · ")}
                  </p>
                </td>
                <td className="px-5 py-4 text-xs text-neutral-600">
                  {product.categories?.name ?? "Uncategorized"}
                </td>
                <td className="px-5 py-4 text-xs text-neutral-600">
                  {inStockVariants}/{product.product_variants.length} available
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    disabled={updatingId === product.id}
                    onClick={() => setProductActive(product.id, !isActive)}
                    className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full ${isActive ? "bg-green-500" : "bg-neutral-400"}`}
                    />
                    {isActive ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-white"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
