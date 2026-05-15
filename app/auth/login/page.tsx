"use client";

import { useRouter, useSearchParams } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/products";

  async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    router.push(redirectTo);
    router.refresh();
    return {};
  }

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}
