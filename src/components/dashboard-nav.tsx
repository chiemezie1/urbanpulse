"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MapPin, Home, Map, AlertTriangle, Cloud, Search, Users, Settings, HelpCircle, Newspaper, Shield } from "lucide-react"
import { useSession } from "next-auth/react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "City Map",
    href: "/dashboard/map",
    icon: <Map className="h-5 w-5" />,
  },
  {
    title: "Incidents",
    href: "/dashboard/incidents",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "Weather",
    href: "/dashboard/weather",
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Local News",
    href: "/dashboard/news",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span>Navigation</span>
          </Link>
        </div>
        <div className="flex-1 py-2">
          <div className="grid gap-1">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", pathname === item.href && "bg-muted")}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>

          {session?.user?.role === "ADMIN" && (
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Admin</h3>
              <Button
                variant="ghost"
                className="justify-start gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/20 w-full"
                asChild
              >
                <Link href="/admin">
                  <Shield className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
