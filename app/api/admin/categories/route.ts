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

export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await requireAdmin();
    if (error) return error;

    const body = (await request.json()) as CategoryPayload;

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const { data, error: insertError } = await supabase
      .from("categories")
      .insert({
        name: body.name.trim(),
        slug: body.slug?.trim() || slugify(body.name),
        description: body.description?.trim() || null,
      })
      .select("id")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "A category with this slug already exists." },
          { status: 409 },
        );
      }

      throw new Error(insertError.message);
    }

    return NextResponse.json({ categoryId: data.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Admin category create error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
