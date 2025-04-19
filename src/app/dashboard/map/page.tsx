"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Layers,
  AlertTriangle,
  Coffee,
  Hospital,
  ShoppingBag,
  Home,
  School,
  ParkingCircle,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CityMap } from "@/components/city-map"
import { ReportIncidentDialog } from "@/components/report-incident-dialog"
import { NearbyIncidents } from "@/components/nearby-incidents"
import { NearbyPlaces } from "@/components/nearby-places"
import { EmergencyServices } from "@/components/emergency-services"

export default function MapPage() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    restaurants: true,
    hospitals: true,
    shops: true,
    schools: false,
    parking: false,
    residential: false,
  })

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">City Map</h1>
        <p className="text-muted-foreground">
          Explore your city with real-time data on incidents, services, and points of interest.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search locations..." className="pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Layers className="h-4 w-4" />
                  Layers
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuCheckboxItem
                  checked={activeLayers.incidents}
                  onCheckedChange={() => toggleLayer("incidents")}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  Incidents
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeLayers.restaurants}
                  onCheckedChange={() => toggleLayer("restaurants")}
                >
                  <Coffee className="mr-2 h-4 w-4 text-amber-500" />
                  Restaurants
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeLayers.hospitals}
                  onCheckedChange={() => toggleLayer("hospitals")}
                >
                  <Hospital className="mr-2 h-4 w-4 text-blue-500" />
                  Hospitals
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeLayers.shops} onCheckedChange={() => toggleLayer("shops")}>
                  <ShoppingBag className="mr-2 h-4 w-4 text-emerald-500" />
                  Shops
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeLayers.schools} onCheckedChange={() => toggleLayer("schools")}>
                  <School className="mr-2 h-4 w-4 text-purple-500" />
                  Schools
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={activeLayers.parking} onCheckedChange={() => toggleLayer("parking")}>
                  <ParkingCircle className="mr-2 h-4 w-4 text-gray-500" />
                  Parking
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeLayers.residential}
                  onCheckedChange={() => toggleLayer("residential")}
                >
                  <Home className="mr-2 h-4 w-4 text-orange-500" />
                  Residential
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsReportDialogOpen(true)} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Report Incident
            </Button>
          </div>
        </div>

        <Tabs defaultValue="map" className="space-y-4">
          <TabsList>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="satellite">Satellite View</TabsTrigger>
            <TabsTrigger value="transit">Transit View</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <CityMap />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="satellite" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="flex h-[600px] w-full items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Satellite view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transit" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="flex h-[600px] w-full items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Transit view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Nearby Incidents</CardTitle>
              <CardDescription>Recent incidents in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <NearbyIncidents />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Places</CardTitle>
              <CardDescription>Trending locations near you</CardDescription>
            </CardHeader>
            <CardContent>
              <NearbyPlaces />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Emergency Services</CardTitle>
              <CardDescription>Nearby emergency facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyServices />
            </CardContent>
          </Card>
        </div>
      </div>

      <ReportIncidentDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen} />
    </div>
  )
}
