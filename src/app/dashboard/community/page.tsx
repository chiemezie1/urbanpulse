"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LocationCommunity } from "@/components/location-community"
import { CommunityDetails } from "@/components/community-details"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, MapPin, RefreshCw, Plus, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CommunityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [communityId, setCommunityId] = useState<string | null>(null)
  const [communities, setCommunities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{name: string, address: string, city?: string, state?: string, country?: string, lat?: number, lng?: number} | null>(null)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: ""
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  // Check if a specific community ID was provided in the URL and get user's location
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { searchParams } = new URL(window.location.href)
      const id = searchParams.get('id')
      if (id) {
        setCommunityId(id)
      }

      // Get user's current location
      getUserCurrentLocation()
    }
  }, [])

  // Fetch communities when location is loaded
  useEffect(() => {
    if (userLocation) {
      fetchCommunities()
    }
  }, [userLocation])

  // Function to get user's current location
  const getUserCurrentLocation = async () => {
    setIsLocationLoading(true)
    console.log('Getting user location...')
    try {
      // First try to get location from the browser
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          })
        })

        const { latitude, longitude } = position.coords

        // Reverse geocode to get address
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566"
        const geocodeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`

        const response = await fetch(geocodeUrl)

        if (response.ok) {
          const data = await response.json()
          const properties = data.features[0]?.properties

          if (properties) {
            const city = properties.city || properties.county || properties.locality || 'Unknown'
            const state = properties.state || properties.region || ''
            const country = properties.country || 'Unknown'
            const formattedAddress = properties.formatted || 'Unknown location'

            // Create a readable location name
            const locationName = [city, state, country].filter(Boolean).join(', ')

            const location = {
              name: locationName,
              address: formattedAddress,
              city,
              state,
              country,
              lat: latitude,
              lng: longitude
            }
            console.log('Setting user location:', location)
            setUserLocation(location)

            // Auto-fill community name and description
            setNewCommunity({
              name: `${city} Community`,
              description: `A community for people in ${locationName}`
            })
          }
        }
      }
    } catch (error) {
      console.error('Error getting location details:', error)
    } finally {
      setIsLocationLoading(false)
    }
  }

  const fetchCommunities = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching communities...', userLocation ? `for location: ${userLocation.name}` : 'no location set')
      const response = await fetch('/api/communities')

      if (response.ok) {
        const data = await response.json()
        console.log('Communities fetched:', data)
        setCommunities(data)
      } else {
        console.error('Failed to fetch communities:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error details:', errorText)
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle community creation
  const handleCreateCommunity = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
        toast({
          title: "Validation Error",
          description: "Please provide both a name and description",
          variant: "destructive"
        })
        return
      }

      if (!userLocation) {
        toast({
          title: "Location Required",
          description: "We need your current location to create a community",
          variant: "destructive"
        })
        return
      }

      setIsCreating(true)

      // Create a temporary location ID if we can't create one in the database
      let locationId = `loc_${userLocation.city?.replace(/\W/g, '')}_${Date.now()}`

      try {
        // Try to create a location in the database
        const locationResponse = await fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: userLocation.city || 'Unknown',
            state: userLocation.state || '',
            country: userLocation.country || 'Unknown',
            latitude: userLocation.lat || 0,
            longitude: userLocation.lng || 0
          })
        })

        if (locationResponse.ok) {
          const locationData = await locationResponse.json()
          if (locationData.id) {
            locationId = locationData.id
          }
        }
      } catch (error) {
        console.error("Error creating location, using temporary ID:", error)
        // Continue with the temporary ID
      }

      // Now create the community with the location ID
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCommunity.name,
          description: newCommunity.description,
          locationId: locationId,
          locationName: userLocation.name,
          coordinates: {
            latitude: userLocation.lat || 0,
            longitude: userLocation.lng || 0
          },
          locationData: {
            city: userLocation.city || '',
            state: userLocation.state || '',
            country: userLocation.country || ''
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create community")
      }

      const newCommunityData = await response.json()

      // Update communities list
      setCommunities([newCommunityData, ...communities])

      // Close dialog
      setShowCreateDialog(false)

      // Show success message
      toast({
        title: "Success",
        description: "Community created successfully! You are now the admin."
      })

      // Navigate to the new community
      router.replace(`/dashboard/community?id=${newCommunityData.id}`)
      // Force a reload of the page to ensure the community details are loaded
      window.location.href = `/dashboard/community?id=${newCommunityData.id}`
    } catch (error) {
      console.error("Error creating community:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create community",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              {communityId
                ? "Connect with members of this community and share updates"
                : "Find and join communities based on your current location"}
            </p>
            {!communityId && userLocation && (
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="flex items-center gap-1 py-1.5 px-3">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{userLocation.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 p-0"
                    onClick={getUserCurrentLocation}
                    disabled={isLocationLoading}
                    title="Refresh location"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}
          </div>
          {communityId && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset the communityId state first to ensure proper rendering
                  setCommunityId(null)
                  // Use client-side navigation with replace to avoid history issues
                  router.replace("/dashboard/community")
                  // Force a refresh of the communities
                  fetchCommunities()
                }}
              >
                Back to Communities
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLocationLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading communities...</p>
          </div>
        </div>
      ) : !communities.length ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-primary/80 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Communities Found</h2>
          <p className="text-muted-foreground mb-6">Be the first to create a community for your area!</p>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" onClick={() => {
                // Auto-fill with current location data
                if (userLocation) {
                  setNewCommunity({
                    name: `${userLocation.city || 'Local'} Community`,
                    description: `A community for people in ${userLocation.name || 'this area'}`
                  })
                }
              }}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your Community
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateCommunity}>
                <DialogHeader>
                  <DialogTitle>Create Community for {userLocation?.name || 'Your Area'}</DialogTitle>
                  <DialogDescription>
                    Create a new community for your current location. You'll automatically become the admin.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Community Name</label>
                    <Input
                      id="name"
                      placeholder={`${userLocation?.city || ''} Community`}
                      value={newCommunity.name}
                      onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      placeholder={`A community for people in ${userLocation?.name || 'your area'}`}
                      value={newCommunity.description}
                      onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Location</p>
                      <p className="text-sm text-muted-foreground">{userLocation?.name}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Create & Become Admin
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : !communityId ? (
        <LocationCommunity initialLocation={userLocation} />
      ) : (
        <CommunityDetails communityId={communityId} />
      )}
    </div>
  )
}
