"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertTriangle,
  Users,
  Cloud,
  TrendingUp,
  BarChart3,
  Activity,
  MapPin,
  RefreshCw,
  ArrowRight,
  Bell,
  MessageSquare,
  Newspaper
} from "lucide-react"
import { useSession } from "next-auth/react"
import { CityMap } from "@/components/city-map"
import { RecentIncidents } from "@/components/recent-incidents"
import { WeatherWidget } from "@/components/weather-widget"
import { CommunityFeed } from "@/components/community-feed"
import { LocalNews } from "@/components/local-news"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    incidents: { count: 0, change: 0 },
    members: { count: 0, change: 0 },
    aqi: { value: "Loading...", improved: true },
    engagement: { rate: 0, change: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    lat: 0,
    lng: 0
  })
  const [isLocationLoading, setIsLocationLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  // Get user's current location
  useEffect(() => {
    const getUserCurrentLocation = async () => {
      setIsLocationLoading(true)
      try {
        // Try to get location from browser
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords

            // Reverse geocode to get address
            try {
              const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=d50176a2ddc242388395c31e6ae2c566`
              )

              if (response.ok) {
                const data = await response.json()
                const result = data.features[0].properties

                const city = result.city || result.county || ""
                const state = result.state || ""
                const country = result.country || ""
                const formattedAddress = result.formatted || ""
                const locationName = [city, state, country].filter(Boolean).join(", ")

                setUserLocation({
                  name: locationName,
                  address: formattedAddress,
                  city,
                  state,
                  country,
                  lat: latitude,
                  lng: longitude
                })
              }
            } catch (error) {
              console.error("Error getting location details:", error)
              setUserLocation({
                name: "Unknown Location",
                address: "Unknown Address",
                city: "",
                state: "",
                country: "",
                lat: latitude,
                lng: longitude
              })
            }
          }, (error) => {
            console.error("Geolocation error:", error)
            setUserLocation({
              name: "New York, USA", // Default fallback
              address: "New York, NY, USA",
              city: "New York",
              state: "NY",
              country: "USA",
              lat: 40.7128,
              lng: -74.0060
            })
          })
        } else {
          // Geolocation not supported
          setUserLocation({
            name: "New York, USA", // Default fallback
            address: "New York, NY, USA",
            city: "New York",
            state: "NY",
            country: "USA",
            lat: 40.7128,
            lng: -74.0060
          })
        }
      } catch (error) {
        console.error("Error getting user location:", error)
        setUserLocation({
          name: "New York, USA", // Default fallback
          address: "New York, NY, USA",
          city: "New York",
          state: "NY",
          country: "USA",
          lat: 40.7128,
          lng: -74.0060
        })
      } finally {
        setIsLocationLoading(false)
      }
    }

    getUserCurrentLocation()
  }, [])

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with a timeout
        setTimeout(() => {
          setStats({
            incidents: { count: 12, change: 2 },
            members: { count: 2854, change: 34 },
            aqi: { value: "Good (42)", improved: true },
            engagement: { rate: 24.5, change: 5.2 },
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with dummy data
        setNotifications([
          { id: 1, type: 'incident', title: 'New incident reported near you', time: '10 min ago' },
          { id: 2, type: 'weather', title: 'Weather alert: Heavy rain expected', time: '1 hour ago' },
          { id: 3, type: 'community', title: 'New post in your community', time: '3 hours ago' }
        ])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header with location */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            {isLocationLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{userLocation.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.location.reload()}
                  title="Refresh your location"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || "Guest"}! Here's what's happening in your area today.
        </p>
      </div>

      {/* Main content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-10 animate-pulse rounded bg-muted"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.incidents.count}</div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">
                        {stats.incidents.change > 0 ? "+" : ""}
                        {stats.incidents.change} from yesterday
                      </p>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs"
                        onClick={() => router.push('/dashboard/incidents')}
                      >
                        View all
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Members</CardTitle>
                <Users className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-10 animate-pulse rounded bg-muted"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.members.count.toLocaleString()}</div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">+{stats.members.change} new members this week</p>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs"
                        onClick={() => router.push('/dashboard/community')}
                      >
                        Join
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Air Quality Index</CardTitle>
                <Cloud className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-10 animate-pulse rounded bg-muted"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.aqi.value}</div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">
                        {stats.aqi.improved ? "Improved" : "Declined"} from yesterday
                      </p>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs"
                        onClick={() => router.push('/dashboard/weather')}
                      >
                        Details
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-10 animate-pulse rounded bg-muted"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.engagement.rate}%</div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">+{stats.engagement.change}% from last month</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Updates from your area</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Bell className="h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {notification.type === 'incident' && <AlertTriangle className="h-4 w-4" />}
                      {notification.type === 'weather' && <Cloud className="h-4 w-4" />}
                      {notification.type === 'community' && <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map and Incidents */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>City Map</CardTitle>
                  <CardDescription>Interactive map showing incidents and points of interest</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push('/dashboard/map')}
                >
                  Full Map
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <CityMap />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Incidents</CardTitle>
                  <CardDescription>Latest reported incidents in your area</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push('/dashboard/incidents')}
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <RecentIncidents />
              </CardContent>
            </Card>
          </div>

          {/* Weather and Community Feed */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Weather</CardTitle>
                  <CardDescription>Current conditions and forecast</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push('/dashboard/weather')}
                >
                  Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <WeatherWidget />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Community Feed</CardTitle>
                  <CardDescription>Recent updates from your community</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push('/dashboard/community')}
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Limit to 3 posts */}
                <CommunityFeed limit={3} />
              </CardContent>
            </Card>
          </div>

          {/* Local News */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Local News</CardTitle>
                <CardDescription>Latest news from {userLocation.name || 'your area'}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => router.push('/dashboard/news')}
              >
                More News
                <Newspaper className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <LocalNews limit={3} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>View detailed statistics about your city and community engagement</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-16 w-16" />
                <p>Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports about your city</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Activity className="h-16 w-16" />
                <p>Reports dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
