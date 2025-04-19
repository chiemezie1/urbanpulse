"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

interface LocationDisplayProps {
  className?: string
  showIcon?: boolean
}

export function LocationDisplay({ className, showIcon = true }: LocationDisplayProps) {
  const [location, setLocation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        if (!navigator.geolocation) {
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
              if (data.city) {
                setLocation(data.city)
              } else if (data.locality) {
                setLocation(data.locality)
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
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        setIsLoading(false)
      }
    }

    getUserLocation()
  }, [])

  if (isLoading) {
    return (
      <div className={`flex items-center text-sm text-muted-foreground animate-pulse ${className || ""}`}>
        {showIcon && <MapPin className="mr-1 h-4 w-4" />}
        <span>Detecting location...</span>
      </div>
    )
  }

  if (!location) return null

  return (
    <div className={`flex items-center text-sm ${className || ""}`}>
      {showIcon && <MapPin className="mr-1 h-4 w-4 text-emerald-500" />}
      <span>{location}</span>
    </div>
  )
}
