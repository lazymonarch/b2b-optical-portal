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

export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const body = (await request.json()) as ProductPayload;

    if (!body.name?.trim() || !body.model_code?.trim()) {
      return NextResponse.json(
        { error: "Product name and model code are required." },
        { status: 400 },
      );
    }

    const { data, error: insertError } = await supabase
      .from("products")
      .insert({
        category_id: body.category_id || null,
        model_code: body.model_code.trim(),
        name: body.name.trim(),
        material: body.material?.trim() || null,
        size_mm: body.size_mm?.trim() || null,
        per_packet_pcs: body.per_packet_pcs ?? null,
        std_packing_pcs: body.std_packing_pcs ?? null,
        description: body.description?.trim() || null,
        is_active: body.is_active ?? false,
      })
      .select("id")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "A product with this model code already exists." },
          { status: 409 },
        );
      }

      throw new Error(insertError.message);
    }

    return NextResponse.json({ productId: data.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Admin product create error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
