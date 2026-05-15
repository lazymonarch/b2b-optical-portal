import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/shop/order");
  }

  return <>{children}</>;
}
