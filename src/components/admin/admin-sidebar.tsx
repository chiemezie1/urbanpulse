"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  MapPin, 
  Users, 
  AlertTriangle, 
  Settings, 
  BarChart, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signOut } from "next-auth/react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Incident Verification",
      href: "/admin/incidents",
      icon: AlertTriangle,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-4 border-b">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">UrbanPulse</span>
          </div>

          <div className="flex-1 py-6 px-4">
            <p className="px-2 mb-4 text-xs font-semibold uppercase text-muted-foreground">
              Admin Controls
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-50 font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Spacer for fixed sidebar */}
      <div className="hidden md:block w-64 shrink-0" />
    </>
  )
}
