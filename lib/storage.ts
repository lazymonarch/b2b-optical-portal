import { createClient as createBrowserClient } from "@/lib/supabase/client"

const BUCKET = "product-images"

export function getStoragePathFromUrl(url: string): string | null {
  const marker = `/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

export async function uploadVariantImage(
  file: File,
  productId: string
): Promise<string> {
  const supabase = createBrowserClient()
  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${productId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
