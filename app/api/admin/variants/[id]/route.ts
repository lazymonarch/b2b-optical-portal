import { NextRequest, NextResponse } from "next/server";

import { deleteStorageImage } from "@/lib/storage-server";
import { createClient } from "@/lib/supabase/server";

type VariantPayload = {
  color_name?: string;
  color_hex?: string | null;
  image_url?: string | null;
  in_stock?: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    return { supabase, error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  return { supabase, error: null };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const body = (await request.json()) as VariantPayload;

    if (body.color_name !== undefined && !body.color_name.trim()) {
      return NextResponse.json({ error: "Color name is required." }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("product_variants")
      .select("image_url")
      .eq("id", id)
      .single();

    const { error: updateError } = await supabase
      .from("product_variants")
      .update({
        ...(body.color_name !== undefined ? { color_name: body.color_name.trim() } : {}),
        ...(body.color_hex !== undefined ? { color_hex: body.color_hex || null } : {}),
        ...(body.image_url !== undefined ? { image_url: body.image_url || null } : {}),
        ...(body.in_stock !== undefined ? { in_stock: body.in_stock } : {}),
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (
      body.image_url !== undefined &&
      existing?.image_url &&
      existing.image_url !== body.image_url
    ) {
      await deleteStorageImage(existing.image_url);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Admin variant update error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const { error: updateError } = await supabase
      .from("product_variants")
      .update({ in_stock: false })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Admin variant soft-delete error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
