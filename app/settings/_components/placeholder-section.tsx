"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import type { SectionCommonProps } from "./types"

export function PlaceholderSection({ dir, t }: SectionCommonProps) {
  return (
    <Card className="border-border/60 bg-background/60 shadow-sm" dir={dir}>
      <CardContent className="space-y-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <p>{t("settings.detail.comingSoon")}</p>
      </CardContent>
    </Card>
  )
}
