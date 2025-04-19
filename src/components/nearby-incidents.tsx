"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function NearbyIncidents() {
  const [incidents, setIncidents] = useState<any[]>([])
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

  // Fetch incidents when user location is available
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setIsLoading(true)
        
        // Fetch incidents from API
        const response = await fetch("/api/incidents")
        const data = await response.json()
        
        // Sort by date (newest first) and take only the first 3
        const sortedIncidents = data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        
        setIncidents(sortedIncidents)
      } catch (error) {
        console.error("Error fetching incidents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncidents()
  }, [userLocation])

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
      default:
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

  if (incidents.length === 0) {
    return (
      <div className="text-center py-6">
        <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No recent incidents reported in your area</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {incidents.map((incident) => (
        <div key={incident.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${getSeverityColor(incident.severity)}`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium">{incident.title}</p>
            <p className="text-sm text-muted-foreground">{incident.location}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
