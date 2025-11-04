"use client"

import { useEffect, useRef, useState } from "react"
import { ImageIcon, Trash2, Upload } from "lucide-react"

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

import type { SectionCommonProps } from "./types"

export function BasicSection({ dir, isRTL, t }: SectionCommonProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const faviconInputRef = useRef<HTMLInputElement | null>(null)

  const alignmentClass = isRTL ? "text-right" : "text-left"

  const revokePreview = (preview: string | null) => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
  }

  useEffect(() => {
    return () => {
      revokePreview(logoPreview)
      revokePreview(faviconPreview)
    }
  }, [faviconPreview, logoPreview])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon",
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const nextPreview = URL.createObjectURL(file)

    if (type === "logo") {
      revokePreview(logoPreview)
      setLogoFile(file)
      setLogoPreview(nextPreview)
    } else {
      revokePreview(faviconPreview)
      setFaviconFile(file)
      setFaviconPreview(nextPreview)
    }
  }

  const handleRemoveFile = (type: "logo" | "favicon") => {
    if (type === "logo") {
      revokePreview(logoPreview)
      setLogoFile(null)
      setLogoPreview(null)
      if (logoInputRef.current) {
        logoInputRef.current.value = ""
      }
    } else {
      revokePreview(faviconPreview)
      setFaviconFile(null)
      setFaviconPreview(null)
      if (faviconInputRef.current) {
        faviconInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-6" dir={dir}>
      <Card className="border-border/60 bg-background/60 shadow-sm">
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.basic.branding.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.basic.branding.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-logo" className={alignmentClass}>
                {t("settings.detail.basic.branding.fields.logo.label")}
              </Label>
              <input
                ref={logoInputRef}
                id="store-logo"
                type="file"
                accept="image/png,image/svg+xml,image/*"
                className="hidden"
                onChange={(event) => handleFileChange(event, "logo")}
                aria-label={t("settings.detail.basic.branding.fields.logo.label")}
              />
              <div className="space-y-3">
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border/60 bg-muted/10 p-6 text-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={logoFile?.name ?? "uploaded-logo"}
                      className="h-20 w-20 rounded-md border border-border/60 object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{t("settings.detail.basic.branding.fields.logo.placeholder")}</span>
                  </Button>
                </div>
                {logoPreview && (
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                    <span className="truncate">{logoFile?.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile("logo")}
                      className="flex items-center gap-1 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t("common.delete")}</span>
                    </Button>
                  </div>
                )}
                <p className={`text-xs text-muted-foreground ${alignmentClass}`}>
                  {t("settings.detail.basic.branding.fields.logo.helper")}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-favicon" className={alignmentClass}>
                {t("settings.detail.basic.branding.fields.favicon.label")}
              </Label>
              <input
                ref={faviconInputRef}
                id="store-favicon"
                type="file"
                accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                className="hidden"
                onChange={(event) => handleFileChange(event, "favicon")}
                aria-label={t("settings.detail.basic.branding.fields.favicon.label")}
              />
              <div className="space-y-3">
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border/60 bg-muted/10 p-6 text-center">
                  {faviconPreview ? (
                    <img
                      src={faviconPreview}
                      alt={faviconFile?.name ?? "uploaded-favicon"}
                      className="h-16 w-16 rounded-md border border-border/60 object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => faviconInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{t("settings.detail.basic.branding.fields.favicon.placeholder")}</span>
                  </Button>
                </div>
                {faviconPreview && (
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                    <span className="truncate">{faviconFile?.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile("favicon")}
                      className="flex items-center gap-1 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t("common.delete")}</span>
                    </Button>
                  </div>
                )}
                <p className={`text-xs text-muted-foreground ${alignmentClass}`}>
                  {t("settings.detail.basic.branding.fields.favicon.helper")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-name" className={alignmentClass}>
              {t("settings.detail.basic.branding.fields.name.label")}
            </Label>
            <Input
              id="store-name"
              dir={dir}
              placeholder={t("settings.detail.basic.branding.fields.name.placeholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-about" className={alignmentClass}>
              {t("settings.detail.basic.branding.fields.about.label")}
            </Label>
            <Textarea
              id="store-about"
              dir={dir}
              rows={5}
              placeholder={t("settings.detail.basic.branding.fields.about.placeholder")}
            />
            <p className={`text-xs text-muted-foreground ${alignmentClass}`}>
              {t("settings.detail.basic.branding.fields.about.helper")}
            </p>
          </div>
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">
            {t("settings.detail.actions.saveBasicBranding")}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-border/60 bg-background/60 shadow-sm" dir={dir}>
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.basic.support.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.basic.support.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="support-phone" className={alignmentClass}>
                {t("settings.detail.basic.support.fields.phone.label")}
              </Label>
              <Input
                id="support-phone"
                type="tel"
                dir={dir}
                placeholder={t("settings.detail.basic.support.fields.phone.placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-whatsapp" className={alignmentClass}>
                {t("settings.detail.basic.support.fields.whatsapp.label")}
              </Label>
              <Input
                id="support-whatsapp"
                type="tel"
                dir={dir}
                placeholder={t("settings.detail.basic.support.fields.whatsapp.placeholder")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="support-telegram" className={alignmentClass}>
                {t("settings.detail.basic.support.fields.telegram.label")}
              </Label>
              <Input
                id="support-telegram"
                dir={dir}
                placeholder={t("settings.detail.basic.support.fields.telegram.placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email" className={alignmentClass}>
                {t("settings.detail.basic.support.fields.email.label")}
              </Label>
              <Input
                id="support-email"
                type="email"
                dir={dir}
                placeholder={t("settings.detail.basic.support.fields.email.placeholder")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">
            {t("settings.detail.actions.saveBasicSupport")}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-border/60 bg-background/60 shadow-sm" dir={dir}>
        <CardHeader className={alignmentClass}>
          <CardTitle>{t("settings.detail.basic.social.title")}</CardTitle>
          <CardDescription>
            {t("settings.detail.basic.social.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="social-instagram" className={alignmentClass}>
                {t("settings.detail.basic.social.fields.instagram.label")}
              </Label>
              <Input
                id="social-instagram"
                type="url"
                dir={dir}
                placeholder={t("settings.detail.basic.social.fields.instagram.placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-x" className={alignmentClass}>
                {t("settings.detail.basic.social.fields.x.label")}
              </Label>
              <Input
                id="social-x"
                type="url"
                dir={dir}
                placeholder={t("settings.detail.basic.social.fields.x.placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-snapchat" className={alignmentClass}>
                {t("settings.detail.basic.social.fields.snapchat.label")}
              </Label>
              <Input
                id="social-snapchat"
                type="url"
                dir={dir}
                placeholder={t("settings.detail.basic.social.fields.snapchat.placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-tiktok" className={alignmentClass}>
                {t("settings.detail.basic.social.fields.tiktok.label")}
              </Label>
              <Input
                id="social-tiktok"
                type="url"
                dir={dir}
                placeholder={t("settings.detail.basic.social.fields.tiktok.placeholder")}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="social-youtube" className={alignmentClass}>
                {t("settings.detail.basic.social.fields.youtube.label")}
              </Label>
              <Input
                id="social-youtube"
                type="url"
                dir={dir}
                placeholder={t("settings.detail.basic.social.fields.youtube.placeholder")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={`flex flex-col gap-2 sm:flex-row ${
            isRTL ? "sm:flex-row-reverse sm:justify-start" : "sm:justify-end"
          }`}
        >
          <Button className="sm:w-auto">
            {t("settings.detail.actions.saveBasicSocial")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
