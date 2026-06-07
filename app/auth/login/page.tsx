import { Suspense } from "react";
import { redirect } from "next/navigation";

import LoginClient from "@/app/auth/login/login-client";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = user.user_metadata?.role;
    redirect(role === "admin" ? "/admin" : redirectTo || "/products");
  }

  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
