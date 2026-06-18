import { createClient } from "@/lib/supabase/server"
import { getStoragePathFromUrl } from "@/lib/storage"

const BUCKET = "product-images"

export async function deleteStorageImage(imageUrl: string | null) {
  if (!imageUrl) return
  const path = getStoragePathFromUrl(imageUrl)
  if (!path) return

  const supabase = await createClient()
  await supabase.storage.from(BUCKET).remove([path])
}
