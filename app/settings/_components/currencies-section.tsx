"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { SectionCommonProps } from "./types"

const CURRENCY_LIST = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Arabian Riyal", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "ب.د" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع." },
]

export function CurrenciesSection({ dir, isRTL, t }: SectionCommonProps) {
  const [currencies, setCurrencies] = useState([
    { code: "USD", name: "United States Dollar", symbol: "$", rate: 1, active: true },
    { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ", rate: 3.67, active: true },
  ])
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const [currencyToAdd, setCurrencyToAdd] = useState("")

  const addCurrency = (code: string) => {
    if (currencies.some((c) => c.code === code)) return
    const info = CURRENCY_LIST.find((c) => c.code === code)
    if (!info) return
    setCurrencies([{ code: info.code, name: info.name, symbol: info.symbol, rate: 1, active: true }, ...currencies])
  }

  const alignmentClass = isRTL ? "text-right" : "text-left"

  const removeCurrency = (code: string) => {
    if (code === "USD") return
    setCurrencies(currencies.filter((c) => c.code !== code))
  }

  const toggleCurrency = (code: string) => {
    if (code === "USD") return
    setCurrencies(
      currencies.map((c) =>
        c.code === code ? { ...c, active: !c.active } : c
      )
    )
  }

  const statusClasses = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    inactive: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  }

  return (
    <div className="space-y-6" dir={dir}>
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.currencies.default.label")}</CardTitle>
          <CardDescription>
            {t("settings.detail.currencies.default.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-currency" className={alignmentClass}>
              {t("settings.detail.currencies.default.label")}
            </Label>
            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <SelectTrigger id="default-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir={dir}>
                {currencies
                  .filter((c) => c.active)
                  .map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">{t("common.save")}</Button>
        </CardFooter>
      </Card>

      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <div className="flex items-start justify-between">
            <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
              <CardTitle>{t("settings.detail.currencies.accepted.title")}</CardTitle>
              <CardDescription>
                {t("settings.detail.currencies.accepted.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <div>
              <Label className={alignmentClass}>
                {t("settings.detail.currencies.accepted.autoUpdate")}
              </Label>
              <p className="text-xs text-muted-foreground">التحديث تلقائي كل ساعة</p>
            </div>
          </div>

          {currencies.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("settings.detail.currencies.accepted.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 md:hidden">
                {currencies.map((currency) => (
                  <Card
                    key={currency.code}
                    className="border border-border/60 shadow-sm"
                  >
                    <CardContent className="space-y-3 py-4 text-sm">
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {currency.code} - {currency.symbol}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currency.name}
                          </p>
                        </div>
                        <Badge className={statusClasses[currency.active ? "active" : "inactive"]}>
                          {currency.active
                            ? t("settings.detail.currencies.accepted.statuses.active")
                            : t("settings.detail.currencies.accepted.statuses.inactive")}
                        </Badge>
                      </div>
                      <div
                        className={`flex items-center justify-between text-xs ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium">{currency.rate}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        {currency.code === "USD" ? (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">{
                            isRTL ? "أساسي" : "Default"
                          }</Badge>
                        ) : (
                          <>
                            <Switch
                              checked={currency.active}
                              onCheckedChange={() => toggleCurrency(currency.code)}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCurrency(currency.code)}
                              className="flex items-center gap-1 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div
                className="hidden overflow-hidden rounded-xl border border-border/60 shadow-sm md:block"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.currencies.accepted.columns.code")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.currencies.accepted.columns.currency")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.currencies.accepted.columns.symbol")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.currencies.accepted.columns.rate")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.currencies.accepted.columns.status")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.currencies.accepted.columns.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currencies.map((currency) => (
                      <TableRow key={currency.code}>
                        <TableCell className="font-medium">{currency.code}</TableCell>
                        <TableCell>{currency.name}</TableCell>
                        <TableCell>{currency.symbol}</TableCell>
                        <TableCell>{currency.rate}</TableCell>
                        <TableCell>
                          {currency.code === "USD" ? (
                            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">{isRTL ? "أساسي" : "Default"}</Badge>
                          ) : (
                            <Badge
                              className={statusClasses[currency.active ? "active" : "inactive"]}
                            >
                              {currency.active
                                ? t("settings.detail.currencies.accepted.statuses.active")
                                : t("settings.detail.currencies.accepted.statuses.inactive")}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {currency.code === "USD" ? (
                            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">{isRTL ? "أساسي" : "Default"}</Badge>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Switch checked={currency.active} onCheckedChange={() => toggleCurrency(currency.code)} />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCurrency(currency.code)}
                                className="flex items-center gap-1 text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Add currency dropdown under the table */}
              <div className={`flex items-center gap-2 pt-4 ${isRTL ? "justify-end" : "justify-start"}`}>
                <Select value={currencyToAdd} onValueChange={setCurrencyToAdd}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder={t("settings.detail.currencies.accepted.selectPlaceholder") || "Select a currency"} />
                  </SelectTrigger>
                  <SelectContent dir={dir}>
                    {CURRENCY_LIST.filter((c) => !currencies.some((x) => x.code === c.code)).map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={() => addCurrency(currencyToAdd)}
                  disabled={!currencyToAdd || !CURRENCY_LIST.some((c) => c.code === currencyToAdd && !currencies.some((x) => x.code === currencyToAdd))}
                >
                  {t("settings.detail.currencies.accepted.add")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.currencies.formatting.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.currencies.formatting.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="symbol-position" className={alignmentClass}>
                {t("settings.detail.currencies.formatting.symbolPosition.label")}
              </Label>
              <Select defaultValue="before">
                <SelectTrigger id="symbol-position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="before">
                    {t("settings.detail.currencies.formatting.symbolPosition.before")}
                  </SelectItem>
                  <SelectItem value="after">
                    {t("settings.detail.currencies.formatting.symbolPosition.after")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decimal-separator" className={alignmentClass}>
                {t("settings.detail.currencies.formatting.decimalSeparator.label")}
              </Label>
              <Select defaultValue="period">
                <SelectTrigger id="decimal-separator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="period">
                    {t("settings.detail.currencies.formatting.decimalSeparator.period")}
                  </SelectItem>
                  <SelectItem value="comma">
                    {t("settings.detail.currencies.formatting.decimalSeparator.comma")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thousands-separator" className={alignmentClass}>
                {t("settings.detail.currencies.formatting.thousandsSeparator.label")}
              </Label>
              <Select defaultValue="comma">
                <SelectTrigger id="thousands-separator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="comma">
                    {t("settings.detail.currencies.formatting.thousandsSeparator.comma")}
                  </SelectItem>
                  <SelectItem value="period">
                    {t("settings.detail.currencies.formatting.thousandsSeparator.period")}
                  </SelectItem>
                  <SelectItem value="space">
                    {t("settings.detail.currencies.formatting.thousandsSeparator.space")}
                  </SelectItem>
                  <SelectItem value="none">
                    {t("settings.detail.currencies.formatting.thousandsSeparator.none")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className={alignmentClass}>
              {t("settings.detail.currencies.formatting.preview")}
            </Label>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-center">
              <p className="text-lg font-semibold">
                ${t("settings.detail.currencies.formatting.example")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">{t("common.save")}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
