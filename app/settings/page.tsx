"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  SettingsIcon,
  User,
  Palette,
  Globe,
  Bell,
  Shield,
  Camera,
  Save,
  Moon,
  Sun,
  Monitor,
  Upload,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("english")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
  })
  const [profile, setProfile] = useState({
    name: "Ibrahim",
    email: "ibrahim@store.com",
    phone: "+1 (555) 123-4567",
    role: "Store Owner",
    avatar: "/placeholder.svg?height=80&width=80",
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
  })

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Digital Store Pro",
    siteDescription: "Your premium digital marketplace for templates, courses, and services",
    logo: "/placeholder.svg?height=60&width=60",
    favicon: "/placeholder.svg?height=32&width=32",
    contactEmail: "support@digitalstore.com",
    supportPhone: "+1 (555) 987-6543",
  })

  const [paymentGateways, setPaymentGateways] = useState({
    stripe: {
      enabled: true,
      publicKey: "pk_test_***************",
      secretKey: "sk_test_***************",
      status: "connected",
      lastTested: "2024-01-15",
    },
    paypal: {
      enabled: true,
      clientId: "AYz***************",
      clientSecret: "ELx***************",
      status: "connected",
      lastTested: "2024-01-14",
    },
    razorpay: {
      enabled: false,
      keyId: "",
      keySecret: "",
      status: "disconnected",
      lastTested: null,
    },
  })

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log("Profile saved:", profile)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Password change logic here
    console.log("Password change requested")
  }

  const handleAvatarChange = () => {
    // Avatar upload logic here
    console.log("Avatar change requested")
  }

  const handleSaveSiteSettings = () => {
    console.log("Site settings saved:", siteSettings)
  }

  const handleTestPaymentGateway = (gateway: string) => {
    console.log(`Testing ${gateway} connection...`)
    // Update last tested date
    setPaymentGateways((prev) => ({
      ...prev,
      [gateway]: {
        ...prev[gateway as keyof typeof prev],
        lastTested: new Date().toISOString().split("T")[0],
        status: "connected",
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="general" className="flex items-center gap-2 h-10">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2 h-10">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 h-10">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 h-10">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Site Settings
                </CardTitle>
                <CardDescription>Configure your store's basic information and branding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      placeholder="Your Store Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      placeholder="support@yourstore.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                    placeholder="Brief description of your store"
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label>Site Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                        <img
                          src={siteSettings.logo || "/placeholder.svg"}
                          alt="Site Logo"
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                        <div className="text-xs text-muted-foreground">PNG, JPG up to 2MB</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                        <img
                          src={siteSettings.favicon || "/placeholder.svg"}
                          alt="Favicon"
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Favicon
                        </Button>
                        <div className="text-xs text-muted-foreground">ICO, PNG 32x32px</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSiteSettings} className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Site Settings
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Preferences
                  </CardTitle>
                  <CardDescription>Choose how the dashboard appears to you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Theme Mode</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Current theme: <span className="font-medium capitalize">{theme}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                  <CardDescription>Set your preferred language and regional settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Display Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="arabic">العربية (Arabic)</SelectItem>
                        <SelectItem value="spanish">Español</SelectItem>
                        <SelectItem value="french">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Time Zone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="utc+3">Arabia Standard Time (UTC+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-lg">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" onClick={handleAvatarChange}>
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                    <div className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</div>
                  </div>
                </div>

                <Separator />

                {/* Profile Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{profile.role}</Badge>
                      <span className="text-sm text-muted-foreground">Contact admin to change role</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                  </div>
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Gateways
                </CardTitle>
                <CardDescription>Configure and manage your payment processing services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(paymentGateways).map(([gateway, config]) => (
                  <div key={gateway} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium capitalize">{gateway}</div>
                          <div className="text-sm text-muted-foreground">
                            {config.status === "connected" ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Connected
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                Disconnected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) =>
                            setPaymentGateways((prev) => ({
                              ...prev,
                              [gateway]: { ...prev[gateway as keyof typeof prev], enabled: checked },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {config.enabled && (
                      <div className="space-y-3 pl-13">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-xs">
                              {gateway === "stripe" ? "Public Key" : gateway === "paypal" ? "Client ID" : "Key ID"}
                            </Label>
                            <Input
                              type="password"
                              value={
                                gateway === "stripe"
                                  ? config.publicKey
                                  : gateway === "paypal"
                                    ? config.clientId
                                    : (config as any).keyId
                              }
                              placeholder="Enter key..."
                              className="text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">
                              {gateway === "stripe"
                                ? "Secret Key"
                                : gateway === "paypal"
                                  ? "Client Secret"
                                  : "Key Secret"}
                            </Label>
                            <Input
                              type="password"
                              value={
                                gateway === "stripe"
                                  ? config.secretKey
                                  : gateway === "paypal"
                                    ? config.clientSecret
                                    : (config as any).keySecret
                              }
                              placeholder="Enter secret..."
                              className="text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {config.lastTested ? `Last tested: ${config.lastTested}` : "Never tested"}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleTestPaymentGateway(gateway)}>
                            Test Connection
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and privacy settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Alerts</Label>
                      <div className="text-sm text-muted-foreground">Get notified of new login attempts</div>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Session Timeout</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account data and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Download Account Data
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Export Settings
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    This action cannot be undone. All your data will be permanently deleted.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about important updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive push notifications in your browser</div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive important alerts via SMS</div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <div className="text-sm text-muted-foreground">Receive updates about new features and tips</div>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
