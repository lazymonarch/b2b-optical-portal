import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== "admin") return null
  return supabase
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()

    const { error } = await supabase.from("products").update(body).eq("id", id)

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A product with this model code already exists." },
          { status: 409 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    )
  }
}

// Soft delete only — hard delete would violate FK constraints from order_items
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const { id } = await params
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id)

    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    )
  }
}
