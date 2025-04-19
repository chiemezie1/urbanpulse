import Link from "next/link"
import Image from "next/image"
import { LocationDisplay } from "@/components/location-display"

export function SiteFooter() {
  return (
    <footer className="border-t py-12 md:py-16 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/images/logo_no_text.jpeg" alt="UrbanPulse Logo" width={32} height={32} className="rounded-sm" />
              <span className="text-xl font-bold">UrbanPulse</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting communities through location-based intelligence. Stay informed about what matters in your city.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Interactive City Map
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Incident Reporting
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Weather & Air Quality
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Community Feed
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-medium">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-muted pt-8 mt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UrbanPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <LocationDisplay className="text-sm text-muted-foreground" />
            <div className="h-4 w-px bg-muted-foreground/20"></div>
            <Link href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
              Change Location
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
