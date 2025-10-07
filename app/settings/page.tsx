"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "next-themes"
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
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string

function translateOrFallback(t: TranslateFn, key: string, fallback: string) {
  const value = t(key)
  return value === key ? fallback : value
}

function formatDateValue(dateString: string | null | undefined, locale: string, fallback: string) {
  if (!dateString) {
    return fallback
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date)
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const locale = isRTL ? "ar-EG" : "en-US"
  const themeMode = theme ?? "system"
  const notTestedText = t("settings.security.payments.neverTested")

  const [language, setLanguage] = useState("english")
  const [timeZone, setTimeZone] = useState("utc-5")
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
      lastTested: null as string | null,
    },
  })

  const handleSaveProfile = () => {
    console.log("Profile saved:", profile)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password change requested")
  }

  const handleAvatarChange = () => {
    console.log("Avatar change requested")
  }

  const handleSaveSiteSettings = () => {
    console.log("Site settings saved:", siteSettings)
  }

  const handleTestPaymentGateway = (gateway: string) => {
    console.log(`Testing ${gateway} connection...`)
    setPaymentGateways((prev) => ({
      ...prev,
      [gateway]: {
        ...prev[gateway as keyof typeof prev],
        lastTested: new Date().toISOString(),
        status: "connected",
      },
    }))
  }

  const themeDisplayName = translateOrFallback(
    t,
    `settings.general.theme.modes.${themeMode}`,
    themeMode,
  )

  const languageOptions = ["english", "arabic", "spanish", "french"] as const
  const timeZoneOptions = ["utc-8", "utc-5", "utc+0", "utc+3"] as const
  const sessionTimeoutOptions = ["15", "30", "60", "240", "never"] as const

  return (
    <div className="space-y-6" dir={dir}>
      <div className={`flex flex-col ${isRTL ? "text-right" : "text-left"}`}>
        <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger
            value="general"
            className={`flex items-center gap-2 h-10 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.general")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className={`flex items-center gap-2 h-10 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.account")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className={`flex items-center gap-2 h-10 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.security")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className={`flex items-center gap-2 h-10 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.notifications")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Building className="h-5 w-5" />
                  <span>{t("settings.general.site.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.general.site.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className={isRTL ? "text-right" : ""}>
                      {t("settings.general.site.fields.name.label")}
                    </Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      placeholder={t("settings.general.site.fields.name.placeholder")}
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className={isRTL ? "text-right" : ""}>
                      {t("settings.general.site.fields.contactEmail.label")}
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      placeholder={t("settings.general.site.fields.contactEmail.placeholder")}
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className={isRTL ? "text-right" : ""}>
                    {t("settings.general.site.fields.description.label")}
                  </Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                    placeholder={t("settings.general.site.fields.description.placeholder")}
                    rows={3}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className={isRTL ? "text-right" : ""}>{t("settings.general.site.logo.label")}</Label>
                    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                        <img
                          src={siteSettings.logo || "/placeholder.svg"}
                          alt={t("settings.general.site.logo.alt")}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
                        <Button variant="outline" size="sm" className={isRTL ? "flex-row-reverse" : ""}>
                          <Upload className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                          {t("settings.general.site.logo.button")}
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          {t("settings.general.site.logo.helper")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className={isRTL ? "text-right" : ""}>{t("settings.general.site.favicon.label")}</Label>
                    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                        <img
                          src={siteSettings.favicon || "/placeholder.svg"}
                          alt={t("settings.general.site.favicon.alt")}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
                        <Button variant="outline" size="sm" className={isRTL ? "flex-row-reverse" : ""}>
                          <Upload className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                          {t("settings.general.site.favicon.button")}
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          {t("settings.general.site.favicon.helper")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveSiteSettings}
                  className={`w-full md:w-auto ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Save className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("settings.general.site.save")}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Palette className="h-5 w-5" />
                    <span>{t("settings.general.theme.title")}</span>
                  </CardTitle>
                  <CardDescription>{t("settings.general.theme.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className={isRTL ? "text-right" : ""}>{t("settings.general.theme.modeLabel")}</Label>
                    <Select value={themeMode} onValueChange={setTheme}>
                      <SelectTrigger className={isRTL ? "justify-between text-right" : "justify-between"}>
                        <SelectValue placeholder={t("settings.general.theme.placeholder")} />
                      </SelectTrigger>
                      <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                        <SelectItem value="light" className={isRTL ? "justify-end text-right" : ""}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Sun className="h-4 w-4" />
                            <span>{t("settings.general.theme.modes.light")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark" className={isRTL ? "justify-end text-right" : ""}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Moon className="h-4 w-4" />
                            <span>{t("settings.general.theme.modes.dark")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system" className={isRTL ? "justify-end text-right" : ""}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Monitor className="h-4 w-4" />
                            <span>{t("settings.general.theme.modes.system")}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className={`text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                      {t("settings.general.theme.current").replace("{theme}", themeDisplayName)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Globe className="h-5 w-5" />
                    <span>{t("settings.general.language.title")}</span>
                  </CardTitle>
                  <CardDescription>{t("settings.general.language.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className={isRTL ? "text-right" : ""}>{t("settings.general.language.languageLabel")}</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className={isRTL ? "justify-between text-right" : "justify-between"}>
                        <SelectValue placeholder={t("settings.general.language.languagePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                        {languageOptions.map((option) => (
                          <SelectItem key={option} value={option} className={isRTL ? "justify-end text-right" : ""}>
                            {t(`settings.general.language.languages.${option}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className={isRTL ? "text-right" : ""}>{t("settings.general.language.timezoneLabel")}</Label>
                    <Select value={timeZone} onValueChange={setTimeZone}>
                      <SelectTrigger className={isRTL ? "justify-between text-right" : "justify-between"}>
                        <SelectValue placeholder={t("settings.general.language.timezonePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                        {timeZoneOptions.map((option) => (
                          <SelectItem key={option} value={option} className={isRTL ? "justify-end text-right" : ""}>
                            {t(`settings.general.language.timezones.${option}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle>{t("settings.account.profile.title")}</CardTitle>
                <CardDescription>{t("settings.account.profile.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-lg">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarChange}
                      className={isRTL ? "flex-row-reverse" : ""}
                    >
                      <Camera className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t("settings.account.profile.changePhoto")}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      {t("settings.account.profile.photoHelper")}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={isRTL ? "text-right" : ""}>
                      {t("settings.account.profile.fields.name")}
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className={isRTL ? "text-right" : ""}>
                      {t("settings.account.profile.fields.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={isRTL ? "text-right" : ""}>
                      {t("settings.account.profile.fields.phone")}
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? "text-right" : ""}>{t("settings.account.profile.fields.role")}</Label>
                    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Badge variant="secondary">{profile.role}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {t("settings.account.profile.roleNote")}
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Save className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("settings.account.profile.save")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle>{t("settings.account.password.title")}</CardTitle>
                <CardDescription>{t("settings.account.password.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className={isRTL ? "text-right" : ""}>
                      {t("settings.account.password.fields.current")}
                    </Label>
                    <Input id="current-password" type="password" className={isRTL ? "text-right" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className={isRTL ? "text-right" : ""}>
                      {t("settings.account.password.fields.new")}
                    </Label>
                    <Input id="new-password" type="password" className={isRTL ? "text-right" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={isRTL ? "text-right" : ""}>
                      {t("settings.account.password.fields.confirm")}
                    </Label>
                    <Input id="confirm-password" type="password" className={isRTL ? "text-right" : ""} />
                  </div>
                  <div className={`text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                    {t("settings.account.password.helper")}
                  </div>
                  <Button type="submit" className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}>
                    {t("settings.account.password.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CreditCard className="h-5 w-5" />
                  <span>{t("settings.security.payments.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.security.payments.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(paymentGateways).map(([gateway, config]) => {
                  const gatewayLabel = translateOrFallback(
                    t,
                    `settings.security.payments.gatewayNames.${gateway}`,
                    gateway,
                  )
                  const statusKey = config.status === "connected" ? "connected" : "disconnected"
                  const statusText = translateOrFallback(
                    t,
                    `settings.status.${statusKey}`,
                    statusKey,
                  )
                  const formattedLastTested = formatDateValue(config.lastTested, locale, notTestedText)
                  const lastTestedLabel = config.lastTested
                    ? t("settings.security.payments.lastTested").replace("{date}", formattedLastTested)
                    : notTestedText

                  const primaryField =
                    gateway === "stripe" ? "publicKey" : gateway === "paypal" ? "clientId" : "keyId"
                  const secondaryField =
                    gateway === "stripe" ? "secretKey" : gateway === "paypal" ? "clientSecret" : "keySecret"

                  const primaryLabel = translateOrFallback(
                    t,
                    `settings.security.payments.fields.${primaryField}`,
                    primaryField,
                  )
                  const secondaryLabel = translateOrFallback(
                    t,
                    `settings.security.payments.fields.${secondaryField}`,
                    secondaryField,
                  )

                  const primaryValue =
                    gateway === "stripe"
                      ? (config as typeof paymentGateways.stripe).publicKey
                      : gateway === "paypal"
                        ? (config as typeof paymentGateways.paypal).clientId
                        : (config as typeof paymentGateways.razorpay).keyId

                  const secondaryValue =
                    gateway === "stripe"
                      ? (config as typeof paymentGateways.stripe).secretKey
                      : gateway === "paypal"
                        ? (config as typeof paymentGateways.paypal).clientSecret
                        : (config as typeof paymentGateways.razorpay).keySecret

                  return (
                    <div key={gateway} className="border rounded-lg p-4 space-y-4">
                      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div className={isRTL ? "text-right" : ""}>
                            <div className="font-medium capitalize">{gatewayLabel}</div>
                            <div className="text-sm text-muted-foreground">
                              {config.status === "connected" ? (
                                <span className={`flex items-center gap-1 text-green-600 ${isRTL ? "flex-row-reverse" : ""}`}>
                                  <CheckCircle className="h-3 w-3" />
                                  {statusText}
                                </span>
                              ) : (
                                <span className={`flex items-center gap-1 text-red-600 ${isRTL ? "flex-row-reverse" : ""}`}>
                                  <AlertCircle className="h-3 w-3" />
                                  {statusText}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
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

                      {config.enabled && (
                        <div className={`space-y-3 ${isRTL ? "pr-13" : "pl-13"}`}>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label className={`text-xs ${isRTL ? "text-right" : ""}`}>{primaryLabel}</Label>
                              <Input
                                type="password"
                                value={primaryValue}
                                onChange={(e) =>
                                  setPaymentGateways((prev) => ({
                                    ...prev,
                                    [gateway]: {
                                      ...prev[gateway as keyof typeof prev],
                                      [primaryField]: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={t("settings.security.payments.placeholder.key")}
                                className={`text-xs ${isRTL ? "text-right" : ""}`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className={`text-xs ${isRTL ? "text-right" : ""}`}>{secondaryLabel}</Label>
                              <Input
                                type="password"
                                value={secondaryValue}
                                onChange={(e) =>
                                  setPaymentGateways((prev) => ({
                                    ...prev,
                                    [gateway]: {
                                      ...prev[gateway as keyof typeof prev],
                                      [secondaryField]: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={t("settings.security.payments.placeholder.secret")}
                                className={`text-xs ${isRTL ? "text-right" : ""}`}
                              />
                            </div>
                          </div>
                          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                              {lastTestedLabel}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestPaymentGateway(gateway)}
                              className={isRTL ? "flex-row-reverse" : ""}
                            >
                              {t("settings.security.payments.test")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle>{t("settings.security.settings.title")}</CardTitle>
                  <CardDescription>{t("settings.security.settings.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`space-y-0.5 ${isRTL ? "text-right" : ""}`}>
                      <Label>{t("settings.security.settings.twoFactor.label")}</Label>
                      <div className="text-sm text-muted-foreground">
                        {t("settings.security.settings.twoFactor.description")}
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                    />
                  </div>
                  <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`space-y-0.5 ${isRTL ? "text-right" : ""}`}>
                      <Label>{t("settings.security.settings.loginAlerts.label")}</Label>
                      <div className="text-sm text-muted-foreground">
                        {t("settings.security.settings.loginAlerts.description")}
                      </div>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className={isRTL ? "text-right" : ""}>
                      {t("settings.security.settings.sessionTimeout.label")}
                    </Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                    >
                      <SelectTrigger className={isRTL ? "justify-between text-right" : "justify-between"}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                        {sessionTimeoutOptions.map((value) => (
                          <SelectItem key={value} value={value} className={isRTL ? "justify-end text-right" : ""}>
                            {t(`settings.security.settings.sessionTimeout.options.${value}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle>{t("settings.security.actions.title")}</CardTitle>
                  <CardDescription>{t("settings.security.actions.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className={`w-full bg-transparent ${isRTL ? "flex-row-reverse" : ""}`}>
                    {t("settings.security.actions.download")}
                  </Button>
                  <Button variant="outline" className={`w-full bg-transparent ${isRTL ? "flex-row-reverse" : ""}`}>
                    {t("settings.security.actions.export")}
                  </Button>
                  <Separator />
                  <Button variant="destructive" className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}>
                    {t("settings.security.actions.delete")}
                  </Button>
                  <div className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                    {t("settings.security.actions.warning")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className={isRTL ? "text-right" : "text-left"}>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>{t("settings.notifications.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {([
                  "email",
                  "push",
                  "sms",
                  "marketing",
                ] as const).map((channel) => {
                  const channelLabel = t(`settings.notifications.channels.${channel}.label`)
                  const channelDescription = t(`settings.notifications.channels.${channel}.description`)

                  return (
                    <div
                      key={channel}
                      className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`space-y-0.5 ${isRTL ? "text-right" : ""}`}>
                        <Label>{channelLabel}</Label>
                        <div className="text-sm text-muted-foreground">{channelDescription}</div>
                      </div>
                      <Switch
                        checked={notifications[channel]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            [channel]: checked,
                          }))
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
