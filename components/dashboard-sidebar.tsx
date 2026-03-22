"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Settings,
  Store,
  X,
  Percent,
  FolderOpen,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/providers/language-provider"

const sidebarItems = [
  {
    titleKey: "navigation.dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    titleKey: "navigation.products",
    href: "/products",
    icon: Package,
  },
  {
    titleKey: "navigation.categories",
    href: "/categories",
    icon: FolderOpen,
  },
  {
    titleKey: "navigation.orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    titleKey: "navigation.customers",
    href: "/customers",
    icon: Users,
  },
  {
    titleKey: "navigation.reviews",
    href: "/reviews",
    icon: Star,
  },
  {
    titleKey: "navigation.coupons",
    href: "/coupons",
    icon: Percent,
  },
  {
    titleKey: "navigation.emails",
    href: "/emails",
    icon: Mail,
  },
  {
    titleKey: "navigation.settings",
    href: "/settings",
    icon: Settings,
  },
]

interface DashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <div
        className={cn(
          "fixed inset-y-0 z-50 flex h-full w-64 flex-col bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isRTL ? "right-0 border-l border-sidebar-border" : "left-0 border-r border-sidebar-border",
          isRTL && isOpen ? "translate-x-0" : !isRTL && isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full",
          isRTL ? "items-end text-right" : "items-start text-left",
        )}
        dir={dir}
      >
        {/* Logo and Store Name */}
        <div className={cn("flex items-center gap-2 p-6 border-b border-sidebar-border", isRTL ? "flex-row-reverse" : "")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary flex-shrink-0">
            <Store className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className={cn("flex flex-col flex-1", isRTL ? "text-right" : "text-left")}>
            <h1 className={cn("text-lg font-semibold text-sidebar-foreground", isRTL && "font-arabic")}>{isRTL ? "لوحة التحكم" : "StoreAdmin"}</h1>
            <p className={cn("text-xs text-muted-foreground", isRTL && "font-arabic")}>{isRTL ? "لوحة تحكم التجارة الإلكترونية" : "E-commerce Dashboard"}</p>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`))
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full h-10 gap-3",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isRTL ? "justify-end" : "justify-start",
                  )}
                  asChild
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose?.()
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex w-full items-center gap-3",
                      isRTL ? "flex-row-reverse text-right" : "text-left",
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className={cn("flex-1 truncate", isRTL && "font-arabic")}>{t(item.titleKey)}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
