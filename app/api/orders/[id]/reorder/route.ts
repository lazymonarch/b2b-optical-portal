import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ReorderItem = {
  quantity: number;
  products:
    | {
        id: string;
        name: string;
        model_code: string;
        is_active: boolean;
      }
    | null;
  product_variants:
    | {
        id: string;
        color_name: string;
        color_hex: string | null;
        image_url: string | null;
        in_stock: boolean;
      }
    | null;
};

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id, shops!inner(user_id)")
      .eq("id", id)
      .single();

    const orderOwner = order as unknown as { shops: { user_id: string } } | null;

    if (!orderOwner || orderOwner.shops.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { data: items, error } = await supabase
      .from("order_items")
      .select(
        `
        quantity,
        products ( id, name, model_code, is_active ),
        product_variants ( id, color_name, color_hex, image_url, in_stock )
      `,
      )
      .eq("order_id", id);

    if (error) {
      throw new Error(error.message);
    }

    const available = [];
    const unavailable = [];

    for (const item of (items ?? []) as unknown as ReorderItem[]) {
      const product = item.products;
      const variant = item.product_variants;

      if (product && variant && product.is_active && variant.in_stock) {
        available.push({
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          modelCode: product.model_code,
          colorName: variant.color_name,
          colorHex: variant.color_hex,
          imageUrl: variant.image_url,
          quantity: item.quantity,
        });
      } else {
        const productName = product?.name ?? "Unknown product";
        const colorName = variant?.color_name ?? "Unknown color";
        const reason = !product?.is_active
          ? "discontinued"
          : !variant?.in_stock
            ? "out of stock"
            : "unavailable";

        unavailable.push(`${productName} (${colorName}) - ${reason}`);
      }
    }

    return NextResponse.json({ available, unavailable });
  } catch (err: unknown) {
    console.error("Reorder API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
