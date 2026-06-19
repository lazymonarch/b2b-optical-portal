import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/admin", label: "Orders" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin" className="font-semibold">
              Admin Dashboard
            </Link>
            <nav className="flex flex-wrap gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/products">View catalog</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
