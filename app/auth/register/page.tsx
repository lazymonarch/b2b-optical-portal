"use client";

import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const shopName = formData.get("shop_name") as string;
    const ownerName = formData.get("owner_name") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) return { error: signUpError.message };
    if (!data.user) return { error: "Something went wrong. Please try again." };

    const { error: shopError } = await supabase.from("shops").insert({
      user_id: data.user.id,
      shop_name: shopName,
      owner_name: ownerName,
      phone,
      city,
    });

    if (shopError) return { error: shopError.message };

    router.push("/products");
    router.refresh();
    return {};
  }

  return <AuthForm mode="register" onSubmit={handleRegister} />;
}
