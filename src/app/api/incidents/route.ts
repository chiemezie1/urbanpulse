import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const severity = searchParams.get("severity")
  const status = searchParams.get("status")

  try {
    // Build where clause based on filters
    const where: any = {}
    if (type) where.type = type as any
    if (severity) where.severity = severity as any
    if (status) where.status = status as any

    const incidents = await prisma.incident.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        Coordinates: true,
        Location: true,
      },
    })

    // Transform incident data to match the expected format
    const formattedIncidents = incidents.map(incident => ({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      location: incident.Location?.city || "Unknown Location",
      latitude: incident.Coordinates?.latitude || 0,
      longitude: incident.Coordinates?.longitude || 0,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      user: {
        id: incident.User?.id,
        name: incident.User?.name,
        image: incident.User?.image,
      },
    }))

    return NextResponse.json(formattedIncidents)
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const userId = session.user.id

    // Create coordinates
    const coordinatesId = uuidv4()
    await prisma.coordinates.create({
      data: {
        id: coordinatesId,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Get user's location
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { locationId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create a new location entry if a custom location is provided
    let locationId = user.locationId; // Default to user's location

    if (data.location && data.location.trim() !== "") {
      // Create a new location entry with the provided location name
      const newLocation = await prisma.location.create({
        data: {
          id: uuidv4(),
          city: data.location,
          country: "Unknown", // We don't have country info from the form
          state: "",
          coordinatesId: coordinatesId, // Link to the coordinates we just created
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      locationId = newLocation.id;
    }

    // Create incident
    const incident = await prisma.incident.create({
      data: {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        type: data.type as any,
        severity: data.severity as any,
        status: "REPORTED" as any,
        reporterId: userId,
        locationId: locationId,
        coordinatesId: coordinatesId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        Coordinates: true,
        Location: true,
      },
    })

    // Format the response
    const formattedIncident = {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      type: incident.type,
      severity: incident.severity,
      status: incident.status,
      location: incident.Location?.city || "Unknown Location",
      latitude: incident.Coordinates?.latitude || 0,
      longitude: incident.Coordinates?.longitude || 0,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      user: {
        id: incident.User?.id,
        name: incident.User?.name,
        image: incident.User?.image,
      },
    }

    return NextResponse.json(formattedIncident, { status: 201 })
  } catch (error) {
    console.error("Error creating incident:", error)
    return NextResponse.json({ error: "Failed to create incident", details: String(error) }, { status: 500 })
  }
}
