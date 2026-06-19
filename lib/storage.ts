import { createClient } from "@/lib/supabase/client";

const PRODUCT_IMAGES_BUCKET = "product-images";

export function getStoragePathFromUrl(url: string): string | null {
  const marker = `/${PRODUCT_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(url.slice(index + marker.length));
}

export async function uploadVariantImage(file: File, productId: string): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
