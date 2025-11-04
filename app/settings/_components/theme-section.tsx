"use client"

import { useState } from "react"
import { CheckCircle2, Edit2, Sparkles } from "lucide-react"

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

import type { SectionCommonProps } from "./types"

interface ThemeOccasion {
  id: string
  nameKey: string
  descriptionKey: string
  gradient: string
  active: boolean
  previewImage: string
}

export function ThemeSection({ dir, isRTL, t }: SectionCommonProps) {
  const [occasions, setOccasions] = useState<ThemeOccasion[]>([
    {
      id: "default",
      nameKey: "settings.detail.theme.occasions.default.name",
      descriptionKey: "settings.detail.theme.occasions.default.description",
      gradient: "from-slate-500 to-slate-600",
      active: true,
      previewImage: "/placeholder.svg?height=128&width=400&text=Default+Theme",
    },
    {
      id: "ramadan",
      nameKey: "settings.detail.theme.occasions.ramadan.name",
      descriptionKey: "settings.detail.theme.occasions.ramadan.description",
      gradient: "from-purple-600 to-indigo-600",
      active: false,
      previewImage: "/placeholder.svg?height=128&width=400&text=Ramadan+Theme",
    },
    {
      id: "eidFitr",
      nameKey: "settings.detail.theme.occasions.eidFitr.name",
      descriptionKey: "settings.detail.theme.occasions.eidFitr.description",
      gradient: "from-emerald-500 to-teal-600",
      active: false,
      previewImage: "/placeholder.svg?height=128&width=400&text=Eid+Al-Fitr",
    },
    {
      id: "eidAdha",
      nameKey: "settings.detail.theme.occasions.eidAdha.name",
      descriptionKey: "settings.detail.theme.occasions.eidAdha.description",
      gradient: "from-amber-500 to-orange-600",
      active: false,
      previewImage: "/placeholder.svg?height=128&width=400&text=Eid+Al-Adha",
    },
    {
      id: "nationalDay",
      nameKey: "settings.detail.theme.occasions.nationalDay.name",
      descriptionKey: "settings.detail.theme.occasions.nationalDay.description",
      gradient: "from-green-600 to-green-700",
      active: false,
      previewImage: "/placeholder.svg?height=128&width=400&text=National+Day",
    },
    {
      id: "newYear",
      nameKey: "settings.detail.theme.occasions.newYear.name",
      descriptionKey: "settings.detail.theme.occasions.newYear.description",
      gradient: "from-pink-500 to-rose-600",
      active: false,
      previewImage: "/placeholder.svg?height=128&width=400&text=New+Year",
    },
  ])

  const alignmentClass = isRTL ? "text-right" : "text-left"

  const handleActivate = (id: string) => {
    setOccasions(
      occasions.map((occasion) => ({
        ...occasion,
        active: occasion.id === id,
      }))
    )
  }

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header Card */}
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.theme.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.theme.description")}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Active Theme */}
      <Card className="border-border/60 bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-sm">
        <CardHeader className={alignmentClass}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">
              {t("settings.detail.theme.currentTheme")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {occasions.map((occasion) => {
            if (!occasion.active) return null
            return (
              <div
                key={occasion.id}
                className={`flex items-center gap-4 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={occasion.previewImage}
                    alt={t(occasion.nameKey)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className={`flex-1 ${alignmentClass}`}>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(occasion.nameKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(occasion.descriptionKey)}
                  </p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Occasions Grid */}
      <div>
        <div className={`mb-4 ${alignmentClass}`}>
          <h2 className="text-xl font-semibold text-foreground">
            {t("settings.detail.theme.occasions.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("settings.detail.theme.occasions.description")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <Card
              key={occasion.id}
              className={`relative overflow-hidden border-border/60 shadow-sm pt-0 transition-all hover:shadow-md ${
                occasion.active ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              {occasion.active && (
                <div className="absolute right-3 top-3 z-10">
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {t("settings.detail.theme.activeTheme")}
                  </Badge>
                </div>
              )}

              <div
                className={`relative h-32 overflow-hidden bg-gradient-to-br ${occasion.gradient}`}
              >
                <img
                  src={occasion.previewImage}
                  alt={t(occasion.nameKey)}
                  className="h-full w-full object-cover opacity-90"
                />
              </div>

              <CardHeader className={alignmentClass}>
                <CardTitle className="text-lg">{t(occasion.nameKey)}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {t(occasion.descriptionKey)}
                </CardDescription>
              </CardHeader>

              <CardFooter
                className={`flex gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    /* Edit theme */
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className={isRTL ? "mr-2" : "ml-2"}>
                    {t("settings.detail.theme.actions.edit")}
                  </span>
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={occasion.active}
                  onClick={() => handleActivate(occasion.id)}
                >
                  {occasion.active
                    ? t("settings.detail.theme.activeTheme")
                    : t("settings.detail.theme.actions.activate")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
