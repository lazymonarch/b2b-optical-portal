import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("product_variants")
      .insert({
        product_id: body.product_id,
        color_name: body.color_name,
        color_hex: body.color_hex,
        image_url: body.image_url,
        in_stock: body.in_stock ?? true,
      })
      .select("id")
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ id: data.id }, { status: 201 })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    )
  }
}
