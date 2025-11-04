"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { SectionCommonProps } from "./types"

const statusClasses: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  inactive: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  testing: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
}

export function PaymentsSection({ dir, isRTL, t }: SectionCommonProps) {
  const alignmentClass = isRTL ? "text-right" : "text-left"

  type GatewayStatus = "active" | "inactive" | "testing"
  type PaymentGateway = {
    id: string
    name: string
    logo: string
    status: GatewayStatus
    fields: { key: string; label: string }[]
  }

  const [testSchedule, setTestSchedule] = useState<string>("hourly")

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: "paypal",
      name: t("settings.security.payments.gatewayNames.paypal"),
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
      status: "active",
      fields: [
        { key: "clientId", label: t("settings.security.payments.fields.clientId") },
        { key: "clientSecret", label: t("settings.security.payments.fields.clientSecret") },
      ],
    },
    {
      id: "paylink",
      name: t("settings.security.payments.gatewayNames.paylink"),
      logo: "https://ps.w.org/paylink/assets/icon-256x256.png?rev=3152760",
      status: "inactive",
      fields: [
        { key: "apiKey", label: t("settings.security.payments.fields.apiKey") },
        { key: "secretKey", label: t("settings.security.payments.fields.secretKey") },
      ],
    },
    {
      id: "stcpay",
      name: t("settings.security.payments.gatewayNames.stcpay"),
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Stc_pay.svg/105px-Stc_pay.svg.png",
      status: "active",
      fields: [
        { key: "merchantId", label: t("settings.security.payments.fields.merchantId") },
        { key: "apiKey", label: t("settings.security.payments.fields.apiKey") },
      ],
    },
    {
      id: "tamara",
      name: t("settings.security.payments.gatewayNames.tamara"),
      logo: "https://cdn.tamara.co/assets/svg/tamara-logo-badge-en.svg",
      status: "testing",
      fields: [
        { key: "apiKey", label: t("settings.security.payments.fields.apiKey") },
        { key: "merchantId", label: t("settings.security.payments.fields.merchantId") },
      ],
    },
    {
      id: "tap",
      name: t("settings.security.payments.gatewayNames.tap"),
      logo: "https://avatars.githubusercontent.com/u/19837565?s=280&v=4",
      status: "inactive",
      fields: [
        { key: "publicKey", label: t("settings.security.payments.fields.publicKey") },
        { key: "secretKey", label: t("settings.security.payments.fields.secretKey") },
      ],
    },
  ])

  const toggleGateway = (id: string) => {
    setPaymentGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: g.status === "active" ? "inactive" : "active" } : g))
    )
  }

  const testAllGateways = () => {
    // remember previous statuses so we can restore them after testing
    const previous = paymentGateways.map((g) => ({ id: g.id, status: g.status }))

    // set all to testing
    setPaymentGateways((prev) => prev.map((g) => ({ ...g, status: "testing" })))

    // after delay, restore each gateway to its previous status
    setTimeout(() => {
      setPaymentGateways((current) =>
        current.map((g) => {
          const prev = previous.find((p) => p.id === g.id)
          return { ...g, status: prev ? prev.status as any : g.status }
        })
      )
    }, 2000)
  }

  return (
    <div className="space-y-6" dir={dir}>
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.security.payments.title")}</CardTitle>
          <CardDescription>
            {t("settings.security.payments.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Label className={alignmentClass}>{t("settings.security.payments.testSchedule") || "Test schedule"}</Label>
              <Select value={testSchedule} onValueChange={setTestSchedule}>
                <SelectTrigger className="w-[160px]">
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
            <div>
              <Button size="sm" variant="outline" onClick={testAllGateways}>
                {t("settings.security.payments.testAll") || "Test all"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {paymentGateways.map((gateway) => (
          <Card
            key={gateway.id}
            className="border-border/60 bg-background/60 shadow-sm"
            dir={dir}
          >
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/60 bg-background p-2">
                    <img
                      src={gateway.logo}
                      alt={gateway.name}
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                  <div className={alignmentClass}>
                    <CardTitle className="text-lg">{gateway.name}</CardTitle>
                    <div className={`mt-1 flex items-center gap-2 ${isRTL ? "justify-end" : ""}`}>
                      <Badge className={statusClasses[gateway.status]}>
                        {t(`settings.security.payments.status.${gateway.status}`)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Switch
                  checked={gateway.status === "active"}
                  onCheckedChange={() => toggleGateway(gateway.id)}
                  aria-label={gateway.name}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {gateway.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${gateway.id}-${field.key}`} className={alignmentClass}>
                    {field.label}
                  </Label>
                  <Input
                    id={`${gateway.id}-${field.key}`}
                    type="password"
                    dir={dir}
                    placeholder={t("settings.security.payments.placeholder.key")}
                  />
                </div>
              ))}

              <div className={`pt-2 text-xs text-muted-foreground ${alignmentClass}`}>
                {t("settings.security.payments.neverTested")}
              </div>
            </CardContent>

            <CardFooter
              className={`flex flex-col gap-2 sm:flex-row ${
                isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
              }`}
            >
              <Button variant="outline" className="sm:w-auto">
                {t("settings.security.payments.test")}
              </Button>
              <Button className="sm:w-auto">
                {t("common.save")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
