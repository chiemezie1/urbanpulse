import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  MapPin,
  Bell,
  Users,
  Cloud,
  Search,
  Shield,
  AlertTriangle,
  Info,
  Zap,
  Building,
  Compass,
  Smartphone,
  CheckCircle2,
  Clock,
  MessageSquare,
  Map,
  BarChart,
  ExternalLink,
  ChevronRight,
  Menu
} from "lucide-react"
import { FeatureCard } from "@/components/feature-card"
import { LocationDisplay } from "@/components/location-display"
import { WeatherTip } from "@/components/weather-tip"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main>
        {/* WHY - Our Purpose and Belief */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <div className="grid grid-cols-6 h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-r border-emerald-500/10"></div>
              ))}
            </div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                  <LocationDisplay showIcon={false} />
                  <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                  <span>Your Connected City Hub</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    We Believe in <span className="text-emerald-500">Connected Communities</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    UrbanPulse exists because we believe everyone deserves to feel connected to their city and empowered by local knowledge. Our purpose is to strengthen communities through shared awareness.
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5 shadow-lg shadow-emerald-500/20">
                      Join Our Mission
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/demo">
                    <Button size="lg" variant="outline" className="border-emerald-200 dark:border-emerald-800">
                      See How It Works
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span>Building stronger communities</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Empowering through knowledge</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>Connecting people to place</span>
                  </div>
                </div>
              </div>

              <div className="mx-auto lg:ml-auto flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/0 z-10"></div>
                  <Image
                    src="/placeholder.svg?height=500&width=500&text=Connected+Community"
                    alt="Connected Community"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    priority
                  />

                  {/* Location indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative">
                      <div className="h-6 w-6 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="absolute inset-0 h-6 w-6 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                    </div>
                  </div>

                  {/* UI overlay elements */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-20 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-medium">Your Location</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-medium">Connected community members</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        Join Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW - Our Guiding Principles */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/30 dark:to-blue-950/30 border-y border-emerald-100 dark:border-emerald-900/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/20 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-4">Our Approach</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">How We <span className="text-emerald-500">Create Connection</span></h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Our approach is guided by three core principles that shape everything we do.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/20 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <MapPin className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Location-First Design</h3>
                <p className="text-muted-foreground">
                  We believe your physical location is the most relevant context for information. Everything in UrbanPulse starts with where you are right now.
                </p>
                <div className="mt-4 pt-4 border-t border-muted w-full">
                  <LocationDisplay className="text-sm font-medium mx-auto justify-center" showIcon={true} />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/20 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in the power of shared knowledge. Our platform enables citizens to contribute and verify information, creating a trusted network of local intelligence.
                </p>
                <div className="mt-4 pt-4 border-t border-muted w-full flex justify-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                        {i}
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-medium border-2 border-background">+</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/20 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <Bell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Actionable Intelligence</h3>
                <p className="text-muted-foreground">
                  We believe information should lead to action. Every alert, update, and insight is designed to help you make better decisions about your daily life in your city.
                </p>
                <div className="mt-4 pt-4 border-t border-muted w-full">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>2 incidents near your location</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT - Our Products and Services */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/20 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">What We Provide</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">The <span className="text-emerald-500">Tools</span> That Make It Possible</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our suite of integrated features work together to create a comprehensive platform for urban connection and awareness.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<MapPin className="h-10 w-10 text-emerald-500" />}
                title="Interactive City Map"
                description="A dynamic, layered map that visualizes incidents, services, and community activity around your current location."
              />
              <FeatureCard
                icon={<Bell className="h-10 w-10 text-emerald-500" />}
                title="Incident Reporting System"
                description="Tools for reporting, verifying, and tracking local incidents with real-time updates and community verification."
              />
              <FeatureCard
                icon={<Cloud className="h-10 w-10 text-emerald-500" />}
                title="Hyperlocal Weather Platform"
                description="Precision weather and air quality data for your exact location, with customizable alerts and forecasts."
              />
              <FeatureCard
                icon={<Search className="h-10 w-10 text-emerald-500" />}
                title="Local Services Directory"
                description="A comprehensive database of services near you, with community ratings, operating hours, and contact information."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-emerald-500" />}
                title="Community Engagement Platform"
                description="Tools for connecting with neighbors, organizing events, and building stronger local relationships."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-emerald-500" />}
                title="Smart Notification System"
                description="Intelligent alerts that deliver only the information that matters to you, based on your location and preferences."
              />
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/20 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">Use Cases</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How UrbanPulse Helps You</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how UrbanPulse can improve your daily life with location-based information and community connections.
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden border-emerald-100 dark:border-emerald-800/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Avoid Traffic Incidents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300&text=Traffic+Incident"
                      alt="Traffic incident map"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground">Get real-time alerts about accidents, road closures, and construction near your location, helping you avoid delays and plan better routes.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/demo" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Try this feature
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden border-emerald-100 dark:border-emerald-800/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-500" />
                    <span>Weather-Aware Planning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300&text=Weather+Forecast"
                      alt="Weather forecast"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground">Make informed decisions based on hyperlocal weather forecasts and air quality data specific to your exact location.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/demo" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Try this feature
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden border-emerald-100 dark:border-emerald-800/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <span>Community Engagement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300&text=Community+Discussion"
                      alt="Community discussion"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground">Connect with neighbors, discuss local issues, and organize community events based on your shared location and interests.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/demo" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Try this feature
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/20 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple. Powerful. Connected.</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Unlike traditional social media, UrbanPulse is location-focused and designed specifically for urban
                  communities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-50">
                      1
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Create Your Account</h3>
                      <p className="text-muted-foreground">
                        Sign up with your email or social accounts to join your city&apos;s community.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-50">
                      2
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Explore Your City</h3>
                      <p className="text-muted-foreground">
                        Use the interactive map to discover what&apos;s happening around you in real-time.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-50">
                      3
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Connect & Contribute</h3>
                      <p className="text-muted-foreground">
                        Report incidents, share updates, and engage with your local community.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mx-auto flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/0 z-10"></div>
                  <Image
                    src="/placeholder.svg?height=300&width=500&text=UrbanPulse+Interface"
                    alt="UrbanPulse Interface"
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Connect with Your City?</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of residents already using UrbanPulse to stay connected and informed.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5 shadow-lg shadow-emerald-500/20">
                    Sign Up Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/demo">
                  <Button size="lg" variant="outline" className="border-emerald-200 dark:border-emerald-800">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
