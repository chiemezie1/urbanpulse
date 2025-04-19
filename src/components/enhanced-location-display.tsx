"use client"

import { useState, useEffect } from "react"
import { MapPin, Compass, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EnhancedLocationDisplayProps {
  className?: string
  showWeather?: boolean
}

export function EnhancedLocationDisplay({ className, showWeather = false }: EnhancedLocationDisplayProps) {
  const [location, setLocation] = useState<{
    city: string;
    region: string;
    country: string;
    latitude?: number;
    longitude?: number;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    icon: string;
  } | null>(null)

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser")
          setIsLoading(false)
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Convert coordinates to city name using reverse geocoding
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
              )
              const data = await response.json()
              
              setLocation({
                city: data.city || data.locality || "Unknown location",
                region: data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || "",
                country: data.countryName || "",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              })
              
              // Fetch weather if requested
              if (showWeather) {
                fetchWeather(position.coords.latitude, position.coords.longitude)
              }
            } catch (error) {
              console.error("Error getting location name:", error)
              setError("Unable to determine your location")
            } finally {
              setIsLoading(false)
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error)
            setError("Location access denied. Please enable location services.")
            setIsLoading(false)
          },
          { timeout: 10000, enableHighAccuracy: true }
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        setError("An error occurred while trying to get your location")
        setIsLoading(false)
      }
    }

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
        if (!response.ok) throw new Error("Weather fetch failed")
        
        const data = await response.json()
        setWeather({
          temp: data.current.temp,
          condition: data.current.condition,
          icon: data.current.icon
        })
      } catch (error) {
        console.error("Weather fetch error:", error)
      }
    }

    getUserLocation()
  }, [showWeather])

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    getUserLocation()
  }

  const getUserLocation = async () => {
    try {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser")
        setIsLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Convert coordinates to city name using reverse geocoding
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
            )
            const data = await response.json()
            
            setLocation({
              city: data.city || data.locality || "Unknown location",
              region: data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || "",
              country: data.countryName || "",
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            
            // Fetch weather if requested
            if (showWeather) {
              fetchWeather(position.coords.latitude, position.coords.longitude)
            }
          } catch (error) {
            console.error("Error getting location name:", error)
            setError("Unable to determine your location")
          } finally {
            setIsLoading(false)
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error)
          setError("Location access denied. Please enable location services.")
          setIsLoading(false)
        },
        { timeout: 10000, enableHighAccuracy: true }
      )
    } catch (error) {
      console.error("Geolocation error:", error)
      setError("An error occurred while trying to get your location")
      setIsLoading(false)
    }
  }

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      if (!response.ok) throw new Error("Weather fetch failed")
      
      const data = await response.json()
      setWeather({
        temp: data.current.temp,
        condition: data.current.condition,
        icon: data.current.icon
      })
    } catch (error) {
      console.error("Weather fetch error:", error)
    }
  }

  if (isLoading) {
    return (
      <Card className={`${className} border-dashed`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Detecting your location...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${className} border-dashed`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Compass className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!location) return null

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">Your Location</h3>
            <p className="text-sm text-muted-foreground">
              {location.city}
              {location.region ? `, ${location.region}` : ""}
              {location.country ? `, ${location.country}` : ""}
            </p>
          </div>
          {weather && (
            <div className="ml-auto flex items-center gap-2">
              {weather.icon ? (
                <Image 
                  src={weather.icon} 
                  alt={weather.condition} 
                  width={40} 
                  height={40}
                  className="h-10 w-10"
                />
              ) : (
                <Cloud className="h-8 w-8 text-blue-500" />
              )}
              <div className="text-right">
                <div className="text-lg font-medium">{weather.temp}°F</div>
                <div className="text-xs text-muted-foreground">{weather.condition}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
