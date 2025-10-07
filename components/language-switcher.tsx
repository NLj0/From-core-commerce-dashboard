"use client"

import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t("language.switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className={locale === "en" ? "bg-accent" : ""}
        >
          <span className="mr-2">🇬🇧</span>
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("ar")}
          className={locale === "ar" ? "bg-accent" : ""}
        >
          <span className="mr-2">🇸🇦</span>
          {t("language.arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
