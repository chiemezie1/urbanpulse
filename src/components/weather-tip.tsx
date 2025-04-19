"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Umbrella, Sun, Wind, Snowflake, Droplets, AlertTriangle } from "lucide-react"
import type { WeatherData } from "@/lib/weather"

interface WeatherTipProps {
  className?: string
}

export function WeatherTip({ className }: WeatherTipProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<string>("your area")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserLocationAndWeather = async () => {
      try {
        if (!navigator.geolocation) {
          fetchWeather()
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Convert coordinates to city name
              const geoResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
              )
              const geoData = await geoResponse.json()

              if (geoData.city) {
                setLocation(geoData.city)
              } else if (geoData.locality) {
                setLocation(geoData.locality)
              }

              // Fetch weather with coordinates
              fetchWeather(position.coords.latitude, position.coords.longitude)
            } catch (error) {
              console.error("Error processing location:", error)
              fetchWeather()
            }
          },
          (error) => {
            console.error("Geolocation error:", error)
            fetchWeather()
          },
        )
      } catch (error) {
        console.error("Location detection error:", error)
        fetchWeather()
      }
    }

    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const url = lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : "/api/weather"

        const response = await fetch(url)
        if (!response.ok) throw new Error("Weather fetch failed")

        const data = await response.json()
        setWeather(data)
      } catch (error) {
        console.error("Weather fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserLocationAndWeather()
  }, [])

  if (isLoading) {
    return (
      <Card
        className={`${className} bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-16 animate-pulse">
            <Cloud className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  // Generate weather tip based on conditions
  const getWeatherTip = () => {
    const condition = weather.current.condition.toLowerCase()
    const temp = weather.current.temp

    if (condition.includes("rain") || condition.includes("shower") || condition.includes("drizzle")) {
      return {
        icon: <Umbrella className="h-8 w-8 text-blue-500" />,
        tip: `Heads up! It's going to rain today in ${location}. Don't forget to take an umbrella with you!`,
        color: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      }
    } else if (condition.includes("snow")) {
      return {
        icon: <Snowflake className="h-8 w-8 text-blue-400" />,
        tip: `Bundle up! It's snowing in ${location} today. Perfect weather for hot chocolate!`,
        color: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      }
    } else if (condition.includes("sun") || condition.includes("clear")) {
      return {
        icon: <Sun className="h-8 w-8 text-amber-500" />,
        tip:
          temp > 85
            ? `It's a scorcher in ${location} today! Don't forget sunscreen and stay hydrated.`
            : `Beautiful sunny day in ${location}! Perfect weather to explore the city.`,
        color: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
      }
    } else if (condition.includes("cloud")) {
      return {
        icon: <Cloud className="h-8 w-8 text-gray-500" />,
        tip: `Cloudy skies in ${location} today. A light jacket might come in handy!`,
        color: "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
      }
    } else if (condition.includes("wind") || condition.includes("gust")) {
      return {
        icon: <Wind className="h-8 w-8 text-teal-500" />,
        tip: `Hold onto your hat! It's windy in ${location} today.`,
        color: "from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20",
      }
    } else if (condition.includes("fog") || condition.includes("mist")) {
      return {
        icon: <Droplets className="h-8 w-8 text-gray-500" />,
        tip: `Foggy conditions in ${location} today. Drive carefully and allow extra time for travel.`,
        color: "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
      }
    } else if (condition.includes("thunder") || condition.includes("storm")) {
      return {
        icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
        tip: `Thunderstorms expected in ${location}. Stay safe and keep an eye on weather alerts!`,
        color: "from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20",
      }
    }

    // Default tip
    return {
      icon: <Cloud className="h-8 w-8 text-emerald-500" />,
      tip: `Current temperature in ${location} is ${temp}°F. Have a great day!`,
      color: "from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20",
    }
  }

  const { icon, tip, color } = getWeatherTip()

  return (
    <Card className={`${className} bg-gradient-to-r ${color}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {icon}
          <p className="text-sm md:text-base">{tip}</p>
        </div>
      </CardContent>
    </Card>
  )
}
