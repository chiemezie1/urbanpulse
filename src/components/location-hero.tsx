"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, MapPin, Navigation, Compass } from "lucide-react"

export function LocationHero() {
  const [location, setLocation] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState<string>("prompt")

  useEffect(() => {
    // Check if geolocation permission was previously granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state)
      })
    }

    const getUserLocation = async () => {
      try {
        if (!navigator.geolocation) {
          setIsLoading(false)
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Store coordinates
              setCoordinates({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              })

              // Convert coordinates to city name using reverse geocoding
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
              )
              const data = await response.json()
              
              if (data.city) {
                setLocation(data.city)
              } else if (data.locality) {
                setLocation(data.locality)
              } else if (data.principalSubdivision) {
                setLocation(data.principalSubdivision)
              } else {
                setLocation("your area")
              }
            } catch (error) {
              console.error("Error getting location name:", error)
              setLocation("your area")
            } finally {
              setIsLoading(false)
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error)
            setLocation("your area")
            setIsLoading(false)
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        setIsLoading(false)
      }
    }

    getUserLocation()
  }, [])

  const getMapUrl = () => {
    if (coordinates) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon - 0.02}%2C${coordinates.lat - 0.02}%2C${coordinates.lon + 0.02}%2C${coordinates.lat + 0.02}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lon}`
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=-74.026%2C40.6927%2C-73.986%2C40.7327&layer=mapnik`
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container px-4 md:px-6 py-20 md:py-32 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            {/* Location badge */}
            <div className="flex items-center">
              {isLoading ? (
                <Badge variant="outline" className="gap-1 py-1.5 text-base font-normal animate-pulse">
                  <Compass className="h-4 w-4" />
                  <span>Detecting your location...</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 py-1.5 text-base font-normal">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>
                    {locationPermission === "denied" 
                      ? "Location access denied" 
                      : location 
                        ? `Your location: ${location}` 
                        : "Location unavailable"}
                  </span>
                </Badge>
              )}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your City, <span className="text-emerald-500">Connected</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                UrbanPulse brings {location || "your city"} to life with real-time information, 
                community engagement, and local insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-1.5 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm">Real-time Incidents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">Weather Updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-sm">Community Feed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm">Local Services</span>
              </div>
            </div>
          </div>
          
          <div className="mx-auto lg:ml-auto flex items-center justify-center">
            <div className="relative w-full max-w-[550px] aspect-square rounded-xl overflow-hidden border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/0 z-10"></div>
              
              {/* Map iframe */}
              <iframe 
                src={getMapUrl()}
                className="w-full h-full border-0"
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
              
              {/* Location marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-white rounded-full border-2 border-emerald-600 animate-pulse"></div>
                </div>
              </div>
              
              {/* Location info */}
              {location && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{location}</div>
                      <div className="text-xs text-muted-foreground">
                        {coordinates ? `${coordinates.lat.toFixed(4)}, ${coordinates.lon.toFixed(4)}` : 'Coordinates unavailable'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
