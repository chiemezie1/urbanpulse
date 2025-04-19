"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Layers, AlertTriangle, Coffee, Hospital, ShoppingBag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import L from "leaflet"

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })

interface MapMarker {
  id: string
  type: string
  title: string
  description?: string
  location: string
  latitude: number
  longitude: number
  severity?: string
}

export function CityMap() {
  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    restaurants: true,
    hospitals: true,
    shops: true,
  })
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [userLocationName, setUserLocationName] = useState<string>("")

  // Get user's location
  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported')
      return
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          console.log(`Got user location: (${latitude}, ${longitude})`)
          setUserLocation({ lat: latitude, lng: longitude })

          // Get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = await response.json()
            const locationName = data.city || data.locality || "your area"
            setUserLocationName(locationName)
            console.log(`Location resolved to: ${locationName}`)
          } catch (error) {
            console.error("Error getting location name:", error)
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    } catch (error) {
      console.error("Geolocation error:", error)
    }
  }

  useEffect(() => {
    // Import Leaflet CSS
    import("leaflet/dist/leaflet.css")

    // Set map as ready after a short delay to ensure CSS is loaded
    const timer = setTimeout(() => {
      setMapReady(true)
      // Get user location once map is ready
      getUserLocation()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        setIsLoading(true)

        // Use user location if available, otherwise default to NYC
        const lat = userLocation?.lat || 40.7128;
        const lng = userLocation?.lng || -74.006;

        // Fetch incidents
        const incidentsRes = await fetch("/api/incidents")
        const incidentsData = await incidentsRes.json()

        // Fetch services with user location
        const servicesRes = await fetch(`/api/services?latitude=${lat}&longitude=${lng}&radius=5000`)
        const servicesData = await servicesRes.json()

        // Combine and format data
        const incidentMarkers = (incidentsData || []).map((incident: any) => ({
          id: incident.id || `incident-${Math.random()}`,
          type: incident.type || "other",
          title: incident.title || "Unnamed Incident",
          description: incident.description || "",
          location: incident.location || "Unknown Location",
          latitude: incident.latitude || 40.7128, // Default to NYC if no coords
          longitude: incident.longitude || -74.006,
          severity: incident.severity || "medium",
        }))

        const serviceMarkers = (servicesData || []).map((service: any) => ({
          id: service.id || `service-${Math.random()}`,
          type: service.type || "other",
          title: service.name || "Unnamed Service",
          description: service.description || "",
          location: service.address || "Unknown Location",
          latitude: service.latitude || 40.7128,
          longitude: service.longitude || -74.006,
        }))

        setMarkers([...incidentMarkers, ...serviceMarkers])
      } catch (error) {
        console.error("Error fetching map data:", error)
        // Set default markers on error
        setMarkers([
          {
            id: "default-1",
            type: "info",
            title: "Default Location",
            description: "A default marker when data cannot be loaded",
            location: "New York City",
            latitude: 40.7128,
            longitude: -74.006,
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    if (mapReady) {
      fetchMarkers()
    }
  }, [mapReady, userLocation])

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  const getMarkerIcon = (type: string, severity?: string) => {
    // In a real implementation, we would return custom Leaflet icons
    // For this example, we'll just return a class name for styling
    switch (type) {
      case "traffic":
      case "construction":
      case "alert":
        return severity === "high" ? "text-red-500" : severity === "medium" ? "text-amber-500" : "text-blue-500"
      case "restaurant":
        return "text-amber-500"
      case "hospital":
        return "text-blue-500"
      case "shopping":
        return "text-emerald-500"
      default:
        return "text-gray-500"
    }
  }

  const getMarkerComponent = (type: string) => {
    switch (type) {
      case "traffic":
        return <AlertTriangle className="h-4 w-4" />
      case "construction":
        return <AlertTriangle className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "restaurant":
        return <Coffee className="h-4 w-4" />
      case "hospital":
        return <Hospital className="h-4 w-4" />
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const shouldShowMarker = (type: string) => {
    if (type === "traffic" || type === "construction" || type === "alert" || type === "info") {
      return activeLayers.incidents
    }
    if (type === "restaurant") {
      return activeLayers.restaurants
    }
    if (type === "hospital") {
      return activeLayers.hospitals
    }
    if (type === "shopping") {
      return activeLayers.shops
    }
    return true
  }

  if (!mapReady) {
    return (
      <div className="relative h-[400px] w-full overflow-hidden rounded-b-lg bg-muted">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-b-lg">
      {typeof window !== "undefined" && (
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [40.7128, -74.006]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!isLoading &&
            markers.map(
              (marker) =>
                shouldShowMarker(marker.type) && (
                  <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    // In a real implementation, we would use custom icons here
                  >
                    <Popup>
                      <div className="p-1">
                        <h3 className="font-medium">{marker.title}</h3>
                        <p className="text-sm text-muted-foreground">{marker.location}</p>
                        {marker.description && <p className="text-sm mt-1">{marker.description}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ),
            )}

          {/* Add user location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-medium">Your Location</h3>
                  <p className="text-sm text-muted-foreground">{userLocationName || 'Current Position'}</p>
                </div>
              </Popup>
            </Marker>
          )}

          <ZoomControl position="bottomleft" />
        </MapContainer>
      )}

      <div className="absolute right-4 top-4 z-[1000]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-1 bg-background/80 backdrop-blur-sm">
              <Layers className="h-4 w-4" />
              Layers
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem checked={activeLayers.incidents} onCheckedChange={() => toggleLayer("incidents")}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
              Incidents
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeLayers.restaurants}
              onCheckedChange={() => toggleLayer("restaurants")}
            >
              <Coffee className="mr-2 h-4 w-4 text-amber-500" />
              Restaurants
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={activeLayers.hospitals} onCheckedChange={() => toggleLayer("hospitals")}>
              <Hospital className="mr-2 h-4 w-4 text-blue-500" />
              Hospitals
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={activeLayers.shops} onCheckedChange={() => toggleLayer("shops")}>
              <ShoppingBag className="mr-2 h-4 w-4 text-emerald-500" />
              Shops
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
