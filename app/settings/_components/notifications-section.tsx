"use client"

import { useState } from "react"
import { Bell, Mail, MessageCircle, Clock } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { SectionCommonProps } from "./types"

interface NotificationEvent {
  id: string
  label: string
  description: string
  email: boolean
  whatsapp: boolean
}

const NOTIFICATION_EVENTS: NotificationEvent[] = [
  {
    id: "newOrder",
    label: "settings.detail.notifications.events.newOrder.label",
    description: "settings.detail.notifications.events.newOrder.description",
    email: true,
    whatsapp: true,
  },
  {
    id: "orderStatusChange",
    label: "settings.detail.notifications.events.orderStatusChange.label",
    description: "settings.detail.notifications.events.orderStatusChange.description",
    email: true,
    whatsapp: false,
  },
  {
    id: "orderShipped",
    label: "settings.detail.notifications.events.orderShipped.label",
    description: "settings.detail.notifications.events.orderShipped.description",
    email: true,
    whatsapp: true,
  },
  {
    id: "paymentReceived",
    label: "settings.detail.notifications.events.paymentReceived.label",
    description: "settings.detail.notifications.events.paymentReceived.description",
    email: true,
    whatsapp: false,
  },
  {
    id: "customerMessage",
    label: "settings.detail.notifications.events.customerMessage.label",
    description: "settings.detail.notifications.events.customerMessage.description",
    email: true,
    whatsapp: true,
  },
  {
    id: "newReview",
    label: "settings.detail.notifications.events.newReview.label",
    description: "settings.detail.notifications.events.newReview.description",
    email: true,
    whatsapp: false,
  },
  {
    id: "lowStock",
    label: "settings.detail.notifications.events.lowStock.label",
    description: "settings.detail.notifications.events.lowStock.description",
    email: true,
    whatsapp: true,
  },
  {
    id: "stockOut",
    label: "settings.detail.notifications.events.stockOut.label",
    description: "settings.detail.notifications.events.stockOut.description",
    email: true,
    whatsapp: true,
  },
  {
    id: "abandonedCart",
    label: "settings.detail.notifications.events.abandonedCart.label",
    description: "settings.detail.notifications.events.abandonedCart.description",
    email: true,
    whatsapp: false,
  },
  {
    id: "newsAndUpdates",
    label: "settings.detail.notifications.events.newsAndUpdates.label",
    description: "settings.detail.notifications.events.newsAndUpdates.description",
    email: true,
    whatsapp: false,
  },
]

export function NotificationsSection({ dir, isRTL, t }: SectionCommonProps) {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [emailFrequency, setEmailFrequency] = useState("instant")
  const [whatsappPhone, setWhatsappPhone] = useState("+966501234567")
  const [businessName, setBusinessName] = useState("My Store")
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [quietStartTime, setQuietStartTime] = useState("22:00")
  const [quietEndTime, setQuietEndTime] = useState("08:00")
  const [events, setEvents] = useState<NotificationEvent[]>(NOTIFICATION_EVENTS)

  const alignmentClass = isRTL ? "text-right" : "text-left"

  const toggleEventChannel = (eventId: string, channel: "email" | "whatsapp") => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, [channel]: !event[channel] }
          : event
      )
    )
  }

  const emailTemplate = `
Hello {user_name},

A new order has been placed on {store_name}.

Order Details:
- Order ID: #12345
- Total: {order_total}
- Items: {item_count}

View in Dashboard: {dashboard_link}

Best regards,
{store_name} Team
  `.trim()

  const whatsappTemplate = `
🎉 *New Order!*

Order ID: #12345
Total: {order_total}

Thank you for shopping!`

  return (
    <div className="space-y-6" dir={dir}>
      {/* Email Channel */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <div className="flex items-start justify-between">
            <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>{t("settings.detail.notifications.channels.email.label")}</CardTitle>
              </div>
              <CardDescription>
                {t("settings.detail.notifications.channels.email.description")}
              </CardDescription>
            </div>
            <Badge
              className={
                emailEnabled
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-500/10 text-slate-600 dark:text-slate-300"
              }
            >
              {emailEnabled
                ? t("settings.detail.notifications.channels.email.enabled")
                : t("settings.detail.notifications.channels.email.disabled")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            <Label>{t("settings.detail.notifications.channels.email.label")}</Label>
          </div>

          {emailEnabled && (
            <div className="space-y-4 rounded-lg border border-border/40 bg-muted/10 p-4">
              <div className="space-y-2">
                <Label htmlFor="email-frequency" className={alignmentClass}>
                  {t("settings.detail.notifications.channels.email.frequency")}
                </Label>
                <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                  <SelectTrigger id="email-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir={dir}>
                    <SelectItem value="instant">
                      {t("settings.detail.notifications.channels.email.frequencies.instant")}
                    </SelectItem>
                    <SelectItem value="hourly">
                      {t("settings.detail.notifications.channels.email.frequencies.hourly")}
                    </SelectItem>
                    <SelectItem value="daily">
                      {t("settings.detail.notifications.channels.email.frequencies.daily")}
                    </SelectItem>
                    <SelectItem value="weekly">
                      {t("settings.detail.notifications.channels.email.frequencies.weekly")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className={alignmentClass}>
                    {t("settings.detail.notifications.channels.email.template")}
                  </Label>
                  <Button size="sm" variant="outline">
                    {t("settings.detail.notifications.channels.email.preview")}
                  </Button>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/40 p-3 font-mono text-xs text-muted-foreground">
                  <pre className="whitespace-pre-wrap break-words">{emailTemplate}</pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button variant="outline">{t("common.cancel")}</Button>
          <Button>{t("common.save")}</Button>
        </CardFooter>
      </Card>

      {/* WhatsApp Business Channel */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <div className="flex items-start justify-between">
            <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>{t("settings.detail.notifications.channels.whatsapp.label")}</CardTitle>
              </div>
              <CardDescription>
                {t("settings.detail.notifications.channels.whatsapp.description")}
              </CardDescription>
            </div>
            <Badge
              className={
                whatsappEnabled
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-500/10 text-slate-600 dark:text-slate-300"
              }
            >
              {whatsappEnabled
                ? t("settings.detail.notifications.channels.whatsapp.enabled")
                : t("settings.detail.notifications.channels.whatsapp.disabled")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
            <Label>{t("settings.detail.notifications.channels.whatsapp.label")}</Label>
          </div>

          {whatsappEnabled && (
            <div className="space-y-4 rounded-lg border border-border/40 bg-muted/10 p-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-phone" className={alignmentClass}>
                  {t("settings.detail.notifications.channels.whatsapp.accountNumber")}
                </Label>
                <Input
                  id="whatsapp-phone"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder={t("settings.detail.notifications.channels.whatsapp.accountNumberPlaceholder")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-name" className={alignmentClass}>
                  {t("settings.detail.notifications.channels.whatsapp.businessName")}
                </Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t("settings.detail.notifications.channels.whatsapp.businessNamePlaceholder")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className={alignmentClass}>
                    {t("settings.detail.notifications.channels.whatsapp.messageTemplate")}
                  </Label>
                  <Button size="sm" variant="outline">
                    {t("settings.detail.notifications.channels.whatsapp.preview")}
                  </Button>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/40 p-3 font-mono text-xs text-muted-foreground">
                  <pre className="whitespace-pre-wrap break-words">{whatsappTemplate}</pre>
                </div>
              </div>

              <Button className="w-full sm:w-auto">
                {t("settings.detail.notifications.channels.whatsapp.testMessage")}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button variant="outline">{t("common.cancel")}</Button>
          <Button>{t("common.save")}</Button>
        </CardFooter>
      </Card>

      {/* Notification Events */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.notifications.events.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.notifications.events.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id}>
              <div
                className={`flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <div className={`space-y-1 flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                  <p className="font-medium text-foreground">{t(event.label)}</p>
                  <p className="text-sm text-muted-foreground">{t(event.description)}</p>
                </div>
                <div
                  className={`flex items-center gap-4 whitespace-nowrap ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {emailEnabled && (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={event.email}
                        onCheckedChange={() => toggleEventChannel(event.id, "email")}
                      />
                      <span className="text-xs text-muted-foreground">
                        <Mail className="inline h-3 w-3" />
                      </span>
                    </div>
                  )}
                  {whatsappEnabled && (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={event.whatsapp}
                        onCheckedChange={() => toggleEventChannel(event.id, "whatsapp")}
                      />
                      <span className="text-xs text-muted-foreground">
                        <MessageCircle className="inline h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {index < events.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <CardTitle>{t("settings.detail.notifications.quiet.title")}</CardTitle>
              <CardDescription>
                {t("settings.detail.notifications.quiet.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={quietHoursEnabled} onCheckedChange={setQuietHoursEnabled} />
            <Label>{t("settings.detail.notifications.quiet.enabled")}</Label>
          </div>

          {quietHoursEnabled && (
            <div className={`grid gap-4 sm:grid-cols-2 ${isRTL ? "text-right" : ""}`}>
              <div className="space-y-2">
                <Label htmlFor="quiet-start" className={alignmentClass}>
                  {t("settings.detail.notifications.quiet.startTime")}
                </Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={quietStartTime}
                  onChange={(e) => setQuietStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end" className={alignmentClass}>
                  {t("settings.detail.notifications.quiet.endTime")}
                </Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={quietEndTime}
                  onChange={(e) => setQuietEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {quietHoursEnabled && (
            <div className="rounded-lg border border-border/40 bg-blue-500/5 p-3 text-sm text-muted-foreground">
              {t("settings.detail.notifications.quiet.helper")}
            </div>
          )}
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button variant="outline">{t("common.cancel")}</Button>
          <Button>{t("common.save")}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
