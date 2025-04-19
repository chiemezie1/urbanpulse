"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Search,
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Coffee,
  ShoppingBag,
  Utensils,
  School,
  Hospital,
  Building,
  Briefcase,
  Plus,
  Filter,
  Heart,
  Home,
  Ticket,
  Landmark,
  SlidersHorizontal,
  Check,
  Wifi,
  AccessibilityIcon
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface Service {
  id: string
  name: string
  description: string | null
  type: string
  address: string
  latitude: number
  longitude: number
  openHours: string | null
  phone: string | null
  website: string | null
  createdAt?: string
  updatedAt?: string
  rating?: number
  priceLevel?: number
  distance?: number
  photos?: string[]
  categories?: string[]
  conditions?: string[]
  city?: string | null
  country?: string | null
  cuisine?: string | null
  hasWifi?: boolean
  hasWheelchairAccess?: boolean
  raw?: any // For debugging
}

export default function ServicesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLocationLoading, setIsLocationLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("catering")
  const [conditionFilter, setConditionFilter] = useState("")
  const [sortBy, setSortBy] = useState("distance") // Default sort by distance
  const [savedServices, setSavedServices] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    type: "CAFE",
    address: "",
    phone: "",
    website: "",
    openHours: ""
  })
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    city: string;
  } | null>(null)
  const [searchRadius, setSearchRadius] = useState(10000) // Default 10km radius (in meters)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const servicesPerPage = 8 // 4 cards per row × 2 rows

  // Define fallback locations for different regions
  const fallbackLocations = {
    // Nigeria locations
    nigeria: [
      { latitude: 9.0765, longitude: 7.3986, city: "Abuja" },  // Abuja
      { latitude: 6.5244, longitude: 3.3792, city: "Lagos" },  // Lagos
      { latitude: 7.3775, longitude: 3.9470, city: "Ibadan" }, // Ibadan
      { latitude: 9.0579, longitude: 7.4951, city: "Central Business District" }, // CBD Abuja
      { latitude: 9.0663242, longitude: 7.4941306, city: "Central Business District (La Taverna)" } // Exact location from example
    ],
    // Ghana locations
    ghana: [
      { latitude: 5.6037, longitude: -0.1870, city: "Accra" }, // Accra
      { latitude: 6.6885, longitude: -1.6244, city: "Kumasi" }, // Kumasi
      { latitude: 5.9032, longitude: -0.9465, city: "Koforidua" } // Koforidua
    ],
    // USA locations
    usa: [
      { latitude: 40.7128, longitude: -74.0060, city: "New York" }, // New York
      { latitude: 34.0522, longitude: -118.2437, city: "Los Angeles" }, // Los Angeles
      { latitude: 41.8781, longitude: -87.6298, city: "Chicago" } // Chicago
    ]
  }

  // Function to get default location based on approximate coordinates
  const getDefaultLocation = (lat: number, lng: number) => {
    // Very rough estimation of continent/region based on coordinates
    if (lat > 0 && lat < 20 && lng > -20 && lng < 40) {
      // Africa (West Africa specifically)
      if (lng > 0) {
        // Nigeria and east
        return fallbackLocations.nigeria[4]; // Central Business District
      } else {
        // Ghana and west
        return fallbackLocations.ghana[0]; // Accra
      }
    } else {
      // Default to USA if not in West Africa
      return fallbackLocations.usa[0]; // New York
    }
  }

  // Default location will be determined when we get approximate coordinates
  const [defaultLocation, setDefaultLocation] = useState(fallbackLocations.nigeria[4])

  // Get user's location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setIsLocationLoading(true)

        // Try to get IP-based location first for a rough estimate
        try {
          const response = await fetch('https://ipapi.co/json/');
          const ipData = await response.json();
          if (ipData.latitude && ipData.longitude) {
            // Update default location based on IP geolocation
            const newDefaultLocation = getDefaultLocation(ipData.latitude, ipData.longitude);
            setDefaultLocation(newDefaultLocation);

            // Log the detected region
            console.log(`Detected approximate location: ${ipData.city}, ${ipData.country_name} (${ipData.latitude}, ${ipData.longitude})`);
          }
        } catch (ipError) {
          console.log('Could not get IP-based location, using fallback');
        }

        if (!navigator.geolocation) {
          console.log('Geolocation not supported, using default location');
          setUserLocation(defaultLocation);
          setIsLocationLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log(`Got precise location: (${latitude}, ${longitude})`);

              // Get city name from coordinates using reverse geocoding with our API key
              const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
              const response = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
              );
              const data = await response.json();

              const result = data.features?.[0]?.properties;
              let cityName = "your area";

              if (result) {
                if (result.city) {
                  cityName = result.city;
                } else if (result.state) {
                  cityName = result.state;
                } else if (result.country) {
                  cityName = result.country;
                }

                console.log(`Location resolved to: ${cityName}, ${result.country || ''}`);
              }

              setUserLocation({
                latitude,
                longitude,
                city: cityName
              });
            } catch (error) {
              console.error("Error getting location name:", error);
              setUserLocation(defaultLocation);
            } finally {
              setIsLocationLoading(false);
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            console.log("Using default location for region");
            setUserLocation(defaultLocation);
            setIsLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (error) {
        console.error("Geolocation error:", error);
        setUserLocation(defaultLocation);
        setIsLocationLoading(false);
      }
    };

    getUserLocation();
  }, [defaultLocation]); // Add defaultLocation as dependency

  // Fetch services when location is available or filters change
  useEffect(() => {
    if (userLocation) {
      fetchServices()
    }
  }, [userLocation, categoryFilter, conditionFilter, searchRadius])

  useEffect(() => {
    filterServices()
  }, [services, searchQuery, sortBy])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, conditionFilter, searchRadius, searchQuery])

  const fetchServices = async () => {
    if (!userLocation) return

    try {
      setIsLoading(true)
      // Use a larger radius for Nigeria to ensure we get results
      const actualRadius = searchRadius * 2 // Double the radius to get more results

      // Use the exact categories format from the documentation
      let url = `/api/geoplaces?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${actualRadius}&categories=${categoryFilter}&limit=100`

      if (conditionFilter) {
        url += `&conditions=${conditionFilter}`
      }

      console.log("Fetching services from:", url)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data)
      setFilteredServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = [...services]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          service.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "type":
          return a.type.localeCompare(b.type)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        default:
          return 0
      }
    })

    setFilteredServices(filtered)
  }

  const handleSaveService = (serviceId: string) => {
    if (savedServices.includes(serviceId)) {
      setSavedServices(savedServices.filter(id => id !== serviceId))
      toast({
        title: "Service removed",
        description: "Service removed from saved list",
      })
    } else {
      setSavedServices([...savedServices, serviceId])
      toast({
        title: "Service saved",
        description: "Service added to your saved list",
      })
    }
  }

  const handleSubmitService = async () => {
    // In a real app, this would submit to an API
    toast({
      title: "Service submitted",
      description: "Your service has been submitted for review",
    })
    setIsDialogOpen(false)
  }

  const getServiceIcon = (type: string, categories?: string[]) => {
    // First check the main type
    switch (type) {
      case "CAFE":
        return <Coffee className="h-5 w-5 text-amber-500" />
      case "RESTAURANT":
        return <Utensils className="h-5 w-5 text-red-500" />
      case "SHOPPING":
      case "COMMERCIAL":
        return <ShoppingBag className="h-5 w-5 text-purple-500" />
      case "EDUCATION":
        return <School className="h-5 w-5 text-blue-500" />
      case "HOSPITAL":
      case "HEALTHCARE":
        return <Hospital className="h-5 w-5 text-emerald-500" />
      case "BUSINESS":
      case "SERVICE":
        return <Briefcase className="h-5 w-5 text-gray-500" />
      case "GOVERNMENT":
        return <Building className="h-5 w-5 text-indigo-500" />
      case "ACCOMMODATION":
        return <Home className="h-5 w-5 text-blue-400" />
      case "LEISURE":
      case "ENTERTAINMENT":
        return <Ticket className="h-5 w-5 text-pink-500" />
      case "TOURISM":
      case "ATTRACTION":
        return <Landmark className="h-5 w-5 text-amber-600" />
    }

    // If no match on type, check categories
    if (categories && categories.length > 0) {
      const category = categories[0].toLowerCase()

      if (category.includes('restaurant') || category.includes('food')) {
        return <Utensils className="h-5 w-5 text-red-500" />
      } else if (category.includes('cafe') || category.includes('coffee')) {
        return <Coffee className="h-5 w-5 text-amber-500" />
      } else if (category.includes('shop') || category.includes('store') || category.includes('commercial')) {
        return <ShoppingBag className="h-5 w-5 text-purple-500" />
      } else if (category.includes('hotel') || category.includes('accommodation')) {
        return <Home className="h-5 w-5 text-blue-400" />
      } else if (category.includes('hospital') || category.includes('health') || category.includes('pharmacy')) {
        return <Hospital className="h-5 w-5 text-emerald-500" />
      } else if (category.includes('school') || category.includes('education') || category.includes('university')) {
        return <School className="h-5 w-5 text-blue-500" />
      } else if (category.includes('tourism') || category.includes('attraction')) {
        return <Landmark className="h-5 w-5 text-amber-600" />
      } else if (category.includes('leisure') || category.includes('entertainment')) {
        return <Ticket className="h-5 w-5 text-pink-500" />
      }
    }

    // Default icon
    return <MapPin className="h-5 w-5 text-gray-500" />
  }

  const getServiceTypeLabel = (type: string, categories?: string[]) => {
    // If we have categories, use the most specific one
    if (categories && categories.length > 0) {
      const mostSpecific = categories[categories.length - 1]
      return mostSpecific
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' > ')
    }

    // Otherwise, format the type
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ')
  }

  if (isLocationLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-muted-foreground">Detecting your location...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Finding services near you...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-500" />
          <p className="text-muted-foreground">
            Discover local services and businesses in {userLocation?.city || 'your area'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Food & Drink</SelectLabel>
                <SelectItem value="catering">All Food & Drink</SelectItem>
                <SelectItem value="catering.restaurant">Restaurants</SelectItem>
                <SelectItem value="catering.restaurant.african">African Restaurants</SelectItem>
                <SelectItem value="catering.cafe">Cafes</SelectItem>
                <SelectItem value="catering.bar">Bars</SelectItem>
                <SelectItem value="catering.fast_food">Fast Food</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Shopping</SelectLabel>
                <SelectItem value="commercial">All Shopping</SelectItem>
                <SelectItem value="commercial.supermarket">Supermarkets</SelectItem>
                <SelectItem value="commercial.shopping_mall">Shopping Malls</SelectItem>
                <SelectItem value="commercial.clothing">Clothing Stores</SelectItem>
                <SelectItem value="commercial.department_store">Department Stores</SelectItem>
                <SelectItem value="commercial.convenience">Convenience Stores</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Accommodation</SelectLabel>
                <SelectItem value="accommodation">All Accommodation</SelectItem>
                <SelectItem value="accommodation.hotel">Hotels</SelectItem>
                <SelectItem value="accommodation.apartment">Apartments</SelectItem>
                <SelectItem value="accommodation.guest_house">Guest Houses</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Tourism & Leisure</SelectLabel>
                <SelectItem value="tourism">Tourist Attractions</SelectItem>
                <SelectItem value="tourism.sights">Sights</SelectItem>
                <SelectItem value="tourism.attraction">Attractions</SelectItem>
                <SelectItem value="leisure">Leisure & Recreation</SelectItem>
                <SelectItem value="leisure.park">Parks</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Services</SelectLabel>
                <SelectItem value="service">All Services</SelectItem>
                <SelectItem value="service.financial">Financial Services</SelectItem>
                <SelectItem value="service.financial.atm">ATMs</SelectItem>
                <SelectItem value="service.financial.bank">Banks</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="healthcare.pharmacy">Pharmacies</SelectItem>
                <SelectItem value="healthcare.hospital">Hospitals</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={searchRadius.toString()} onValueChange={(value) => setSearchRadius(parseInt(value))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1 km radius</SelectItem>
              <SelectItem value="2000">2 km radius</SelectItem>
              <SelectItem value="5000">5 km radius</SelectItem>
              <SelectItem value="10000">10 km radius</SelectItem>
              <SelectItem value="15000">15 km radius</SelectItem>
              <SelectItem value="20000">20 km radius</SelectItem>
              <SelectItem value="50000">50 km radius</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters ? "bg-muted" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Advanced Filters</span>
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="type">Category</SelectItem>
            </SelectContent>
          </Select>

          {showAdvancedFilters && (
            <Card className="absolute top-full right-0 mt-2 z-10 w-[300px] shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conditions">Amenities & Features</Label>
                  <Select value={conditionFilter} onValueChange={setConditionFilter}>
                    <SelectTrigger id="conditions">
                      <SelectValue placeholder="Select amenities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>General</SelectLabel>
                        <SelectItem value="">No filters</SelectItem>
                        <SelectItem value="internet_access">Internet Access</SelectItem>
                        <SelectItem value="internet_access.free">Free Internet Access</SelectItem>
                        <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
                        <SelectItem value="wheelchair.yes">Fully Wheelchair Accessible</SelectItem>
                        <SelectItem value="dogs">Dog Friendly</SelectItem>
                        <SelectItem value="access">Public Access</SelectItem>
                        <SelectItem value="no_fee">No Entry Fee</SelectItem>
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Food & Drink</SelectLabel>
                        <SelectItem value="vegetarian">Vegetarian Options</SelectItem>
                        <SelectItem value="vegetarian.only">Vegetarian Only</SelectItem>
                        <SelectItem value="vegan">Vegan Options</SelectItem>
                        <SelectItem value="vegan.only">Vegan Only</SelectItem>
                        <SelectItem value="halal">Halal Food</SelectItem>
                        <SelectItem value="halal.only">Halal Only</SelectItem>
                        <SelectItem value="kosher">Kosher Food</SelectItem>
                        <SelectItem value="organic">Organic Food</SelectItem>
                        <SelectItem value="gluten_free">Gluten Free Options</SelectItem>
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Features</SelectLabel>
                        <SelectItem value="named">Named Places Only</SelectItem>
                        <SelectItem value="outdoor_seating">Outdoor Seating</SelectItem>
                        <SelectItem value="air_conditioning">Air Conditioning</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price-level">Price Level</Label>
                    <div className="flex items-center gap-1">
                      {Array(3).fill(0).map((_, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-0`}
                        >
                          {'$'.repeat(i + 1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AccessibilityIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Accessible</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Submit a new service or business to be added to the directory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="type" className="text-right text-sm font-medium">
                    Type
                  </label>
                  <Select
                    value={newService.type}
                    onValueChange={(value) => setNewService({ ...newService, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAFE">Cafe</SelectItem>
                      <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                      <SelectItem value="SHOPPING">Shopping</SelectItem>
                      <SelectItem value="EDUCATION">Education</SelectItem>
                      <SelectItem value="HOSPITAL">Healthcare</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="GOVERNMENT">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="address" className="text-right text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    value={newService.address}
                    onChange={(e) => setNewService({ ...newService, address: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    value={newService.phone}
                    onChange={(e) => setNewService({ ...newService, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="website" className="text-right text-sm font-medium">
                    Website
                  </label>
                  <Input
                    id="website"
                    value={newService.website}
                    onChange={(e) => setNewService({ ...newService, website: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="hours" className="text-right text-sm font-medium">
                    Hours
                  </label>
                  <Input
                    id="hours"
                    value={newService.openHours}
                    onChange={(e) => setNewService({ ...newService, openHours: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g. Mon-Fri: 9AM-5PM"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="description" className="text-right text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="col-span-3 min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitService}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <div className="text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredServices.length === 0 ? (
              <div className="col-span-full flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No services found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || categoryFilter !== "catering"
                      ? "Try adjusting your filters"
                      : "There are no services in your area yet"}
                  </p>
                </div>
              </div>
            ) : (
              // Get current services for pagination (2 rows of 4 cards = 8 items per page)
              filteredServices
                .slice((currentPage - 1) * servicesPerPage, currentPage * servicesPerPage)
                .map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {getServiceIcon(service.type, service.categories)}
                          <span>{service.name}</span>
                        </CardTitle>
                        <CardDescription>
                          {getServiceTypeLabel(service.type, service.categories)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={savedServices.includes(service.id) ? "text-red-500" : ""}
                        onClick={() => handleSaveService(service.id)}
                      >
                        <Heart className={`h-5 w-5 ${savedServices.includes(service.id) ? "fill-current" : ""}`} />
                        <span className="sr-only">Save</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-2">
                    {service.description && (
                      <p className="text-sm line-clamp-2">{service.description}</p>
                    )}
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{service.address} {service.distance !== undefined && `(${service.distance} km away)`}</span>
                    </div>
                    {service.rating !== undefined && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                        <span>
                          {typeof service.rating === 'number'
                            ? service.rating.toFixed(1)
                            : service.rating}
                          {' '}
                          {typeof service.rating === 'number'
                            ? Array(Math.min(Math.round(service.rating), 5)).fill('★').join('')
                            : '★★★★'}
                        </span>
                      </div>
                    )}

                    {/* Show cuisine if available */}
                    {service.cuisine && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Utensils className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Cuisine: {service.cuisine.split(';').map(c =>
                          c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</span>
                      </div>
                    )}

                    {/* Show amenities */}
                    {(service.hasWifi || service.hasWheelchairAccess || (service.conditions && service.conditions.length > 0)) && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                        <span className="flex flex-wrap gap-1">
                          {service.hasWifi && (
                            <Badge variant="outline" className="bg-blue-50">WiFi</Badge>
                          )}
                          {service.hasWheelchairAccess && (
                            <Badge variant="outline" className="bg-green-50">Wheelchair Access</Badge>
                          )}
                          {service.conditions?.includes('outdoor_seating') && (
                            <Badge variant="outline" className="bg-emerald-50">Outdoor Seating</Badge>
                          )}
                          {service.conditions?.includes('dogs') && (
                            <Badge variant="outline" className="bg-amber-50">Dog Friendly</Badge>
                          )}
                        </span>
                      </div>
                    )}
                    {service.openHours && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{service.openHours}</span>
                      </div>
                    )}
                    {service.phone && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{service.phone}</span>
                      </div>
                    )}
                    {service.website && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <a href={service.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {service.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/dashboard/services/${service.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {filteredServices.length > servicesPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.ceil(filteredServices.length / servicesPerPage) }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(currentPage + 2, Math.ceil(filteredServices.length / servicesPerPage))
                    )
                    .map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-9 h-9"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev =>
                    Math.min(prev + 1, Math.ceil(filteredServices.length / servicesPerPage))
                  )}
                  disabled={currentPage === Math.ceil(filteredServices.length / servicesPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="rounded-lg border">
            {filteredServices.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No services found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || categoryFilter !== "catering"
                      ? "Try adjusting your filters"
                      : "There are no services in your area yet"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredServices
                  .slice((currentPage - 1) * servicesPerPage, currentPage * servicesPerPage)
                  .map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getServiceIcon(service.type, service.categories)}
                      </div>
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{getServiceTypeLabel(service.type, service.categories)}</Badge>
                          <span>•</span>
                          <span>{service.address} {service.distance !== undefined && `(${service.distance} km away)`}</span>
                          {service.openHours && (
                            <>
                              <span>•</span>
                              <span>{service.openHours}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={savedServices.includes(service.id) ? "text-red-500" : ""}
                        onClick={() => handleSaveService(service.id)}
                      >
                        <Heart className={`h-5 w-5 ${savedServices.includes(service.id) ? "fill-current" : ""}`} />
                        <span className="sr-only">Save</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/services/${service.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredServices.length > servicesPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.ceil(filteredServices.length / servicesPerPage) }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(currentPage + 2, Math.ceil(filteredServices.length / servicesPerPage))
                    )
                    .map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-9 h-9"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev =>
                    Math.min(prev + 1, Math.ceil(filteredServices.length / servicesPerPage))
                  )}
                  disabled={currentPage === Math.ceil(filteredServices.length / servicesPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Map</CardTitle>
              <CardDescription>View services on an interactive map</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center bg-muted">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Map View</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive map will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
