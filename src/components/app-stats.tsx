"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, MessageSquare, AlertTriangle } from "lucide-react"

export function AppStats() {
  const [stats, setStats] = useState({
    users: 0,
    cities: 0,
    posts: 0,
    incidents: 0
  })
  
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Simulate loading stats from an API
    const finalStats = {
      users: 25000,
      cities: 120,
      posts: 85000,
      incidents: 32000
    }
    
    // Animate the numbers counting up
    const duration = 2000 // 2 seconds
    const frameRate = 60
    const frames = duration / (1000 / frameRate)
    let frame = 0
    
    const interval = setInterval(() => {
      frame++
      const progress = frame / frames
      
      setStats({
        users: Math.floor(progress * finalStats.users),
        cities: Math.floor(progress * finalStats.cities),
        posts: Math.floor(progress * finalStats.posts),
        incidents: Math.floor(progress * finalStats.incidents)
      })
      
      if (frame === frames) {
        clearInterval(interval)
      }
    }, 1000 / frameRate)
    
    // Set up intersection observer to start animation when component is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    const element = document.getElementById('app-stats')
    if (element) {
      observer.observe(element)
    }
    
    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [isVisible])
  
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }
  
  return (
    <div id="app-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <Users className="h-8 w-8 text-emerald-500 mb-2" />
          <div className="text-3xl font-bold">{formatNumber(stats.users)}+</div>
          <p className="text-sm text-muted-foreground">Active Users</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <MapPin className="h-8 w-8 text-blue-500 mb-2" />
          <div className="text-3xl font-bold">{formatNumber(stats.cities)}+</div>
          <p className="text-sm text-muted-foreground">Cities Covered</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <MessageSquare className="h-8 w-8 text-amber-500 mb-2" />
          <div className="text-3xl font-bold">{formatNumber(stats.posts)}+</div>
          <p className="text-sm text-muted-foreground">Community Posts</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <div className="text-3xl font-bold">{formatNumber(stats.incidents)}+</div>
          <p className="text-sm text-muted-foreground">Incidents Reported</p>
        </CardContent>
      </Card>
    </div>
  )
}
