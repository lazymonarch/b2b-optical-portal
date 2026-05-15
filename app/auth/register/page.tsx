import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4">
      <div className="grid gap-6 rounded-lg border p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Register shop</h1>
          <p className="text-sm text-muted-foreground">
            This form will create a Supabase user and shop profile.
          </p>
        </div>
        <div className="grid gap-3">
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Shop name" />
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Owner name" />
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Phone" />
          <input className="h-10 rounded-md border px-3 text-sm" placeholder="Email" type="email" />
          <input
            className="h-10 rounded-md border px-3 text-sm"
            placeholder="Password"
            type="password"
          />
          <Button>Create account</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href="/auth/login" className="font-medium text-foreground underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
