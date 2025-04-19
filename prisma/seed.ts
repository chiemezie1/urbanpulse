import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {
  try {
    // Create coordinates for default location
    const coordinatesId = uuidv4()
    await prisma.coordinates.create({
      data: {
        id: coordinatesId,
        latitude: 40.7128,
        longitude: -74.006,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create default location
    const locationId = uuidv4()
    await prisma.location.create({
      data: {
        id: locationId,
        city: "New York",
        state: "NY",
        country: "USA",
        coordinatesId: coordinatesId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create test user
    const password = await hash("password123", 10)
    const userId = uuidv4()

    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        id: userId,
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        password,
        image: "/placeholder.svg?height=40&width=40",
        locationId: locationId,
        role: "RESIDENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log(`Created user: ${user.name}`)

    // Create incidents
    // Using enum values from the schema
    const incidents = [
      {
        title: "Traffic Accident",
        description: "Two-car collision with minor injuries",
        type: "TRAFFIC", // This is an enum value
        severity: "HIGH", // This is an enum value
        reporterId: userId,
        locationId: locationId,
      },
      {
        title: "Road Construction",
        description: "Lane closure due to road repairs",
        type: "CONSTRUCTION", // This is an enum value
        severity: "MEDIUM", // This is an enum value
        reporterId: userId,
        locationId: locationId,
      },
      {
        title: "Power Outage",
        description: "Widespread power outage affecting several blocks",
        type: "POWER_OUTAGE", // This is an enum value
        severity: "HIGH", // This is an enum value
        reporterId: userId,
        locationId: locationId,
      },
      {
        title: "Community Event",
        description: "Farmers market this weekend",
        type: "PUBLIC_EVENT", // This is an enum value
        severity: "LOW", // This is an enum value
        reporterId: userId,
        locationId: locationId,
      },
    ]

    for (const incident of incidents) {
      // Create coordinates for each incident
      const incidentCoordinatesId = uuidv4()
      await prisma.coordinates.create({
        data: {
          id: incidentCoordinatesId,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.006 + (Math.random() - 0.5) * 0.01,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      await prisma.incident.create({
        data: {
          id: uuidv4(),
          title: incident.title,
          description: incident.description,
          type: incident.type as any, // Cast to any to bypass type checking
          severity: incident.severity as any, // Cast to any to bypass type checking
          reporterId: incident.reporterId,
          locationId: incident.locationId,
          coordinatesId: incidentCoordinatesId,
          status: "REPORTED" as any, // Cast to any to bypass type checking
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }

    console.log(`Created ${incidents.length} incidents`)

    // Create community posts
    const posts = [
      {
        content:
          "Just reported a pothole on Main Street. The city crew is already on their way to fix it! Love how responsive our community services have become since we started using UrbanPulse.",
        authorId: userId,
        locationId: locationId,
        category: "general",
      },
      {
        content:
          "Heads up everyone! There's a community cleanup event this Saturday at Central Park. Bring gloves and join us from 9am-12pm. Let's make our city shine! #CommunityCleanup #UrbanPride",
        authorId: userId,
        locationId: locationId,
        category: "event",
      },
      {
        content:
          "The new bike lane on Riverside Drive is finally open! Just took my first ride and it's fantastic. Great job to everyone who advocated for this improvement to our city infrastructure.",
        authorId: userId,
        locationId: locationId,
        category: "infrastructure",
      },
    ]

    for (const post of posts) {
      // Create coordinates for each post
      const postCoordinatesId = uuidv4()
      await prisma.coordinates.create({
        data: {
          id: postCoordinatesId,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.006 + (Math.random() - 0.5) * 0.01,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      await prisma.post.create({
        data: {
          id: uuidv4(),
          ...post,
          coordinatesId: postCoordinatesId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }

    console.log(`Created ${posts.length} posts`)

    // Create POIs (Points of Interest)
    const pois = [
      {
        name: "Urban Brew Coffee",
        description: "Local coffee shop with free WiFi",
        type: "CAFE", // This is an enum value
        address: "123 Main St",
        phone: "(555) 123-4567",
        website: "https://urbanbrew.example.com",
        openingHours: "Mon-Fri: 7AM-9PM, Sat-Sun: 8AM-10PM",
      },
      {
        name: "City Center Mall",
        description: "Shopping mall with over 100 stores",
        type: "SHOPPING", // This is an enum value
        address: "500 Market St",
        openingHours: "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
      },
      {
        name: "City General Hospital",
        description: "Full-service hospital with emergency care",
        type: "HOSPITAL", // This is an enum value
        address: "800 Health Ave",
        phone: "(555) 123-4567",
        website: "https://citygeneralhospital.example.com",
        openingHours: "Open 24/7",
      },
    ]

    for (const poi of pois) {
      // Create coordinates for each POI
      const poiCoordinatesId = uuidv4()
      await prisma.coordinates.create({
        data: {
          id: poiCoordinatesId,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.006 + (Math.random() - 0.5) * 0.01,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      await prisma.pOI.create({
        data: {
          id: uuidv4(),
          name: poi.name,
          description: poi.description,
          type: poi.type as any, // Cast to any to bypass type checking
          address: poi.address,
          phone: poi.phone,
          website: poi.website,
          openingHours: poi.openingHours,
          locationId: locationId,
          coordinatesId: poiCoordinatesId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }

    console.log(`Created ${pois.length} POIs`)
  } catch (error) {
    console.error("Error in seed script:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
