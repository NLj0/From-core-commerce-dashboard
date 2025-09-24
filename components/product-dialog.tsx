"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Upload, X, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductValidator } from "@/lib/product-validation"
import { ValidationDisplay } from "@/components/validation-display"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: string
  image: string
  category: string
  sku: string
}

interface ProductImage {
  id: string
  url: string
  file?: File
  isPrimary: boolean
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
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [imageErrors, setImageErrors] = useState<string[]>([])
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: any[]; warnings: any[] }>({
    isValid: true,
    errors: [],
    warnings: [],
  })
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    sku: "",
    description: "",
    image: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    deliveryMethod: "",
    downloadLink: "",
    expirationDays: "",
    codes: [] as string[],
    digitalCodes: [] as string[],
    codeMessages: [] as string[],
    deliveryTime: "",
    bundleProducts: [] as string[],
    bundleDelivery: "combined",
    customFields: [] as Array<{
      id: string
      type: "text" | "textarea" | "image" | "dropdown"
      label: string
      required: boolean
      options?: Array<{ label: string; price: number }>
    }>,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        sku: product.sku,
        description: "",
        image: product.image,
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        deliveryMethod: "",
        downloadLink: "",
        expirationDays: "",
        codes: [],
        digitalCodes: [],
        codeMessages: [],
        deliveryTime: "",
        bundleProducts: [],
        bundleDelivery: "combined",
        customFields: [],
      })
      setProductImages(product.images || [])
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        sku: "",
        description: "",
        image: "",
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        deliveryMethod: "",
        downloadLink: "",
        expirationDays: "",
        codes: [],
        digitalCodes: [],
        codeMessages: [],
        deliveryTime: "",
        bundleProducts: [],
        bundleDelivery: "combined",
        customFields: [],
      })
      setProductImages([])
    }
  }, [product])

  useEffect(() => {
    const result = ProductValidator.validateProduct({
      images: productImages,
      customFields: formData.customFields,
    })
    setValidationResult(result)
  }, [productImages, formData.customFields])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationResult = ProductValidator.validateProduct({
      images: productImages,
      customFields: formData.customFields,
    })

    if (!validationResult.isValid) {
      // Show validation errors in a more user-friendly way
      const errorMessages = validationResult.errors.map((error) => error.message).join("\n")
      alert(`Please fix the following issues:\n\n${errorMessages}`)
      return
    }

    const productData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      category: formData.category,
      sku: formData.sku,
      image:
        productImages.find((img) => img.isPrimary)?.url ||
        productImages[0]?.url ||
        `/placeholder.svg?height=60&width=60&query=${formData.name}`,
      productType: productType || "standard",
      images: productImages,
      customFields: formData.customFields,
      ...formData,
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
          { value: "code", label: "Code sent by Email" },
          { value: "file", label: "File displayed on Order Page" },
        ]
      case "digital-card":
        return [
          { value: "email", label: "Code sent by Email" },
          { value: "order-page", label: "Code shown on Order Page" },
          { value: "file", label: "File containing multiple codes" },
        ]
      case "service":
        return [
          { value: "file", label: "Upload file after completion" },
          { value: "email", label: "Send by Email" },
          { value: "link", label: "Share through external link" },
        ]
      default:
        return []
    }
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

  const addDigitalCode = () => {
    setFormData({ ...formData, digitalCodes: [...formData.digitalCodes, ""] })
  }

  const updateDigitalCode = (index: number, value: string) => {
    const newCodes = [...formData.digitalCodes]
    newCodes[index] = value
    setFormData({ ...formData, digitalCodes: newCodes })
  }

  const removeDigitalCode = (index: number) => {
    const newCodes = formData.digitalCodes.filter((_, i) => i !== index)
    setFormData({ ...formData, digitalCodes: newCodes })
  }

  const addCodeMessage = () => {
    setFormData({ ...formData, codeMessages: [...formData.codeMessages, ""] })
  }

  const updateCodeMessage = (index: number, value: string) => {
    const newMessages = [...formData.codeMessages]
    newMessages[index] = value
    setFormData({ ...formData, codeMessages: newMessages })
  }

  const removeCodeMessage = (index: number) => {
    const newMessages = formData.codeMessages.filter((_, i) => i !== index)
    setFormData({ ...formData, codeMessages: newMessages })
  }

  const validateImageUpload = (files: FileList): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = []
    const errors: string[] = []

    if (productImages.length + files.length > 10) {
      errors.push(`Maximum 10 images allowed. You can add ${10 - productImages.length} more images.`)
      return { valid: [], errors }
    }

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`File ${file.name} is not an image.`)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        errors.push(`File ${file.name} exceeds 10MB limit.`)
        return
      }

      validFiles.push(file)
    })

    return { valid: validFiles, errors }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const { valid, errors } = validateImageUpload(files)
    setImageErrors(errors)

    if (valid.length > 0) {
      const newImages: ProductImage[] = valid.map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        file,
        isPrimary: productImages.length === 0 && index === 0,
      }))

      setProductImages((prev) => [...prev, ...newImages])
    }
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
      setFormData({ ...formData, digitalCodes: [...formData.digitalCodes, ...lines] })
    }
    reader.readAsText(file)
  }

  const setPrimaryImage = (imageId: string) => {
    setProductImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === imageId,
      })),
    )
  }

  const removeImage = (imageId: string) => {
    setProductImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId)
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true
      }
      return filtered
    })
    setImageErrors([])
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
      const newOptions = field.options.filter((_, i) => i !== optionIndex)
      updateCustomField(fieldId, { options: newOptions })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? `Edit ${getProductTypeTitle()}` : `Add New ${getProductTypeTitle()}`}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : `Fill in the details to add a new ${getProductTypeTitle().toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>

        {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
          <ValidationDisplay errors={validationResult.errors} warnings={validationResult.warnings} showSummary={true} />
        )}

        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    {productType === "digital" ? "Stock (Leave empty for unlimited)" : "Stock Quantity"}
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder={productType === "digital" ? "Unlimited" : "0"}
                    required={productType !== "digital"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>
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
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              {productType && productType !== "bundle" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Delivery Method</Label>
                    <RadioGroup
                      value={formData.deliveryMethod}
                      onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                    >
                      {getDeliveryMethods().map((method) => (
                        <div key={method.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={method.value} id={method.value} />
                          <Label htmlFor={method.value}>{method.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {formData.deliveryMethod === "download" && (
                    <div className="space-y-2">
                      <Label htmlFor="downloadLink">Download Link</Label>
                      <Input
                        id="downloadLink"
                        value={formData.downloadLink}
                        onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                        placeholder="https://example.com/download"
                      />
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
                    </div>
                  )}

                  {(formData.deliveryMethod === "order-page" || formData.deliveryMethod === "code") && (
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Digital Codes & Messages</Label>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={addDigitalCode}>
                            + Add Code
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={addCodeMessage}>
                            + Add Message
                          </Button>
                        </div>
                      </div>

                      {formData.digitalCodes.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Codes</Label>
                          {formData.digitalCodes.map((code, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={code}
                                onChange={(e) => updateDigitalCode(index, e.target.value)}
                                placeholder="Enter digital code"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeDigitalCode(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.codeMessages.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Messages</Label>
                          {formData.codeMessages.map((message, index) => (
                            <div key={index} className="flex gap-2">
                              <Textarea
                                value={message}
                                onChange={(e) => updateCodeMessage(index, e.target.value)}
                                placeholder="Enter message or instructions"
                                rows={2}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeCodeMessage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

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
                    </div>
                  )}

                  {productType === "service" && (
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
                  )}

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Custom Order Fields</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => addCustomField("text")}>
                          + Text
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addCustomField("textarea")}>
                          + Textarea
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addCustomField("image")}>
                          + Image
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addCustomField("dropdown")}>
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
                                  size="sm"
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
                                  field.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex gap-2 items-center">
                                      <Input
                                        value={option.label}
                                        onChange={(e) =>
                                          updateDropdownOption(field.id, optionIndex, { label: e.target.value })
                                        }
                                        placeholder="Option label"
                                        size="sm"
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
                                          size="sm"
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
                  </div>
                </div>
              )}

              {productType === "bundle" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bundle Contents</Label>
                    <p className="text-sm text-muted-foreground">Select products to include in this bundle</p>
                    <div className="border rounded-lg p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">Bundle product selection would go here</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bundle Delivery</Label>
                    <RadioGroup
                      value={formData.bundleDelivery}
                      onValueChange={(value) => setFormData({ ...formData, bundleDelivery: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="combined" id="combined" />
                        <Label htmlFor="combined">Combined delivery (everything in one order)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="separate" id="separate" />
                        <Label htmlFor="separate">Separate delivery (each product delivered separately)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Product Images</Label>
                  <Badge variant="outline">{productImages.length}/10</Badge>
                </div>

                {imageErrors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <div className="text-sm text-destructive space-y-1">
                      {imageErrors.map((error, index) => (
                        <p key={index}>• {error}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload product images (Max 10 images, 10MB each)</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Choose Files
                  </Button>
                </div>

                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productImages.map((image) => (
                      <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                        <img src={image.url || "/placeholder.svg"} alt="Product" className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={image.isPrimary ? "default" : "secondary"}
                            onClick={() => setPrimaryImage(image.id)}
                          >
                            <Star className={`h-4 w-4 ${image.isPrimary ? "fill-current" : ""}`} />
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(image.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {image.isPrimary && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!validationResult.isValid}
                className={!validationResult.isValid ? "opacity-50 cursor-not-allowed" : ""}
              >
                {product ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
