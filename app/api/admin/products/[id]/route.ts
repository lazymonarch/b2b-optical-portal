import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ProductPayload = {
  category_id?: string | null;
  model_code?: string;
  name?: string;
  material?: string | null;
  size_mm?: string | null;
  per_packet_pcs?: number | null;
  std_packing_pcs?: number | null;
  description?: string | null;
  is_active?: boolean;
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

    const body = (await request.json()) as ProductPayload;

    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    if (body.model_code !== undefined && !body.model_code.trim()) {
      return NextResponse.json({ error: "Model code is required." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        ...(body.category_id !== undefined ? { category_id: body.category_id || null } : {}),
        ...(body.model_code !== undefined ? { model_code: body.model_code.trim() } : {}),
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.material !== undefined ? { material: body.material?.trim() || null } : {}),
        ...(body.size_mm !== undefined ? { size_mm: body.size_mm?.trim() || null } : {}),
        ...(body.per_packet_pcs !== undefined ? { per_packet_pcs: body.per_packet_pcs } : {}),
        ...(body.std_packing_pcs !== undefined
          ? { std_packing_pcs: body.std_packing_pcs }
          : {}),
        ...(body.description !== undefined
          ? { description: body.description?.trim() || null }
          : {}),
        ...(body.is_active !== undefined ? { is_active: body.is_active } : {}),
      })
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "A product with this model code already exists." },
          { status: 409 },
        );
      }

      throw new Error(updateError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Admin product update error:", err);
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
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Admin product soft-delete error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
