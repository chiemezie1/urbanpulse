"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, Calendar, MapPin } from "lucide-react"
import { LocalNews } from "@/components/local-news"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import type { NewsArticle } from "@/lib/news"

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("New York")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([])
  const [userLocation, setUserLocation] = useState("")

  useEffect(() => {
    // Try to get user's location from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Convert coordinates to city name using reverse geocoding
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
            )
            const data = await response.json()
            if (data.city) {
              setLocation(data.city)
              setUserLocation(data.city)
            }
          } catch (error) {
            console.error("Error getting location name:", error)
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error)
        },
      )
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/news?location=${encodeURIComponent(searchQuery)}&pageSize=10`)
      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }
      const data = await response.json()
      setSearchResults(data.articles)
      setLocation(searchQuery)
    } catch (error) {
      console.error("Error searching news:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Local News</h1>
        <p className="text-muted-foreground">
          Stay informed about what's happening in {userLocation || "your city"} and beyond.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search news by location or topic..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>

      <Tabs defaultValue="local" className="space-y-4">
        <TabsList>
          <TabsTrigger value="local">Local News</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Headlines from {location}</CardTitle>
                  <CardDescription>Latest news and updates from your area</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocalNews location={location} />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Weather Impact</CardTitle>
                  <CardDescription>How weather affects local events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Upcoming Events</span>
                      </div>
                      <ul className="mt-2 space-y-2">
                        <li className="text-sm">
                          Farmers Market - Saturday, 9AM-2PM
                          <span className="ml-2 text-xs text-emerald-500">Weather looks good!</span>
                        </li>
                        <li className="text-sm">
                          Community Run - Sunday, 8AM
                          <span className="ml-2 text-xs text-amber-500">Possible light rain</span>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Traffic Alerts</span>
                      </div>
                      <ul className="mt-2 space-y-2">
                        <li className="text-sm">
                          Main Street - Construction delays
                          <span className="ml-2 text-xs text-red-500">Heavy congestion</span>
                        </li>
                        <li className="text-sm">
                          Highway 101 - Normal traffic flow
                          <span className="ml-2 text-xs text-emerald-500">No delays</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} results for "${location}"`
                  : "Search for news by location or topic"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  {searchQuery ? "No results found. Try a different search term." : "Enter a search term to find news."}
                </div>
              ) : (
                <div className="space-y-6">
                  {searchResults.map((article) => (
                    <div key={article.id} className="flex gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        {article.urlToImage ? (
                          <Image
                            src={article.urlToImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // If image fails to load, replace with placeholder
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg?height=96&width=96&text=News";
                            }}
                          />
                        ) : (
                          <Image
                            src="/placeholder.svg?height=96&width=96&text=News"
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {article.source.name} • {getTimeAgo(article.publishedAt)}
                          </p>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Read more <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Articles</CardTitle>
              <CardDescription>Articles you've saved for later reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                You haven't saved any articles yet. Click the bookmark icon on any article to save it for later.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
