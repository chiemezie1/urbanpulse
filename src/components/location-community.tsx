"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Users, MapPin, Plus, Settings, UserPlus, Shield, Loader2, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Community {
  id: string
  name: string
  description: string
  locationId: string
  locationName: string
  memberCount: number
  isAdmin: boolean
  isMember: boolean
  createdAt: string
  distance?: number
}

interface LocationCommunityProps {
  initialLocation?: {
    name: string,
    address: string,
    city?: string,
    state?: string,
    country?: string,
    lat?: number,
    lng?: number
  } | null
}

export function LocationCommunity({ initialLocation }: LocationCommunityProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [communities, setCommunities] = useState<Community[]>([])
  const [userCommunity, setUserCommunity] = useState<Community | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [joiningCommunityId, setJoiningCommunityId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{
    id: string
    name: string
    lat: number
    lng: number
    city?: string
    state?: string
    country?: string
    address?: string
  } | null>(null)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: ""
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])

  // Function to get user's current location
  const getUserCurrentLocation = async () => {
    setIsLocationLoading(true)
    setLocationError(null)

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
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=d50176a2ddc242388395c31e6ae2c566`
        )

        if (response.ok) {
          const data = await response.json()
          const properties = data.features[0]?.properties

          if (properties) {
            const city = properties.city || properties.county || properties.locality || 'Unknown'
            const state = properties.state || properties.region || ''
            const country = properties.country || 'Unknown'
            const formattedAddress = properties.formatted || 'Unknown location'

            // Create a unique location ID based on the location details
            const locationId = `loc_${city.replace(/\W/g, '')}_${Date.now()}`

            // Create a readable location name
            const locationName = [city, state, country].filter(Boolean).join(', ')

            setUserLocation({
              id: locationId,
              name: locationName,
              lat: latitude,
              lng: longitude,
              city,
              state,
              country,
              address: formattedAddress
            })

            // We'll fetch communities in the useEffect hook
            return
          }
        }
      }

      // If browser geolocation fails, try IP-based geolocation as fallback
      const geoResponse = await fetch('https://ipapi.co/json/')
      if (geoResponse.ok) {
        const geoData = await geoResponse.json()
        const { latitude, longitude, city, region, country_name } = geoData

        // Create a unique location ID based on the location details
        const locationId = `loc_${city.replace(/\W/g, '')}_${Date.now()}`

        // Create a readable location name
        const locationName = [city, region, country_name].filter(Boolean).join(', ')

        setUserLocation({
          id: locationId,
          name: locationName,
          lat: latitude,
          lng: longitude,
          city,
          state: region,
          country: country_name,
          address: locationName
        })

        // We'll fetch communities in the useEffect hook
      } else {
        throw new Error('Failed to get location')
      }
    } catch (error) {
      console.error('Error getting location details:', error)
      setLocationError('Could not determine your current location')
      toast({
        title: 'Location Error',
        description: 'Could not determine your current location',
        variant: 'destructive'
      })
    } finally {
      setIsLocationLoading(false)
    }
  }

  // Function to fetch communities based on location
  const fetchCommunities = async (locationId: string, city: string, _state: string, country: string) => {
    setIsLoading(true)
    try {
      // Make sure we have location data
      if (!userLocation || !userLocation.lat || !userLocation.lng) {
        console.warn('Location data not available yet, cannot fetch communities')
        return
      }

      // First try the nearby endpoint
      try {
        const nearbyResponse = await fetch(`/api/communities/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`)

        if (nearbyResponse.ok) {
          const nearbyData = await nearbyResponse.json()
          console.log('Found nearby communities:', nearbyData.length)

          // Process the nearby communities
          processCommunityData(nearbyData, locationId)
          return
        }
      } catch (nearbyError) {
        console.warn('Nearby communities endpoint failed, falling back to regular endpoint')
      }

      // Fallback to regular communities endpoint with location parameters
      try {
        const response = await fetch(`/api/communities?locationId=${locationId}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`)

        if (response.ok) {
          const data = await response.json()
          console.log('Found communities by location params:', data.length)

          // Process the community data
          processCommunityData(data, locationId)
          return
        }
      } catch (locationError) {
        console.warn('Location-based query failed, falling back to all communities')
      }

      // Final fallback - just get all communities
      const fallbackResponse = await fetch('/api/communities')

      if (fallbackResponse.ok) {
        const allData = await fallbackResponse.json()
        console.log('Fetched all communities as fallback:', allData.length)

        // Process all communities
        processCommunityData(allData, locationId)
      } else {
        throw new Error('Failed to fetch any communities')
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
      toast({
        title: 'Error',
        description: 'Failed to load communities',
        variant: 'destructive'
      })

      // Fallback to empty arrays if all API calls fail
      setCommunities([])
      setFilteredCommunities([])
      setUserCommunity(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to process community data
  const processCommunityData = (data: Community[], locationId: string) => {
    // Set the user's community if one exists for their location
    const userLocationCommunity = data.find((c: Community) =>
      // Match by locationId or by similar location name
      c.locationId === locationId ||
      (userLocation && c.locationName && (
        c.locationName.includes(userLocation.city || '') ||
        (userLocation.city && c.locationName.includes(userLocation.city))
      ))
    )

    if (userLocationCommunity) {
      setUserCommunity(userLocationCommunity)
    } else {
      setUserCommunity(null)
    }

    // Set all communities
    setCommunities(data)
    setFilteredCommunities(data)
  }

  // Initialize with the provided location or get user's current location
  useEffect(() => {
    if (initialLocation && !userLocation) {
      // Convert the initialLocation to our internal format
      const locationId = `loc_${initialLocation.city?.replace(/\W/g, '') || 'unknown'}_${Date.now()}`

      setUserLocation({
        id: locationId,
        name: initialLocation.name,
        lat: initialLocation.lat || 0,
        lng: initialLocation.lng || 0,
        city: initialLocation.city,
        state: initialLocation.state,
        country: initialLocation.country,
        address: initialLocation.address
      })

      // Communities will be fetched by the userLocation useEffect
    } else if (!userLocation && !isLocationLoading) {
      // If no initialLocation provided, get user's current location
      getUserCurrentLocation()
    }
  }, [initialLocation])

  // Fetch communities whenever userLocation changes
  useEffect(() => {
    if (userLocation && userLocation.city && userLocation.country) {
      console.log('Location changed, fetching communities for:', userLocation.name)
      fetchCommunities(
        userLocation.id,
        userLocation.city,
        userLocation.state || '',
        userLocation.country
      )
    }
  }, [userLocation])

  // Filter communities when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCommunities(communities)
    } else {
      const filtered = communities.filter(
        community =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.locationName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCommunities(filtered)
    }
  }, [communities, searchQuery])

  // Auto-fill community name and description when user location is available
  useEffect(() => {
    if (userLocation && userLocation.city) {
      // Only auto-fill if the fields are empty
      if (!newCommunity.name.trim()) {
        setNewCommunity(prev => ({
          ...prev,
          name: `${userLocation.city} Community`
        }))
      }

      if (!newCommunity.description.trim()) {
        setNewCommunity(prev => ({
          ...prev,
          description: `A community for people in ${userLocation.name}`
        }))
      }
    }
  }, [userLocation])

  // We're using real location data from the user's browser

  const handleCreateCommunity = async () => {
    try {
      // Auto-populate name and description if empty
      let communityName = newCommunity.name.trim()
      let communityDescription = newCommunity.description.trim()

      if (!communityName) {
        communityName = `${userLocation?.city || 'Local'} Community`
        // Update the state so the user can see the auto-filled value
        setNewCommunity(prev => ({ ...prev, name: communityName }))
      }

      if (!communityDescription) {
        communityDescription = `A community for people in ${userLocation?.name || 'this area'}`
        // Update the state so the user can see the auto-filled value
        setNewCommunity(prev => ({ ...prev, description: communityDescription }))
      }

      if (!userLocation) {
        toast({
          title: "Location Required",
          description: "You need to set your location before creating a community",
          variant: "destructive"
        })
        return
      }

      // Set loading state
      setIsLoading(true)

      // Make an API call to create the community with the current location
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: communityName,
          description: communityDescription,
          locationId: userLocation.id,
          locationName: userLocation.name,
          coordinates: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
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
        throw new Error(errorData.error || 'Failed to create community')
      }

      const newCommunityData = await response.json()

      // Update local state with the new community
      setCommunities([newCommunityData, ...communities])
      setUserCommunity(newCommunityData)
      setShowCreateDialog(false)
      setNewCommunity({ name: "", description: "" })

      toast({
        title: "Success",
        description: "Community created successfully"
      })

      // Navigate to the new community page using client-side navigation
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
      setIsLoading(false)
    }
  }

  const handleJoinCommunity = async (communityId: string) => {
    try {
      // Set loading state for this specific community
      setJoiningCommunityId(communityId)

      // Make an API call to join the community
      const response = await fetch(`/api/communities/${communityId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to join community")
      }

      // Get the updated community data
      const joinedCommunity = await response.json()

      // Update the communities list
      const updatedCommunities = communities.map(community => {
        if (community.id === communityId) {
          return {
            ...community,
            isMember: true,
            memberCount: community.memberCount + 1
          }
        }
        return community
      })

      setCommunities(updatedCommunities)

      // If this is the user's location community, update that too
      if (joinedCommunity && userLocation && joinedCommunity.locationId === userLocation.id) {
        setUserCommunity(joinedCommunity)
      }

      toast({
        title: "Success",
        description: "You've joined the community"
      })

      // Navigate to the community page using client-side navigation
      router.replace(`/dashboard/community?id=${communityId}`)
      // Force a reload of the page to ensure the community details are loaded
      window.location.href = `/dashboard/community?id=${communityId}`
    } catch (error) {
      console.error("Error joining community:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join community",
        variant: "destructive"
      })
    } finally {
      // Clear loading state
      setJoiningCommunityId(null)
    }
  }

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      // Set loading state for this specific community
      setJoiningCommunityId(communityId) // Reuse the same state for leaving

      // Make an API call to leave the community
      const response = await fetch(`/api/communities/${communityId}/members`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to leave community")
      }

      // Update the communities list
      const updatedCommunities = communities.map(community => {
        if (community.id === communityId) {
          return {
            ...community,
            isMember: false,
            memberCount: Math.max(0, community.memberCount - 1)
          }
        }
        return community
      })

      setCommunities(updatedCommunities)

      // If this was the user's location community, update that too
      if (userCommunity && userCommunity.id === communityId) {
        setUserCommunity(null)
      }

      toast({
        title: "Success",
        description: "You've left the community"
      })

      // If we're on the community page, navigate back to the main community page
      if (window.location.href.includes(`id=${communityId}`)) {
        // Use client-side navigation
        router.push('/dashboard/community')
      }
    } catch (error) {
      console.error("Error leaving community:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to leave community",
        variant: "destructive"
      })
    } finally {
      // Clear loading state
      setJoiningCommunityId(null)
    }
  }

  // We'll use granular loading states instead of a full-page loading indicator

  return (
    <div className="space-y-6">
      {/* Loading indicator when location is being loaded */}
      {isLocationLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        </div>
      )}

      {/* User's Location Community */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Your Location Community
            </div>
            {userLocation && !isLocationLoading && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={getUserCurrentLocation}
                disabled={isLocationLoading}
                title="Refresh your location"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            {isLocationLoading ? "Detecting your current location..." :
             userLocation ? (
               <span>
                 Based on your current location: <span className="font-medium text-primary">{userLocation.name}</span>
               </span>
             ) : "Set your location to find your community"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLocationLoading ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Detecting your location...</p>
              <p className="text-xs text-muted-foreground">Please allow location access if prompted</p>
            </div>
          ) : locationError ? (
            <div className="text-center py-6">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-2">{locationError}</p>
              <Button onClick={getUserCurrentLocation} className="mb-2">
                Try Again
              </Button>
              <p className="text-xs text-muted-foreground">Make sure location services are enabled in your browser</p>
            </div>
          ) : !userLocation ? (
            <div className="text-center py-6">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">Could not detect your current location</p>
              <Button onClick={getUserCurrentLocation}>
                Refresh Location
              </Button>
            </div>
          ) : userCommunity ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{userCommunity.name}</h3>
                  <p className="text-sm text-muted-foreground">{userCommunity.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{userCommunity.locationName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{userCommunity.memberCount} members</Badge>
                  {userCommunity.isAdmin && (
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    // Use router.replace for client-side navigation without page reload
                    router.replace(`/dashboard/community?id=${userCommunity.id}`)
                    // Force a reload of the page to ensure the community details are loaded
                    window.location.href = `/dashboard/community?id=${userCommunity.id}`
                  }}>
                    View
                  </Button>
                  {userCommunity.isAdmin ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Use router.push for client-side navigation without page reload
                        router.push(`/dashboard/community/manage?id=${userCommunity.id}`)
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={joiningCommunityId === userCommunity.id}
                        >
                          {joiningCommunityId === userCommunity.id ? (
                            <>
                              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              Leaving...
                            </>
                          ) : "Leave"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave Community</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to leave this community? You can rejoin at any time.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleLeaveCommunity(userCommunity.id)}>
                            Leave
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Users className="h-12 w-12 mx-auto text-primary/80 mb-2" />
              <h3 className="text-lg font-medium mb-2">No community exists for {userLocation?.city || 'your location'} yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to create a community for your area and become its admin</p>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" className="px-6" onClick={() => {
                    // Auto-fill with current location data
                    if (userLocation) {
                      setNewCommunity({
                        name: `${userLocation.city || 'Local'} Community`,
                        description: `A community for people in ${userLocation.name || 'this area'}`
                      })
                    }
                  }}>
                    <Plus className="h-5 w-5 mr-2" />
                    Create {userLocation?.city || 'Your'} Community
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleCreateCommunity()
                  }}>
                    <DialogHeader>
                      <DialogTitle>Create Community for {userLocation?.city || userLocation?.name || 'Your Area'}</DialogTitle>
                      <DialogDescription>
                        Create a new community for your current location: <span className="font-medium">{userLocation?.name}</span>
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
                      <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isLoading}>Cancel</Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
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
          )}
        </CardContent>
      </Card>

      {/* Search and Browse Communities */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Communities</CardTitle>
          <CardDescription>Discover and join communities in other locations</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading communities...</p>
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No communities found</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              filteredCommunities.map((community) => (
                <div key={community.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">{community.name}</h3>
                    <p className="text-sm text-muted-foreground">{community.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{community.locationName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{community.memberCount} members</span>
                      </div>
                      {community.distance !== undefined && (
                        <Badge variant="outline" className="text-xs font-normal">
                          {community.distance < 1 ? 'Less than 1 km' : `${Math.round(community.distance)} km away`}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    {community.isMember ? (
                      <Button variant="outline" size="sm" onClick={() => {
                        // Use router.replace for client-side navigation without page reload
                        router.replace(`/dashboard/community?id=${community.id}`)
                        // Force a reload of the page to ensure the community details are loaded
                        window.location.href = `/dashboard/community?id=${community.id}`
                      }}>
                        View
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleJoinCommunity(community.id)}
                        disabled={joiningCommunityId === community.id}
                      >
                        {joiningCommunityId === community.id ? (
                          <>
                            <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Joining...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Join
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
