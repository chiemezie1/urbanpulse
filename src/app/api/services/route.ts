import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Mock data for different service types
const mockServicesByType = {
  CAFE: [
    {
      id: "cafe-1",
      name: "Urban Brew Coffee",
      description: "Artisanal coffee shop with locally roasted beans and homemade pastries.",
      type: "CAFE",
      address: "123 Main St",
      latitude: 40.7128,
      longitude: -74.006,
      openHours: "Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM",
      phone: "(555) 123-4567",
      website: "https://urbanbrewcoffee.com",
      rating: 4.7,
      priceLevel: 2,
      distance: 0.3,
      photos: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    },
    {
      id: "cafe-2",
      name: "The Daily Grind",
      description: "Cozy neighborhood cafe with specialty drinks and free wifi.",
      type: "CAFE",
      address: "456 Oak Ave",
      latitude: 40.7135,
      longitude: -74.0085,
      openHours: "Daily: 6AM-8PM",
      phone: "(555) 234-5678",
      website: "https://dailygrindcafe.com",
      rating: 4.5,
      priceLevel: 1,
      distance: 0.7,
      photos: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    },
    {
      id: "cafe-3",
      name: "Espresso Lane",
      description: "Fast service coffee shop with drive-through and mobile ordering.",
      type: "CAFE",
      address: "789 Pine Blvd",
      latitude: 40.7145,
      longitude: -74.0095,
      openHours: "Mon-Fri: 5AM-9PM, Sat-Sun: 6AM-8PM",
      phone: "(555) 345-6789",
      website: "https://espressolane.com",
      rating: 4.2,
      priceLevel: 1,
      distance: 1.2,
      photos: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ],
  RESTAURANT: [
    {
      id: "restaurant-1",
      name: "The Green Table",
      description: "Farm-to-table restaurant with seasonal ingredients and craft cocktails.",
      type: "RESTAURANT",
      address: "101 Broadway",
      latitude: 40.7138,
      longitude: -74.0075,
      openHours: "Tue-Sun: 5PM-11PM, Closed Mondays",
      phone: "(555) 456-7890",
      website: "https://thegreentable.com",
      rating: 4.8,
      priceLevel: 3,
      distance: 0.5,
      photos: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    },
    {
      id: "restaurant-2",
      name: "Sushi Wave",
      description: "Contemporary Japanese restaurant with fresh sushi and sake selection.",
      type: "RESTAURANT",
      address: "202 5th Ave",
      latitude: 40.7148,
      longitude: -74.0065,
      openHours: "Daily: 11:30AM-10PM",
      phone: "(555) 567-8901",
      website: "https://sushiwave.com",
      rating: 4.6,
      priceLevel: 3,
      distance: 0.8,
      photos: ["https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ],
  SHOPPING: [
    {
      id: "shopping-1",
      name: "Urban Outfitters",
      description: "Trendy clothing store with the latest fashion and accessories.",
      type: "SHOPPING",
      address: "303 Madison St",
      latitude: 40.7158,
      longitude: -74.0055,
      openHours: "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
      phone: "(555) 678-9012",
      website: "https://urbanoutfitters.com",
      rating: 4.3,
      priceLevel: 2,
      distance: 1.0,
      photos: ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ],
  EDUCATION: [
    {
      id: "education-1",
      name: "City Public Library",
      description: "Public library with extensive collection, study spaces, and free wifi.",
      type: "EDUCATION",
      address: "404 Park Ave",
      latitude: 40.7168,
      longitude: -74.0045,
      openHours: "Mon-Thu: 9AM-8PM, Fri-Sat: 9AM-5PM, Sun: 1PM-5PM",
      phone: "(555) 789-0123",
      website: "https://citylibrary.org",
      rating: 4.5,
      priceLevel: 0,
      distance: 1.3,
      photos: ["https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ],
  HOSPITAL: [
    {
      id: "hospital-1",
      name: "Community Medical Center",
      description: "Full-service hospital with emergency care and specialized departments.",
      type: "HOSPITAL",
      address: "505 Health Blvd",
      latitude: 40.7178,
      longitude: -74.0035,
      openHours: "24/7",
      phone: "(555) 890-1234",
      website: "https://communitymedical.org",
      rating: 4.2,
      priceLevel: 0,
      distance: 1.5,
      photos: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ],
  BUSINESS: [
    {
      id: "business-1",
      name: "Workspace Hub",
      description: "Coworking space with private offices, meeting rooms, and amenities.",
      type: "BUSINESS",
      address: "606 Commerce St",
      latitude: 40.7188,
      longitude: -74.0025,
      openHours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM, Closed Sundays",
      phone: "(555) 901-2345",
      website: "https://workspacehub.com",
      rating: 4.7,
      priceLevel: 2,
      distance: 1.8,
      photos: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ],
  GOVERNMENT: [
    {
      id: "government-1",
      name: "City Hall",
      description: "Municipal government offices and public services.",
      type: "GOVERNMENT",
      address: "707 Civic Center Dr",
      latitude: 40.7198,
      longitude: -74.0015,
      openHours: "Mon-Fri: 9AM-5PM, Closed Weekends",
      phone: "(555) 012-3456",
      website: "https://cityhall.gov",
      rating: 3.9,
      priceLevel: 0,
      distance: 2.0,
      photos: ["https://images.unsplash.com/photo-1541872703-74c5e44368f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
    }
  ]
};

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const radius = searchParams.get("radius") || "5" // Default radius 5km

  try {
    // If we have coordinates, use them to fetch nearby services
    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      // In a real app, this would call an external API like Google Places
      // For now, we'll use our mock data and filter by distance

      // Get all services or filter by type
      let allServices: any[] = []
      if (type && type !== "all") {
        allServices = mockServicesByType[type as keyof typeof mockServicesByType] || []
      } else {
        // Combine all service types
        Object.values(mockServicesByType).forEach(services => {
          allServices = [...allServices, ...services]
        })
      }

      // Calculate actual distance for each service based on user's location
      const servicesWithDistance = allServices.map(service => ({
        ...service,
        distance: calculateDistance(lat, lng, service.latitude, service.longitude)
      }))

      // Filter by radius
      const maxRadius = parseFloat(radius)
      const nearbyServices = servicesWithDistance.filter(service => service.distance <= maxRadius)

      // Sort by distance
      nearbyServices.sort((a, b) => a.distance - b.distance)

      return NextResponse.json(nearbyServices)
    } else {
      // Fallback to database if no coordinates provided
      const pois = await prisma.pOI.findMany({
        where: type && type !== "all" ? { type: type as any } : undefined,
        orderBy: {
          name: "asc",
        },
        include: {
          Coordinates: true,
          Location: true,
        },
      })

      // Transform POI data to match the expected service format
      const services = pois.map(poi => ({
        id: poi.id,
        name: poi.name,
        description: poi.description,
        type: poi.type,
        address: poi.address || "",
        latitude: poi.Coordinates?.latitude || 0,
        longitude: poi.Coordinates?.longitude || 0,
        openHours: poi.openingHours,
        phone: poi.phone,
        website: poi.website,
        createdAt: poi.createdAt,
        updatedAt: poi.updatedAt,
        rating: 4.0, // Default rating
        priceLevel: 2, // Default price level
        distance: 0, // Unknown distance
        photos: []
      }))

      return NextResponse.json(services)
    }
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
