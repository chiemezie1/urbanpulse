"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const screenshots = [
  {
    title: "Interactive City Map",
    description: "Explore your city with layers for incidents, services, and more",
    image: "/placeholder.svg?height=600&width=800&text=City+Map+Screenshot",
    alt: "UrbanPulse City Map Interface"
  },
  {
    title: "Real-time Incident Reporting",
    description: "Report and track incidents like traffic, construction, or events",
    image: "/placeholder.svg?height=600&width=800&text=Incident+Reporting+Screenshot",
    alt: "UrbanPulse Incident Reporting Interface"
  },
  {
    title: "Community Feed",
    description: "Share updates and connect with others in your neighborhood",
    image: "/placeholder.svg?height=600&width=800&text=Community+Feed+Screenshot",
    alt: "UrbanPulse Community Feed Interface"
  },
  {
    title: "Weather & Air Quality",
    description: "Access current conditions and forecasts for your location",
    image: "/placeholder.svg?height=600&width=800&text=Weather+Screenshot",
    alt: "UrbanPulse Weather Interface"
  }
]

export function AppScreenshots() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length)
  }
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length)
  }
  
  return (
    <div className="relative overflow-hidden rounded-xl border shadow-lg bg-background">
      <div className="absolute top-0 left-0 right-0 h-8 bg-muted flex items-center px-4 gap-1.5 z-10">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-xs text-muted-foreground">UrbanPulse - {screenshots[currentIndex].title}</div>
      </div>
      
      <div className="pt-8 relative">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={screenshots[currentIndex].image}
            alt={screenshots[currentIndex].alt}
            fill
            className="object-cover"
          />
          
          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
            <h3 className="font-medium">{screenshots[currentIndex].title}</h3>
            <p className="text-sm text-gray-200">{screenshots[currentIndex].description}</p>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Dots */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
