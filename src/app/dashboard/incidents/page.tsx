"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Filter,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReportIncidentDialog } from "@/components/report-incident-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Incident {
  id: string
  title: string
  description: string
  type: string
  severity: string
  status: string
  location: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image: string
  }
}

export default function IncidentsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [severityFilter, setSeverityFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchIncidents()
  }, [typeFilter, severityFilter, statusFilter])

  const fetchIncidents = async () => {
    try {
      setIsLoading(true)
      let url = "/api/incidents"
      const params = new URLSearchParams()

      if (typeFilter) params.append("type", typeFilter)
      if (severityFilter) params.append("severity", severityFilter)
      if (statusFilter) params.append("status", statusFilter)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch incidents")
      }

      const data = await response.json()
      setIncidents(data)
    } catch (error) {
      console.error("Error fetching incidents:", error)
      toast({
        title: "Error",
        description: "Failed to load incidents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh incidents after a new one is reported
  const refreshIncidents = () => {
    fetchIncidents()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REPORTED":
        return "bg-blue-100 text-blue-800"
      case "VERIFIED":
        return "bg-purple-100 text-purple-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "TRAFFIC":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "ROAD_CLOSURE":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "CONSTRUCTION":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "ACCIDENT":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "FLOOD":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      case "FIRE":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "POWER_OUTAGE":
        return <AlertTriangle className="h-5 w-5 text-purple-500" />
      case "PUBLIC_EVENT":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    return incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           incident.location.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground">
          View and report incidents in your community
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search incidents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
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
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="REPORTED">Reported</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Report Incident
            </Button>
          </DialogTrigger>
        </Dialog>

        {/* Use the ReportIncidentDialog component */}
        <ReportIncidentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={refreshIncidents}
        />
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No incidents found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {incidents.length === 0
              ? "There are no incidents reported in your area yet."
              : "No incidents match your current filters."}
          </p>
          <Button className="mt-4 gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Report Incident
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(incident.type)}
                  <CardTitle className="text-base">{incident.title}</CardTitle>
                </div>
                <Badge className={getSeverityColor(incident.severity)}>
                  {incident.severity.charAt(0) + incident.severity.slice(1).toLowerCase()}
                </Badge>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">Location: </span>
                  {incident.location}
                </div>
                <p className="text-sm line-clamp-3">{incident.description}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}</span>
                </div>
                <Badge className={getStatusColor(incident.status)}>
                  {incident.status.charAt(0) + incident.status.slice(1).toLowerCase().replace('_', ' ')}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
