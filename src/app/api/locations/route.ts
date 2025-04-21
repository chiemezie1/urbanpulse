import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

// GET /api/locations - Get all locations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const country = searchParams.get('country')

    // Build the query based on provided parameters
    const whereClause: any = {}

    if (city) {
      whereClause.city = city
    }

    if (country) {
      whereClause.country = country
    }

    const locations = await prisma.location.findMany({
      where: whereClause,
      include: {
        Coordinates: true
      }
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

// POST /api/locations - Create a new location
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      city = "Unknown",
      state = "",
      country = "Unknown",
      address = "",
      latitude = 0,
      longitude = 0
    } = body

    // Check if location already exists
    const existingLocation = await prisma.location.findFirst({
      where: {
        city,
        country
      }
    })

    if (existingLocation) {
      return NextResponse.json(existingLocation)
    }

    // Create coordinates first
    const coordinates = await prisma.coordinates.create({
      data: {
        id: uuidv4(),
        latitude,
        longitude
      }
    })

    // Create the location
    const location = await prisma.location.create({
      data: {
        id: uuidv4(),
        city,
        state,
        country,
        address,
        coordinatesId: coordinates.id
      },
      include: {
        Coordinates: true
      }
    })

    return NextResponse.json(location)
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create location" },
      { status: 500 }
    )
  }
}
