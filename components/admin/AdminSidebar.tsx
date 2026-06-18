"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: "Orders",
      href: "/admin",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2M9 7h6M9 11h6M9 15h6"/>
        </svg>
      ),
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4M9 7v10M15 7v10"/>
        </svg>
      ),
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-56 bg-neutral-900 text-white p-4 border-r border-neutral-800">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                font-medium transition-colors ${
                isActive
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
