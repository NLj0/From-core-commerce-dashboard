"use client"

import Link from "next/link"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SECTION_DEFINITIONS } from "./sections"
import { useLanguage } from "@/providers/language-provider"

export default function SettingsPage() {
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const DirectionalArrow = isRTL ? ArrowLeft : ArrowRight

  return (
    <div className="space-y-6" dir={dir}>
      <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
        <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-base">{t("settings.subtitle")}</p>
      </div>

      <p className={`text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}>
        {t("settings.overview.intro")}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {SECTION_DEFINITIONS.map(({ key, icon: Icon, accent, path }) => {
          const title = t(`settings.overview.sections.${key}.title`)
          const description = t(`settings.overview.sections.${key}.description`)

          return (
            <Link
              key={key}
              href={path}
              className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="flex h-full flex-col gap-4 border border-border/50 py-5 shadow-sm transition ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <CardContent className="flex flex-1 flex-col items-center gap-3 text-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold">
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter
                  className={`mt-auto flex w-full pt-0 ${isRTL ? "justify-end" : "justify-start"}`}
                >
                  <Button
                    asChild
                    variant="ghost"
                    className={`gap-2 px-0 text-sm font-medium ${
                      isRTL ? "ml-auto justify-end text-right" : "justify-start"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-2 ${
                        isRTL ? "justify-end" : ""
                      }`}
                    >
                      {t("settings.overview.manage")}
                      <DirectionalArrow className="h-4 w-4" />
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
