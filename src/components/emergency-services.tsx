"use client"

import { useState, useEffect } from "react"
import { Hospital, Shield, Flame } from "lucide-react"

export function EmergencyServices() {
  const [services, setServices] = useState<any[]>([])
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

  // Fetch emergency services when user location is available
  useEffect(() => {
    const fetchEmergencyServices = async () => {
      try {
        setIsLoading(true)
        
        if (!userLocation) {
          return
        }
        
        // Use Geoapify Places API to get nearby emergency services
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566"
        const categories = "healthcare.hospital,healthcare.clinic,service.police,service.fire_station"
        const radius = 10000 // 10km (wider radius for emergency services)
        const limit = 3
        
        const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${userLocation.lng},${userLocation.lat},${radius}&limit=${limit}&apiKey=${apiKey}`
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.features && data.features.length > 0) {
          const formattedServices = data.features.map((feature: any) => {
            const props = feature.properties
            return {
              id: props.place_id,
              name: props.name || "Emergency Service",
              address: props.formatted || props.street || "No address",
              category: props.categories?.[0] || "healthcare",
              openingHours: props.categories?.[0]?.includes("hospital") ? "Open 24/7" : (props.opening_hours || "Unknown hours")
            }
          })
          
          setServices(formattedServices)
        }
      } catch (error) {
        console.error("Error fetching emergency services:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userLocation) {
      fetchEmergencyServices()
    }
  }, [userLocation])

  // Get icon based on category
  const getServiceIcon = (category: string) => {
    if (category.includes("hospital") || category.includes("clinic") || category.includes("healthcare")) {
      return <Hospital className="h-4 w-4" />
    } else if (category.includes("police")) {
      return <Shield className="h-4 w-4" />
    } else if (category.includes("fire")) {
      return <Flame className="h-4 w-4" />
    } else {
      return <Hospital className="h-4 w-4" />
    }
  }

  // Get color based on category
  const getServiceColor = (category: string) => {
    if (category.includes("hospital") || category.includes("clinic") || category.includes("healthcare")) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    } else if (category.includes("police")) {
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
    } else if (category.includes("fire")) {
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
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

  if (services.length === 0) {
    return (
      <div className="text-center py-6">
        <Hospital className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No emergency services found nearby</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {services.map((service) => (
        <div key={service.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${getServiceColor(service.category)}`}>
            {getServiceIcon(service.category)}
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-muted-foreground">{service.address}</p>
            <p className="text-xs text-muted-foreground">{service.openingHours}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
