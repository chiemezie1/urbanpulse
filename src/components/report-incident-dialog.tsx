"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MapPin } from "lucide-react"

interface ReportIncidentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReportIncidentDialog({ open, onOpenChange, onSuccess }: ReportIncidentDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    location: "",
    description: "",
    severity: "",
    latitude: 0,
    longitude: 0,
  })

  // Get user's location when dialog opens
  useEffect(() => {
    if (open) {
      getUserLocation()
    }
  }, [open])

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      return
    }

    setIsLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Convert coordinates to address using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await response.json()

          // Format the location string
          let locationString = ""
          if (data.locality) {
            locationString += data.locality
          }
          if (data.city) {
            locationString += locationString ? ", " + data.city : data.city
          }
          if (!locationString && data.countryName) {
            locationString = data.countryName
          }

          // Update form data with location information
          setFormData(prev => ({
            ...prev,
            location: locationString || "Current Location",
            latitude,
            longitude
          }))
        } catch (error) {
          console.error("Error getting location:", error)
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.type || !formData.title || !formData.location || !formData.severity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to report incident")
      }

      toast({
        title: "Incident reported",
        description: "Thank you for helping keep your community informed.",
      })

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      onOpenChange(false)
      setFormData({
        type: "",
        title: "",
        location: "",
        description: "",
        severity: "",
        latitude: 0,
        longitude: 0,
      })
    } catch (error) {
      console.error("Error reporting incident:", error)
      toast({
        title: "Error",
        description: "Failed to report incident. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Incident</DialogTitle>
          <DialogDescription>Provide details about the incident to alert your community.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="incident-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRAFFIC">Traffic</SelectItem>
                  <SelectItem value="ROAD_CLOSURE">Road Closure</SelectItem>
                  <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                  <SelectItem value="ACCIDENT">Accident</SelectItem>
                  <SelectItem value="FLOOD">Flood</SelectItem>
                  <SelectItem value="FIRE">Fire</SelectItem>
                  <SelectItem value="POWER_OUTAGE">Power Outage</SelectItem>
                  <SelectItem value="PUBLIC_EVENT">Public Event</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => handleChange("severity", value)}>
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief title of the incident"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="location"
                  placeholder="Address or intersection"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={isLoadingLocation ? "pr-10" : ""}
                />
                {isLoadingLocation && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                title="Use my current location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {formData.latitude !== 0 && formData.longitude !== 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Using coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the incident"
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
