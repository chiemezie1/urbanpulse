"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  AlertTriangle,
  Search,
  MapPin,
  Loader2
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import type { WeatherData } from "@/lib/weather"

export default function WeatherPage() {
  const { toast } = useToast()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLocationLoading, setIsLocationLoading] = useState(true)
  const [location, setLocation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [activeTab, setActiveTab] = useState("current")
  const [airQualityData, setAirQualityData] = useState<any>(null)
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([])

  // Get user's current location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setIsLocationLoading(true)

        if (!navigator.geolocation) {
          // Fallback to default location if geolocation is not available
          setLocation("New York")
          setCoordinates({ lat: 40.7128, lon: -74.006 })
          setIsLocationLoading(false)
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords

              // Convert coordinates to city name using reverse geocoding with Geoapify
              const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566";
              const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`
              )

              if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
              }

              const data = await response.json()

              if (!data.features || data.features.length === 0) {
                throw new Error("No location data found");
              }

              const properties = data.features[0].properties;

              // Build location name from available data
              const city = properties.city || properties.county || properties.state;
              const state = properties.state || "";
              const country = properties.country || "";

              let locationName = [city, state, country].filter(Boolean).join(", ");
              if (!locationName) locationName = "your area";

              setLocation(locationName)
              setCoordinates({ lat: latitude, lon: longitude })
            } catch (error) {
              console.error("Error getting location name:", error)
              setLocation("your area")
              setCoordinates({ lat: 40.7128, lon: -74.006 }) // Default to New York
            } finally {
              setIsLocationLoading(false)
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error)
            setLocation("New York")
            setCoordinates({ lat: 40.7128, lon: -74.006 }) // Default to New York
            setIsLocationLoading(false)
          },
          { timeout: 10000, enableHighAccuracy: true } // 10 second timeout
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        setLocation("New York")
        setCoordinates({ lat: 40.7128, lon: -74.006 }) // Default to New York
        setIsLocationLoading(false)
      }
    }

    getUserLocation()
  }, [])

  // Fetch weather data when coordinates change
  useEffect(() => {
    if (coordinates) {
      fetchWeatherData()
      fetchAirQualityData()
      fetchWeatherAlerts()
    }
  }, [coordinates])

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true)
      if (!coordinates) return

      const response = await fetch(`/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`)

      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      toast({
        title: "Error",
        description: "Failed to load weather data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAirQualityData = async () => {
    try {
      if (!coordinates) return;

      // Use the OpenWeatherMap Air Pollution API
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || process.env.OPENWEATHERMAP_API_KEY;

      if (!API_KEY) {
        console.warn("OpenWeatherMap API key not found, using fallback data");
        setAirQualityData({
          aqi: weather?.current.aqi || 42,
          pm25: 8.2,
          pm10: 12.5,
          o3: 68,
          no2: 12,
          so2: 2.1,
          co: 0.8
        });
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Air quality API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.list || data.list.length === 0) {
        throw new Error("No air quality data available");
      }

      const airQuality = data.list[0];

      setAirQualityData({
        aqi: airQuality.main.aqi * 20, // Convert 1-5 scale to approximate AQI
        pm25: airQuality.components.pm2_5,
        pm10: airQuality.components.pm10,
        o3: airQuality.components.o3,
        no2: airQuality.components.no2,
        so2: airQuality.components.so2,
        co: airQuality.components.co
      });
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      // Use fallback data
      setAirQualityData({
        aqi: weather?.current.aqi || 42,
        pm25: 8.2,
        pm10: 12.5,
        o3: 68,
        no2: 12,
        so2: 2.1,
        co: 0.8
      });
    }
  }

  const fetchWeatherAlerts = async () => {
    try {
      // Use the alerts from the weather data
      if (weather && weather.alerts) {
        setWeatherAlerts(weather.alerts)
      } else {
        // If no alerts in the weather data, set empty array
        setWeatherAlerts([])
      }
    } catch (error) {
      console.error("Error processing weather alerts:", error)
      setWeatherAlerts([])
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setIsLocationLoading(true)

      // Use Geoapify API to convert location name to coordinates
      const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566";
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&format=json&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error(`No results found for "${searchQuery}"`);
      }

      const result = data.results[0];
      const formattedLocation = result.formatted || searchQuery;

      // Set the searched location
      setLocation(formattedLocation)

      // Set the coordinates
      setCoordinates({ lat: result.lat, lon: result.lon })
      setSearchQuery("")
    } catch (error) {
      console.error("Error searching location:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to find location",
        variant: "destructive",
      })
    } finally {
      setIsLocationLoading(false)
    }
  }

  const getAqiLabel = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-emerald-600 dark:text-emerald-400" }
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-600 dark:text-yellow-400" }
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-600 dark:text-orange-400" }
    if (aqi <= 200) return { label: "Unhealthy", color: "text-red-600 dark:text-red-400" }
    if (aqi <= 300) return { label: "Very Unhealthy", color: "text-purple-600 dark:text-purple-400" }
    return { label: "Hazardous", color: "text-rose-600 dark:text-rose-400" }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500" />
      case "rain":
      case "drizzle":
      case "thunderstorm":
        return <CloudRain className="h-12 w-12 text-blue-500" />
      case "snow":
        return <CloudSnow className="h-12 w-12 text-blue-200" />
      case "mist":
      case "fog":
      case "haze":
        return <CloudFog className="h-12 w-12 text-gray-500" />
      default:
        return <Cloud className="h-12 w-12 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-blue-100 text-blue-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "CRITICAL":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLocationLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="text-muted-foreground">Detecting your location...</p>
      </div>
    )
  }

  if (isLoading || !weather) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-muted-foreground">Loading weather data for {location}...</p>
      </div>
    )
  }

  const aqiInfo = getAqiLabel(weather.current.aqi)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-500" />
          <p className="text-muted-foreground">
            Current conditions and forecast for {location}
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
              <CardDescription>
                Weather conditions in {location} as of {new Date().toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    {weather.current.icon ? (
                      <Image
                        src={weather.current.icon}
                        alt={weather.current.condition}
                        width={80}
                        height={80}
                      />
                    ) : (
                      getWeatherIcon(weather.current.condition)
                    )}
                    <div>
                      <div className="text-4xl font-bold">{weather.current.temp}°F</div>
                      <div className="text-xl">{weather.current.condition}</div>
                      <div className="text-sm text-muted-foreground">Feels like {weather.current.feelsLike}°F</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="text-sm font-medium">Feels Like</div>
                        <div className="text-lg">{weather.current.feelsLike}°F</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Humidity</div>
                        <div className="text-lg">{weather.current.humidity}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Wind</div>
                        <div className="text-lg">{weather.current.wind} mph</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Air Quality</div>
                        <div className={`text-lg ${aqiInfo.color}`}>{aqiInfo.label}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="text-sm font-medium text-muted-foreground">UV Index</div>
                    <div className="text-lg font-semibold">{weather.current.uvIndex}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Visibility</div>
                    <div className="text-lg font-semibold">{weather.current.visibility} km</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Pressure</div>
                    <div className="text-lg font-semibold">{weather.current.pressure} hPa</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Dew Point</div>
                    <div className="text-lg font-semibold">{weather.current.dewPoint}°F</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
              <CardDescription>Weather forecast for the next 5 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {weather.forecast.map((day, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4 text-center">
                      <CardTitle className="text-lg">{day.day}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 text-center">
                      <div className="mb-2 flex justify-center">
                        {day.icon ? (
                          <Image src={day.icon} alt={day.condition} width={50} height={50} />
                        ) : (
                          getWeatherIcon(day.condition)
                        )}
                      </div>
                      <div className="text-lg font-bold">
                        {day.high}° <span className="font-normal text-muted-foreground">/ {day.low}°</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{day.condition}</div>
                      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Droplets className="h-3 w-3 mr-0.5" />{day.humidity}%
                        </span>
                        <span className="flex items-center">
                          <Wind className="h-3 w-3 mr-0.5" />{day.wind}mph
                        </span>
                      </div>
                      {day.pop > 0 && (
                        <div className="mt-1 flex items-center justify-center text-xs text-blue-500">
                          <Droplets className="h-3 w-3 mr-0.5" />
                          <span>{day.pop}% chance of rain</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
              <CardDescription>Weather conditions for the next 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-x-auto pb-4">
                <div className="flex gap-4">
                  {weather.hourly.map((hour, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 rounded-lg border p-3 text-center">
                      <div className="text-sm font-medium">{hour.time}</div>
                      {hour.icon ? (
                        <Image src={hour.icon} alt={hour.condition} width={32} height={32} />
                      ) : (
                        <Cloud className="h-8 w-8 text-blue-500" />
                      )}
                      <div className="text-lg font-bold">{hour.temp}°</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{hour.condition}</span>
                        {hour.pop > 0 && (
                          <span className="flex items-center text-blue-500">
                            <Droplets className="h-3 w-3 mr-0.5" />{hour.pop}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="air-quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Air Quality Index</CardTitle>
              <CardDescription>Current air quality in {location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-6 py-6">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-emerald-100 dark:border-emerald-900/20">
                  <div className="text-4xl font-bold">{airQualityData?.aqi || weather.current.aqi}</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${aqiInfo.color}`}>{aqiInfo.label}</div>
                  <p className="mt-2 text-muted-foreground">
                    {aqiInfo.label === "Good"
                      ? "Air quality is satisfactory, and air pollution poses little or no risk."
                      : aqiInfo.label === "Moderate"
                        ? "Air quality is acceptable. However, there may be a risk for some people."
                        : "Air quality may be unhealthy. Reduce outdoor activities."}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">PM2.5</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{airQualityData?.pm25 || "8.2"}</div>
                    <p className="text-xs text-muted-foreground">μg/m³</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">PM10</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{airQualityData?.pm10 || "12.5"}</div>
                    <p className="text-xs text-muted-foreground">μg/m³</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Ozone (O₃)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{airQualityData?.o3 || "68"}</div>
                    <p className="text-xs text-muted-foreground">μg/m³</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">NO₂</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{airQualityData?.no2 || "12"}</div>
                    <p className="text-xs text-muted-foreground">μg/m³</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Air Quality History</CardTitle>
              <CardDescription>Air quality trends over the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Air quality history chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Alerts</CardTitle>
              <CardDescription>Active weather alerts for {location}</CardDescription>
            </CardHeader>
            <CardContent>
              {weatherAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Cloud className="h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Active Alerts</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are currently no weather alerts for your area.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {weatherAlerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <CardDescription>
                            Valid until {new Date(alert.endTime).toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <div className={`rounded-full px-2 py-1 text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500 flex-shrink-0" />
                          <p className="text-sm">{alert.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure your weather alert preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Severe Weather Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for severe weather events
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Daily Weather Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      Get a daily summary of weather conditions
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Air Quality Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Be notified when air quality becomes unhealthy
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
