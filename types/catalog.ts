export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Product = {
  id: string;
  category_id: string | null;
  model_code: string;
  name: string;
  material: string | null;
  size_mm: string | null;
  per_packet_pcs: number | null;
  std_packing_pcs: number | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string | null;
  image_url: string | null;
  in_stock: boolean;
};

export type ProductWithVariants = Product & {
  category?: Category | null;
  variants: ProductVariant[];
};
