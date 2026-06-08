import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type OrderRequestItem = {
  productId: string;
  variantId: string;
  quantity: number;
  itemNote: string;
  productName?: string;
  colorName?: string;
};

type OrderRequestBody = {
  shopId?: string;
  shopName?: string;
  phone?: string | null;
  address?: string;
  notes?: string;
  itemCount?: number;
  items?: OrderRequestItem[];
};

function getAppUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderRequestBody;
    const { shopId, shopName, phone, address, notes, itemCount, items } = body;

    if (!shopId || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("id", shopId)
      .eq("user_id", user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: "Shop not found." }, { status: 403 });
    }

    if (address) {
      await supabase.from("shops").update({ address }).eq("id", shopId);
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        shop_id: shopId,
        status: "pending",
        notes: notes ?? "",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message ?? "Failed to create order.");
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      item_note: item.itemNote,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    fetch(`${getAppUrl(request)}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        shopName,
        phone,
        itemCount: itemCount ?? items.reduce((sum, item) => sum + item.quantity, 0),
        items,
      }),
    }).catch(console.error);

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 },
    );
  }
}
