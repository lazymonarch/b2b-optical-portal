"use client";

import { useRouter, useSearchParams } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/products";

  async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? data.user?.user_metadata?.role;
    const target = role === "admin" ? "/admin" : redirectTo;

    router.refresh();
    window.location.assign(target);
    return {};
  }

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}
