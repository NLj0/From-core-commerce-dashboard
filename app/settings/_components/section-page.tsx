"use client"

import type { ComponentType } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/providers/language-provider"

import {
  SECTION_DEFINITION_MAP,
  type SectionKey,
} from "../sections"
import { BasicSection } from "./basic-section"
import { CurrenciesSection } from "./currencies-section"
import { IntegrationsSection } from "./integrations-section"
import { MaintenanceSection } from "./maintenance-section"
import { NotificationsSection } from "./notifications-section"
import { PaymentsSection } from "./payments-section"
import { PlaceholderSection } from "./placeholder-section"
import { SeoSection } from "./seo-section"
import { StaffSection } from "./staff-section"
import { ThemeSection } from "./theme-section"
import type { SectionCommonProps } from "./types"

const SECTION_COMPONENTS: Partial<Record<SectionKey, ComponentType<SectionCommonProps>>> = {
  basic: BasicSection,
  currencies: CurrenciesSection,
  integrations: IntegrationsSection,
  maintenance: MaintenanceSection,
  notifications: NotificationsSection,
  payments: PaymentsSection,
  seo: SeoSection,
  staff: StaffSection,
  theme: ThemeSection,
}

type SettingsSectionPageProps = {
  sectionKey: SectionKey
}

export function SettingsSectionPage({ sectionKey }: SettingsSectionPageProps) {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const BackArrow = isRTL ? ArrowLeft : ArrowRight

  const section = SECTION_DEFINITION_MAP[sectionKey]
  const SectionComponent = SECTION_COMPONENTS[sectionKey] ?? PlaceholderSection
  const buttonOrderClass = "order-2"
  const headerOrderClass = "order-1"

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/settings")}
          className={`${buttonOrderClass} flex flex-row-reverse gap-2 px-0 text-sm font-medium ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <span>{t("settings.detail.back")}</span>
          <BackArrow className="h-4 w-4" />
        </Button>

        <div
          className={`${headerOrderClass} flex items-center gap-3 ${
            isRTL ? "text-right" : ""
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${section.accent}`}
          >
            <section.icon className="h-6 w-6" />
          </div>
          <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-2xl font-semibold text-foreground">
              {t(`settings.overview.sections.${section.key}.title`)}
            </h1>
            <p className="text-muted-foreground">
              {t(`settings.overview.sections.${section.key}.description`)}
            </p>
          </div>
        </div>
      </div>

      <SectionComponent dir={dir as "ltr" | "rtl"} isRTL={isRTL} t={t} />
    </div>
  )
}
