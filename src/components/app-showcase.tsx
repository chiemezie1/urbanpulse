"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Bell, Cloud, Users, Search, Shield } from "lucide-react"

export function AppShowcase() {
  const [activeTab, setActiveTab] = useState("map")
  
  const features = [
    {
      id: "map",
      icon: <MapPin className="h-4 w-4" />,
      label: "Map",
      title: "Interactive City Map",
      description: "Explore your city with layers for incidents, services, and more",
      image: "/images/screenshots/map-screen.png",
      fallbackImage: "/placeholder.svg?height=600&width=300&text=Map+View"
    },
    {
      id: "incidents",
      icon: <Bell className="h-4 w-4" />,
      label: "Incidents",
      title: "Real-time Incident Reporting",
      description: "Report and track incidents like traffic, construction, or events",
      image: "/images/screenshots/incidents-screen.png",
      fallbackImage: "/placeholder.svg?height=600&width=300&text=Incidents+View"
    },
    {
      id: "weather",
      icon: <Cloud className="h-4 w-4" />,
      label: "Weather",
      title: "Weather & Air Quality",
      description: "Access current conditions and forecasts for your location",
      image: "/images/screenshots/weather-screen.png",
      fallbackImage: "/placeholder.svg?height=600&width=300&text=Weather+View"
    },
    {
      id: "services",
      icon: <Search className="h-4 w-4" />,
      label: "Services",
      title: "Nearby Services Finder",
      description: "Discover restaurants, hospitals, and other services near you",
      image: "/images/screenshots/services-screen.png",
      fallbackImage: "/placeholder.svg?height=600&width=300&text=Services+View"
    },
    {
      id: "community",
      icon: <Users className="h-4 w-4" />,
      label: "Community",
      title: "Community Feed",
      description: "Share updates and connect with others in your neighborhood",
      image: "/images/screenshots/community-screen.png",
      fallbackImage: "/placeholder.svg?height=600&width=300&text=Community+View"
    },
    {
      id: "alerts",
      icon: <Shield className="h-4 w-4" />,
      label: "Alerts",
      title: "Real-time Notifications",
      description: "Stay informed about important events in your area",
      image: "/images/screenshots/alerts-screen.png",
      fallbackImage: "/placeholder.svg?height=600&width=300&text=Alerts+View"
    }
  ]
  
  const currentFeature = features.find(f => f.id === activeTab) || features[0]

  return (
    <div className="w-full">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {features.map(feature => (
            <TabsTrigger 
              key={feature.id} 
              value={feature.id}
              className="flex items-center gap-1.5"
            >
              {feature.icon}
              <span className="hidden sm:inline">{feature.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-2xl font-bold">{currentFeature.title}</h3>
            <p className="text-muted-foreground">{currentFeature.description}</p>
            <ul className="space-y-2 mt-4">
              {currentFeature.id === "map" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">View all incidents and services on an interactive map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Filter by type, severity, and distance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Get directions and estimated travel times</span>
                  </li>
                </>
              )}
              
              {currentFeature.id === "incidents" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Report incidents in your area with just a few taps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Add photos, descriptions, and severity levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Track incident status and resolution</span>
                  </li>
                </>
              )}
              
              {currentFeature.id === "weather" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Get real-time weather conditions for your exact location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">View 5-day forecast and hourly predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Monitor air quality and receive alerts for poor conditions</span>
                  </li>
                </>
              )}
              
              {currentFeature.id === "services" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Find essential services near you like restaurants, hospitals, and more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">View ratings, hours, and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Save your favorite places for quick access</span>
                  </li>
                </>
              )}
              
              {currentFeature.id === "community" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Connect with neighbors and local community members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Share updates, ask questions, and offer help</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Create and join local interest groups</span>
                  </li>
                </>
              )}
              
              {currentFeature.id === "alerts" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Receive real-time notifications about important events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Customize alert types and notification preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm">Get emergency alerts for your area even when the app is closed</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div className="flex items-center justify-center">
            <Card className="relative overflow-hidden border-2 border-muted rounded-xl shadow-lg max-w-[300px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 z-10 pointer-events-none"></div>
              <Image
                src={currentFeature.image}
                alt={currentFeature.title}
                width={300}
                height={600}
                className="object-cover"
                onError={(e) => {
                  // If image fails to load, use fallback
                  const target = e.target as HTMLImageElement;
                  target.src = currentFeature.fallbackImage;
                }}
              />
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
