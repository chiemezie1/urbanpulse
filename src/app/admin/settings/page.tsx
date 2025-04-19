"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Save
} from "lucide-react"

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [adminAlerts, setAdminAlerts] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(false)
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [adminApproval, setAdminApproval] = useState(true)
  const [autoVerification, setAutoVerification] = useState(false)
  
  // API settings
  const [apiKey, setApiKey] = useState("sk_live_urbanpulse_7f8a9b2c3d4e5f6g7h8i9j0k")
  const [rateLimit, setRateLimit] = useState("100")
  const [webhookUrl, setWebhookUrl] = useState("")
  
  const handleSaveSettings = (section: string) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      })
    }, 1000)
  }
  
  const regenerateApiKey = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      const newKey = "sk_live_urbanpulse_" + Math.random().toString(36).substring(2, 15)
      setApiKey(newKey)
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been generated. Make sure to update your applications.",
      })
    }, 1000)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api">
            <Database className="mr-2 h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="UrbanPulse" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Textarea 
                    id="platform-description" 
                    defaultValue="UrbanPulse connects you with local incidents, weather, services, and your community—all in one place, personalized to your location."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-location">Default Location</Label>
                  <Input id="default-location" defaultValue="New York, NY" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the platform in maintenance mode
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSaveSettings("General")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure location and language settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="distance-unit">Distance Unit</Label>
                  <Select defaultValue="miles">
                    <SelectTrigger id="distance-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="kilometers">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature-unit">Temperature Unit</Label>
                  <Select defaultValue="fahrenheit">
                    <SelectTrigger id="temperature-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-detect">Auto-detect Location</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect user location
                    </p>
                  </div>
                  <Switch id="auto-detect" defaultChecked />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSaveSettings("Regional")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via browser push
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-alerts">Admin Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for admin-level events
                    </p>
                  </div>
                  <Switch 
                    id="admin-alerts" 
                    checked={adminAlerts}
                    onCheckedChange={setAdminAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-digest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of platform activity
                    </p>
                  </div>
                  <Switch 
                    id="daily-digest" 
                    checked={dailyDigest}
                    onCheckedChange={setDailyDigest}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input 
                    id="notification-email" 
                    type="email" 
                    defaultValue="admin@urbanpulse.example.com" 
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSaveSettings("Notification")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-approval">Admin Approval for New Users</Label>
                    <p className="text-sm text-muted-foreground">
                      Require admin approval for new user registrations
                    </p>
                  </div>
                  <Switch 
                    id="admin-approval" 
                    checked={adminApproval}
                    onCheckedChange={setAdminApproval}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-verification">Auto-Verification for Trusted Users</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically verify incidents reported by trusted users
                    </p>
                  </div>
                  <Switch 
                    id="auto-verification" 
                    checked={autoVerification}
                    onCheckedChange={setAutoVerification}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    defaultValue="60" 
                    min="5"
                    max="1440"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="very-strong">Very Strong (12+ chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSaveSettings("Security")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API access and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      value={apiKey} 
                      readOnly
                      className="font-mono"
                    />
                    <Button 
                      variant="outline" 
                      onClick={regenerateApiKey}
                      disabled={isLoading}
                    >
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This key provides full access to the API. Keep it secure.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <Input 
                    id="rate-limit" 
                    type="number" 
                    value={rateLimit}
                    onChange={(e) => setRateLimit(e.target.value)}
                    min="10"
                    max="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url" 
                    type="url" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Receive real-time notifications when events occur.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowed-origins">Allowed Origins (CORS)</Label>
                  <Textarea 
                    id="allowed-origins" 
                    defaultValue="https://urbanpulse.example.com
https://admin.urbanpulse.example.com"
                    placeholder="Enter one origin per line"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Domains that are allowed to make API requests. One per line.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-enabled">API Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable API access
                    </p>
                  </div>
                  <Switch id="api-enabled" defaultChecked />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSaveSettings("API")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
