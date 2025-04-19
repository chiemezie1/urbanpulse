import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c

  return distance
}

// GET /api/communities/nearby - Get communities near a location
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const latStr = searchParams.get('lat')
    const lngStr = searchParams.get('lng')
    const radiusStr = searchParams.get('radius') || '50' // Default radius in km

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    const radius = parseInt(radiusStr)

    // Get all communities with their coordinates
    const communities = await prisma.community.findMany({
      include: {
        location: {
          include: {
            Coordinates: true
          }
        },
        members: {
          include: {
            user: true
          }
        }
      }
    })

    // Filter communities by distance
    const nearbyCommunities = communities.filter(community => {
      if (!community.location?.Coordinates) return false

      const communityLat = community.location.Coordinates.latitude
      const communityLng = community.location.Coordinates.longitude

      // Calculate distance using Haversine formula
      const distance = calculateDistance(lat, lng, communityLat, communityLng)
      return distance <= radius
    })

    // Format the response to include membership status for the current user
    const formattedCommunities = nearbyCommunities.map(community => {
      const isMember = community.members.some(member => member.user.id === userId)
      const isAdmin = community.members.some(member => member.user.id === userId && member.role === 'ADMIN')

      return {
        id: community.id,
        name: community.name,
        description: community.description,
        locationId: community.locationId,
        locationName: [community.location?.city, community.location?.state, community.location?.country]
                     .filter(Boolean).join(', '),
        memberCount: community.members.length,
        isAdmin,
        isMember,
        createdAt: community.createdAt.toISOString(),
        // Include distance from user's location
        distance: community.location?.Coordinates ? calculateDistance(
          lat,
          lng,
          community.location.Coordinates.latitude,
          community.location.Coordinates.longitude
        ) : null
      }
    })

    // Sort by distance
    formattedCommunities.sort((a, b) => {
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    })

    return NextResponse.json(formattedCommunities)
  } catch (error) {
    console.error("Error fetching nearby communities:", error)
    return NextResponse.json(
      { error: "Failed to fetch nearby communities" },
      { status: 500 }
    )
  }
}
