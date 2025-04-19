"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  User,
  Bell,
  Lock,
  MapPin,
  Shield,
  LogOut,
  Save,
  Trash2,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  username: string
  image: string
  bio: string
  location: {
    id: string
    city: string
    state: string
    country: string
  }
  preferences: {
    darkMode: boolean
    notificationsEnabled: boolean
    emailNotifications: boolean
    pushNotifications: boolean
    locationSharing: boolean
  }
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    username: "",
    image: "",
    bio: "",
    location: {
      id: "",
      city: "",
      state: "",
      country: ""
    },
    preferences: {
      darkMode: false,
      notificationsEnabled: true,
      emailNotifications: true,
      pushNotifications: true,
      locationSharing: true
    }
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)

      // In a real app, this would be an API call to fetch the user profile
      // For now, we'll use mock data based on the session
      setTimeout(() => {
        setProfile({
          id: session?.user?.id || "",
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          username: session?.user?.email?.split('@')[0] || "",
          image: session?.user?.image || "/placeholder.svg",
          bio: "I'm a resident interested in community events and local services.",
          location: {
            id: "loc_1",
            city: "New York",
            state: "NY",
            country: "USA"
          },
          preferences: {
            darkMode: false,
            notificationsEnabled: true,
            emailNotifications: true,
            pushNotifications: true,
            locationSharing: true
          }
        })
        setIsLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }))
  }

  const handlePreferenceChange = (name: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would be an API call to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profile.name,
          image: profile.image
        }
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // In a real app, this would be an API call to update the password
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would be an API call to update preferences
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would be an API call to delete the account
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully",
      })

      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.image} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Picture</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Location</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profile.location.city}
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={profile.location.state}
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={profile.location.country}
                      onChange={handleLocationChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Master toggle for all notifications
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notificationsEnabled}
                    onCheckedChange={(value) => handlePreferenceChange("notificationsEnabled", value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.emailNotifications}
                    onCheckedChange={(value) => handlePreferenceChange("emailNotifications", value)}
                    disabled={!profile.preferences.notificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.pushNotifications}
                    onCheckedChange={(value) => handlePreferenceChange("pushNotifications", value)}
                    disabled={!profile.preferences.notificationsEnabled}
                  />
                </div>
                <Separator />
                <h3 className="font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Incident Alerts</h4>
                      <p className="text-xs text-muted-foreground">
                        Notifications about new incidents in your area
                      </p>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Incidents</SelectItem>
                        <SelectItem value="important">Important Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Community Posts</h4>
                      <p className="text-xs text-muted-foreground">
                        Notifications about new posts and comments
                      </p>
                    </div>
                    <Select defaultValue="mentions">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="mentions">Mentions Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Weather Alerts</h4>
                      <p className="text-xs text-muted-foreground">
                        Notifications about severe weather conditions
                      </p>
                    </div>
                    <Select defaultValue="severe">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="severe">Severe Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSavePassword} disabled={isSaving}>
                {isSaving ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable 2FA</h3>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch />
              </div>
              <div className="text-sm text-muted-foreground">
                Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Set Up Two-Factor Authentication
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Session</h3>
                      <p className="text-sm text-muted-foreground">
                        {navigator.userAgent.split(' ').slice(-1)[0]} • {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Mobile App</h3>
                      <p className="text-sm text-muted-foreground">
                        iPhone • Last active 2 days ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-red-500 hover:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out of All Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your information is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Location Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow the app to access your location
                  </p>
                </div>
                <Switch
                  checked={profile.preferences.locationSharing}
                  onCheckedChange={(value) => handlePreferenceChange("locationSharing", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Profile Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile
                  </p>
                </div>
                <Select defaultValue="community">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="community">Community Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage data collection
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Download a copy of your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                You can request a copy of your personal data, including your profile information, posts, and comments.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Profile Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your profile information and preferences
                  </p>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Activity Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your posts, comments, and interactions
                  </p>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This action is irreversible. Once you delete your account, all your data will be permanently removed from our systems.
              </p>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
