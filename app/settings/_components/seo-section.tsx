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

import type { SectionCommonProps } from "./types"

const seoFormCards = [
  {
    suffix: "ar",
    languageKey: "ar" as const,
    textDir: "rtl" as const,
  },
  {
    suffix: "en",
    languageKey: "en" as const,
    textDir: "ltr" as const,
  },
] as const

export function SeoSection({ dir, isRTL, t }: SectionCommonProps) {
  const renderSeoForm = (
    card: (typeof seoFormCards)[number],
  ) => {
    const alignmentClass = card.textDir === "rtl" ? "text-right" : "text-left"

    return (
      <Card
        key={card.suffix}
        dir={dir}
        className="border-border/60 bg-background/70 shadow-sm lg:shadow-md"
      >
        <CardHeader className={isRTL ? "text-right" : "text-left"}>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                {t("settings.detail.seo.heading")}
              </CardTitle>
              <CardDescription>
                {t("settings.detail.seo.description")}
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

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor={`homepage-title-${card.suffix}`}
              className={alignmentClass}
            >
              {t("settings.detail.seo.homepageTitle.label")}
            </Label>
            <Input
              id={`homepage-title-${card.suffix}`}
              dir={card.textDir}
              placeholder={t(
                `settings.detail.seo.homepageTitle.placeholder.${card.languageKey}`
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`meta-description-${card.suffix}`}
              className={alignmentClass}
            >
              {t("settings.detail.seo.metaDescription.label")}
            </Label>
            <Textarea
              id={`meta-description-${card.suffix}`}
              dir={card.textDir}
              rows={5}
              placeholder={t(
                `settings.detail.seo.metaDescription.placeholder.${card.languageKey}`
              )}
            />
            <p className={`text-xs text-muted-foreground ${alignmentClass}`}>
              {t("settings.detail.seo.metaDescription.helper")}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`keywords-${card.suffix}`}
              className={alignmentClass}
            >
              {t("settings.detail.seo.keywords.label")}
            </Label>
            <Textarea
              id={`keywords-${card.suffix}`}
              dir={card.textDir}
              rows={3}
              placeholder={t(
                `settings.detail.seo.keywords.placeholder.${card.languageKey}`
              )}
            />
            <p className={`text-xs text-muted-foreground ${alignmentClass}`}>
              {t("settings.detail.seo.keywords.helper")}
            </p>
          </div>
        </CardContent>

        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">{t("settings.detail.actions.saveSeo")}</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6" dir={dir}>
      <div className="grid gap-6 lg:grid-cols-2">
        {seoFormCards.map((card) => renderSeoForm(card))}

        <Card className="border-border/60 bg-background/60 shadow-sm lg:col-span-2">
          <CardHeader className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t("settings.detail.seo.robots.title")}</CardTitle>
            <CardDescription>
              {t("settings.detail.seo.robots.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="robots-editor">
              {t("settings.detail.seo.robots.label")}
            </Label>
            <Textarea
              id="robots-editor"
              rows={10}
              dir={isRTL ? "rtl" : "ltr"}
              placeholder={t("settings.detail.seo.robots.placeholder")}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.detail.seo.robots.helper")}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button>{t("settings.detail.actions.saveRobots")}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
