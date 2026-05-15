import ProductCard from "@/components/products/ProductCard";

export interface CatalogProduct {
  id: string;
  name: string;
  model_code: string;
  material: string | null;
  size_mm: string | null;
  per_packet_pcs: number | null;
  categories: { id: string; name: string; slug: string } | null;
  product_variants: {
    id: string;
    color_name: string;
    color_hex: string | null;
    image_url: string | null;
    in_stock: boolean;
  }[];
}

interface ProductGridProps {
  products: CatalogProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
