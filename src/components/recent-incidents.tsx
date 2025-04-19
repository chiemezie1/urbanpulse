"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Construction, Car, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Incident {
  id: string
  type: string
  title: string
  location: string
  createdAt: string
  severity: string
}

export function RecentIncidents() {
  const [filter, setFilter] = useState<string | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const url = filter ? `/api/incidents?type=${filter}` : "/api/incidents"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch incidents")
        }

        const data = await response.json()
        setIncidents(data)
      } catch (error) {
        console.error("Error fetching incidents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncidents()
  }, [filter])

  const getIcon = (type: string) => {
    switch (type) {
      case "traffic":
        return <Car className="h-4 w-4" />
      case "construction":
        return <Construction className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === null ? "secondary" : "outline"} size="sm" onClick={() => setFilter(null)}>
          All
        </Button>
        <Button
          variant={filter === "traffic" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter("traffic")}
          className="gap-1"
        >
          <Car className="h-3 w-3" /> Traffic
        </Button>
        <Button
          variant={filter === "construction" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter("construction")}
          className="gap-1"
        >
          <Construction className="h-3 w-3" /> Construction
        </Button>
        <Button
          variant={filter === "alert" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter("alert")}
          className="gap-1"
        >
          <AlertTriangle className="h-3 w-3" /> Alerts
        </Button>
        <Button
          variant={filter === "info" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilter("info")}
          className="gap-1"
        >
          <Info className="h-3 w-3" /> Info
        </Button>
      </div>

      <div className="space-y-2">
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No incidents found</div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
              <div
                className={cn("mt-0.5 flex h-8 w-8 items-center justify-center rounded-full", {
                  "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400": incident.severity === "high",
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400":
                    incident.severity === "medium",
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400": incident.severity === "low",
                })}
              >
                {getIcon(incident.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{incident.title}</p>
                  <Badge
                    variant="outline"
                    className={cn({
                      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400":
                        incident.severity === "high",
                      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400":
                        incident.severity === "medium",
                      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400":
                        incident.severity === "low",
                    })}
                  >
                    {incident.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{incident.location}</p>
                <p className="text-xs text-muted-foreground">{getTimeAgo(incident.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
