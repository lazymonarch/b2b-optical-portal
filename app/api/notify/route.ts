import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Notifications will be connected after the order flow is implemented.",
    },
    { status: 501 },
  );
}
