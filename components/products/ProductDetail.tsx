"use client";

import Image from "next/image";
import Link from "next/link";
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

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    model_code: string;
    material: string | null;
    size_mm: string | null;
    per_packet_pcs: number | null;
    std_packing_pcs: number | null;
    description: string | null;
    categories: { name: string } | null;
    product_variants: Variant[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const variants = product.product_variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants[0] ?? null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

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
  const specs = [product.material, product.size_mm].filter(Boolean);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
      <div className="relative aspect-[4/3] max-h-[520px] min-h-[260px] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        {image ? (
          <Image
            src={image}
            alt={`${product.name} - ${selectedVariant?.color_name}`}
            fill
            className="object-contain p-8"
            priority
          />
        ) : (
          <div className="flex size-full items-center justify-center p-8">
            <svg
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="1.5"
              aria-hidden="true"
              className="h-24 w-24 max-w-full"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
        )}
      </div>

      <section className="min-w-0 space-y-5">
        {product.categories?.name && (
          <p className="text-sm text-neutral-500">{product.categories.name}</p>
        )}

        <div>
          <h1 className="break-words text-3xl font-semibold tracking-tight text-neutral-900">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">{product.model_code}</p>
        </div>

        {specs.length > 0 && (
          <p className="text-sm text-neutral-600">{specs.join(" · ")}</p>
        )}

        {product.per_packet_pcs && (
          <p className="text-sm text-neutral-500">
            {product.per_packet_pcs} pcs per packet
            {product.std_packing_pcs ? ` · std. packing ${product.std_packing_pcs} pcs` : ""}
          </p>
        )}

        {product.description && (
          <p className="max-w-prose text-sm leading-7 text-neutral-600">{product.description}</p>
        )}

        {variants.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-500">Color</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2">
                  <ColorSwatch
                    colorName={variant.color_name}
                    colorHex={variant.color_hex}
                    selected={selectedVariant?.id === variant.id}
                    onClick={() => setSelectedVariant(variant)}
                  />
                  <span className="text-xs text-neutral-600">{variant.color_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={handleAddToOrder}
            disabled={!selectedVariant?.in_stock}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              added
                ? "bg-green-600 text-white"
                : !selectedVariant?.in_stock
                  ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
            }`}
          >
            {added ? "Added to order" : !selectedVariant?.in_stock ? "Out of stock" : "Add to order"}
          </button>
          <Link
            href="/products"
            className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Back to catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
