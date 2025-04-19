import { NextResponse } from "next/server"

// Get API key from environment variables
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

if (!GEOAPIFY_API_KEY) {
  console.error("Missing Geoapify API key in environment variables");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const radius = searchParams.get("radius") || "5000" // Default 5km (in meters)
  const categories = searchParams.get("categories") || "catering" // Default to catering
  const conditions = searchParams.get("conditions") || "" // Optional conditions
  const limit = searchParams.get("limit") || "100" // Default limit

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    )
  }

  try {
    // For radius-based search - use circle filter as recommended in the docs
    const circleFilter = `circle:${longitude},${latitude},${radius}`

    // Add bias for proximity sorting (recommended in the docs)
    const bias = `proximity:${longitude},${latitude}`

    // Construct the Geoapify Places API URL with all recommended parameters
    let apiUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=${circleFilter}&bias=${bias}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`

    // Add conditions if provided
    if (conditions) {
      apiUrl += `&conditions=${conditions}`
    }

    // Add bias for proximity sorting
    apiUrl += `&bias=proximity:${longitude},${latitude}`

    console.log("Fetching from API:", apiUrl.replace(GEOAPIFY_API_KEY, "API_KEY_HIDDEN"))

    // Fetch data from Geoapify
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Check if we have features in the response
    if (!data.features || data.features.length === 0) {
      console.log("No features found in the API response, returning empty array")
      return NextResponse.json([])
    }

    // Transform the GeoJSON response to match our service format
    const services = data.features.map((feature: any) => {
      const properties = feature.properties
      const geometry = feature.geometry

      // Calculate distance in kilometers
      const distance = properties.distance ? properties.distance / 1000 : null

      // Extract categories
      const categories = properties.categories || []
      const mainCategory = categories[0] || ""
      const categoryParts = mainCategory.split(".")
      const type = categoryParts[0].toUpperCase()

      // Extract address components
      const address = properties.formatted || properties.address_line2 || ""

      // Extract opening hours
      const openHours = properties.opening_hours || null

      // Extract contact information
      let phone = null
      if (properties.contact && properties.contact.phone) {
        phone = properties.contact.phone
      } else if (properties.phone) {
        phone = properties.phone
      }

      let website = null
      if (properties.contact && properties.contact.website) {
        website = properties.contact.website
      } else if (properties.website) {
        website = properties.website
      }

      // Create a description if none exists
      let description = properties.description
      if (!description) {
        if (categories.length > 0) {
          const categoryName = categories[categories.length - 1]
            .split('.')
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
          description = `A ${categoryName} in ${properties.city || properties.district || "the area"}`
        } else {
          description = `A place in ${properties.city || properties.district || "the area"}`
        }
      }

      // Extract details about the place
      const details = properties.details || []
      const hasWifi = details.includes("internet_access") || properties.internet_access
      const hasWheelchairAccess = details.includes("wheelchair") || properties.wheelchair === "yes"

      // Extract cuisine for restaurants and cafes
      let cuisine = null
      if (properties.catering && properties.catering.cuisine) {
        cuisine = properties.catering.cuisine
      } else if (properties.cuisine) {
        cuisine = properties.cuisine
      }

      // Generate a random rating if none exists
      const rating = properties.rating
        ? Number(properties.rating)
        : Number((Math.random() * 2 + 3).toFixed(1)) // Random rating between 3-5

      return {
        id: properties.place_id || `geo-${Math.random().toString(36).substring(2, 15)}`,
        name: properties.name || "Unnamed Place",
        description,
        type,
        address,
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
        openHours,
        phone,
        website,
        rating,
        priceLevel: properties.price_level || Math.floor(Math.random() * 3) + 1, // Random price level if not provided
        distance,
        photos: properties.images || [],
        categories,
        conditions: properties.conditions || [],
        city: properties.city || properties.district || null,
        country: properties.country || null,
        cuisine,
        hasWifi,
        hasWheelchairAccess,
        raw: properties // Include raw data for debugging
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching places:", error)
    return NextResponse.json({ error: "Failed to fetch places from API" }, { status: 500 })
  }
}
