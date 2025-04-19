"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Bell, Menu, Sun, Moon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardNav } from "@/components/dashboard-nav"
import { useSession, signOut } from "next-auth/react"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex items-center gap-2 pb-4 pt-2">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">UrbanPulse</span>
          </div>
          <DashboardNav />
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="flex items-center gap-2 md:mr-4">
        <MapPin className="h-6 w-6 text-emerald-500" />
        <span className="text-xl font-bold hidden md:inline-block">UrbanPulse</span>
      </Link>
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {mounted && theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image || "/placeholder.svg?height=40&width=40"}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{session?.user?.name || "Guest User"}</p>
                <p className="text-sm text-muted-foreground">{session?.user?.email || "guest@example.com"}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
