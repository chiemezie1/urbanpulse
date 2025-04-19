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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Users, MapPin, Plus, Settings, UserPlus, Shield, Trash2, ArrowLeft, Edit, UserMinus, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface CommunityMember {
  id: string
  userId: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string
    image: string
    email: string
  }
}

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
  members?: CommunityMember[]
}

export function CommunityManagement({ communityId }: { communityId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [community, setCommunity] = useState<Community | null>(null)
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editedCommunity, setEditedCommunity] = useState({
    name: "",
    description: ""
  })
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [memberFilter, setMemberFilter] = useState("all")
  const [processingMemberId, setProcessingMemberId] = useState<string | null>(null)
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

  useEffect(() => {
    fetchCommunityDetails()
    getUserCurrentLocation()
  }, [communityId])

  // Function to get user's current location
  const getUserCurrentLocation = async () => {
    setIsLocationLoading(true)

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
          }
        }
      }
    } catch (error) {
      console.error('Error getting location details:', error)
    } finally {
      setIsLocationLoading(false)
    }
  }

  const fetchCommunityDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/communities/${communityId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch community details")
      }

      const data = await response.json()
      setCommunity(data)
      setMembers(data.members || [])
      setEditedCommunity({
        name: data.name,
        description: data.description
      })
    } catch (error) {
      console.error("Error fetching community details:", error)
      toast({
        title: "Error",
        description: "Failed to load community details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCommunity = async () => {
    try {
      setIsUpdating(true)

      const response = await fetch(`/api/communities/${communityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editedCommunity)
      })

      if (!response.ok) {
        throw new Error("Failed to update community")
      }

      const updatedCommunity = await response.json()
      setCommunity(updatedCommunity)
      setShowEditDialog(false)

      toast({
        title: "Success",
        description: "Community updated successfully"
      })
    } catch (error) {
      console.error("Error updating community:", error)
      toast({
        title: "Error",
        description: "Failed to update community",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCommunity = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/communities/${communityId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete community")
      }

      toast({
        title: "Success",
        description: "Community deleted successfully"
      })

      // Navigate back to the communities page
      router.push("/dashboard/community")
    } catch (error) {
      console.error("Error deleting community:", error)
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive"
      })
      setIsDeleting(false)
    }
  }

  const handlePromoteToAdmin = async (memberId: string) => {
    try {
      setProcessingMemberId(memberId)

      const response = await fetch(`/api/communities/${communityId}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ memberId })
      })

      if (!response.ok) {
        throw new Error("Failed to promote member to admin")
      }

      // Update the members list
      const updatedMembers = members.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            role: "ADMIN"
          }
        }
        return member
      })

      setMembers(updatedMembers)

      toast({
        title: "Success",
        description: "Member promoted to admin"
      })
    } catch (error) {
      console.error("Error promoting member:", error)
      toast({
        title: "Error",
        description: "Failed to promote member",
        variant: "destructive"
      })
    } finally {
      setProcessingMemberId(null)
    }
  }

  const handleDemoteFromAdmin = async (memberId: string) => {
    try {
      setProcessingMemberId(memberId)

      const response = await fetch(`/api/communities/${communityId}/admins`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ memberId })
      })

      if (!response.ok) {
        throw new Error("Failed to demote admin")
      }

      // Update the members list
      const updatedMembers = members.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            role: "MEMBER"
          }
        }
        return member
      })

      setMembers(updatedMembers)

      toast({
        title: "Success",
        description: "Admin demoted to member"
      })
    } catch (error) {
      console.error("Error demoting admin:", error)
      toast({
        title: "Error",
        description: "Failed to demote admin",
        variant: "destructive"
      })
    } finally {
      setProcessingMemberId(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      setProcessingMemberId(memberId)

      const member = members.find(m => m.id === memberId)
      if (!member) return

      const response = await fetch(`/api/communities/${communityId}/members/${member.userId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      // Update the members list
      const updatedMembers = members.filter(m => m.id !== memberId)
      setMembers(updatedMembers)

      toast({
        title: "Success",
        description: "Member removed from community"
      })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      })
    } finally {
      setProcessingMemberId(null)
    }
  }

  const filteredMembers = memberFilter === "all"
    ? members
    : members.filter(member => member.role === memberFilter.toUpperCase())

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Loading community details...</p>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Community not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/community")}
        >
          Go to Communities
        </Button>
      </div>
    )
  }

  if (!community.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">You don't have permission to manage this community</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push(`/dashboard/community?id=${communityId}`)}
        >
          Back to Community
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{community.name}</h2>
          <p className="text-muted-foreground">Community Management</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            // Force a reload of the page to ensure the community details are loaded
            window.location.href = `/dashboard/community?id=${communityId}`
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Details</CardTitle>
              <CardDescription>View and edit community information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Name</p>
                <p>{community.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{community.description}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{community.locationName}</span>
                </div>
              </div>

              {userLocation && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Your Current Location</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{userLocation.name}</span>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Members</p>
                <p className="text-sm text-muted-foreground">{community.memberCount} members</p>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Community
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Community</DialogTitle>
                    <DialogDescription>
                      Update your community's information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Community Name</label>
                      <Input
                        id="name"
                        value={editedCommunity.name}
                        onChange={(e) => setEditedCommunity({ ...editedCommunity, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Textarea
                        id="description"
                        value={editedCommunity.description}
                        onChange={(e) => setEditedCommunity({ ...editedCommunity, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                    <Button
                      onClick={handleUpdateCommunity}
                      disabled={isUpdating || !editedCommunity.name.trim() || !editedCommunity.description.trim()}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for this community</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting this community will remove all its content and cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Community
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      community and all its content.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCommunity}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>Manage members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={memberFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMemberFilter("all")}
                  >
                    All Members
                  </Button>
                  <Button
                    variant={memberFilter === "admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMemberFilter("admin")}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admins
                  </Button>
                </div>

                <Separator />

                {filteredMembers.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No members found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name} />
                            <AvatarFallback>{member.user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.user.name}</p>
                            <p className="text-sm text-muted-foreground">{member.user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={member.role === "ADMIN" ? "secondary" : "outline"}>
                                {member.role === "ADMIN" ? (
                                  <>
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                  </>
                                ) : "Member"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Don't show actions for the current user */}
                        {member.user.id !== session?.user?.id && (
                          <div className="flex gap-2">
                            {member.role === "ADMIN" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDemoteFromAdmin(member.id)}
                                disabled={processingMemberId === member.id}
                              >
                                {processingMemberId === member.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                ) : (
                                  <>
                                    <UserMinus className="h-4 w-4 mr-1" />
                                    Demote
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePromoteToAdmin(member.id)}
                                disabled={processingMemberId === member.id}
                              >
                                {processingMemberId === member.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Make Admin
                                  </>
                                )}
                              </Button>
                            )}

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={processingMemberId === member.id}
                                >
                                  {processingMemberId === member.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                  ) : (
                                    <>
                                      <UserMinus className="h-4 w-4 mr-1" />
                                      Remove
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {member.user.name} from this community?
                                    They will lose access to all community content.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
