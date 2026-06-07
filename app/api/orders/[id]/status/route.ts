import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const validStatuses = ["pending", "confirmed", "dispatched", "delivered"] as const;

type OrderStatus = (typeof validStatuses)[number];

function isOrderStatus(status: string): status is OrderStatus {
  return validStatuses.includes(status as OrderStatus);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status } = (await request.json()) as { status?: string };

    if (!status || !isOrderStatus(status)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Order status update error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
