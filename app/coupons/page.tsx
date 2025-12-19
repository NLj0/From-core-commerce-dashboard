"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Percent, Calendar, Users, TrendingUp } from "lucide-react"
import { CouponDialog } from "@/components/coupon-dialog"
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string

// Mock coupon data
const mockCoupons = [
  {
    id: "1",
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 1000,
    usageCount: 245,
    minOrderValue: 50,
    appliesTo: "all",
    status: "active",
    products: [],
  },
  {
    id: "2",
    code: "SAVE50",
    discountType: "fixed",
    discountValue: 50,
    startDate: "2024-02-01",
    endDate: "2024-03-31",
    usageLimit: 500,
    usageCount: 89,
    minOrderValue: 200,
    appliesTo: "selected",
    status: "active",
    products: ["Wireless Headphones", "Smart Watch"],
  },
  {
    id: "3",
    code: "EXPIRED10",
    discountType: "percentage",
    discountValue: 10,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    usageLimit: 200,
    usageCount: 200,
    minOrderValue: 0,
    appliesTo: "all",
    status: "expired",
    products: [],
  },
  {
    id: "4",
    code: "NEWUSER",
    discountType: "fixed",
    discountValue: 25,
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    usageLimit: 300,
    usageCount: 156,
    minOrderValue: 100,
    appliesTo: "selected",
    status: "active",
    products: ["Gaming Mouse", "Mechanical Keyboard"],
  },
  {
    id: "5",
    code: "DISABLED15",
    discountType: "percentage",
    discountValue: 15,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 100,
    usageCount: 45,
    minOrderValue: 75,
    appliesTo: "all",
    status: "disabled",
    products: [],
  },
]

function getStatusBadge(status: string, t: TranslateFn) {
  const key = `coupons.status.${status}`
  const label = t(key)
  const text = label === key ? status : label

  switch (status) {
    case "active":
      return <Badge variant="success">{text}</Badge>
    case "expired":
      return <Badge variant="gray">{text}</Badge>
    case "disabled":
      return <Badge variant="danger">{text}</Badge>
    default:
      return <Badge variant="outline">{text}</Badge>
  }
}

function formatDiscount(type: string, value: number, t: TranslateFn, locale: string, currencySymbol: string) {
  if (type === "percentage") {
    return t("coupons.discount.percentage").replace("{value}", value.toLocaleString(locale))
  }

  const formattedValue = value.toLocaleString(locale)
  const template = t("coupons.discount.fixed")

  return template
    .replace("{currency}", currencySymbol)
    .replace("{value}", formattedValue)
}

function formatDateLabel(dateString: string, isRTL: boolean) {
  const locale = isRTL ? "ar-EG" : "en-US"
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function formatCurrencyValue(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

export default function CouponsPage() {
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const locale = isRTL ? "ar-EG" : "en-US"
  const currency = isRTL ? "SAR" : "USD"
  const currencySymbol = t("formatting.currency")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)

  const filteredCoupons = mockCoupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCoupons = mockCoupons.length
  const activeCoupons = mockCoupons.filter((c) => c.status === "active").length
  const totalUsage = mockCoupons.reduce((sum, c) => sum + c.usageCount, 0)
  const totalSavings = mockCoupons.reduce((sum, c) => {
    if (c.discountType === "percentage") {
      return sum + c.usageCount * 25 // Estimated average savings per use
    } else {
      return sum + c.usageCount * c.discountValue
    }
  }, 0)
  const activeRate = totalCoupons > 0 ? Math.round((activeCoupons / totalCoupons) * 100) : 0

  const handleCreateCoupon = () => {
    setEditingCoupon(null)
    setDialogOpen(true)
  }

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon)
    setDialogOpen(true)
  }

  const handleSaveCoupon = (couponData: any) => {
    // Here you would typically save to your backend
    // For now, just log the data
  }

  const formatDate = (dateString: string) => formatDateLabel(dateString, isRTL)

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-bold text-foreground">{t("coupons.title")}</h1>
          <p className="text-muted-foreground">{t("coupons.subtitle")}</p>
        </div>
        <Button
          className={`text-white bg-emerald-600 hover:bg-emerald-700 ${isRTL ? "flex-row-reverse" : ""}`}
          onClick={handleCreateCoupon}
        >
          <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t("coupons.actions.create")}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("coupons.stats.total")}</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoupons.toLocaleString(locale)}</div>
            <p className="text-xs text-muted-foreground">
              {t("coupons.stats.totalDescription").replace("{count}", activeCoupons.toLocaleString(locale))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("coupons.stats.usage")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString(locale)}</div>
            <p className="text-xs text-muted-foreground">{t("coupons.stats.usageDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("coupons.stats.savings")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyValue(totalSavings, locale, currency)}</div>
            <p className="text-xs text-muted-foreground">{t("coupons.stats.savingsDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("coupons.stats.activeRate")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRate.toLocaleString(locale)}%</div>
            <p className="text-xs text-muted-foreground">{t("coupons.stats.activeRateDescription")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`}
            />
            <Input
              placeholder={t("coupons.filters.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? "pr-10 text-right" : "pl-10"} md:w-[300px]`}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={`w-[180px] ${isRTL ? "justify-between text-right" : "justify-between"}`}>
              <SelectValue placeholder={t("coupons.filters.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent align={isRTL ? "start" : "end"}>
              <SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
                {t("coupons.filters.statusOptions.all")}
              </SelectItem>
              <SelectItem value="active" className={isRTL ? "justify-end text-right" : ""}>
                {t("coupons.filters.statusOptions.active")}
              </SelectItem>
              <SelectItem value="expired" className={isRTL ? "justify-end text-right" : ""}>
                {t("coupons.filters.statusOptions.expired")}
              </SelectItem>
              <SelectItem value="disabled" className={isRTL ? "justify-end text-right" : ""}>
                {t("coupons.filters.statusOptions.disabled")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={`text-sm text-muted-foreground ${isRTL ? "text-left md:text-right" : "text-right"}`}>
          {t("coupons.showingCount")
            .replace("{current}", filteredCoupons.length.toLocaleString(locale))
            .replace("{total}", totalCoupons.toLocaleString(locale))}
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className={isRTL ? "text-right" : ""}>{t("coupons.table.code")}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{t("coupons.table.discount")}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{t("coupons.table.validity")}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{t("coupons.table.usage")}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{t("coupons.table.appliesTo")}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{t("coupons.table.status")}</TableHead>
                <TableHead className={isRTL ? "text-left" : "text-right"}>{t("coupons.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className={`font-medium ${isRTL ? "text-right" : ""}`}>{coupon.code}</TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatDiscount(coupon.discountType, coupon.discountValue, t, locale, currencySymbol)}
                    </span>
                    {coupon.minOrderValue > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {t("coupons.table.min")} {formatCurrencyValue(coupon.minOrderValue, locale, currency)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {coupon.usageCount.toLocaleString(locale)} / {coupon.usageLimit ? coupon.usageLimit.toLocaleString(locale) : "∞"}
                    </span>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{
                          width: coupon.usageLimit
                            ? `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  {coupon.appliesTo === "all" ? (
                    <span className="text-sm">{t("coupons.table.allProducts")}</span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{t("coupons.table.selectedProducts")}</span>
                      <span className="text-xs text-muted-foreground">
                        {coupon.products.slice(0, 2).join(isRTL ? "، " : ", ")}
                        {coupon.products.length > 2 && (
                          <span>
                            {" "}
                            {t("coupons.table.more").replace(
                              "{count}",
                              (coupon.products.length - 2).toLocaleString(locale),
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(coupon.status, t)}</TableCell>
                <TableCell className={isRTL ? "text-left" : "text-right"}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`h-8 w-8 p-0 ${isRTL ? "rotate-180" : ""}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                      <DropdownMenuItem
                        onClick={() => handleEditCoupon(coupon)}
                        className={isRTL ? "flex-row-reverse justify-end gap-2" : ""}
                      >
                        <Edit className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                        {t("coupons.actions.edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`text-destructive ${isRTL ? "flex-row-reverse justify-end gap-2" : ""}`}
                      >
                        <Trash2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                        {t("coupons.actions.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon.id} className={`p-4 ${isRTL ? "text-right" : ""}`}>
            <div className="space-y-3">
              {/* First Line: Code, Discount, Status */}
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="font-bold text-lg">{coupon.code}</span>
                  <Badge variant="outline" className="text-xs">
                    {formatDiscount(coupon.discountType, coupon.discountValue, t, locale, currencySymbol)}
                  </Badge>
                </div>
                {getStatusBadge(coupon.status, t)}
              </div>

              {/* Second Line: Usage, Validity, Actions */}
              <div
                className={`flex items-center justify-between text-sm text-muted-foreground ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span>
                    {coupon.usageCount.toLocaleString(locale)}/{
                      coupon.usageLimit ? coupon.usageLimit.toLocaleString(locale) : "∞"
                    } {t("coupons.table.used")}
                  </span>
                  <span>{t("coupons.table.until").replace("{date}", formatDate(coupon.endDate))}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${isRTL ? "rotate-180" : ""}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"} className={isRTL ? "text-right" : ""}>
                    <DropdownMenuItem
                      onClick={() => handleEditCoupon(coupon)}
                      className={isRTL ? "flex-row-reverse justify-end gap-2" : ""}
                    >
                      <Edit className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t("coupons.actions.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`text-destructive ${isRTL ? "flex-row-reverse justify-end gap-2" : ""}`}
                    >
                      <Trash2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t("coupons.actions.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Additional Info */}
              {coupon.appliesTo === "selected" && (
                <div className="text-xs text-muted-foreground">
                  {t("coupons.mobile.appliesTo")} {coupon.products.slice(0, 2).join(isRTL ? "، " : ", ")}
                  {coupon.products.length > 2 && (
                    <span>
                      {" "}
                      {t("coupons.table.more").replace(
                        "{count}",
                        (coupon.products.length - 2).toLocaleString(locale),
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Coupon Dialog */}
      <CouponDialog open={dialogOpen} onOpenChange={setDialogOpen} coupon={editingCoupon} onSave={handleSaveCoupon} />
    </div>
  )
}
