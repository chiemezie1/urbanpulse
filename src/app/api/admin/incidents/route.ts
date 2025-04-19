import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        role: true,
      },
    })

    if (user?.role !== "ADMIN" && user?.role !== "EMERGENCY_RESPONDER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status") || undefined
    const type = url.searchParams.get("type") || undefined
    const severity = url.searchParams.get("severity") || undefined

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (type) {
      where.type = type
    }
    
    if (severity) {
      where.severity = severity
    }

    // Get incidents with pagination
    const [incidents, totalIncidents] = await Promise.all([
      prisma.incident.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          severity: true,
          status: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          resolvedAt: true,
          User: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          Location: {
            select: {
              city: true,
              state: true,
              country: true,
            },
          },
          Coordinates: {
            select: {
              latitude: true,
              longitude: true,
            },
          },
          IncidentReport: {
            select: {
              id: true,
              description: true,
              imageUrl: true,
              createdAt: true,
              User: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
          },
          _count: {
            select: {
              IncidentReport: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.incident.count({ where }),
    ])

    return NextResponse.json({
      incidents,
      pagination: {
        total: totalIncidents,
        page,
        limit,
        totalPages: Math.ceil(totalIncidents / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        role: true,
      },
    })

    if (adminUser?.role !== "ADMIN" && adminUser?.role !== "EMERGENCY_RESPONDER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { incidentId, status, note } = body

    if (!incidentId || !status) {
      return NextResponse.json(
        { error: "Incident ID and status are required" },
        { status: 400 }
      )
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update incident status
      const updatedIncident = await tx.incident.update({
        where: {
          id: incidentId,
        },
        data: {
          status,
          resolvedAt: status === "RESOLVED" ? new Date() : undefined,
        },
        select: {
          id: true,
          title: true,
          status: true,
          reporterId: true,
        },
      })

      // Add a note if provided
      if (note) {
        await tx.incidentReport.create({
          data: {
            incidentId,
            reporterId: adminUser.id,
            description: `[Status Update] ${note}`,
          },
        })
      }

      // Create notification for the reporter
      await tx.notification.create({
        data: {
          recipientId: updatedIncident.reporterId,
          senderId: adminUser.id,
          type: "INCIDENT",
          content: `Your incident "${updatedIncident.title}" has been ${status.toLowerCase().replace('_', ' ')}.`,
          relatedId: incidentId,
        },
      })

      return updatedIncident
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
