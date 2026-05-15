import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Order creation will be connected to Supabase in the next implementation step.",
    },
    { status: 501 },
  );
}
