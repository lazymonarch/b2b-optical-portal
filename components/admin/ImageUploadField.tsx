"use client";

import imageCompression from "browser-image-compression";
import { ImageIcon, Upload } from "lucide-react";
import { useState } from "react";

import { uploadVariantImage } from "@/lib/storage";

type ImageUploadFieldProps = {
  productId: string;
  currentImageUrl: string | null;
  onUploaded: (url: string) => void;
};

export default function ImageUploadField({
  productId,
  currentImageUrl,
  onUploaded,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 800,
        maxSizeMB: 0.15,
        useWebWorker: true,
      });

      const imageUrl = await uploadVariantImage(compressed, productId);
      setPreview(imageUrl);
      onUploaded(imageUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-contain p-1" />
        ) : (
          <ImageIcon className="size-5 text-neutral-400" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
          <Upload className="size-3.5" aria-hidden="true" />
          {uploading ? "Uploading..." : "Choose image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="mt-1 text-[11px] text-neutral-400">Compressed before upload.</p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
