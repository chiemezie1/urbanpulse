import { NextResponse } from "next/server"
import { getWeatherData } from "@/lib/weather"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat") ? Number.parseFloat(searchParams.get("lat") as string) : undefined
  const lon = searchParams.get("lon") ? Number.parseFloat(searchParams.get("lon") as string) : undefined

  try {
    const weatherData = await getWeatherData(lat, lon)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
