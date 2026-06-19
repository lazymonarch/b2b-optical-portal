import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type CategoryPayload = {
  name?: string;
  slug?: string;
  description?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    return { supabase, error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  return { supabase, error: null };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const body = (await request.json()) as CategoryPayload;

    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.slug !== undefined
          ? { slug: body.slug.trim() || slugify(body.name ?? "") }
          : {}),
        ...(body.description !== undefined
          ? { description: body.description?.trim() || null }
          : {}),
      })
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "A category with this slug already exists." },
          { status: 409 },
        );
      }

      throw new Error(updateError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Admin category update error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
