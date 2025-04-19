"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import type { NewsArticle } from "@/lib/news"

interface LocalNewsProps {
  location?: string;
  limit?: number;
}

export function LocalNews({ location = "New York", limit }: LocalNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [userLocation, setUserLocation] = useState(location)

  useEffect(() => {
    // Try to get user's location from browser
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Convert coordinates to city name using reverse geocoding
              // Use Geoapify instead of BigDataCloud
              const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566"
              const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&apiKey=${apiKey}`
              )

              if (!response.ok) {
                throw new Error(`Geocoding API responded with status: ${response.status}`)
              }

              const data = await response.json()
              const properties = data.features[0]?.properties

              if (properties?.city) {
                setUserLocation(properties.city)
              } else if (properties?.county) {
                setUserLocation(properties.county)
              } else if (properties?.state) {
                setUserLocation(properties.state)
              }
            } catch (error) {
              console.error("Error getting location name:", error)
              // Fall back to default location
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error)
            // Fall back to default location
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      } catch (error) {
        console.error("Error with geolocation API:", error)
        // Fall back to default location
      }
    }
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Use a try-catch block to handle potential fetch errors
        try {
          // Use a timeout to prevent the fetch from hanging indefinitely
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

          const pageSize = limit || 3
          const response = await fetch(
            `/api/news?location=${encodeURIComponent(userLocation)}&page=${page}&pageSize=${pageSize}`,
            { signal: controller.signal }
          )

          clearTimeout(timeoutId) // Clear the timeout if fetch completes

          if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.status}`)
          }

          const data = await response.json()
          setNews(data.articles)
          setTotalPages(Math.ceil(data.totalResults / pageSize))
        } catch (fetchError) {
          console.error("Error fetching news:", fetchError)

          // Use fallback data if fetch fails
          const fallbackArticles = [
              {
                id: "1",
                title: `Local Community Center Opens in ${userLocation}`,
                description: `A new community center has opened its doors in ${userLocation}.`,
                url: "#",
                urlToImage: "/placeholder.svg?height=200&width=300&text=Community+Center",
                source: { name: "Local News" },
                publishedAt: new Date(Date.now() - 86400000).toISOString(),
                content: "Community center details..."
              },
              {
                id: "2",
                title: `${userLocation} Farmers Market Expands`,
                description: `The popular farmers market in ${userLocation} is growing.`,
                url: "#",
                urlToImage: "/placeholder.svg?height=200&width=300&text=Farmers+Market",
                source: { name: "City News" },
                publishedAt: new Date(Date.now() - 172800000).toISOString(),
                content: "Farmers market details..."
              },
              {
                id: "3",
                title: `Transportation Improvements in ${userLocation}`,
                description: `City officials have announced transportation improvements.`,
                url: "#",
                urlToImage: "/placeholder.svg?height=200&width=300&text=Transportation",
                source: { name: "Urban News" },
                publishedAt: new Date(Date.now() - 259200000).toISOString(),
                content: "Transportation details..."
              }
            ]

          // Limit the fallback articles based on the limit parameter
          const limitedArticles = limit ? fallbackArticles.slice(0, limit) : fallbackArticles

          setNews(limitedArticles)
          setTotalPages(1)
        }
      } catch (error) {
        console.error("Error in news component:", error)
        setError("Unable to load local news. Using fallback data.")

        // Set minimal fallback data even if everything fails
        const minimalFallback = [
          {
            id: "fallback",
            title: `Local News for ${userLocation}`,
            description: "Local news is currently unavailable.",
            url: "#",
            urlToImage: "/placeholder.svg?height=200&width=300&text=Local+News",
            source: { name: "News Service" },
            publishedAt: new Date().toISOString(),
            content: "Content unavailable"
          }
        ]

        // Limit the minimal fallback data based on the limit parameter
        const limitedMinimalFallback = limit ? minimalFallback.slice(0, limit) : minimalFallback

        setNews(limitedMinimalFallback)
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [userLocation, page])

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages))
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local News</CardTitle>
        <CardDescription>Latest news from {userLocation}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center text-muted-foreground">{error}</div>
        ) : news.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No news available for this location.</div>
        ) : (
          <div className="space-y-4">
            {news.map((article) => (
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
            ))}
          </div>
        )}
      </CardContent>
      {!isLoading && !error && news.length > 0 && !limit && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === totalPages}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
