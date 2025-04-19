"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import {
  Search,
  MoreHorizontal,
  Filter,
  UserPlus,
  RefreshCw,
  Shield,
  User
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  name: string | null
  email: string
  username: string
  image: string | null
  role: string
  createdAt: string
  Location: {
    city: string
    state: string | null
    country: string
  }
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const page = searchParams.get("page") || "1"
      const search = searchParams.get("search") || ""
      const role = searchParams.get("role") || ""

      const queryParams = new URLSearchParams()
      queryParams.set("page", page)
      queryParams.set("limit", "10")
      if (search) queryParams.set("search", search)
      if (role) queryParams.set("role", role)

      const response = await fetch(`/api/admin/users?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    params.set("page", "1")
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("role", value)
    } else {
      params.delete("role")
    }
    params.set("page", "1")
    router.push(`/admin/users?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      // Update the user in the local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ))

      toast({
        title: "Success",
        description: "User role updated successfully.",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "EMERGENCY_RESPONDER":
        return "default"
      case "URBAN_PLANNER":
        return "secondary"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            View and manage all users on the platform
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
                    placeholder="Search users..."
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

              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={roleFilter} onValueChange={handleRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EMERGENCY_RESPONDER">Emergency Responder</SelectItem>
                      <SelectItem value="URBAN_PLANNER">Urban Planner</SelectItem>
                      <SelectItem value="RESIDENT">Resident</SelectItem>
                      <SelectItem value="TOURIST">Tourist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="icon" onClick={fetchUsers}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-3 w-[100px]" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                      </TableRow>
                    ))
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name || "Unnamed User"}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>@{user.username}</TableCell>
                        <TableCell>
                          {user.Location.city}
                          {user.Location.state && `, ${user.Location.state}`}
                          {user.Location.country && `, ${user.Location.country}`}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
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
                              <DropdownMenuItem>View profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit user</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.id, "ADMIN")}
                                className={user.role === "ADMIN" ? "bg-muted" : ""}
                              >
                                <Shield className="mr-2 h-4 w-4 text-destructive" />
                                Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.id, "EMERGENCY_RESPONDER")}
                                className={user.role === "EMERGENCY_RESPONDER" ? "bg-muted" : ""}
                              >
                                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                Emergency Responder
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.id, "URBAN_PLANNER")}
                                className={user.role === "URBAN_PLANNER" ? "bg-muted" : ""}
                              >
                                <Shield className="mr-2 h-4 w-4 text-amber-500" />
                                Urban Planner
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.id, "RESIDENT")}
                                className={user.role === "RESIDENT" ? "bg-muted" : ""}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Resident
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.id, "TOURIST")}
                                className={user.role === "TOURIST" ? "bg-muted" : ""}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Tourist
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

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
    </div>
  )
}
