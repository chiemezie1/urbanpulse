export interface WeatherData {
  current: {
    temp: number
    condition: string
    icon: string
    humidity: number
    wind: number
    aqi: number
    feelsLike: number
    pressure: number
    visibility: number
    dewPoint: number
    uvIndex: number
    sunrise: number
    sunset: number
  }
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
    icon: string
    humidity: number
    wind: number
    sunrise: number
    sunset: number
    pop: number // Probability of precipitation
  }>
  hourly: Array<{
    time: string
    temp: number
    condition: string
    icon: string
    pop: number // Probability of precipitation
  }>
  alerts: Array<{
    id: string
    type: string
    severity: string
    title: string
    description: string
    startTime: string
    endTime: string
  }>
}

export async function getWeatherData(lat = 40.7128, lon = -74.006): Promise<WeatherData> {
  // Use the OpenWeatherMap API key from environment variables
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || process.env.OPENWEATHERMAP_API_KEY || "";

  if (!API_KEY) {
    console.warn("OpenWeatherMap API key not found, using fallback data")
    return getFallbackWeatherData()
  }

  try {
    // Use the OpenWeatherMap API to get current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
      { next: { revalidate: 1800 } } // Revalidate every 30 minutes
    )

    if (!currentRes.ok) {
      console.error(`Failed to fetch current weather data: ${currentRes.status} ${currentRes.statusText}`)
      throw new Error("Failed to fetch weather data")
    }

    const currentData = await currentRes.json()

    // Get forecast data
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
      { next: { revalidate: 1800 } }
    )

    if (!forecastRes.ok) {
      console.error(`Failed to fetch forecast data: ${forecastRes.status} ${forecastRes.statusText}`)
      throw new Error("Failed to fetch weather data")
    }

    const forecastData = await forecastRes.json()

    // Air quality
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      { next: { revalidate: 1800 } },
    )

    if (!aqiRes.ok) {
      console.error(`Failed to fetch air quality data: ${aqiRes.status} ${aqiRes.statusText}`)
      throw new Error("Failed to fetch air quality data")
    }

    const aqiData = await aqiRes.json()

    // Process the data
    const current = {
      temp: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      icon: getWeatherIcon(currentData.weather[0].icon),
      humidity: currentData.main.humidity,
      wind: Math.round(currentData.wind.speed),
      aqi: aqiData.list[0].main.aqi * 20, // Convert 1-5 scale to approximate AQI
      feelsLike: Math.round(currentData.main.feels_like),
      pressure: currentData.main.pressure,
      visibility: currentData.visibility / 1000, // Convert to km
      dewPoint: Math.round(currentData.main.temp_min), // Use temp_min as a fallback for dew point
      uvIndex: 0, // Not available in current weather API
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset
    }

    // Process daily forecast from 5-day forecast data
    // Group forecast data by day
    const dailyData: Record<string, any> = {}

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const day = date.toLocaleDateString("en-US", { weekday: "short" })

      if (!dailyData[day]) {
        dailyData[day] = {
          temps: [],
          icons: [],
          conditions: [],
          humidity: [],
          wind: [],
          pop: [],
          dt: item.dt
        }
      }

      dailyData[day].temps.push(item.main.temp)
      dailyData[day].icons.push(item.weather[0].icon)
      dailyData[day].conditions.push(item.weather[0].main)
      dailyData[day].humidity.push(item.main.humidity)
      dailyData[day].wind.push(item.wind.speed)
      dailyData[day].pop.push(item.pop || 0)
    })

    // Process each day's data
    const forecast = Object.entries(dailyData)
      .map(([day, data]: [string, any]) => {
        const temps = data.temps
        return {
          day,
          high: Math.round(Math.max(...temps)),
          low: Math.round(Math.min(...temps)),
          condition: getMostFrequent(data.conditions),
          icon: getWeatherIcon(getMostFrequent(data.icons)),
          humidity: Math.round(data.humidity.reduce((sum: number, val: number) => sum + val, 0) / data.humidity.length),
          wind: Math.round(data.wind.reduce((sum: number, val: number) => sum + val, 0) / data.wind.length),
          sunrise: currentData.sys.sunrise, // Use current day sunrise/sunset
          sunset: currentData.sys.sunset,
          pop: Math.round(Math.max(...data.pop) * 100) // Use maximum probability of precipitation
        }
      })
      .slice(0, 5) // Limit to 5 days

    // Process hourly forecast from 3-hour forecast data
    const hourly = forecastData.list.slice(0, 8).map((item: any) => {
      const date = new Date(item.dt * 1000)
      return {
        time: date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: getWeatherIcon(item.weather[0].icon),
        pop: Math.round((item.pop || 0) * 100) // Convert to percentage
      }
    })

    // For now, we'll use empty alerts since the standard API doesn't provide them
    // In a production app, you would use a separate API call to get weather alerts
    const alerts: any[] = []

    return {
      current,
      forecast,
      hourly,
      alerts
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return getFallbackWeatherData()
  }
}

// Helper function to get the most frequent item in an array
function getMostFrequent(arr: string[]): string {
  if (arr.length === 0) return "";

  const counts = arr.reduce((acc: Record<string, number>, val: string) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

// Geocoding function to convert location name to coordinates
export async function geocodeLocation(locationName: string): Promise<{ lat: number; lon: number; name: string } | null> {
  // Use the Geoapify API key from environment variables
  const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "d50176a2ddc242388395c31e6ae2c566";

  if (!locationName.trim()) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&format=json&apiKey=${API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn(`No geocoding results found for: ${locationName}`);
      return null;
    }

    const result = data.results[0];
    const name = result.formatted || locationName;

    return {
      lat: result.lat,
      lon: result.lon,
      name
    };
  } catch (error) {
    console.error(`Error geocoding location ${locationName}:`, error);
    return null;
  }
}

function getWeatherIcon(iconCode: string) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function getFallbackWeatherData(): WeatherData {
  const now = new Date()
  const sunrise = new Date(now)
  sunrise.setHours(6, 30, 0, 0)
  const sunset = new Date(now)
  sunset.setHours(19, 30, 0, 0)

  return {
    current: {
      temp: 72,
      condition: "Partly Cloudy",
      icon: "https://openweathermap.org/img/wn/02d@2x.png",
      humidity: 65,
      wind: 8,
      aqi: 42,
      feelsLike: 70,
      pressure: 1015,
      visibility: 10,
      dewPoint: 55,
      uvIndex: 5,
      sunrise: Math.floor(sunrise.getTime() / 1000),
      sunset: Math.floor(sunset.getTime() / 1000)
    },
    forecast: [
      {
        day: "Today",
        high: 74,
        low: 62,
        condition: "Partly Cloudy",
        icon: "https://openweathermap.org/img/wn/02d@2x.png",
        humidity: 65,
        wind: 8,
        sunrise: Math.floor(sunrise.getTime() / 1000),
        sunset: Math.floor(sunset.getTime() / 1000),
        pop: 20
      },
      {
        day: "Tomorrow",
        high: 68,
        low: 58,
        condition: "Rain",
        icon: "https://openweathermap.org/img/wn/10d@2x.png",
        humidity: 75,
        wind: 10,
        sunrise: Math.floor(sunrise.getTime() / 1000) + 86400,
        sunset: Math.floor(sunset.getTime() / 1000) + 86400,
        pop: 80
      },
      {
        day: "Wed",
        high: 70,
        low: 60,
        condition: "Sunny",
        icon: "https://openweathermap.org/img/wn/01d@2x.png",
        humidity: 60,
        wind: 7,
        sunrise: Math.floor(sunrise.getTime() / 1000) + 172800,
        sunset: Math.floor(sunset.getTime() / 1000) + 172800,
        pop: 10
      },
      {
        day: "Thu",
        high: 72,
        low: 62,
        condition: "Partly Cloudy",
        icon: "https://openweathermap.org/img/wn/02d@2x.png",
        humidity: 65,
        wind: 8,
        sunrise: Math.floor(sunrise.getTime() / 1000) + 259200,
        sunset: Math.floor(sunset.getTime() / 1000) + 259200,
        pop: 30
      },
      {
        day: "Fri",
        high: 75,
        low: 63,
        condition: "Sunny",
        icon: "https://openweathermap.org/img/wn/01d@2x.png",
        humidity: 55,
        wind: 6,
        sunrise: Math.floor(sunrise.getTime() / 1000) + 345600,
        sunset: Math.floor(sunset.getTime() / 1000) + 345600,
        pop: 0
      },
    ],
    hourly: Array.from({ length: 24 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() + i)
      const isDay = hour.getHours() > 6 && hour.getHours() < 20

      return {
        time: hour.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        temp: Math.round(72 - i % 5 + i % 3),
        condition: i % 3 === 0 ? "Rain" : i % 2 === 0 ? "Partly Cloudy" : "Sunny",
        icon: `https://openweathermap.org/img/wn/${i % 3 === 0 ? "10" : i % 2 === 0 ? "02" : "01"}${isDay ? "d" : "n"}@2x.png`,
        pop: i % 3 === 0 ? 70 : i % 2 === 0 ? 30 : 0
      }
    }),
    alerts: [
      {
        id: "FLOOD_WATCH-1",
        type: "FLOOD",
        severity: "MEDIUM",
        title: "Flood Watch",
        description: "A flood watch is in effect for the area until 8:00 PM tonight. Heavy rainfall may lead to flooding in low-lying areas.",
        startTime: new Date(now.getTime()).toISOString(),
        endTime: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "THUNDERSTORM_WARNING-2",
        type: "STORM",
        severity: "HIGH",
        title: "Severe Thunderstorm Warning",
        description: "The National Weather Service has issued a severe thunderstorm warning for the area. Strong winds, heavy rain, and lightning are expected.",
        startTime: new Date(now.getTime()).toISOString(),
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      }
    ]
  }
}
