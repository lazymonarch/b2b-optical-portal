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
      .from("products")
      .insert({
        model_code: body.model_code,
        name: body.name,
        material: body.material,
        size_mm: body.size_mm,
        per_packet_pcs: body.per_packet_pcs,
        std_packing_pcs: body.std_packing_pcs,
        description: body.description,
        category_id: body.category_id,
        is_active: body.is_active ?? false,
      })
      .select("id")
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A product with this model code already exists." },
          { status: 409 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json({ id: data.id }, { status: 201 })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    )
  }
}
