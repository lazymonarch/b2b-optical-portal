"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ShopProfile = {
  id: string;
  shop_name: string;
  owner_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
};

type ShopProfileFormProps = {
  shop: ShopProfile;
};

export default function ShopProfileForm({ shop }: ShopProfileFormProps) {
  const [form, setForm] = useState({
    shop_name: shop.shop_name,
    owner_name: shop.owner_name ?? "",
    phone: shop.phone ?? "",
    address: shop.address ?? "",
    city: shop.city ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function updateForm(patch: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (!form.shop_name.trim()) {
        throw new Error("Shop name is required.");
      }

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("shops")
        .update({
          shop_name: form.shop_name.trim(),
          owner_name: form.owner_name.trim() || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          city: form.city.trim() || null,
        })
        .eq("id", shop.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessage("Profile updated.");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-sm font-medium text-neutral-900">Shop details</h2>
        <p className="text-xs text-neutral-500">
          These details are used for orders and delivery communication.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Shop name</label>
          <input
            value={form.shop_name}
            onChange={(event) => updateForm({ shop_name: event.target.value })}
            required
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Owner name</label>
          <input
            value={form.owner_name}
            onChange={(event) => updateForm({ owner_name: event.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateForm({ phone: event.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-neutral-500">City</label>
          <input
            value={form.city}
            onChange={(event) => updateForm({ city: event.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs text-neutral-500">Delivery address</label>
          <textarea
            value={form.address}
            onChange={(event) => updateForm({ address: event.target.value })}
            rows={4}
            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          <Save className="size-4" aria-hidden="true" />
          {loading ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}
