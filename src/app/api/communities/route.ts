import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

// GET /api/communities - Get all communities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const city = searchParams.get('city')
    const country = searchParams.get('country')

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Build the query based on provided parameters
    const whereClause: any = {}

    if (locationId) {
      whereClause.locationId = locationId
    }

    // Get all communities
    const communities = await prisma.community.findMany({
      where: whereClause,
      include: {
        location: true,
        members: {
          include: {
            user: true
          }
        }
      }
    })

    // Format the response to include membership status for the current user
    const formattedCommunities = communities.map(community => {
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
        createdAt: community.createdAt.toISOString()
      }
    })

    return NextResponse.json(formattedCommunities)
  } catch (error) {
    console.error("Error fetching communities:", error)
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    )
  }
}

// POST /api/communities - Create a new community
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()
    const {
      name,
      description,
      locationId,
      locationName,
      coordinates,
      locationData
    } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    // Check if the location exists, create it if it doesn't
    let locationRecord = await prisma.location.findUnique({
      where: { id: locationId }
    })

    if (!locationRecord && locationData) {
      // Create coordinates first
      const coordinatesRecord = await prisma.coordinates.create({
        data: {
          id: uuidv4(),
          latitude: coordinates?.latitude || 0,
          longitude: coordinates?.longitude || 0
        }
      })

      // Create the location
      locationRecord = await prisma.location.create({
        data: {
          id: locationId,
          city: locationData.city || 'Unknown',
          state: locationData.state || '',
          country: locationData.country || 'Unknown',
          coordinatesId: coordinatesRecord.id
        }
      })
    }

    if (!locationRecord) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      )
    }

    // Create the community
    const community = await prisma.community.create({
      data: {
        id: uuidv4(),
        name,
        description,
        locationId: locationRecord.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: {
          create: {
            userId,
            role: 'ADMIN',
            joinedAt: new Date()
          }
        }
      },
      include: {
        location: true,
        members: {
          include: {
            user: true
          }
        }
      }
    })

    // Format the response
    const formattedCommunity = {
      id: community.id,
      name: community.name,
      description: community.description,
      locationId: community.locationId,
      locationName: [community.location?.city, community.location?.state, community.location?.country]
                   .filter(Boolean).join(', '),
      memberCount: community.members.length,
      isAdmin: true,
      isMember: true,
      createdAt: community.createdAt.toISOString()
    }

    return NextResponse.json(formattedCommunity)
  } catch (error) {
    console.error("Error creating community:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create community" },
      { status: 500 }
    )
  }
}
