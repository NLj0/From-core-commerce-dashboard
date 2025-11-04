"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

import type { SectionCommonProps } from "./types"

export function MaintenanceSection({ dir, isRTL, t }: SectionCommonProps) {
  const maintenanceMessageCards = [
    {
      suffix: "en",
      languageKey: "en" as const,
      textDir: "ltr" as const,
    },
    {
      suffix: "ar",
      languageKey: "ar" as const,
      textDir: "rtl" as const,
    },
  ]

  const alignmentClass = isRTL ? "text-right" : "text-left"

  return (
    <div className="space-y-6" dir={dir}>
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.maintenance.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.maintenance.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className={`${alignmentClass} space-y-1`}>
              <Label htmlFor="maintenance-status">
                {t("settings.detail.maintenance.status.label")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.detail.maintenance.status.helper")}
              </p>
            </div>
            <Switch
              id="maintenance-status"
              defaultChecked
              aria-label={t("settings.detail.maintenance.status.label")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maintenance-start" className={alignmentClass}>
                {t("settings.detail.maintenance.schedule.start")}
              </Label>
              <Input
                id="maintenance-start"
                type="datetime-local"
                dir={dir}
                placeholder="2024-06-01T09:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance-end" className={alignmentClass}>
                {t("settings.detail.maintenance.schedule.end")}
              </Label>
              <Input
                id="maintenance-end"
                type="datetime-local"
                dir={dir}
                placeholder="2024-06-01T17:00"
              />
            </div>
          </div>

          <p className={`${alignmentClass} text-xs text-muted-foreground`}>
            {t("settings.detail.maintenance.schedule.helper")}
          </p>
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">
            {t("settings.detail.actions.saveMaintenance")}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {maintenanceMessageCards.map((card) => (
          <Card
            key={card.suffix}
            dir={dir}
            className="border-border/60 bg-background/60 shadow-sm"
          >
            <CardHeader className={alignmentClass}>
              <div className="flex items-start justify-between gap-3">
                <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                  <CardTitle className="text-lg font-semibold">
                    {t("settings.detail.maintenance.message.label")}
                  </CardTitle>
                  <CardDescription>
                    {t("settings.detail.maintenance.message.helper")}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-medium uppercase"
                >
                  {t(`settings.detail.languages.${card.languageKey}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                id={`maintenance-message-${card.suffix}`}
                dir={card.textDir}
                rows={5}
                placeholder={t(
                  `settings.detail.maintenance.message.placeholder.${card.languageKey}`
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 bg-background/60 shadow-sm" dir={dir}>
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.maintenance.allowedIPs.label")}</CardTitle>
          <CardDescription>
            {t("settings.detail.maintenance.allowedIPs.helper")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            id="maintenance-allowed-ips"
            dir={isRTL ? "rtl" : "ltr"}
            rows={4}
            placeholder={t("settings.detail.maintenance.allowedIPs.placeholder")}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  )
}
