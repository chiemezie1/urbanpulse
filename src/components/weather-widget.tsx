"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Cloud, Wind, Droplets } from "lucide-react"
import Image from "next/image"
import type { WeatherData } from "@/lib/weather"

interface WeatherWidgetProps {
  location?: string;
}

export function WeatherWidget({ location }: WeatherWidgetProps = {}) {
  const [view, setView] = useState("weather")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState(location || "")

  // Get user's location if not provided
  useEffect(() => {
    const getUserLocation = async () => {
      if (location) {
        // If location is provided, geocode it
        try {
          const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566";
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&format=json&apiKey=${API_KEY}`
          );

          if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          if (!data.results || data.results.length === 0) {
            throw new Error(`No results found for "${location}"`);
          }

          const result = data.results[0];
          setCoordinates({ lat: result.lat, lon: result.lon });
          setLocationName(result.formatted || location);
        } catch (error) {
          console.error("Error geocoding location:", error);
          // Fall back to browser geolocation
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoordinates({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              });
            },
            (error) => {
              console.error("Geolocation error:", error);
              // Default to New York
              setCoordinates({ lat: 40.7128, lon: -74.006 });
              setLocationName("New York");
            }
          );
        }
      } else if (navigator.geolocation) {
        // Use browser geolocation
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lat: latitude, lon: longitude });

            // Reverse geocode to get location name
            try {
              const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566";
              const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`
              );

              if (response.ok) {
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                  const properties = data.features[0].properties;
                  const city = properties.city || properties.county || properties.state;
                  const state = properties.state || "";
                  const country = properties.country || "";

                  const name = [city, state, country].filter(Boolean).join(", ");
                  setLocationName(name || "Your Location");
                }
              }
            } catch (error) {
              console.error("Error getting location name:", error);
              setLocationName("Your Location");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Default to New York
            setCoordinates({ lat: 40.7128, lon: -74.006 });
            setLocationName("New York");
          }
        );
      } else {
        // Geolocation not supported, default to New York
        setCoordinates({ lat: 40.7128, lon: -74.006 });
        setLocationName("New York");
      }
    };

    getUserLocation();
  }, [location]);

  // Fetch weather data when coordinates are available
  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`);

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (coordinates) {
      fetchWeather();
    }
  }, [coordinates])

  if (isLoading || !weather) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const getAqiLabel = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-emerald-600 dark:text-emerald-400" }
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-600 dark:text-yellow-400" }
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-600 dark:text-orange-400" }
    if (aqi <= 200) return { label: "Unhealthy", color: "text-red-600 dark:text-red-400" }
    if (aqi <= 300) return { label: "Very Unhealthy", color: "text-purple-600 dark:text-purple-400" }
    return { label: "Hazardous", color: "text-rose-600 dark:text-rose-400" }
  }

  const aqiInfo = getAqiLabel(weather.current.aqi)

  return (
    <Tabs value={view} onValueChange={setView} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="weather">Weather</TabsTrigger>
        <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
      </TabsList>

      <TabsContent value="weather" className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">{locationName}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {weather.current.icon ? (
                <Image
                  src={weather.current.icon || "/placeholder.svg"}
                  alt={weather.current.condition}
                  width={50}
                  height={50}
                />
              ) : (
                <Cloud className="h-10 w-10" />
              )}
              <div>
                <div className="text-3xl font-bold">{weather.current.temp}°F</div>
                <div className="text-muted-foreground">{weather.current.condition}</div>
                <div className="text-xs text-muted-foreground">Feels like {weather.current.feelsLike}°F</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>{weather.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <span>{weather.current.wind} mph</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-2 border-t">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center rounded-lg p-2 text-center hover:bg-muted">
              <div className="text-sm font-medium">{day.day}</div>
              <div className="my-1">
                {day.icon ? (
                  <Image src={day.icon || "/placeholder.svg"} alt={day.condition} width={30} height={30} />
                ) : (
                  <Cloud className="h-6 w-6" />
                )}
              </div>
              <div className="text-sm">
                <span className="font-medium">{day.high}°</span> / {day.low}°
              </div>
              {day.pop > 0 && (
                <div className="mt-1 flex items-center text-xs text-blue-500">
                  <Droplets className="h-3 w-3 mr-0.5" />
                  <span>{day.pop}%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-2 pt-2 border-t">
            {weather.hourly.slice(0, 12).map((hour, index) => (
              <div key={index} className="flex flex-col items-center rounded-lg p-2 text-center min-w-[60px] hover:bg-muted">
                <div className="text-xs font-medium">{hour.time}</div>
                <div className="my-1">
                  {hour.icon ? (
                    <Image src={hour.icon || "/placeholder.svg"} alt={hour.condition} width={24} height={24} />
                  ) : (
                    <Cloud className="h-5 w-5" />
                  )}
                </div>
                <div className="text-sm font-medium">{hour.temp}°</div>
                {hour.pop > 0 && (
                  <div className="mt-0.5 flex items-center text-xs text-blue-500">
                    <Droplets className="h-2 w-2 mr-0.5" />
                    <span>{hour.pop}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="air-quality">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-emerald-100 dark:border-emerald-900/20">
            <div className="text-3xl font-bold">{weather.current.aqi}</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${aqiInfo.color}`}>{aqiInfo.label}</div>
            <p className="text-sm text-muted-foreground">
              {aqiInfo.label === "Good"
                ? "Air quality is satisfactory, and air pollution poses little or no risk."
                : aqiInfo.label === "Moderate"
                  ? "Air quality is acceptable. However, there may be a risk for some people."
                  : "Air quality may be unhealthy. Reduce outdoor activities."}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border p-2">
              <div className="font-medium">Ozone (O₃)</div>
              <div className="text-muted-foreground">{weather.current.aqi <= 50 ? "Good" : weather.current.aqi <= 100 ? "Moderate" : "Unhealthy"}</div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="font-medium">UV Index</div>
              <div className="text-muted-foreground">{weather.current.uvIndex}</div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="font-medium">Visibility</div>
              <div className="text-muted-foreground">{weather.current.visibility} km</div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="font-medium">Pressure</div>
              <div className="text-muted-foreground">{weather.current.pressure} hPa</div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
