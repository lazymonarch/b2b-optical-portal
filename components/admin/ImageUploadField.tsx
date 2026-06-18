"use client"

import { useState } from "react"
import imageCompression from "browser-image-compression"
import { uploadVariantImage } from "@/lib/storage"

interface ImageUploadFieldProps {
  productId: string
  currentImageUrl: string | null
  onUploaded: (url: string) => void
}

export default function ImageUploadField({
  productId,
  currentImageUrl,
  onUploaded,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setPreview(URL.createObjectURL(file))

    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 800,
        maxSizeMB: 0.15,
        useWebWorker: true,
      })

      const url = await uploadVariantImage(compressed, productId)
      onUploaded(url)
      setPreview(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.")
      setPreview(currentImageUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg bg-neutral-100 border border-neutral-200
        overflow-hidden flex items-center justify-center flex-shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="w-full h-full object-contain" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#a3a3a3" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-700 cursor-pointer
          border border-neutral-200 rounded-lg px-3 py-1.5 inline-block
          hover:bg-neutral-50 transition-colors">
          {uploading ? "Uploading..." : "Choose image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  )
}
