"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, X, Shield, LogOut } from "lucide-react"
import { LocationDisplay } from "@/components/location-display"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">UrbanPulse</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Features
          </Link>
          <Link href="/#use-cases" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Use Cases
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            About Us
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LocationDisplay />
          </div>
          
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback>
                      {session.user.name
                        ? `${session.user.name.charAt(0)}${session.user.name.split(" ")[1]?.charAt(0) || ""}`
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                {session?.user?.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/admin" className="w-full flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-emerald-500" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                  <div className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
          
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#use-cases"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
            <div className="pt-2">
              <LocationDisplay />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
