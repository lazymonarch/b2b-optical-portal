import { createClient } from "@/lib/supabase/server";
import { getStoragePathFromUrl } from "@/lib/storage";

const PRODUCT_IMAGES_BUCKET = "product-images";

export async function deleteStorageImage(imageUrl: string | null) {
  if (!imageUrl) return;

  const path = getStoragePathFromUrl(imageUrl);
  if (!path) return;

  const supabase = await createClient();
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
}
