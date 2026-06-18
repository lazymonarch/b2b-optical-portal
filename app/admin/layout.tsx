import Link from "next/link"
import { Button } from "@/components/ui/button"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4">
          <Link href="/admin" className="font-semibold">
            Admin Dashboard
          </Link>
          <Button asChild variant="outline">
            <Link href="/products">View catalog</Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 max-w-6xl w-full px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
