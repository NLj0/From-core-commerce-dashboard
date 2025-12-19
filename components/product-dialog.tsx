"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, Search, Globe, Trash2, Expand, AlertCircle, Loader2 } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Helper function to convert ISO date to yyyy-MM-dd format for input type="date"
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  } catch {
    return ""
  }
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: string
  image?: string
  images?: string | string[]
  videos?: string | string[]
  category?: string | { id: string; name: string }
  categoryId?: string
  sku: string
  nameArabic?: string
  nameAr?: string
  description?: string
  descriptionArabic?: string
  descriptionAr?: string
  basePrice?: number
  costPrice?: number
  salePrice?: number
  discountType?: "percentage" | "amount"
  discountValue?: number
  discountStartDate?: string | null
  discountEndDate?: string | null
  totalSales?: number
  totalRevenue?: number
  netProfit?: number
  displayedDiscountRate?: number
  averageRating?: number
  promotionalTitle?: string
  isActive?: boolean
  allowRepeatPurchase?: boolean
  preventDiscount?: boolean
  deliveryMethod?: string
  codes?: string[]
  downloadLink?: string
  expirationDays?: string
  deliveryTime?: string
  emailMessage?: string
  digitalSettings?: string // JSON string containing digital product settings
  unlimitedStock?: boolean
  quantity?: number | null
  productType?: string | null
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  monthlyStats?: Array<{
    id: string
    productId: string
    month: string
    year: number
    sales: number
    revenue: number
    profit: number
    createdAt?: string
    updatedAt?: string
  }>
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  productType?: string | null
  onSave: (product: ProductData) => void
}

type CategoryOption = {
  id: string
  name: string
  nameAr?: string | null
}

interface CustomField {
  id: string
  type: "text" | "textarea" | "image" | "dropdown"
  label: string
  required: boolean
  options?: Array<{ label: string; price: number }>
}

interface DropdownOption {
  label: string
  price: number
}

interface FormDataState {
  name: string
  nameArabic: string
  description: string
  descriptionArabic: string
  categoryId: string
  sku: string
  basePrice: string
  costPrice: string
  salePrice: string
  stock: string
  image: string
  metaTitle: string
  metaDescription: string
  keywords: string
  deliveryMethod: string
  downloadLink: string
  expirationDays: string
  codes: string[]
  deliveryTime: string
  deliveryType: string
  uploadedFile: File | null
  emailMessage: string
  bundleProducts: string[]
  bundleDelivery: string
  customFields: CustomField[]
  discountType: "percentage" | "amount"
  discountValue: string
  discountStartDate: string
  discountEndDate: string
  totalSales: string
  totalRevenue: string
  netProfit: string
  displayedDiscountRate: string
  averageRating: string
  unlimitedStock: boolean
  promotionalTitle: string
  isActive: boolean
  allowRepeatPurchase: boolean
  preventDiscount: boolean
  images: string[] // Data URLs للـ preview
  imageFiles: File[] // الملفات الفعلية (يتم رفعها عند الـ save)
  mainImage: string
  video: string
  videoFile: File | null // ملف الفيديو الفعلي (يتم رفعه عند الـ save)
}

interface ProductData {
  name: string
  nameArabic: string
  description: string
  descriptionArabic: string
  categoryId: string | null
  sku: string
  basePrice: number | null
  costPrice: number | null
  salePrice: number | null
  price: number
  stock: string
  quantity: number
  trackQuantity: boolean
  unlimitedStock: boolean
  isDigital: boolean
  digitalSettings: string
  image: string
  images: string[]
  videos: string[]
  codes: string[]
  customFields: CustomField[]
  productType: string
  discountType: "percentage" | "amount"
  discountValue: number | null
  discountStartDate: string | null
  discountEndDate: string | null
  totalSales: number | null
  totalRevenue: number | null
  netProfit: number | null
  displayedDiscountRate: number | null
  averageRating: number | null
  metaTitle: string
  metaDescription: string
  keywords: string
  promotionalTitle: string
  isActive: boolean
  allowRepeatPurchase: boolean
  preventDiscount: boolean
}

const MAX_IMAGES = 5
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

export function ProductDialog({ open, onOpenChange, product, productType, onSave }: ProductDialogProps) {
  const [currentStep, setCurrentStep] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    nameArabic: "",
    description: "",
    descriptionArabic: "",
    categoryId: "",
    sku: "",
    basePrice: "",
    costPrice: "",
    salePrice: "",
    stock: "",
    image: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    deliveryMethod: "",
    downloadLink: "",
    expirationDays: "",
    codes: [],
    deliveryTime: "",
    deliveryType: "",
    uploadedFile: null,
    emailMessage: "",
    bundleProducts: [],
    bundleDelivery: "combined",
    customFields: [],
    discountType: "percentage",
    discountValue: "",
    discountStartDate: "",
    discountEndDate: "",
    totalSales: "",
    totalRevenue: "",
    netProfit: "",
    displayedDiscountRate: "",
    averageRating: "",
    unlimitedStock: false,
    promotionalTitle: "",
    isActive: true,
    allowRepeatPurchase: true,
    preventDiscount: false,
    images: [],
    imageFiles: [],
    mainImage: "",
    video: "",
    videoFile: null,
  })
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [pendingCategoryName, setPendingCategoryName] = useState<string | null>(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [],
  )

  const formatCurrencyTick = useCallback((value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return `$${value}`
  }, [])

  const formatTooltipValue = useCallback((value: number, name: string): [string, string] => {
    switch (name) {
      case "Revenue":
      case "Profit":
        return [currencyFormatter.format(value), name]
      case "Sales":
        return [value.toString(), name]
      default:
        return [value.toString(), name]
    }
  }, [currencyFormatter])

  useEffect(() => {
    if (product) {
      let digitalSettings: any = {}
      try {
        digitalSettings = product.digitalSettings ? JSON.parse(product.digitalSettings) : {}
      } catch (e) {
        console.warn("Failed to parse digitalSettings:", e)
        digitalSettings = {}
      }

      const parsedCodes = Array.isArray(digitalSettings.codes)
        ? digitalSettings.codes
        : Array.isArray(product.codes)
          ? product.codes
          : []

      let parsedImages: string[] = []
      if (product.images) {
        if (typeof product.images === "string") {
          try {
            parsedImages = JSON.parse(product.images)
          } catch (error) {
            console.warn("Failed to parse product images", error)
          }
        } else if (Array.isArray(product.images)) {
          parsedImages = product.images
        }
      }

      let parsedVideo = ""
      if (product.videos) {
        if (typeof product.videos === "string") {
          try {
            const parsed = JSON.parse(product.videos)
            if (Array.isArray(parsed) && parsed.length) {
              parsedVideo = typeof parsed[0] === "string" ? parsed[0] : ""
            } else if (typeof parsed === "string" && parsed.startsWith("/")) {
              parsedVideo = parsed
            } else if (product.videos.trim().startsWith("/")) {
              parsedVideo = product.videos
            }
          } catch (error) {
            if (product.videos.trim().startsWith("/")) {
              parsedVideo = product.videos
            }
          }
        } else if (Array.isArray(product.videos) && product.videos.length) {
          parsedVideo = product.videos.find((item): item is string => typeof item === "string") || ""
        }
      }

      if (!parsedImages.length && product.image) {
        parsedImages = [product.image]
      }

      if (parsedImages.length > MAX_IMAGES) {
        parsedImages = parsedImages.slice(0, MAX_IMAGES)
      }

      const fallbackImage = parsedImages[0] ?? product.image ?? ""
      const primaryCategoryId =
        product.categoryId ??
        (typeof product.category === "object" && product.category !== null ? product.category.id : undefined)

      let fallbackCategoryName = ""
      if (!primaryCategoryId) {
        if (typeof product.category === "string") {
          fallbackCategoryName = product.category
        } else if (typeof product.category === "object" && product.category) {
          fallbackCategoryName = product.category.name ?? ""
        }
      }

      let normalizedDeliveryMethod = digitalSettings.deliveryMethod ?? product.deliveryMethod ?? ""
      if (productType === "digital" && normalizedDeliveryMethod === "email") {
        normalizedDeliveryMethod = "code"
      }

      setFormData({
        name: product.name ?? "",
        nameArabic: product.nameArabic ?? product.nameAr ?? "",
        description: product.description ?? "",
        descriptionArabic: product.descriptionArabic ?? product.descriptionAr ?? "",
        categoryId: primaryCategoryId ?? "",
        sku: product.sku ?? "",
        basePrice: product.basePrice != null ? product.basePrice.toString() : "",
        costPrice: product.costPrice != null ? product.costPrice.toString() : "",
        salePrice:
          product.salePrice != null
            ? product.salePrice.toString()
            : product.price != null
              ? product.price.toString()
              : "",
        stock:
          product.stock != null
            ? product.stock.toString()
            : product.quantity != null
              ? product.quantity.toString()
              : "",
  image: fallbackImage,
  metaTitle: product.metaTitle ?? "",
  metaDescription: product.metaDescription ?? "",
  keywords: product.keywords ?? "",
        deliveryMethod: normalizedDeliveryMethod,
        downloadLink: digitalSettings.downloadLink ?? product.downloadLink ?? "",
        expirationDays: digitalSettings.expirationDays ?? product.expirationDays ?? "",
        codes: parsedCodes,
        deliveryTime: digitalSettings.deliveryTime ?? product.deliveryTime ?? "",
        deliveryType: digitalSettings.deliveryType ?? "",
        uploadedFile: null,
        emailMessage: digitalSettings.emailMessage ?? product.emailMessage ?? "",
        bundleProducts: [],
        bundleDelivery: digitalSettings.bundleDelivery ?? "combined",
        customFields: Array.isArray(digitalSettings.customFields) ? digitalSettings.customFields : [],
        discountType: product.discountType ?? "percentage",
        discountValue: product.discountValue != null ? product.discountValue.toString() : "",
        discountStartDate: product.discountStartDate ?? "",
        discountEndDate: product.discountEndDate ?? "",
        totalSales: product.totalSales != null ? product.totalSales.toString() : "",
        totalRevenue: product.totalRevenue != null ? product.totalRevenue.toString() : "",
        netProfit: product.netProfit != null ? product.netProfit.toString() : "",
        displayedDiscountRate: product.displayedDiscountRate != null ? product.displayedDiscountRate.toString() : "",
        averageRating: product.averageRating != null ? product.averageRating.toString() : "",
        unlimitedStock:
          product.unlimitedStock ??
          (product.stock === null ||
            (product.quantity != null && product.quantity >= 999999)),
        promotionalTitle: product.promotionalTitle ?? "",
        isActive: product.isActive ?? true,
        allowRepeatPurchase: product.allowRepeatPurchase ?? true,
        preventDiscount: product.preventDiscount ?? false,
        images: parsedImages,
        imageFiles: [],
        mainImage: fallbackImage,
        video: parsedVideo,
        videoFile: null,
      })

      setPendingCategoryName(primaryCategoryId ? null : fallbackCategoryName || null)
    } else {
      // Default delivery method
      const defaultDeliveryMethod = "code"

      setFormData({
        name: "",
        nameArabic: "",
        description: "",
        descriptionArabic: "",
        categoryId: "",
        sku: "",
        basePrice: "",
        costPrice: "",
        salePrice: "",
        stock: "",
        image: "",
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        deliveryMethod: defaultDeliveryMethod,
        downloadLink: "",
        expirationDays: "",
        codes: [],
        deliveryTime: "",
        deliveryType: "",
        uploadedFile: null,
        emailMessage: "",
        bundleProducts: [],
        bundleDelivery: "combined",
        customFields: [],
        discountType: "percentage",
        discountValue: "",
        discountStartDate: "",
        discountEndDate: "",
        totalSales: "",
        totalRevenue: "",
        netProfit: "",
        displayedDiscountRate: "",
        averageRating: "",
        unlimitedStock: false,
        promotionalTitle: "",
        isActive: true,
        allowRepeatPurchase: true,
        preventDiscount: false,
        images: [],
        imageFiles: [],
        mainImage: "",
        video: "",
        videoFile: null,
      })
      setPendingCategoryName(null)
    }
  }, [product])

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        setCategoriesError(null)
        const response = await fetch("/api/categories")
        if (!response.ok) {
          const message = await response.text().catch(() => "Failed to fetch categories")
          console.error("Failed to load categories", new Error(message || "Failed to fetch categories"))
          if (isMounted) {
            setCategoriesError("تعذر تحميل التصنيفات. تأكد من إضافة التصنيفات من صفحة التصنيفات.")
          }
          return
        }
        const data = await response.json()
        const normalizedCategories: CategoryOption[] = Array.isArray(data)
          ? data.map((category: any) => ({
              id: category.id,
              name: category.name,
            }))
          : []
        if (isMounted) {
          setCategories(normalizedCategories)
        }
      } catch (error) {
        console.error("Failed to load categories", error)
        if (isMounted) {
          setCategoriesError("تعذر تحميل التصنيفات. تأكد من إضافة التصنيفات من صفحة التصنيفات.")
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!pendingCategoryName || !categories.length) return

    const normalizedPendingName = pendingCategoryName.trim().toLowerCase()
    const matchedCategory = categories.find(
      (category) =>
        category.name?.trim().toLowerCase() === normalizedPendingName,
    )

    if (matchedCategory) {
      setFormData((prev) => ({
        ...prev,
        categoryId: prev.categoryId || matchedCategory.id,
      }))
      setPendingCategoryName(null)
    }
  }, [pendingCategoryName, categories])

  // Check if product type supports unlimited stock
  const supportsUnlimitedStock = productType === "digital" || productType === "digital-card"

  // File validation and upload utilities
  const validateAndUploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []
    const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"])

    for (const file of formData.imageFiles) {
      // Security validation
      if (file.size > MAX_IMAGE_SIZE) {
        setSubmitError(`Image ${file.name} is too large. Max size is 5MB.`)
        continue
      }

      if (!allowedImageTypes.has(file.type)) {
        setSubmitError(`Image ${file.name} has unsupported format. Allowed: JPEG, PNG, GIF, WebP.`)
        continue
      }

      if (!file.type.startsWith("image/")) {
        setSubmitError(`File ${file.name} is not a valid image.`)
        continue
      }

      const formPayload = new FormData()
      formPayload.append("file", file)

      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formPayload,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Failed to upload image", errorText)
          setSubmitError(`Failed to upload ${file.name}`)
          continue
        }

        const result = (await response.json()) as { url?: string }
        if (result?.url) {
          uploadedUrls.push(result.url)
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        setSubmitError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return uploadedUrls
  }

  const validateAndUploadVideo = async (): Promise<string | null> => {
    if (!formData.videoFile) return null

    // Security validation
    if (formData.videoFile.size > MAX_VIDEO_SIZE) {
      setSubmitError(`Video is too large. Max size is 50MB.`)
      return null
    }

    if (formData.videoFile.type !== "video/mp4") {
      setSubmitError("Only MP4 videos are supported.")
      return null
    }

    if (!formData.videoFile.type.startsWith("video/")) {
      setSubmitError("File is not a valid video.")
      return null
    }

    const formPayload = new FormData()
    formPayload.append("file", formData.videoFile)

    try {
      const response = await fetch("/api/uploads?type=video", {
        method: "POST",
        body: formPayload,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to upload video", errorText)
        setSubmitError("Failed to upload video")
        return null
      }

      const result = (await response.json()) as { url?: string }
      return result?.url || null
    } catch (error) {
      console.error("Error uploading video:", error)
      setSubmitError(`Failed to upload video: ${error instanceof Error ? error.message : "Unknown error"}`)
      return null
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.categoryId) {
      setSubmitError("Please select a category before saving the product.")
      return
    }

    try {
      setIsSubmitting(true)
      
      const parseFloatValue = (value: string): number | null => (value ? Number.parseFloat(value) : null)
      const parseIntValue = (value: string): number | null => (value ? Number.parseInt(value, 10) : null)

      const basePriceValue = parseFloatValue(formData.basePrice)
      const costPriceValue = parseFloatValue(formData.costPrice)
      const salePriceValue = parseFloatValue(formData.salePrice)
      const discountValue = parseFloatValue(formData.discountValue)
      const totalSalesValue = parseIntValue(formData.totalSales)
      const totalRevenueValue = parseFloatValue(formData.totalRevenue)
      const netProfitValue = parseFloatValue(formData.netProfit)
      const displayedDiscountRateValue = parseFloatValue(formData.displayedDiscountRate)
      const averageRatingValue = parseFloatValue(formData.averageRating)

      const { uploadedFile, codes, customFields, ...restFormData } = formData

      const trimmedCodes = (codes ?? []).map((code) => code.trim()).filter((code) => code.length > 0)

      const digitalSettingsPayload = {
        deliveryMethod: restFormData.deliveryMethod || null,
        downloadLink: restFormData.downloadLink || null,
        expirationDays: restFormData.expirationDays || null,
        codes: trimmedCodes,
        deliveryTime: restFormData.deliveryTime || null,
        deliveryType: restFormData.deliveryType || null,
        emailMessage: restFormData.emailMessage || null,
        bundleDelivery: restFormData.bundleDelivery || null,
        customFields,
      }

      const supportedDigitalTypes = new Set(["digital", "digital-card", "service"])
      const isDigitalProduct = productType ? supportedDigitalTypes.has(productType) : false
      const unlimitedStockSelected = supportsUnlimitedStock && restFormData.unlimitedStock
      const parsedStockValue = restFormData.stock ? Number.parseInt(restFormData.stock, 10) : null
      const stockValue = Number.isFinite(parsedStockValue as number) ? (parsedStockValue as number) : null

      const computedQuantity = isDigitalProduct
        ? unlimitedStockSelected
          ? 999999
          : trimmedCodes.length > 0
            ? trimmedCodes.length
            : stockValue ?? 0
        : stockValue ?? 0

      // Auto-fill SEO fields if empty
      const finalMetaTitle = formData.metaTitle.trim() || formData.name
      const trimmedDescription = formData.description.length > 155 ? `${formData.description.slice(0, 152)}...` : formData.description
      const finalMetaDescription = formData.metaDescription.trim() || trimmedDescription

      // Upload files now (delayed from handleImageUpload/handleVideoUpload)
      const uploadedImageUrls = await validateAndUploadImages()
      const uploadedVideoUrl = await validateAndUploadVideo()

      const productData: ProductData = {
        ...restFormData,
        codes: trimmedCodes,
        customFields,
        name: restFormData.name,
        nameArabic: restFormData.nameArabic,
        description: restFormData.description,
        descriptionArabic: restFormData.descriptionArabic,
        basePrice: basePriceValue,
        costPrice: costPriceValue,
        salePrice: salePriceValue,
        price: salePriceValue ?? basePriceValue ?? 0,
        stock: unlimitedStockSelected ? "" : restFormData.stock,
        quantity: computedQuantity,
        trackQuantity: !unlimitedStockSelected,
        unlimitedStock: unlimitedStockSelected,
        isDigital: isDigitalProduct,
        digitalSettings: JSON.stringify(digitalSettingsPayload),
        categoryId: restFormData.categoryId || null,
        sku: restFormData.sku,
        image: formData.mainImage || uploadedImageUrls[0] || `/placeholder.svg?height=60&width=60&query=${restFormData.name}`,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
        videos: uploadedVideoUrl ? [uploadedVideoUrl] : (formData.video ? [formData.video] : []),
        productType: productType || "digital",
        discountType: restFormData.discountType,
        discountValue,
        discountStartDate: restFormData.discountStartDate || null,
        discountEndDate: restFormData.discountEndDate || null,
        totalSales: totalSalesValue,
        totalRevenue: totalRevenueValue,
        netProfit: netProfitValue,
        displayedDiscountRate: displayedDiscountRateValue,
        averageRating: averageRatingValue,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDescription,
        keywords: formData.keywords,
        promotionalTitle: formData.promotionalTitle,
        isActive: formData.isActive,
        allowRepeatPurchase: formData.allowRepeatPurchase,
        preventDiscount: formData.preventDiscount,
      }

      onSave(productData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save product"
      setSubmitError(errorMessage)
      console.error("Error saving product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, productType, supportsUnlimitedStock, onSave])

  const getProductTypeTitle = () => {
    return "Product"
  }

  const getDeliveryMethods = () => {
    return [
      { value: "download", label: "Direct Download Link" },
      { value: "code", label: "Code sent" },
      { value: "file", label: "File displayed on Order Page" },
      { value: "custom-fields", label: "Custom Order Fields" },
    ]
  }

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

  const getSEOPreview = () => {
    const titleSource = formData.metaTitle?.trim() || formData.name || "Product Title"
    const descriptionSource =
      formData.metaDescription?.trim() ||
      formData.description?.trim() ||
      "Write a compelling description to improve how this product appears in search results."

    const safeTitle = titleSource.length > 70 ? `${titleSource.slice(0, 67).trim()}...` : titleSource
    const safeDescription =
      descriptionSource.length > 160 ? `${descriptionSource.slice(0, 157).trim()}...` : descriptionSource

    const generatedSlug = slugify(formData.name || titleSource)
    const url = `https://yourstore.com/products/${generatedSlug || "product"}`

    return {
      title: safeTitle,
      description: safeDescription,
      url,
    }
  }

  const parseNumericInput = (value: string) => {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const basePriceNumber = parseNumericInput(formData.basePrice)
  const salePriceNumber = parseNumericInput(formData.salePrice)
  const discountValueNumber = parseNumericInput(formData.discountValue)
  const priceReference = salePriceNumber || basePriceNumber

  let discountPercent = 0
  let discountAmount = 0

  if (formData.discountType === "percentage") {
    discountPercent = discountValueNumber
    discountAmount = priceReference * (discountPercent / 100)
  } else {
    discountAmount = discountValueNumber
    if (priceReference > 0) {
      discountPercent = (discountAmount / priceReference) * 100
    }
  }

  const discountPercentDisplay = `${Number.isFinite(discountPercent) ? discountPercent.toFixed(1) : "0.0"}%`
  const discountAmountDisplay = `$${Number.isFinite(discountAmount) ? discountAmount.toFixed(2) : "0.00"}`

  const methodsWithImplicitStockLimits = new Set(["code", "email", "order-page"])

  const shouldRenderStockControls = (method?: string | null) => {
    if (!method) return false
    return !methodsWithImplicitStockLimits.has(method)
  }

  const getStockDisplay = (method?: string) => {
    const deliveryMethod = method ?? formData.deliveryMethod
    
    // بالنسبة للكود - عدد الكودات هو الـ stock
    if (deliveryMethod === "code" || deliveryMethod === "email" || deliveryMethod === "order-page") {
      return formData.codes.length
    }
    
    // بالنسبة للتحميل المباشر والملفات
    if (deliveryMethod === "download" || deliveryMethod === "file" || deliveryMethod === "custom-fields") {
      if (formData.unlimitedStock) return "Unlimited"
      return formData.stock || "0"
    }
    
    return formData.stock || "0"
  }

  const renderStockControls = (methodOverride?: string) => {
    const method = methodOverride ?? formData.deliveryMethod
    
    // الطرق التي تعتمد على الكودات - لا تحتاج تحكم
    if (method === "code" || method === "email" || method === "order-page") {
      return null
    }

    // الطرق الأخرى (download, file, custom-fields) - تحتاج تحكم
    const isUnlimited = supportsUnlimitedStock && formData.unlimitedStock
    const stockIsRequired = !isUnlimited && productType !== "digital"

    return (
      <div className="space-y-2">
        <Label htmlFor="stock">Stock Quantity</Label>
        {supportsUnlimitedStock && (
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="unlimited"
              checked={formData.unlimitedStock}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  unlimitedStock: checked as boolean,
                  stock: checked ? "" : formData.stock,
                })
              }
            />
            <Label htmlFor="unlimited" className="text-sm">
              Unlimited Stock
            </Label>
          </div>
        )}
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          placeholder={isUnlimited ? "Unlimited" : "0"}
          disabled={isUnlimited}
          required={stockIsRequired}
        />
      </div>
    )
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (file) {
        setFormData((prev) => ({ ...prev, uploadedFile: file }))
      }
    } catch (error) {
      console.error("Error handling file upload:", error)
      setSubmitError("Failed to process file upload")
    }
  }, [])

  const handleCodesFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) {
        setSubmitError("No file selected")
        return
      }
      if (!file.name.endsWith(".txt")) {
        setSubmitError("Please select a .txt file")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const lines = content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
          setFormData((prev) => ({ ...prev, codes: [...prev.codes, ...lines] }))
          setSubmitError(null)
        } catch (error) {
          console.error("Error parsing file:", error)
          setSubmitError("Failed to parse file contents")
        }
      }
      reader.onerror = () => {
        setSubmitError("Failed to read file")
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("Error in handleCodesFileUpload:", error)
      setSubmitError("Failed to upload codes file")
    }
  }, [])

  const addCode = () => {
    setFormData({ ...formData, codes: [...formData.codes, ""] })
  }

  const updateCode = (index: number, value: string) => {
    const newCodes = [...formData.codes]
    newCodes[index] = value
    setFormData({ ...formData, codes: newCodes })
  }

  const removeCode = (index: number) => {
    const newCodes = formData.codes.filter((_, i) => i !== index)
    setFormData({ ...formData, codes: newCodes })
  }

  const addCustomField = useCallback((type: "text" | "textarea" | "image" | "dropdown") => {
    setFormData((prev) => {
      try {
        const textFieldCount = prev.customFields.filter((f) => f.type === "text").length
        const hasTextarea = prev.customFields.some((f) => f.type === "textarea")
        const hasImageUpload = prev.customFields.some((f) => f.type === "image")
        const hasDropdown = prev.customFields.some((f) => f.type === "dropdown")

        // Validation
        if (type === "text" && textFieldCount >= 7) {
          setSubmitError("Maximum 7 text fields allowed")
          return prev
        }

        if (type === "textarea" && hasTextarea) {
          setSubmitError("Only 1 textarea allowed")
          return prev
        }

        if (type === "image" && hasImageUpload) {
          setSubmitError("Only 1 image upload field allowed")
          return prev
        }

        if (type === "dropdown" && hasDropdown) {
          setSubmitError("Only 1 dropdown field allowed")
          return prev
        }

        if ((type === "textarea" || type === "image" || type === "dropdown") && textFieldCount >= 3) {
          setSubmitError("When using Textarea, Image Upload, or Dropdown, you can only add up to 3 Text Fields")
          return prev
        }

        const newField: CustomField = {
          id: Date.now().toString(),
          type,
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
          required: false,
          options:
            type === "dropdown"
              ? [
                  { label: "Option 1", price: 0 },
                  { label: "Option 2", price: 0 },
                ]
              : undefined,
        }

        setSubmitError(null)
        return {
          ...prev,
          customFields: [...prev.customFields, newField],
        }
      } catch (error) {
        console.error("Error adding custom field:", error)
        setSubmitError("Failed to add custom field")
        return prev
      }
    })
  }, [])

  const removeCustomField = useCallback((fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((f) => f.id !== fieldId),
    }))
  }, [])

  const updateCustomField = useCallback((fieldId: string, updates: Partial<CustomField>) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    }))
  }, [])

  const addDropdownOption = useCallback((fieldId: string) => {
    try {
      const field = formData.customFields.find((f) => f.id === fieldId)
      if (field && field.type === "dropdown") {
        const newOptions = [...(field.options || []), { label: "New Option", price: 0 }]
        updateCustomField(fieldId, { options: newOptions })
      }
    } catch (error) {
      console.error("Error adding dropdown option:", error)
      setSubmitError("Failed to add dropdown option")
    }
  }, [formData.customFields, updateCustomField])

  const updateDropdownOption = useCallback(
    (fieldId: string, optionIndex: number, updates: Partial<DropdownOption>) => {
      try {
        const field = formData.customFields.find((f) => f.id === fieldId)
        if (field && field.options) {
          const newOptions = [...field.options]
          newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates }
          updateCustomField(fieldId, { options: newOptions })
        }
      } catch (error) {
        console.error("Error updating dropdown option:", error)
        setSubmitError("Failed to update dropdown option")
      }
    },
    [formData.customFields, updateCustomField],
  )

  const removeDropdownOption = useCallback(
    (fieldId: string, optionIndex: number) => {
      try {
        const field = formData.customFields.find((f) => f.id === fieldId)
        if (field && field.options) {
          if (field.options.length <= 1) {
            setSubmitError("You must have at least one option in the dropdown")
            return
          }
          const newOptions = field.options.filter((_: DropdownOption, i: number) => i !== optionIndex)
          updateCustomField(fieldId, { options: newOptions })
        }
      } catch (error) {
        console.error("Error removing dropdown option:", error)
        setSubmitError("Failed to remove dropdown option")
      }
    },
    [formData.customFields, updateCustomField],
  )

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files ? Array.from(e.target.files) : []
      if (!files.length) return

      const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"])
      let canProceed = true

      setFormData((prev) => {
        const remainingSlots = MAX_IMAGES - prev.imageFiles.length
        if (remainingSlots <= 0) {
          setSubmitError(`You can only upload up to ${MAX_IMAGES} images.`)
          canProceed = false
          e.target.value = ""
          return prev
        }

        if (files.length > remainingSlots) {
          setSubmitError(`Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} can be added.`)
        }

        return prev
      })

      if (!canProceed) return

      const filesToAdd: File[] = []
      const previewUrls: string[] = []

      for (const file of files) {
        // Quick validation
        if (file.size > MAX_IMAGE_SIZE) {
          setSubmitError(`File ${file.name} is too large. Max size is 5MB.`)
          continue
        }

        if (!allowedImageTypes.has(file.type)) {
          setSubmitError(`File ${file.name} is not a supported image format.`)
          continue
        }

        filesToAdd.push(file)

        // Create Data URL for preview
        const reader = new FileReader()
        reader.onload = (event) => {
          previewUrls.push(event.target?.result as string)

          // When all files are processed, update state
          if (previewUrls.length === filesToAdd.length) {
            setFormData((prev) => {
              const newImageFiles = [...prev.imageFiles, ...filesToAdd].slice(0, MAX_IMAGES)
              const newImages = [...prev.images, ...previewUrls].slice(0, MAX_IMAGES)
              return {
                ...prev,
                imageFiles: newImageFiles,
                images: newImages,
                mainImage: prev.mainImage || previewUrls[0] || "",
              }
            })
            setSubmitError(null)
          }
        }
        reader.onerror = () => {
          setSubmitError(`Failed to read ${file.name}`)
        }
        reader.readAsDataURL(file)
      }

      e.target.value = ""
    } catch (error) {
      console.error("Error in handleImageUpload:", error)
      setSubmitError("Failed to process image upload")
    }
  }, [])

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      if (formData.videoFile) {
        setSubmitError("You can only upload one product video.")
        e.target.value = ""
        return
      }

      // Quick validation
      if (file.type !== "video/mp4") {
        setSubmitError("Only MP4 videos are supported.")
        e.target.value = ""
        return
      }

      if (file.size > MAX_VIDEO_SIZE) {
        setSubmitError("Video size must be 50MB or less.")
        e.target.value = ""
        return
      }

      // Create Data URL for preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          videoFile: file,
          video: (event.target?.result as string) || "",
        }))
        setSubmitError(null)
      }
      reader.onerror = () => {
        setSubmitError("Failed to read video file")
      }
      reader.readAsDataURL(file)

      e.target.value = ""
    } catch (error) {
      console.error("Error in handleVideoUpload:", error)
      setSubmitError("Failed to process video upload")
    }
  }, [])

  const removeImage = useCallback((index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      const newImageFiles = prev.imageFiles.filter((_, i) => i !== index)
      const newMainImage = prev.mainImage === prev.images[index] ? newImages[0] || "" : prev.mainImage

      return {
        ...prev,
        images: newImages,
        imageFiles: newImageFiles,
        mainImage: newMainImage,
      }
    })
  }, [])

  const setAsMainImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: prev.images[index],
    }))
  }, [])

  const setAsMainMedia = useCallback((type: "image" | "video") => {
    if (type === "video") {
      setFormData((prev) => ({
        ...prev,
        mainImage: prev.video,
      }))
    }
  }, [])

  const removeVideo = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      video: "",
      videoFile: null,
    }))
  }, [])

  // Memoized generated SKU
  const generateSKU = useCallback(() => {
    let prefix = "ST"
    if (productType === "digital") prefix = "DG"
    else if (productType === "digital-card") prefix = "DC"
    else if (productType === "service") prefix = "SV"
    else if (productType === "bundle") prefix = "BN"

    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${random}` }))
  }, [productType])

  // Memoized product stats chart data - من البيانات الشهرية الفعلية
  const productStatsData = useMemo(() => {
    if (!product?.monthlyStats || product.monthlyStats.length === 0) {
      // إذا لم توجد بيانات، عرض الشهور الستة الأخيرة بقيم فارغة
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      return months.map((month) => ({
        month,
        sales: 0,
        revenue: 0,
        profit: 0,
      }))
    }

    // ترتيب البيانات حسب الشهر
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const sortedStats = (product.monthlyStats as any[]).sort((a, b) => {
      const aIndex = monthOrder.indexOf(a.month)
      const bIndex = monthOrder.indexOf(b.month)
      return aIndex - bIndex
    })

    // أخذ آخر 6 شهور
    const last6Months = sortedStats.slice(-6)
    
    return last6Months.map((stat: any) => ({
      month: stat.month,
      sales: stat.sales || 0,
      revenue: stat.revenue || 0,
      profit: stat.profit || 0,
    }))
  }, [product?.monthlyStats])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{product ? `Edit ${getProductTypeTitle()}` : `Add New ${getProductTypeTitle()}`}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : `Fill in the details to add a new ${getProductTypeTitle().toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={currentStep}
          onValueChange={setCurrentStep}
          className="w-full flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="images">Product Images & Video</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
              <TabsContent value="basic" className="space-y-4 no-scrollbar">
                {/* Card 1: Product Information - Combined product details and catalog settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name-en">Product Name (English) *</Label>
                        <Input
                          id="name-en"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter product name in English"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name-ar">Product Name (Arabic)</Label>
                        <Input
                          id="name-ar"
                          value={formData.nameArabic}
                          onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
                          placeholder="Enter product name in Arabic"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="description-en">Description (English)</Label>
                        <Textarea
                          id="description-en"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the product in English"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description-ar">Description (Arabic)</Label>
                        <Textarea
                          id="description-ar"
                          value={formData.descriptionArabic}
                          onChange={(e) => setFormData({ ...formData, descriptionArabic: e.target.value })}
                          placeholder="Describe the product in Arabic"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="sku"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="Product SKU"
                            required
                          />
                          <Button type="button" variant="outline" onClick={generateSKU}>
                            Generate
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.categoryId}
                          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                          required
                          disabled={categoriesLoading || (!categoriesLoading && categories.length === 0)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                categoriesLoading
                                  ? "Loading categories..."
                                  : categories.length
                                    ? "Select category"
                                    : "No categories available"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-categories" disabled>
                                {categoriesLoading ? "Loading..." : "Add categories first"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {categoriesError && <p className="text-xs text-destructive mt-1">{categoriesError}</p>}
                        {!categoriesError && !categoriesLoading && categories.length === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Create at least one category from the Categories page before adding products.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promotional-title">Promo Headline</Label>
                      <Input
                        id="promotional-title"
                        value={formData.promotionalTitle}
                        maxLength={15}
                        onChange={(e) => setFormData({ ...formData, promotionalTitle: e.target.value })}
                        placeholder="Write a short promotional headline"
                      />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This short headline appears on the product card in the store. Maximum of 15 characters.
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="flex items-center justify-between gap-3 rounded-md border border-dashed border-muted-foreground/30 p-3">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Show Product in Store</Label>
                          <p className="text-xs text-muted-foreground">Make this product visible to customers.</p>
                        </div>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              isActive: Boolean(checked),
                            }))
                          }
                          aria-label="Toggle product availability"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-md border border-dashed border-muted-foreground/30 p-3">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Allow Repeat Purchase</Label>
                          <p className="text-xs text-muted-foreground">Let customers buy this item multiple times.</p>
                        </div>
                        <Switch
                          checked={formData.allowRepeatPurchase}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              allowRepeatPurchase: Boolean(checked),
                            }))
                          }
                          aria-label="Toggle repeat purchases"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-md border border-dashed border-muted-foreground/30 p-3">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Disable Discounts</Label>
                          <p className="text-xs text-muted-foreground">Block coupons and automatic promotions.</p>
                        </div>
                        <Switch
                          checked={formData.preventDiscount}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              preventDiscount: Boolean(checked),
                            }))
                          }
                          aria-label="Toggle discount prevention"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Pricing & Discount - Combined pricing and discount settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="basePrice">Base Price</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          step="0.01"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costPrice">Purchase Price</Label>
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          value={formData.costPrice}
                          onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salePrice">Sale Price *</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          step="0.01"
                          value={formData.salePrice}
                          onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="discountType">Discount Type</Label>
                          <Select
                            value={formData.discountType}
                            onValueChange={(value) =>
                              setFormData({ ...formData, discountType: value as "percentage" | "amount" })
                            }
                          >
                            <SelectTrigger id="discountType" className="w-full">
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="amount">Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discountValue">
                            {formData.discountType === "amount" ? "Discount Amount" : "Discount Percentage"}
                          </Label>
                          <Input
                            id="discountValue"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="discountStartDate">Discount Start Date</Label>
                          <Input
                            id="discountStartDate"
                            type="date"
                            value={formatDateForInput(formData.discountStartDate)}
                            onChange={(e) => setFormData({ ...formData, discountStartDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discountEndDate">Discount End Date</Label>
                          <Input
                            id="discountEndDate"
                            type="date"
                            value={formatDateForInput(formData.discountEndDate)}
                            onChange={(e) => setFormData({ ...formData, discountEndDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: Product Performance - Replaced with recharts area chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-2xl font-bold">{formData.totalSales || "0"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">
                          ${formData.totalRevenue ? Number.parseFloat(formData.totalRevenue).toFixed(2) : "0.00"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Net Profit</p>
                        <p className="text-2xl font-bold">
                          ${formData.netProfit ? Number.parseFloat(formData.netProfit).toFixed(2) : "0.00"}
                        </p>
                      </div>
                    </div>
                    <div className="w-full" style={{ height: 220, minWidth: 300 }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={productStatsData} margin={{ top: 10, right: 48, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                              <stop offset="55%" stopColor="#6366f1" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="55%" stopColor="#10b981" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                              <stop offset="55%" stopColor="#f59e0b" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeOpacity={0.3} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                          <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            width={52}
                            tickFormatter={formatCurrencyTick}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            width={10}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            labelStyle={{
                              color: "#111827",
                              fontWeight: "600",
                              marginBottom: "4px",
                            }}
                            itemStyle={{ color: "#374151", fontSize: "12px" }}
                            formatter={(value, name) => formatTooltipValue(value as number, name as string)}
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="sales"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#salesGradient)"
                            fillOpacity={0.6}
                            name="Sales"
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                            name="Revenue"
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="profit"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fill="url(#profitGradient)"
                            name="Profit"
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Performance metrics sync automatically from the database
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="SEO description for search engines"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="Comma-separated keywords"
                  />
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">SEO Preview</Label>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/20 space-y-2">
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-blue-600 mt-1 shrink-0" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="text-blue-600 text-sm font-medium hover:underline cursor-pointer truncate">
                          {getSEOPreview().title}
                        </div>
                        <div className="text-green-700 text-xs truncate">{getSEOPreview().url}</div>
                        <div className="text-gray-600 text-sm leading-relaxed">{getSEOPreview().description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                      This is how your category will appear in Google search results
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4">
                {productType && productType !== "bundle" && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Delivery Method *</Label>
                      <RadioGroup
                        value={formData.deliveryMethod}
                        onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                        className="space-y-2"
                      >
                        {getDeliveryMethods().map((method) => (
                          <div key={method.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={method.value} id={method.value} />
                            <Label htmlFor={method.value} className="font-normal">
                              {method.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {formData.deliveryMethod === "download" && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="space-y-2">
                          <Label htmlFor="downloadLink">Download Link *</Label>
                          <Input
                            id="downloadLink"
                            value={formData.downloadLink}
                            onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                            placeholder="https://example.com/download"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expirationDays">Link Expiration (days)</Label>
                          <Input
                            id="expirationDays"
                            type="number"
                            value={formData.expirationDays}
                            onChange={(e) => setFormData({ ...formData, expirationDays: e.target.value })}
                            placeholder="7"
                          />
                        </div>
                        {renderStockControls("download")}
                      </div>
                    )}

                    {(formData.deliveryMethod === "code" ||
                      formData.deliveryMethod === "email" ||
                      formData.deliveryMethod === "order-page") && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Codes *</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addCode}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Code
                            </Button>
                          </div>
                          {formData.codes.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No codes added yet. Click "Add Code" to start.
                            </p>
                          )}
                          <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                            {formData.codes.map((code, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={code}
                                  onChange={(e) => updateCode(index, e.target.value)}
                                  placeholder={`Code ${index + 1}`}
                                  required
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeCode(index)}
                                  className="shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emailMessage">Message Template</Label>
                          <Textarea
                            id="emailMessage"
                            value={formData.emailMessage}
                            onChange={(e) => setFormData({ ...formData, emailMessage: e.target.value })}
                            placeholder="Enter your email message. Use {code} to insert the code automatically."
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground">
                            Use {"{code}"} as a placeholder that will be replaced with the actual code when sending
                            emails.
                          </p>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Upload .txt file (each line becomes a separate code)
                            </p>
                            <input
                              type="file"
                              accept=".txt"
                              onChange={handleCodesFileUpload}
                              className="hidden"
                              id="codes-file-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("codes-file-upload")?.click()}
                            >
                              Choose .txt File
                            </Button>
                          </div>
                        </div>
                        {renderStockControls()}
                      </div>
                    )}

                    {formData.deliveryMethod === "file" && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="space-y-2">
                          <Label>Upload File *</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              {productType === "digital-card"
                                ? "Upload file containing multiple codes"
                                : "Upload file to be displayed on order page"}
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              Supported formats: JPG, PNG, GIF (Max 5MB each)
                            </p>
                            <input
                              type="file"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                              accept=".txt,.pdf,.zip,.rar"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("file-upload")?.click()}
                            >
                              Choose File
                            </Button>
                            {formData.uploadedFile && (
                              <p className="text-sm text-green-600 mt-2">Selected: {formData.uploadedFile.name}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fileExpiration">File Expiration (days)</Label>
                          <Input
                            id="fileExpiration"
                            type="number"
                            value={formData.expirationDays}
                            onChange={(e) => setFormData({ ...formData, expirationDays: e.target.value })}
                            placeholder="30"
                          />
                        </div>
                        {renderStockControls("file")}
                      </div>
                    )}

                    {productType === "service" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
                          <Input
                            id="deliveryTime"
                            type="number"
                            value={formData.deliveryTime}
                            onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                            placeholder="3"
                          />
                        </div>
                        {renderStockControls()}
                      </div>
                    )}

                    {formData.deliveryMethod === "custom-fields" && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium">Custom Order Fields Configuration</Label>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => addCustomField("text")}>
                              + Text
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addCustomField("textarea")}
                            >
                              + Textarea
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => addCustomField("image")}>
                              + Image
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addCustomField("dropdown")}
                            >
                              + Dropdown
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• Maximum 7 text fields</p>
                          <p>• Only 1 textarea, 1 image upload, and 1 dropdown allowed</p>
                          <p>• If using textarea/image/dropdown, maximum 3 text fields</p>
                          <p>• Dropdown options can have additional pricing</p>
                        </div>

                        {formData.customFields.length > 0 && (
                          <div className="space-y-3">
                            {formData.customFields.map((field) => (
                              <div key={field.id} className="border rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline">{field.type}</Badge>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCustomField(field.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">Field Label</Label>
                                    <Input
                                      value={field.label}
                                      onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                                      placeholder="Field label"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2 pt-5">
                                    <input
                                      type="checkbox"
                                      checked={field.required}
                                      onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                                    />
                                    <Label className="text-xs">Required</Label>
                                  </div>
                                </div>
                                {field.type === "dropdown" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Options with Pricing</Label>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addDropdownOption(field.id)}
                                      >
                                        + Add Option
                                      </Button>
                                    </div>
                                    {field.options &&
                                      field.options.map((option: DropdownOption, optionIndex: number) => (
                                        <div key={optionIndex} className="flex gap-2 items-center">
                                          <Input
                                            value={option.label}
                                            onChange={(e) =>
                                              updateDropdownOption(field.id, optionIndex, { label: e.target.value })
                                            }
                                            placeholder="Option label"
                                            className="flex-1"
                                          />
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs">+$</span>
                                            <Input
                                              type="number"
                                              step="0.01"
                                              value={option.price}
                                              onChange={(e) =>
                                                updateDropdownOption(field.id, optionIndex, {
                                                  price: Number.parseFloat(e.target.value) || 0,
                                                })
                                              }
                                              placeholder="0.00"
                                              className="w-20"
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeDropdownOption(field.id, optionIndex)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    {(!field.options || field.options.length === 0) && (
                                      <p className="text-xs text-muted-foreground">No options added yet</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {formData.customFields.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No custom fields configured. Add fields above to collect additional information from
                            customers.
                          </p>
                        )}
                        {renderStockControls("custom-fields")}
                      </div>
                    )}
                  </div>
                )}

                {productType === "bundle" && (
                  <div className="space-y-4">
                    {renderStockControls("bundle")}
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                      <Label>Bundle Contents *</Label>
                      <p className="text-sm text-muted-foreground">Select products to include in this bundle</p>
                      <div className="border rounded-lg p-4 space-y-2 min-h-[100px]">
                        <p className="text-sm text-muted-foreground">
                          Bundle product selection component would be implemented here with existing products
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Products to Bundle
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                      <Label>Bundle Delivery Method *</Label>
                      <RadioGroup
                        value={formData.bundleDelivery}
                        onValueChange={(value) => setFormData({ ...formData, bundleDelivery: value })}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="combined" id="combined" />
                          <Label htmlFor="combined" className="font-normal">
                            Combined delivery (everything in one order)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="separate" id="separate" />
                          <Label htmlFor="separate" className="font-normal">
                            Separate delivery (each product delivered separately)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Images & Video</Label>
                    <p className="text-sm text-muted-foreground">
                      Upload up to {MAX_IMAGES} images (JPG, PNG, GIF, WebP – 5MB each) and one optional MP4 video up to 50MB.
                    </p>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Showcase the product with screenshots, lifestyle images, or a short video walkthrough.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Upload Images
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={Boolean(formData.video)}
                        onClick={() => document.getElementById('video-upload')?.click()}
                      >
                        {formData.video ? 'Video Added' : 'Upload Video'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Images: {formData.images.length}/{MAX_IMAGES} · Video: {formData.video ? 1 : 0}/1
                    </p>
                  </div>

                  {/* Combined Images & Video Grid */}
                  {(formData.images.length > 0 || formData.video) && (
                    <div className="space-y-3">
                      <Label>Uploaded Media ({formData.images.length + (formData.video ? 1 : 0)})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Images */}
                        {formData.images.map((image, index) => (
                          <div
                            key={`img-${index}`}
                            className={`relative group rounded-lg overflow-hidden border-2 ${
                              formData.mainImage === image
                                ? 'border-primary'
                                : 'border-muted-foreground/25'
                            }`}
                          >
                            <div className="aspect-square relative">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Main Image Badge */}
                              {formData.mainImage === image && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                  Main
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {formData.mainImage !== image && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setAsMainImage(index)}
                                  >
                                    Set Main
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeImage(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Video */}
                        {formData.video && (
                          <div className="relative group rounded-lg overflow-hidden border-2 border-muted-foreground/25">
                            <div className="aspect-square relative bg-black">
                              <video
                                src={formData.video}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Video Badge */}
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Video
                              </div>

                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setAsMainMedia("video")}
                                >
                                  Set Main
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setVideoModalOpen(true)}
                                >
                                  <Expand className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={removeVideo}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Click on an image to set it as the main product image. Click "Set Main" on the video to display it as the primary media.
                      </p>
                    </div>
                  )}

                  {formData.images.length === 0 && !formData.video && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No media uploaded yet</p>
                      <p className="text-xs mt-1">Upload images and video to showcase your product</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="mt-4 mb-4 flex items-start gap-3 p-3 bg-destructive border border-destructive/90 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{submitError}</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {product ? "Updating..." : "Adding..."}
                  </>
                ) : product ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>

      {/* Video Expand Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Video</DialogTitle>
          </DialogHeader>
          {formData.video && (
            <div className="w-full bg-black rounded-lg overflow-hidden">
              <video
                src={formData.video}
                controls
                autoPlay
                className="w-full h-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
