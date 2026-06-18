import { createClient } from "@/lib/supabase/server"
import { deleteStorageImage } from "@/lib/storage-server"
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

    let oldImageUrl: string | null = null
    if (body.image_url !== undefined) {
      const { data: existing } = await supabase
        .from("product_variants")
        .select("image_url")
        .eq("id", id)
        .single()
      oldImageUrl = existing?.image_url ?? null
    }

    const { error } = await supabase.from("product_variants").update(body).eq("id", id)
    if (error) throw new Error(error.message)

    // Clean up only after the new value is confirmed saved, and only if it changed
    if (oldImageUrl && oldImageUrl !== body.image_url) {
      await deleteStorageImage(oldImageUrl)
    }

    return NextResponse.json({ success: true })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    )
  }
}

// Soft delete only — sets in_stock false, never removes the row
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdmin()
  if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const { id } = await params
    const { error } = await supabase
      .from("product_variants")
      .update({ in_stock: false })
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
