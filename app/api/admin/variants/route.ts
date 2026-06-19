import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type VariantPayload = {
  product_id?: string;
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

export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const body = (await request.json()) as VariantPayload;

    if (!body.product_id || !body.color_name?.trim()) {
      return NextResponse.json(
        { error: "Product and color name are required." },
        { status: 400 },
      );
    }

    const { data, error: insertError } = await supabase
      .from("product_variants")
      .insert({
        product_id: body.product_id,
        color_name: body.color_name.trim(),
        color_hex: body.color_hex || null,
        image_url: body.image_url || null,
        in_stock: body.in_stock ?? true,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({ variantId: data.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Admin variant create error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
