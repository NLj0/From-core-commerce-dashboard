"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Upload, X, Plus, Search, Globe, Trash2 } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: string
  image: string
  category: string
  sku: string
  nameArabic?: string
  description?: string
  descriptionArabic?: string
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
  images?: string[]
  mainImage?: string
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  productType?: string | null
  onSave: (product: any) => void
}

export function ProductDialog({ open, onOpenChange, product, productType, onSave }: ProductDialogProps) {
  const [currentStep, setCurrentStep] = useState("basic")
  const [formData, setFormData] = useState({
    name: "",
    nameArabic: "",
    description: "",
    descriptionArabic: "",
    category: "",
    sku: "",
    basePrice: "",
    costPrice: "",
    salePrice: "",
    stock: "",
    image: "",
    // Multiple images support
    images: [] as string[],
    mainImage: "",
    // SEO fields
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    // Delivery fields
    deliveryMethod: "",
    downloadLink: "",
    expirationDays: "",
    codes: [] as string[],
    deliveryTime: "",
    deliveryType: "", // for services: file, email, link
    uploadedFile: null as File | null,
    emailMessage: "", // Custom email message with {code} placeholder
    // Bundle fields
    bundleProducts: [] as string[],
    bundleDelivery: "combined",
    // Custom fields
    customFields: [] as any[],
    // Discount fields
    discountType: "percentage" as "percentage" | "amount",
    discountValue: "",
    discountStartDate: "",
    discountEndDate: "",
    // Product stats
    totalSales: "",
    totalRevenue: "",
    netProfit: "",
    displayedDiscountRate: "",
    averageRating: "",
    // Stock management
    unlimitedStock: false,
    promotionalTitle: "",
    isActive: true,
    allowRepeatPurchase: true,
    preventDiscount: false,
  })

  const productStatsData = [
    { month: "Jan", sales: 45, revenue: 2250, profit: 1125 },
    { month: "Feb", sales: 52, revenue: 2600, profit: 1300 },
    { month: "Mar", sales: 61, revenue: 3050, profit: 1525 },
    { month: "Apr", sales: 58, revenue: 2900, profit: 1450 },
    { month: "May", sales: 70, revenue: 3500, profit: 1750 },
    { month: "Jun", sales: 68, revenue: 3400, profit: 1700 },
  ]

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  const formatCurrencyTick = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return `$${value}`
  }

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case "Revenue":
      case "Profit":
        return [currencyFormatter.format(value), name]
      case "Sales":
        return [value, name]
      default:
        return [value, name]
    }
  }

  useEffect(() => {
    if (product) {
      // Initialize images from product data
      const productImages = product.images ?? []
      const productMainImage = product.mainImage ?? (productImages.length > 0 ? productImages[0] : "")
      
      setFormData({
        name: product.name ?? "",
        nameArabic: product.nameArabic ?? "",
        description: product.description ?? "",
        descriptionArabic: product.descriptionArabic ?? "",
        category: product.category ?? "",
        sku: product.sku ?? "",
        basePrice: product.basePrice != null ? product.basePrice.toString() : "",
        costPrice: product.costPrice != null ? product.costPrice.toString() : "",
        salePrice:
          product.salePrice != null
            ? product.salePrice.toString()
            : product.price != null
              ? product.price.toString()
              : "",
        stock: product.stock != null ? product.stock.toString() : "",
        image: product.image ?? "",
        images: productImages,
        mainImage: productMainImage,
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
        discountType: product.discountType ?? "percentage",
        discountValue: product.discountValue != null ? product.discountValue.toString() : "",
        discountStartDate: product.discountStartDate ?? "",
        discountEndDate: product.discountEndDate ?? "",
        totalSales: product.totalSales != null ? product.totalSales.toString() : "",
        totalRevenue: product.totalRevenue != null ? product.totalRevenue.toString() : "",
        netProfit: product.netProfit != null ? product.netProfit.toString() : "",
        displayedDiscountRate: product.displayedDiscountRate != null ? product.displayedDiscountRate.toString() : "",
        averageRating: product.averageRating != null ? product.averageRating.toString() : "",
        unlimitedStock: product.stock === null,
        promotionalTitle: product.promotionalTitle ?? "",
        isActive: product.isActive ?? true,
        allowRepeatPurchase: product.allowRepeatPurchase ?? true,
        preventDiscount: product.preventDiscount ?? false,
      })
    } else {
      setFormData({
        name: "",
        nameArabic: "",
        description: "",
        descriptionArabic: "",
        category: "",
        sku: "",
        basePrice: "",
        costPrice: "",
        salePrice: "",
        stock: "",
        image: "",
        images: [],
        mainImage: "",
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
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parseFloatValue = (value: string) => (value ? Number.parseFloat(value) : null)
    const parseIntValue = (value: string) => (value ? Number.parseInt(value, 10) : null)

    const basePriceValue = parseFloatValue(formData.basePrice)
    const costPriceValue = parseFloatValue(formData.costPrice)
    const salePriceValue = parseFloatValue(formData.salePrice)
    const discountValue = parseFloatValue(formData.discountValue)
    const totalSalesValue = parseIntValue(formData.totalSales)
    const totalRevenueValue = parseFloatValue(formData.totalRevenue)
    const netProfitValue = parseFloatValue(formData.netProfit)
    const displayedDiscountRateValue = parseFloatValue(formData.displayedDiscountRate)
    const averageRatingValue = parseFloatValue(formData.averageRating)

    // Use main image or first image or generate placeholder
    const primaryImage = formData.mainImage || (formData.images.length > 0 ? formData.images[0] : formData.image) || `/placeholder.svg?height=60&width=60&query=${formData.name}`

    const productData = {
      ...formData,
      name: formData.name,
      nameArabic: formData.nameArabic,
      description: formData.description,
      descriptionArabic: formData.descriptionArabic,
      basePrice: basePriceValue,
      costPrice: costPriceValue,
      salePrice: salePriceValue,
      price: salePriceValue ?? basePriceValue ?? 0,
      stock: formData.unlimitedStock ? null : parseIntValue(formData.stock),
      category: formData.category,
      sku: formData.sku,
      image: primaryImage,
      images: formData.images,
      mainImage: formData.mainImage,
      productType: productType || "standard",
      discountType: formData.discountType,
      discountValue,
      discountStartDate: formData.discountStartDate || null,
      discountEndDate: formData.discountEndDate || null,
      totalSales: totalSalesValue,
      totalRevenue: totalRevenueValue,
      netProfit: netProfitValue,
      displayedDiscountRate: displayedDiscountRateValue,
      averageRating: averageRatingValue,
    }

    onSave(productData)
  }

  const generateSKU = () => {
    let prefix = "ST"
    if (productType === "digital") prefix = "DG"
    else if (productType === "digital-card") prefix = "DC"
    else if (productType === "service") prefix = "SV"
    else if (productType === "bundle") prefix = "BN"

    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    setFormData({ ...formData, sku: `${prefix}-${random}` })
  }

  const getProductTypeTitle = () => {
    switch (productType) {
      case "digital":
        return "Digital Product"
      case "digital-card":
        return "Digital Card"
      case "service":
        return "On-Demand Service"
      case "bundle":
        return "Bundle Products"
      default:
        return "Product"
    }
  }

  const getDeliveryMethods = () => {
    switch (productType) {
      case "digital":
        return [
          { value: "download", label: "Direct Download Link" },
          { value: "code", label: "Code sent" },
          { value: "file", label: "File displayed on Order Page" },
          { value: "custom-fields", label: "Custom Order Fields" },
        ]
      case "digital-card":
        return [
          { value: "email", label: "Code sent" },
          { value: "order-page", label: "Code shown on Order Page" },
          { value: "file", label: "File containing multiple codes" },
          { value: "custom-fields", label: "Custom Order Fields" },
        ]
      case "service":
        return [
          { value: "file", label: "Upload file after completion" },
          { value: "email", label: "Send by Email" },
          { value: "link", label: "Share through external link" },
          { value: "custom-fields", label: "Custom Order Fields" },
        ]
      default:
        return []
    }
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

  const methodsWithImplicitStockLimits = new Set(["code"])
  const supportsUnlimitedStock = productType === "digital" || productType === "digital-card"

  const shouldRenderStockControls = (method?: string | null) => {
    if (!method) return false
    return !methodsWithImplicitStockLimits.has(method)
  }

  const renderStockControls = (methodOverride?: string) => {
    const method = methodOverride ?? formData.deliveryMethod
    if (!shouldRenderStockControls(method)) {
      return null
    }

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, uploadedFile: file })
    }
  }

  // Image handling functions for multiple product images
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        // File type validation - using console.warn as toast system is not available
        console.warn(`Invalid file type: ${file.name}. Supported formats: JPG, PNG, GIF`)
        return
      }
      if (file.size > maxSize) {
        // File size validation - using console.warn as toast system is not available
        console.warn(`File too large: ${file.name}. Maximum size is 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setFormData((prev) => {
          const updatedImages = [...prev.images, imageUrl]
          // Set as main image if it's the first image
          const updatedMainImage = prev.mainImage || imageUrl
          return {
            ...prev,
            images: updatedImages,
            mainImage: updatedMainImage,
          }
        })
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    event.target.value = ''
  }

  const setAsMainImage = (index: number) => {
    const image = formData.images[index]
    if (image) {
      setFormData({ ...formData, mainImage: image })
    }
  }

  const removeImage = (index: number) => {
    const imageToRemove = formData.images[index]
    const newImages = formData.images.filter((_, i) => i !== index)
    
    // If removing the main image, set the first remaining image as main
    let newMainImage = formData.mainImage
    if (formData.mainImage === imageToRemove) {
      newMainImage = newImages.length > 0 ? newImages[0] : ""
    }
    
    setFormData({
      ...formData,
      images: newImages,
      mainImage: newMainImage,
    })
  }

  const handleCodesFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.name.endsWith(".txt")) {
      alert("Please select a .txt file")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
      setFormData({ ...formData, codes: [...formData.codes, ...lines] })
    }
    reader.readAsText(file)
  }

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

  const addCustomField = (type: "text" | "textarea" | "image" | "dropdown") => {
    const textFieldCount = formData.customFields.filter((f) => f.type === "text").length
    const hasTextarea = formData.customFields.some((f) => f.type === "textarea")
    const hasImageUpload = formData.customFields.some((f) => f.type === "image")
    const hasDropdown = formData.customFields.some((f) => f.type === "dropdown")

    if (type === "text" && textFieldCount >= 7) {
      alert("Maximum 7 text fields allowed")
      return
    }

    if (type === "textarea" && hasTextarea) {
      alert("Only 1 textarea allowed")
      return
    }

    if (type === "image" && hasImageUpload) {
      alert("Only 1 image upload field allowed")
      return
    }

    if (type === "dropdown" && hasDropdown) {
      alert("Only 1 dropdown field allowed")
      return
    }

    if ((type === "textarea" || type === "image" || type === "dropdown") && textFieldCount >= 3) {
      alert("When using Textarea, Image Upload, or Dropdown, you can only add up to 3 Text Fields")
      return
    }

    if ((type === "textarea" || type === "image" || type === "dropdown") && textFieldCount > 3) {
      alert("You have more than 3 text fields. Remove some text fields before adding this field type.")
      return
    }

    const newField = {
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

    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }))
  }

  const removeCustomField = (fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((f) => f.id !== fieldId),
    }))
  }

  const updateCustomField = (fieldId: string, updates: Partial<(typeof formData.customFields)[0]>) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    }))
  }

  const addDropdownOption = (fieldId: string) => {
    const field = formData.customFields.find((f) => f.id === fieldId)
    if (field && field.type === "dropdown") {
      const newOptions = [...(field.options || []), { label: "New Option", price: 0 }]
      updateCustomField(fieldId, { options: newOptions })
    }
  }

  const updateDropdownOption = (fieldId: string, optionIndex: number, updates: { label?: string; price?: number }) => {
    const field = formData.customFields.find((f) => f.id === fieldId)
    if (field && field.options) {
      const newOptions = [...field.options]
      newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates }
      updateCustomField(fieldId, { options: newOptions })
    }
  }

  const removeDropdownOption = (fieldId: string, optionIndex: number) => {
    const field = formData.customFields.find((f) => f.id === fieldId)
    if (field && field.options) {
      // Prevent removing the last option
      if (field.options.length <= 1) {
        alert("You must have at least one option in the dropdown")
        return
      }
      const newOptions = field.options.filter((_: any, i: number) => i !== optionIndex)
      updateCustomField(fieldId, { options: newOptions })
    }
  }

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
            <TabsTrigger value="images">Images</TabsTrigger>
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
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Digital Products">Digital Products</SelectItem>
                            <SelectItem value="Digital Cards">Digital Cards</SelectItem>
                            <SelectItem value="Services">Services</SelectItem>
                            <SelectItem value="Bundles">Bundles</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Templates">Templates</SelectItem>
                          </SelectContent>
                        </Select>
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
                            value={formData.discountStartDate}
                            onChange={(e) => setFormData({ ...formData, discountStartDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discountEndDate">Discount End Date</Label>
                          <Input
                            id="discountEndDate"
                            type="date"
                            value={formData.discountEndDate}
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
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
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
                          <Label htmlFor="emailMessage">Email Message Template</Label>
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
                                      field.options.map((option: any, optionIndex: number) => (
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
                <div className="space-y-3">
                  <Label>Product Images</Label>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {productType === "service"
                        ? "Upload portfolio samples or service images"
                        : productType === "digital-card"
                          ? "Upload card design or preview images"
                          : "Upload product images or screenshots"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: JPG, PNG, GIF (Max 5MB each)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="space-y-3">
                      <Label>Uploaded Images ({formData.images.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
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
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Click on an image to set it as the main product image. The main image will be displayed first.
                      </p>
                    </div>
                  )}

                  {formData.images.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No images uploaded yet</p>
                      <p className="text-xs mt-1">Upload images to display your product</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="flex flex-col sm:flex-col gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {product ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
