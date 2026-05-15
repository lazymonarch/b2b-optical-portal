"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ColorSwatch from "@/components/products/ColorSwatch";
import { useCart } from "@/hooks/useCart";

interface Variant {
  id: string;
  color_name: string;
  color_hex: string | null;
  image_url: string | null;
  in_stock: boolean;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    model_code: string;
    material: string | null;
    size_mm: string | null;
    per_packet_pcs: number | null;
    product_variants: Variant[];
    categories: { name: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const variants = product.product_variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants[0] ?? null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAddToOrder() {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      modelCode: product.model_code,
      colorName: selectedVariant.color_name,
      colorHex: selectedVariant.color_hex,
      imageUrl: selectedVariant.image_url,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const image = selectedVariant?.image_url;

  return (
    <div className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-sm">
      <div
        className="relative h-44 cursor-pointer overflow-hidden border-b border-neutral-100 bg-neutral-50"
        onClick={() => router.push(`/products/${product.id}`)}
      >
        {image ? (
          <Image
            src={image}
            alt={`${product.name} - ${selectedVariant?.color_name}`}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
        )}

        {product.categories?.name && (
          <div className="absolute top-2 left-2 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs text-neutral-500">
            {product.categories.name}
          </div>
        )}
      </div>

      <div className="p-4">
        {variants.length > 0 && (
          <div className="mb-3 flex gap-1.5">
            {variants.map((variant) => (
              <ColorSwatch
                key={variant.id}
                colorName={variant.color_name}
                colorHex={variant.color_hex}
                selected={selectedVariant?.id === variant.id}
                onClick={() => setSelectedVariant(variant)}
              />
            ))}
          </div>
        )}

        <p className="text-sm leading-snug font-medium text-neutral-900">{product.name}</p>
        <p className="mt-0.5 mb-1 text-xs text-neutral-400">{product.model_code}</p>

        <p className="text-xs text-neutral-500">
          {[product.material, product.size_mm].filter(Boolean).join(" · ")}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {product.per_packet_pcs ? `Min. ${product.per_packet_pcs} pcs / pkt` : ""}
          </span>
          <button
            onClick={handleAddToOrder}
            disabled={!selectedVariant?.in_stock}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              added
                ? "bg-green-600 text-white"
                : !selectedVariant?.in_stock
                  ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
            }`}
          >
            {added ? "Added" : !selectedVariant?.in_stock ? "Out of stock" : "Add to order"}
          </button>
        </div>
      </div>
    </div>
  );
}
