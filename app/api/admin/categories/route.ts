import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { name, slug } = await request.json()

    const { error } = await supabase.from("categories").insert({ name, slug })

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A category with this name already exists." },
          { status: 409 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true }, { status: 201 })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    )
  }
}
