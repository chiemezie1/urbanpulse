"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  MoreHorizontal,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  MessageSquare,
  ExternalLink
} from "lucide-react"

interface Incident {
  id: string
  title: string
  description: string
  type: string
  severity: string
  status: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  User: {
    id: string
    name: string | null
    username: string
    image: string | null
  }
  Location: {
    city: string
    state: string | null
    country: string
  }
  Coordinates: {
    latitude: number
    longitude: number
  }
  IncidentReport: Array<{
    id: string
    description: string
    imageUrl: string | null
    createdAt: string
    User: {
      id: string
      name: string | null
      username: string
      image: string | null
    }
  }>
  _count: {
    IncidentReport: number
  }
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function IncidentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [incidents, setIncidents] = useState<Incident[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [severityFilter, setSeverityFilter] = useState("")

  // For status update dialog
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchIncidents = async () => {
    setLoading(true)
    try {
      const page = searchParams.get("page") || "1"
      const search = searchParams.get("search") || ""
      const status = searchParams.get("status") || ""
      const type = searchParams.get("type") || ""
      const severity = searchParams.get("severity") || ""

      const queryParams = new URLSearchParams()
      queryParams.set("page", page)
      queryParams.set("limit", "10")
      if (search) queryParams.set("search", search)
      if (status) queryParams.set("status", status)
      if (type) queryParams.set("type", type)
      if (severity) queryParams.set("severity", severity)

      const response = await fetch(`/api/admin/incidents?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch incidents")
      }

      const data = await response.json()
      setIncidents(data.incidents)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching incidents:", error)
      toast({
        title: "Error",
        description: "Failed to load incidents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    params.set("page", "1")
    router.push(`/admin/incidents?${params.toString()}`)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    params.set("page", "1")
    router.push(`/admin/incidents?${params.toString()}`)
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("type", value)
    } else {
      params.delete("type")
    }
    params.set("page", "1")
    router.push(`/admin/incidents?${params.toString()}`)
  }

  const handleSeverityFilter = (value: string) => {
    setSeverityFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("severity", value)
    } else {
      params.delete("severity")
    }
    params.set("page", "1")
    router.push(`/admin/incidents?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/admin/incidents?${params.toString()}`)
  }

  const openStatusDialog = (incident: Incident, initialStatus: string) => {
    setSelectedIncident(incident)
    setNewStatus(initialStatus)
    setStatusNote("")
    setIsDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedIncident || !newStatus) return

    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/incidents", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incidentId: selectedIncident.id,
          status: newStatus,
          note: statusNote,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update incident status")
      }

      // Update the incident in the local state
      setIncidents(incidents.map(incident =>
        incident.id === selectedIncident.id
          ? { ...incident, status: newStatus }
          : incident
      ))

      toast({
        title: "Success",
        description: "Incident status updated successfully.",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating incident status:", error)
      toast({
        title: "Error",
        description: "Failed to update incident status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "default"
      case "IN_PROGRESS":
        return "secondary"
      case "RESOLVED":
        return "success"
      case "REJECTED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "default"
      case "MEDIUM":
        return "secondary"
      case "LOW":
        return "outline"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    const nameParts = name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`
    }
    return name.substring(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incident Verification</h1>
        <p className="text-muted-foreground">
          Review and verify reported incidents
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger
              value="all"
              onClick={() => handleStatusFilter("")}
            >
              All Incidents
            </TabsTrigger>
            <TabsTrigger
              value="reported"
              onClick={() => handleStatusFilter("REPORTED")}
            >
              Reported
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              onClick={() => handleStatusFilter("VERIFIED")}
            >
              Verified
            </TabsTrigger>
            <TabsTrigger
              value="in_progress"
              onClick={() => handleStatusFilter("IN_PROGRESS")}
            >
              In Progress
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="icon" onClick={fetchIncidents}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Incidents</CardTitle>
              <CardDescription>
                Review and manage all reported incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search incidents..."
                        className="pl-8 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button variant="outline" onClick={handleSearch}>
                      Search
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={typeFilter} onValueChange={handleTypeFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Incident type" />
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
                    </div>

                    <div className="flex items-center gap-2">
                      <Select value={severityFilter} onValueChange={handleSeverityFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-[250px]" />
                            <Skeleton className="h-6 w-[100px]" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No incidents found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incidents.map((incident) => (
                      <Card key={incident.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{incident.title}</h3>
                                <Badge variant={getStatusBadgeVariant(incident.status)}>
                                  {incident.status.replace(/_/g, " ")}
                                </Badge>
                                <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                                  {incident.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {incident.type.replace(/_/g, " ")}
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openStatusDialog(incident, "VERIFIED")}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Verify Incident
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openStatusDialog(incident, "IN_PROGRESS")}>
                                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                  Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openStatusDialog(incident, "RESOLVED")}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                                  Mark Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openStatusDialog(incident, "REJECTED")}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Reject Incident
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View on Map
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>

                        <CardContent className="pb-3">
                          <div className="space-y-4">
                            <p className="text-sm">{incident.description}</p>

                            {incident.imageUrl && (
                              <div className="relative h-48 w-full sm:w-1/2 rounded-md overflow-hidden">
                                <img
                                  src={incident.imageUrl}
                                  alt={incident.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {incident.Location.city}
                                  {incident.Location.state && `, ${incident.Location.state}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Reported {formatDate(incident.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{incident._count.IncidentReport} reports</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={incident.User.image || undefined} alt={incident.User.name || ""} />
                                  <AvatarFallback>{getInitials(incident.User.name)}</AvatarFallback>
                                </Avatar>
                                <span>@{incident.User.username}</span>
                              </div>
                            </div>

                            {incident.IncidentReport.length > 0 && (
                              <div className="mt-4 space-y-3">
                                <h4 className="text-sm font-medium">Additional Reports</h4>
                                <div className="space-y-2">
                                  {incident.IncidentReport.map((report) => (
                                    <div key={report.id} className="bg-muted/50 p-3 rounded-md">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Avatar className="h-5 w-5">
                                          <AvatarImage src={report.User.image || undefined} alt={report.User.name || ""} />
                                          <AvatarFallback>{getInitials(report.User.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium">@{report.User.username}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm">{report.description}</p>
                                      {report.imageUrl && (
                                        <div className="mt-2 relative h-24 w-full sm:w-1/3 rounded-md overflow-hidden">
                                          <img
                                            src={report.imageUrl}
                                            alt="Report image"
                                            className="object-cover w-full h-full"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                  {incident._count.IncidentReport > 3 && (
                                    <Button variant="link" className="text-xs p-0 h-auto">
                                      View all {incident._count.IncidentReport} reports
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <div className="flex flex-wrap gap-2 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => openStatusDialog(incident, "VERIFIED")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => openStatusDialog(incident, "IN_PROGRESS")}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              In Progress
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => openStatusDialog(incident, "RESOLVED")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Resolve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => openStatusDialog(incident, "REJECTED")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                {pagination.totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                          className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: pagination.totalPages }).map((_, i) => {
                        const pageNumber = i + 1

                        // Show first page, last page, and pages around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === pagination.totalPages ||
                          (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={pageNumber === pagination.page}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        }

                        // Show ellipsis for gaps
                        if (
                          pageNumber === 2 ||
                          pageNumber === pagination.totalPages - 1
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }

                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            pagination.page < pagination.totalPages &&
                            handlePageChange(pagination.page + 1)
                          }
                          className={
                            pagination.page >= pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reported" className="space-y-4">
          {/* Content is the same as "all" but filtered by status */}
          <Card>
            <CardHeader>
              <CardTitle>Reported Incidents</CardTitle>
              <CardDescription>
                Review newly reported incidents that need verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same content as "all" tab but filtered */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Incidents</CardTitle>
              <CardDescription>
                Incidents that have been verified by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same content as "all" tab but filtered */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incidents In Progress</CardTitle>
              <CardDescription>
                Incidents that are currently being addressed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same content as "all" tab but filtered */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Incident Status</DialogTitle>
            <DialogDescription>
              Change the status of this incident and add an optional note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Incident</h4>
              <p className="text-sm">{selectedIncident?.title}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Status</h4>
              <Badge variant={getStatusBadgeVariant(selectedIncident?.status || "")}>
                {selectedIncident?.status.replace(/_/g, " ") || ""}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">New Status</h4>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REPORTED">Reported</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Add a Note (Optional)</h4>
              <Textarea
                placeholder="Add details about this status change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus || isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
