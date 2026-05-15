import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="font-semibold">
            Admin Dashboard
          </Link>
          <Button asChild variant="outline">
            <Link href="/products">View catalog</Link>
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
