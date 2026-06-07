import { NextResponse } from "next/server";

import { sendOrderNotifications } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const { orderId, shopName, itemCount } = (await req.json()) as {
      orderId?: string;
      shopName?: string;
      itemCount?: number;
    };

    if (!orderId || !shopName || typeof itemCount !== "number") {
      return NextResponse.json({ error: "Invalid notification payload." }, { status: 400 });
    }

    sendOrderNotifications({ shopName, orderId, itemCount }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification trigger error:", error);
    return NextResponse.json({ error: "Failed to trigger notifications" }, { status: 500 });
  }
}
