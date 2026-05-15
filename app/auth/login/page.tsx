import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <div className="grid gap-6 rounded-lg border p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Shop login</h1>
          <p className="text-sm text-muted-foreground">
            Supabase auth fields will be wired into this form next.
          </p>
        </div>
        <div className="grid gap-3">
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Email" type="email" />
          <input
            className="h-10 rounded-md border px-3 text-sm"
            placeholder="Password"
            type="password"
          />
          <Button>Login</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          New shop?{" "}
          <Link href="/auth/register" className="font-medium text-foreground underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
