"use client"

import { useState } from "react"
import {
  Copy,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ChevronRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { SectionCommonProps } from "./types"

interface ApiKey {
  id: string
  name: string
  created: string
  lastUsed: string | null
  status: "active" | "revoked" | "expired"
}

interface ServiceStatus {
  id: string
  name: string
  description: string
  status: "connected" | "error" | "warning" | "verifying"
  lastCheck: string
  details?: {
    version?: string
    expiresIn?: number
    endpoint?: string
  }
}

const SERVICES: ServiceStatus[] = [
  {
    id: "ssl",
    name: "SSL/TLS Certificate",
    description: "Verify your domain's SSL certificate status",
    status: "connected",
    lastCheck: "2 hours ago",
    details: {
      expiresIn: 45,
    },
  },
  {
    id: "smtp",
    name: "SMTP Email Server",
    description: "Check your email configuration",
    status: "connected",
    lastCheck: "1 hour ago",
    details: {
      endpoint: "smtp.mail.com",
    },
  },
  {
    id: "dns",
    name: "DNS Configuration",
    description: "Verify DNS records and domain settings",
    status: "connected",
    lastCheck: "30 minutes ago",
  },
  {
    id: "cdn",
    name: "CDN Service",
    description: "Check CDN connectivity",
    status: "connected",
    lastCheck: "15 minutes ago",
    details: {
      version: "2.1.0",
    },
  },
  {
    id: "storage",
    name: "Cloud Storage",
    description: "Verify cloud storage connection",
    status: "warning",
    lastCheck: "5 minutes ago",
  },
  {
    id: "backup",
    name: "Backup Service",
    description: "Check automated backup status",
    status: "connected",
    lastCheck: "Just now",
  },
]

export function IntegrationsSection({ dir, isRTL, t }: SectionCommonProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Mobile App",
      created: "Oct 15, 2025",
      lastUsed: "2 hours ago",
      status: "active",
    },
    {
      id: "key_2",
      name: "Analytics Integration",
      created: "Oct 10, 2025",
      lastUsed: "1 day ago",
      status: "active",
    },
    {
      id: "key_3",
      name: "Old Integration",
      created: "Sep 1, 2025",
      lastUsed: null,
      status: "revoked",
    },
  ])

  const [services, setServices] = useState<ServiceStatus[]>(SERVICES)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [testSchedule, setTestSchedule] = useState<string>("hourly")
  const [isGenOpen, setIsGenOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")

  const alignmentClass = isRTL ? "text-right" : "text-left"

  const statusClasses = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    revoked: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    expired: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    connected: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    verifying: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  }

  const statusIcons = {
    connected: <CheckCircle2 className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    verifying: <Clock className="h-4 w-4 animate-spin" />,
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const revokeApiKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, status: "revoked" } : key
      )
    )
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  const testService = (id: string) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, status: "verifying", lastCheck: "Just now" } : service
      )
    )
    setTimeout(() => {
      setServices(
        services.map((service) =>
          service.id === id ? { ...service, status: "connected" } : service
        )
      )
    }, 2000)
  }

  const testAll = () => {
    setServices(services.map((s) => ({ ...s, status: "verifying", lastCheck: "Just now" })))
    setTimeout(() => {
      setServices(services.map((s) => ({ ...s, status: "connected", lastCheck: "Just now" })))
    }, 2000)
  }

  const generateApiKey = () => {
    const id = `key_${Math.random().toString(36).slice(2, 10)}`
    const created = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    const newKey: ApiKey = {
      id,
      name: newKeyName || "New Key",
      created,
      lastUsed: null,
      status: "active",
    }
    setApiKeys([newKey, ...apiKeys])
    // copy generated id to clipboard
    try {
      navigator.clipboard.writeText(id)
      setCopiedKey(id)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (e) {
      // ignore
    }
    setNewKeyName("")
    setIsGenOpen(false)
  }

  return (
    <div className="space-y-6" dir={dir}>
      {/* API Keys Section */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <div className="flex items-start justify-between">
            <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
              <CardTitle>{t("settings.detail.integrations.apiKeys.title")}</CardTitle>
              <CardDescription>
                {t("settings.detail.integrations.apiKeys.description")}
              </CardDescription>
            </div>
            <Dialog open={isGenOpen} onOpenChange={setIsGenOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{t("settings.detail.integrations.apiKeys.add")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("settings.detail.integrations.apiKeys.generateTitle") || "Generate New API Key"}</DialogTitle>
                  <DialogDescription>
                    {t("settings.detail.integrations.apiKeys.generateDescription") || "Create a new API key for integrations."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-2">
                  <Label htmlFor="new-key-name">{t("common.name") || "Name"}</Label>
                  <Input id="new-key-name" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder={t("settings.detail.integrations.apiKeys.namePlaceholder") || "e.g. Mobile App"} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenOpen(false)}>{t("common.cancel") || "Cancel"}</Button>
                  <Button onClick={generateApiKey}>{t("settings.detail.integrations.apiKeys.generate") || "Generate"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("settings.detail.currencies.accepted.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {apiKeys.map((key) => (
                  <Card key={key.id} className="border border-border/60 shadow-sm">
                    <CardContent className="space-y-3 py-4 text-sm">
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{key.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("settings.detail.integrations.apiKeys.table.created")}: {key.created}
                          </p>
                        </div>
                        <Badge className={statusClasses[key.status]}>
                          {t(`settings.detail.integrations.apiKeys.status.${key.status}`)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {key.lastUsed
                          ? `${t("settings.detail.integrations.apiKeys.table.lastUsed")}: ${key.lastUsed}`
                          : t("settings.detail.integrations.apiKeys.neverUsed")}
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => copyToClipboard(`key_${key.id}`, key.id)}
                        >
                          <Copy className="h-3 w-3" />
                          {copiedKey === key.id ? "Copied" : "Copy"}
                        </Button>
                        {key.status === "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => revokeApiKey(key.id)}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteApiKey(key.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table */}
              <div
                className="hidden overflow-hidden rounded-xl border border-border/60 shadow-sm md:block"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.integrations.apiKeys.table.name")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.integrations.apiKeys.table.created")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.integrations.apiKeys.table.lastUsed")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.integrations.apiKeys.table.status")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.integrations.apiKeys.table.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>{key.created}</TableCell>
                        <TableCell>
                          {key.lastUsed
                            ? key.lastUsed
                            : t("settings.detail.integrations.apiKeys.neverUsed")}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusClasses[key.status]}>
                            {t(`settings.detail.integrations.apiKeys.status.${key.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(`key_${key.id}`, key.id)}
                              className="flex items-center gap-1"
                              title={t("settings.detail.integrations.apiKeys.copy")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {key.status === "active" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => revokeApiKey(key.id)}
                                className="flex items-center gap-1"
                                title={t("settings.detail.integrations.apiKeys.revoke")}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteApiKey(key.id)}
                              className="flex items-center gap-1 text-destructive"
                              title={t("settings.detail.integrations.apiKeys.delete")}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Verification Section */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.integrations.services.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.integrations.services.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Label className={alignmentClass}>Test schedule</Label>
              <Select value={testSchedule} onValueChange={setTestSchedule}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="1min">Every 1 minute</SelectItem>
                  <SelectItem value="10min">Every 10 minutes</SelectItem>
                  <SelectItem value="hourly">Every hour</SelectItem>
                  <SelectItem value="daily">Every day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={testAll}>
                Test all
              </Button>
            </div>
          </div>
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-4"
            >
              <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                  {statusIcons[service.status as keyof typeof statusIcons]}
                </div>
                <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {t("settings.detail.integrations.services.lastCheck")}: {service.lastCheck}
                  </div>
                  {service.details && (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {service.details.version && (
                        <div>
                          {t("settings.detail.integrations.services.version")}: {service.details.version}
                        </div>
                      )}
                      {service.details.expiresIn && (
                        <div>
                          {t("settings.detail.integrations.services.certificateExpires")}:{" "}
                          {service.details.expiresIn}{" "}
                          {t("settings.detail.integrations.services.daysRemaining")}
                        </div>
                      )}
                      {service.details.endpoint && (
                        <div>
                          {t("settings.detail.integrations.services.endpoint")}:{" "}
                          {service.details.endpoint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Badge className={statusClasses[service.status]}>
                  {t(`settings.detail.integrations.services.status.${service.status}`)}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testService(service.id)}
                >
                  {t("settings.detail.integrations.services.test")}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
