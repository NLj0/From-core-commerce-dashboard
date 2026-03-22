"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Mail,
  Calendar,
  Users,
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react"
import { EmailTemplateEditor } from "@/components/email-template-editor"
import { EmailCampaignEditor } from "@/components/email-campaign-editor"
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string

// Mock data for email templates
const emailTemplates = [
  {
    id: 1,
    name: "Welcome & Account Activation",
    type: "transactional",
    subject: "Welcome to our store, {username}!",
    lastModified: "2024-01-15",
    status: "active",
    requiredPlaceholders: ["{username}", "{activation_link}"],
    content: "Welcome {username}! Please activate your account by clicking {activation_link}.",
  },
  {
    id: 2,
    name: "Order Confirmation",
    type: "transactional",
    subject: "Your order {order_id} has been confirmed",
    lastModified: "2024-01-14",
    status: "active",
    requiredPlaceholders: ["{username}", "{order_id}", "{order_summary}", "{total_amount}", "{delivery_link}"],
    content:
      "Hi {username}, your order {order_id} has been confirmed. Order summary: {order_summary}. Total: {total_amount}. Track delivery: {delivery_link}.",
  },
  {
    id: 3,
    name: "Order Status Updates",
    type: "transactional",
    subject: "Order {order_id} status update",
    lastModified: "2024-01-13",
    status: "active",
    requiredPlaceholders: ["{username}", "{order_id}", "{order_status}", "{tracking_link}"],
    content: "Hi {username}, your order {order_id} status is now: {order_status}. Track your order: {tracking_link}.",
  },
  {
    id: 4,
    name: "Password Reset",
    type: "transactional",
    subject: "Reset your password",
    lastModified: "2024-01-12",
    status: "active",
    requiredPlaceholders: ["{username}", "{reset_link}"],
    content: "Hi {username}, click here to reset your password: {reset_link}.",
  },
  {
    id: 5,
    name: "Security & Account Notifications",
    type: "transactional",
    subject: "Security notification for your account",
    lastModified: "2024-01-11",
    status: "active",
    requiredPlaceholders: ["{username}", "{notification_type}", "{notification_time}"],
    content: "Hi {username}, security notification: {notification_type} at {notification_time}.",
  },
  {
    id: 6,
    name: "Invoices & Receipts",
    type: "transactional",
    subject: "Invoice for order {order_id}",
    lastModified: "2024-01-10",
    status: "active",
    requiredPlaceholders: ["{username}", "{order_id}", "{invoice_link}", "{invoice_date}", "{total_amount}"],
    content:
      "Hi {username}, your invoice for order {order_id} is ready. Date: {invoice_date}. Amount: {total_amount}. Download: {invoice_link}.",
  },
  {
    id: 7,
    name: "Review Request",
    type: "marketing",
    subject: "How was your {product_name}?",
    lastModified: "2024-01-09",
    status: "active",
    requiredPlaceholders: ["{username}", "{product_name}", "{review_link}"],
    content: "Hi {username}, please review your recent purchase of {product_name}: {review_link}.",
  },
  {
    id: 8,
    name: "Promotional & Marketing Emails",
    type: "marketing",
    subject: "Special offer just for you, {username}!",
    lastModified: "2024-01-08",
    status: "active",
    requiredPlaceholders: ["{username}", "{promo_code}", "{promo_link}", "{offer_expiry}"],
    content:
      "Hi {username}, use code {promo_code} for a special discount! Shop now: {promo_link}. Expires: {offer_expiry}.",
  },
  {
    id: 9,
    name: "Abandoned Cart Emails",
    type: "marketing",
    subject: "Don't forget your items, {username}",
    lastModified: "2024-01-07",
    status: "active",
    requiredPlaceholders: ["{username}", "{cart_items}", "{cart_link}", "{discount_offer}"],
    content:
      "Hi {username}, you left these items in your cart: {cart_items}. Complete your purchase: {cart_link}. Special offer: {discount_offer}.",
  },
  {
    id: 10,
    name: "Customer Support Emails",
    type: "transactional",
    subject: "Support ticket {ticket_id} update",
    lastModified: "2024-01-06",
    status: "active",
    requiredPlaceholders: ["{username}", "{ticket_id}", "{support_message}", "{ticket_status}"],
    content: "Hi {username}, update on ticket {ticket_id}: {support_message}. Status: {ticket_status}.",
  },
]

// Mock data for email campaigns
const emailCampaigns = [
  {
    id: 1,
    name: "Winter Sale 2024",
    recipients: 1250,
    status: "sent",
    scheduledDate: "2024-01-15",
    openRate: 24.5,
    clickRate: 3.2,
  },
  {
    id: 2,
    name: "New Product Launch",
    recipients: 890,
    status: "scheduled",
    scheduledDate: "2024-01-20",
    openRate: null,
    clickRate: null,
  },
  {
    id: 3,
    name: "Customer Feedback Survey",
    recipients: 2100,
    status: "draft",
    scheduledDate: null,
    openRate: null,
    clickRate: null,
  },
]

// Mock data for email logs
const emailLogs = [
  {
    id: 1,
    recipient: "john@example.com",
    recipientName: "John Doe",
    subject: "Your order #ORD-001 has been confirmed",
    type: "transactional",
    status: "sent",
    date: "2024-01-15T10:30:00Z",
    template: "Order Confirmation",
    openedAt: "2024-01-15T11:45:00Z",
    clickedAt: null,
    bounced: false,
    unsubscribed: false,
  },
  {
    id: 2,
    recipient: "sarah@example.com",
    recipientName: "Sarah Wilson",
    subject: "Winter Sale - 50% Off Everything!",
    type: "marketing",
    status: "sent",
    date: "2024-01-15T09:15:00Z",
    template: "Winter Sale 2024",
    openedAt: "2024-01-15T10:22:00Z",
    clickedAt: "2024-01-15T10:25:00Z",
    bounced: false,
    unsubscribed: false,
  },
  {
    id: 3,
    recipient: "mike@example.com",
    recipientName: "Mike Johnson",
    subject: "Your order #ORD-003 has been delivered",
    type: "transactional",
    status: "failed",
  date: "2024-01-14T16:45:00Z",
    template: "Product Delivery",
    openedAt: null,
    clickedAt: null,
    bounced: true,
    unsubscribed: false,
    failureReason: "Invalid email address",
  },
  {
    id: 4,
    recipient: "emma@example.com",
    recipientName: "Emma Davis",
    subject: "Don't forget your items, Emma",
    type: "marketing",
    status: "sent",
    date: "2024-01-14T14:20:00Z",
    template: "Abandoned Cart",
    openedAt: null,
    clickedAt: null,
    bounced: false,
    unsubscribed: true,
  },
  {
    id: 5,
    recipient: "alex@example.com",
    recipientName: "Alex Brown",
    subject: "Welcome to our store, Alex!",
    type: "marketing",
    status: "sent",
    date: "2024-01-13T12:00:00Z",
    template: "Welcome Email",
    openedAt: "2024-01-13T13:15:00Z",
    clickedAt: "2024-01-13T13:18:00Z",
    bounced: false,
    unsubscribed: false,
  },
]

const analyticsCardConfig = [
  {
    key: "sent" as const,
    value: 12847,
    change: 15,
    format: "number" as const,
    Icon: Mail,
  },
  {
    key: "openRate" as const,
    value: 24.8,
    change: 2.1,
    format: "percent" as const,
    Icon: Eye,
  },
  {
    key: "clickRate" as const,
    value: 3.4,
    change: 0.3,
    format: "percent" as const,
    Icon: Users,
  },
  {
    key: "failed" as const,
    value: 127,
    change: -8,
    format: "number" as const,
    Icon: Mail,
  },
]

function getStatusBadge(status: string, t: TranslateFn) {
  const key = `emails.status.${status}`
  const label = t(key)
  const text = label === key ? status : label

  switch (status) {
    case "sent":
      return <Badge variant="badge-emerald">{text}</Badge>
    case "scheduled":
      return <Badge variant="badge-blue">{text}</Badge>
    case "draft":
      return <Badge variant="badge-gray">{text}</Badge>
    case "failed":
      return <Badge variant="badge-rose">{text}</Badge>
    case "active":
      return <Badge variant="badge-emerald">{text}</Badge>
    default:
      return <Badge variant="outline">{text}</Badge>
  }
}

function getTypeBadge(type: string, t: TranslateFn) {
  const key = `emails.types.${type}`
  const label = t(key)
  const text = label === key ? type : label

  switch (type) {
    case "transactional":
      return <Badge variant="badge-blue">{text}</Badge>
    case "marketing":
      return <Badge variant="secondary">{text}</Badge>
    default:
      return <Badge variant="outline">{text}</Badge>
  }
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

function formatDateTimeValue(dateString: string | null | undefined, locale: string, fallback: string) {
  if (!dateString) {
    return fallback
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatPercentageValue(value: number | null | undefined, locale: string, fallback: string) {
  if (value === null || value === undefined) {
    return fallback
  }

  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value / 100)
}

function formatChangeValue(change: number, locale: string) {
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })
  const sign = change > 0 ? "+" : ""
  return `${sign}${formatter.format(change)}%`
}

export default function EmailsPage() {
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const locale = isRTL ? "ar-EG" : "en-US"
  const notAvailableText = t("emails.common.notAvailable")
  const notScheduledText = t("emails.common.noDate")

  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false)
  const [isCampaignEditorOpen, setIsCampaignEditorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)

  const [logTypeFilter, setLogTypeFilter] = useState("all")
  const [logStatusFilter, setLogStatusFilter] = useState("all")
  const [logSearchTerm, setLogSearchTerm] = useState("")
  const [selectedLogEntries, setSelectedLogEntries] = useState<number[]>([])

  const filteredEmailLogs = emailLogs.filter((log) => {
    const matchesType = logTypeFilter === "all" || log.type === logTypeFilter
    const matchesStatus = logStatusFilter === "all" || log.status === logStatusFilter
    const matchesSearch =
      logSearchTerm === "" ||
      log.recipient.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.recipientName.toLowerCase().includes(logSearchTerm.toLowerCase())

    return matchesType && matchesStatus && matchesSearch
  })

  const handleLogEntrySelection = (logId: number, checked: boolean) => {
    if (checked) {
      setSelectedLogEntries((prev) => [...prev, logId])
    } else {
      setSelectedLogEntries((prev) => prev.filter((id) => id !== logId))
    }
  }

  const handleSelectAllLogs = (checked: boolean) => {
    if (checked) {
      setSelectedLogEntries(filteredEmailLogs.map((log) => log.id))
    } else {
      setSelectedLogEntries([])
    }
  }

  const exportSelectedLogs = () => {
    const selectedLogs = filteredEmailLogs.filter((log) => selectedLogEntries.includes(log.id))
    // Handle export logic here
  }

  return (
    <div className="space-y-4 md:space-y-6" dir={dir}>
      <div className={`flex flex-col ${isRTL ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("emails.title")}</h1>
        <p className="text-muted-foreground mt-1 md:mt-2">{t("emails.subtitle")}</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger
            value="templates"
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span>{t("emails.tabs.templates")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span>{t("emails.tabs.campaigns")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Mail className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">{t("emails.tabs.logs")}</span>
            <span className="sm:hidden">{t("emails.tabs.logsShort")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className={`flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span>{t("emails.tabs.analytics")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 ${isRTL ? "sm:flex-row-reverse" : ""}`}
            >
              <CardTitle className={`text-lg md:text-xl ${isRTL ? "text-right" : "text-left"}`}>
                {t("emails.templates.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}
                >
                  <div className="relative flex-1">
                    <Search
                      className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`}
                    />
                    <Input
                      placeholder={t("emails.templates.searchPlaceholder")}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"}`}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger
                      className={`w-full sm:w-[180px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
                    >
                      <SelectValue placeholder={t("emails.templates.filter.placeholder")} />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                      <SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
                        {t("emails.templates.filter.options.all")}
                      </SelectItem>
                      <SelectItem value="transactional" className={isRTL ? "justify-end text-right" : ""}>
                        {t("emails.templates.filter.options.transactional")}
                      </SelectItem>
                      <SelectItem value="marketing" className={isRTL ? "justify-end text-right" : ""}>
                        {t("emails.templates.filter.options.marketing")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden md:block">
                  <Table dir={dir}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={isRTL ? "text-right" : ""}>{t("emails.templates.table.name")}</TableHead>
                        <TableHead className={isRTL ? "text-right" : ""}>{t("emails.templates.table.type")}</TableHead>
                        <TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                          {t("emails.templates.table.subject")}
                        </TableHead>
                        <TableHead className={isRTL ? "text-right" : ""}>{t("emails.templates.table.modified")}</TableHead>
                        <TableHead className={isRTL ? "text-left" : "text-right"}>
                          {t("emails.templates.table.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className={`font-medium ${isRTL ? "text-right" : ""}`}>{template.name}</TableCell>
                          <TableCell className={isRTL ? "text-right" : ""}>{getTypeBadge(template.type, t)}</TableCell>
                          <TableCell className={`max-w-xs truncate hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                            {template.subject}
                          </TableCell>
                          <TableCell className={`text-muted-foreground text-sm ${isRTL ? "text-right" : ""}`}>
                            {formatDateValue(template.lastModified, locale, notAvailableText)}
                          </TableCell>
                          <TableCell className={isRTL ? "text-left" : "text-right"}>
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={t("common.view")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={t("common.edit")}
                                onClick={() => {
                                  setSelectedTemplate(template)
                                  setIsTemplateEditorOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden space-y-4">
                  {emailTemplates.map((template) => {
                    const modifiedLabel = formatDateValue(template.lastModified, locale, notAvailableText)
                    const modifiedText = t("emails.templates.mobile.modified").replace("{date}", modifiedLabel)

                    return (
                      <Card key={template.id} className={isRTL ? "text-right" : ""}>
                        <CardContent className="p-4">
                          <div className={`flex items-start justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{template.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.subject}</p>
                            </div>
                            <div className={`flex items-center gap-1 ${isRTL ? "mr-2 flex-row-reverse" : "ml-2"}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={t("common.view")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={t("common.edit")}
                                onClick={() => {
                                  setSelectedTemplate(template)
                                  setIsTemplateEditorOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                              {getTypeBadge(template.type, t)}
                            </div>
                            <span className="text-xs text-muted-foreground">{modifiedText}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 ${isRTL ? "sm:flex-row-reverse" : ""}`}
            >
              <CardTitle className={`text-lg md:text-xl ${isRTL ? "text-right" : "text-left"}`}>
                {t("emails.campaigns.title")}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCampaign(null)
                  setIsCampaignEditorOpen(true)
                }}
                className={`w-full sm:w-auto ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("emails.campaigns.create")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block">
                <Table dir={dir}>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? "text-right" : ""}>{t("emails.campaigns.table.name")}</TableHead>
                      <TableHead className={isRTL ? "text-right" : ""}>{t("emails.campaigns.table.recipients")}</TableHead>
                      <TableHead className={isRTL ? "text-right" : ""}>{t("emails.campaigns.table.status")}</TableHead>
                      <TableHead className={isRTL ? "text-right" : ""}>{t("emails.campaigns.table.date")}</TableHead>
                      <TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                        {t("emails.campaigns.table.openRate")}
                      </TableHead>
                      <TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                        {t("emails.campaigns.table.clickRate")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-left" : "text-right"}>
                        {t("emails.campaigns.table.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailCampaigns.map((campaign) => {
                      const scheduledLabel = formatDateValue(campaign.scheduledDate, locale, notScheduledText)
                      const openRateLabel = formatPercentageValue(campaign.openRate, locale, notAvailableText)
                      const clickRateLabel = formatPercentageValue(campaign.clickRate, locale, notAvailableText)

                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className={`font-medium ${isRTL ? "text-right" : ""}`}>{campaign.name}</TableCell>
                          <TableCell className={isRTL ? "text-right" : ""}>
                            {campaign.recipients.toLocaleString(locale)}
                          </TableCell>
                          <TableCell className={isRTL ? "text-right" : ""}>{getStatusBadge(campaign.status, t)}</TableCell>
                          <TableCell className={`text-muted-foreground text-sm ${isRTL ? "text-right" : ""}`}>
                            {scheduledLabel}
                          </TableCell>
                          <TableCell className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                            {openRateLabel}
                          </TableCell>
                          <TableCell className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                            {clickRateLabel}
                          </TableCell>
                          <TableCell className={isRTL ? "text-left" : "text-right"}>
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={t("common.view")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={t("common.edit")}
                                onClick={() => {
                                  setSelectedCampaign(campaign)
                                  setIsCampaignEditorOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-4">
                {emailCampaigns.map((campaign) => {
                  const scheduledLabel = formatDateValue(campaign.scheduledDate, locale, notScheduledText)
                  const openRateLabel = formatPercentageValue(campaign.openRate, locale, notAvailableText)
                  const clickRateLabel = formatPercentageValue(campaign.clickRate, locale, notAvailableText)
                  const recipientsLabel = t("emails.campaigns.mobile.recipients").replace(
                    "{count}",
                    campaign.recipients.toLocaleString(locale),
                  )
                  const dateLabel = campaign.scheduledDate
                    ? t("emails.campaigns.mobile.date").replace("{date}", scheduledLabel)
                    : t("emails.campaigns.mobile.noDate")
                  const metricsLabel = t("emails.campaigns.mobile.metrics")
                    .replace("{open}", openRateLabel)
                    .replace("{click}", clickRateLabel)

                  return (
                    <Card key={campaign.id} className={isRTL ? "text-right" : ""}>
                      <CardContent className="p-4">
                        <div className={`flex items-start justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm">{campaign.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{recipientsLabel}</p>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? "mr-2 flex-row-reverse" : "ml-2"}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label={t("common.view")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label={t("common.edit")}
                              onClick={() => {
                                setSelectedCampaign(campaign)
                                setIsCampaignEditorOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            {getStatusBadge(campaign.status, t)}
                          </div>
                          <div className={isRTL ? "text-left" : "text-right"}>
                            <div className="text-xs text-muted-foreground">{dateLabel}</div>
                            <div className="text-xs text-muted-foreground">{metricsLabel}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 ${isRTL ? "sm:flex-row-reverse" : ""}`}
            >
              <CardTitle className={`text-lg md:text-xl ${isRTL ? "text-right" : "text-left"}`}>
                {t("emails.logs.title")}
              </CardTitle>
              <div
                className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${isRTL ? "sm:flex-row-reverse" : ""}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className={`w-full sm:w-auto ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <RefreshCw className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("emails.logs.refresh")}
                </Button>
                {selectedLogEntries.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportSelectedLogs}
                    className={`w-full sm:w-auto bg-transparent ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Download className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("emails.logs.export").replace(
                      "{count}",
                      selectedLogEntries.length.toLocaleString(locale),
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}
                >
                  <div className="relative flex-1">
                    <Search
                      className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`}
                    />
                    <Input
                      placeholder={t("emails.logs.searchPlaceholder")}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"}`}
                      value={logSearchTerm}
                      onChange={(e) => setLogSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
                      <SelectTrigger
                        className={`w-full sm:w-[150px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
                      >
                        <SelectValue placeholder={t("emails.logs.filters.type.placeholder")} />
                      </SelectTrigger>
                      <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                        <SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
                          {t("emails.logs.filters.type.options.all")}
                        </SelectItem>
                        <SelectItem value="transactional" className={isRTL ? "justify-end text-right" : ""}>
                          {t("emails.logs.filters.type.options.transactional")}
                        </SelectItem>
                        <SelectItem value="marketing" className={isRTL ? "justify-end text-right" : ""}>
                          {t("emails.logs.filters.type.options.marketing")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={logStatusFilter} onValueChange={setLogStatusFilter}>
                      <SelectTrigger
                        className={`w-full sm:w-[150px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
                      >
                        <SelectValue placeholder={t("emails.logs.filters.status.placeholder")} />
                      </SelectTrigger>
                      <SelectContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                        <SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
                          {t("emails.logs.filters.status.options.all")}
                        </SelectItem>
                        <SelectItem value="sent" className={isRTL ? "justify-end text-right" : ""}>
                          {t("emails.logs.filters.status.options.sent")}
                        </SelectItem>
                        <SelectItem value="failed" className={isRTL ? "justify-end text-right" : ""}>
                          {t("emails.logs.filters.status.options.failed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="rounded-md border">
                    <Table dir={dir}>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={`w-12 ${isRTL ? "text-right" : ""}`}>
                            <Checkbox
                              checked={
                                selectedLogEntries.length === filteredEmailLogs.length && filteredEmailLogs.length > 0
                              }
                              onCheckedChange={(checked) => handleSelectAllLogs(Boolean(checked))}
                              aria-label={t("emails.logs.table.select")}
                            />
                          </TableHead>
                          <TableHead className={isRTL ? "text-right" : ""}>
                            {t("emails.logs.table.recipient")}
                          </TableHead>
                          <TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                            {t("emails.logs.table.subject")}
                          </TableHead>
                          <TableHead className={isRTL ? "text-right" : ""}>
                            {t("emails.logs.table.type")}
                          </TableHead>
                          <TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                            {t("emails.logs.table.template")}
                          </TableHead>
                          <TableHead className={isRTL ? "text-right" : ""}>
                            {t("emails.logs.table.status")}
                          </TableHead>
                          <TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                            {t("emails.logs.table.sent")}
                          </TableHead>
                          <TableHead className={`hidden xl:table-cell ${isRTL ? "text-right" : ""}`}>
                            {t("emails.logs.table.engagement")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmailLogs.map((log) => {
                          const sentLabel = formatDateTimeValue(log.date, locale, notAvailableText)

                          return (
                            <TableRow key={log.id}>
                              <TableCell className={isRTL ? "text-right" : ""}>
                                <Checkbox
                                  checked={selectedLogEntries.includes(log.id)}
                                  onCheckedChange={(checked) => handleLogEntrySelection(log.id, Boolean(checked))}
                                  aria-label={t("emails.logs.table.select")}
                                />
                              </TableCell>
                              <TableCell>
                                <div className={isRTL ? "text-right" : ""}>
                                  <div className="font-medium text-sm">{log.recipientName}</div>
                                  <div className="text-xs text-muted-foreground">{log.recipient}</div>
                                </div>
                              </TableCell>
                              <TableCell className={`max-w-xs hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                                <div className="truncate" title={log.subject}>
                                  {log.subject}
                                </div>
                              </TableCell>
                              <TableCell className={isRTL ? "text-right" : ""}>{getTypeBadge(log.type, t)}</TableCell>
                              <TableCell className={`text-muted-foreground text-sm hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                                {log.template}
                              </TableCell>
                              <TableCell>
                                <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                  {getStatusBadge(log.status, t)}
                                  {log.status === "failed" && log.failureReason && (
                                    <div className="text-xs text-red-600">{log.failureReason}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className={`text-muted-foreground text-xs hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
                                {sentLabel}
                              </TableCell>
                              <TableCell className={`hidden xl:table-cell ${isRTL ? "text-right" : ""}`}>
                                <div className="space-y-1">
                                  {log.openedAt && (
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                      <Eye className="h-3 w-3" />
                                      {t("emails.logs.activity.opened")}
                                    </div>
                                  )}
                                  {log.clickedAt && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600">
                                      <Mail className="h-3 w-3" />
                                      {t("emails.logs.activity.clicked")}
                                    </div>
                                  )}
                                  {log.bounced && (
                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                      <RefreshCw className="h-3 w-3" />
                                      {t("emails.logs.activity.bounced")}
                                    </div>
                                  )}
                                  {log.unsubscribed && (
                                    <div className="flex items-center gap-1 text-xs text-orange-600">
                                      <Users className="h-3 w-3" />
                                      {t("emails.logs.activity.unsubscribed")}
                                    </div>
                                  )}
                                  {!log.openedAt &&
                                    !log.clickedAt &&
                                    !log.bounced &&
                                    !log.unsubscribed &&
                                    log.status === "sent" && (
                                      <div className="text-xs text-muted-foreground">
                                        {t("emails.logs.activity.none")}
                                      </div>
                                    )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="md:hidden space-y-4">
                  <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Checkbox
                      checked={
                        selectedLogEntries.length === filteredEmailLogs.length && filteredEmailLogs.length > 0
                      }
                      onCheckedChange={(checked) => handleSelectAllLogs(Boolean(checked))}
                      aria-label={t("emails.logs.table.select")}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedLogEntries.length > 0
                        ? t("emails.logs.selected").replace(
                            "{count}",
                            selectedLogEntries.length.toLocaleString(locale),
                          )
                        : ""}
                    </span>
                  </div>
                  {filteredEmailLogs.map((log) => {
                    const sentLabel = formatDateTimeValue(log.date, locale, notAvailableText)

                    return (
                      <Card key={log.id} className={isRTL ? "text-right" : ""}>
                        <CardContent className="p-4">
                          <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Checkbox
                              checked={selectedLogEntries.includes(log.id)}
                              onCheckedChange={(checked) => handleLogEntrySelection(log.id, Boolean(checked))}
                              className="mt-1"
                              aria-label={t("emails.logs.table.select")}
                            />
                            <div className="flex-1 min-w-0">
                              <div className={`flex items-start justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm">{log.recipientName}</h3>
                                  <p className="text-xs text-muted-foreground truncate">{log.recipient}</p>
                                </div>
                                <div className={isRTL ? "mr-2" : "ml-2"}>{getStatusBadge(log.status, t)}</div>
                              </div>
                              <p className="text-sm mb-2 line-clamp-2">{log.subject}</p>
                              <div
                                className={`flex items-center justify-between text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                              >
                                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                  {getTypeBadge(log.type, t)}
                                  <span>{log.template}</span>
                                </div>
                                <span>{sentLabel}</span>
                              </div>
                              {(log.openedAt || log.clickedAt || log.bounced || log.unsubscribed) && (
                                <div className={`flex items-center gap-3 mt-2 text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
                                  {log.openedAt && (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <Eye className="h-3 w-3" />
                                      {t("emails.logs.activity.opened")}
                                    </div>
                                  )}
                                  {log.clickedAt && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                      <Mail className="h-3 w-3" />
                                      {t("emails.logs.activity.clicked")}
                                    </div>
                                  )}
                                  {log.bounced && (
                                    <div className="flex items-center gap-1 text-red-600">
                                      <RefreshCw className="h-3 w-3" />
                                      {t("emails.logs.activity.bounced")}
                                    </div>
                                  )}
                                  {log.unsubscribed && (
                                    <div className="flex items-center gap-1 text-orange-600">
                                      <Users className="h-3 w-3" />
                                      {t("emails.logs.activity.unsubscribed")}
                                    </div>
                                  )}
                                </div>
                              )}
                              {log.status === "failed" && log.failureReason && (
                                <div className="text-xs text-red-600 mt-1">{log.failureReason}</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {filteredEmailLogs.length === 0 && (
                  <div className={`text-center py-8 text-muted-foreground ${isRTL ? "text-right" : "text-center"}`}>
                    {t("emails.logs.empty")}
                  </div>
                )}

                <div
                  className={`flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground ${isRTL ? "sm:flex-row-reverse" : ""}`}
                >
                  <div className={`text-center sm:text-left ${isRTL ? "sm:text-right" : ""}`}>
                    {t("emails.logs.showing")
                      .replace("{current}", filteredEmailLogs.length.toLocaleString(locale))
                      .replace("{total}", emailLogs.length.toLocaleString(locale))}
                    {selectedLogEntries.length > 0 && (
                      <span className={isRTL ? "mr-2" : "ml-2"}>
                        (
                        {t("emails.logs.selected").replace(
                          "{count}",
                          selectedLogEntries.length.toLocaleString(locale),
                        )}
                        )
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Button variant="outline" size="sm" disabled>
                      {t("common.previous")}
                    </Button>
                    <span>
                      {t("emails.logs.pagination.page")
                        .replace("{current}", "1")
                        .replace("{total}", "1")}
                    </span>
                    <Button variant="outline" size="sm" disabled>
                      {t("common.next")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Through Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.4%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">-8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Email Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
                Email analytics chart would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EmailTemplateEditor
        template={selectedTemplate}
        isOpen={isTemplateEditorOpen}
        onClose={() => {
          setIsTemplateEditorOpen(false)
          setSelectedTemplate(null)
        }}
        onSave={(template) => {
          // Handle template save logic here
        }}
      />

      <EmailCampaignEditor
        campaign={selectedCampaign}
        isOpen={isCampaignEditorOpen}
        onClose={() => {
          setIsCampaignEditorOpen(false)
          setSelectedCampaign(null)
        }}
        onSave={(campaign) => {
          // Handle campaign save logic here
        }}
      />
    </div>
  )
}
