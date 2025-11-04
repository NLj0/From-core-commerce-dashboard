import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Coins,
  CreditCard,
  Palette,
  Plug,
  Search,
  Settings,
  ShieldAlert,
  Store,
  Users,
} from "lucide-react"

export type SectionKey =
  | "basic"
  | "integrations"
  | "payments"
  | "store"
  | "currencies"
  | "maintenance"
  | "notifications"
  | "staff"
  | "seo"
  | "theme"

export type SettingSectionDefinition = {
  key: SectionKey
  icon: LucideIcon
  accent: string
  path: string
}

export const SECTION_DEFINITIONS: SettingSectionDefinition[] = [
  {
    key: "basic",
    icon: Settings,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    path: "/settings/basic",
  },
  {
    key: "integrations",
    icon: Plug,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    path: "/settings/integrations",
  },
  {
    key: "payments",
    icon: CreditCard,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    path: "/settings/payments",
  },
  {
    key: "store",
    icon: Store,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    path: "/settings/store",
  },
  {
    key: "currencies",
    icon: Coins,
    accent: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    path: "/settings/currencies",
  },
  {
    key: "maintenance",
    icon: ShieldAlert,
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    path: "/settings/maintenance",
  },
  {
    key: "notifications",
    icon: Bell,
    accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    path: "/settings/notifications",
  },
  {
    key: "staff",
    icon: Users,
    accent: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    path: "/settings/staff",
  },
  {
    key: "seo",
    icon: Search,
    accent: "bg-lime-500/10 text-lime-600 dark:text-lime-400",
    path: "/settings/seo",
  },
  {
    key: "theme",
    icon: Palette,
    accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    path: "/settings/theme",
  },
]

export const SECTION_DEFINITION_MAP: Record<SectionKey, SettingSectionDefinition> =
  SECTION_DEFINITIONS.reduce((acc, definition) => {
    acc[definition.key] = definition
    return acc
  }, {} as Record<SectionKey, SettingSectionDefinition>)

export function isSectionKey(value: string): value is SectionKey {
  return SECTION_DEFINITIONS.some((definition) => definition.key === value)
}
