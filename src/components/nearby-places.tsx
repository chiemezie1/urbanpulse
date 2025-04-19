"use client"

import { useState, useEffect } from "react"
import { Coffee, ShoppingBag, Utensils, Building } from "lucide-react"

export function NearbyPlaces() {
  const [places, setPlaces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error("Error getting geolocation:", error)
        }
      )
    }

    getUserLocation()
  }, [])

  // Fetch places when user location is available
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true)
        
        if (!userLocation) {
          return
        }
        
        // Use Geoapify Places API to get nearby places
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566"
        const categories = "catering.restaurant,catering.cafe,commercial.shopping_mall,commercial.supermarket"
        const radius = 5000 // 5km
        const limit = 3
        
        const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${userLocation.lng},${userLocation.lat},${radius}&limit=${limit}&apiKey=${apiKey}`
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.features && data.features.length > 0) {
          const formattedPlaces = data.features.map((feature: any) => {
            const props = feature.properties
            return {
              id: props.place_id,
              name: props.name || "Unnamed Place",
              address: props.formatted || props.street || "No address",
              category: props.categories?.[0] || "commercial",
              openingHours: props.opening_hours || "Unknown hours"
            }
          })
          
          setPlaces(formattedPlaces)
        }
      } catch (error) {
        console.error("Error fetching places:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userLocation) {
      fetchPlaces()
    }
  }, [userLocation])

  // Get icon based on category
  const getPlaceIcon = (category: string) => {
    if (category.includes("restaurant") || category.includes("food")) {
      return <Utensils className="h-4 w-4" />
    } else if (category.includes("cafe") || category.includes("coffee")) {
      return <Coffee className="h-4 w-4" />
    } else if (category.includes("shopping") || category.includes("supermarket")) {
      return <ShoppingBag className="h-4 w-4" />
    } else {
      return <Building className="h-4 w-4" />
    }
  }

  // Get color based on category
  const getPlaceColor = (category: string) => {
    if (category.includes("restaurant") || category.includes("food")) {
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
    } else if (category.includes("cafe") || category.includes("coffee")) {
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
    } else if (category.includes("shopping") || category.includes("supermarket")) {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
    } else {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-6">
        <Coffee className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No popular places found nearby</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {places.map((place) => (
        <div key={place.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${getPlaceColor(place.category)}`}>
            {getPlaceIcon(place.category)}
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium">{place.name}</p>
            <p className="text-sm text-muted-foreground">{place.address}</p>
            <p className="text-xs text-muted-foreground">{place.openingHours}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
