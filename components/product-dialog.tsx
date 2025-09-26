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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus } from "lucide-react"

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
    price: "",
    stock: "",
    category: "",
    sku: "",
    description: "",
    image: "",
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
    // Stock management
    unlimitedStock: false,
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
        deliveryTime: "",
        deliveryType: "",
        uploadedFile: null,
        emailMessage: "",
        bundleProducts: [],
        bundleDelivery: "combined",
        customFields: [],
        unlimitedStock: false,
      })
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
        deliveryTime: "",
        deliveryType: "",
        uploadedFile: null,
        emailMessage: "",
        bundleProducts: [],
        bundleDelivery: "combined",
        customFields: [],
        unlimitedStock: false,
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...formData,
      name: formData.name,
      price: Number.parseFloat(formData.price),
      stock: formData.unlimitedStock ? null : Number.parseInt(formData.stock),
      category: formData.category,
      sku: formData.sku,
      image: formData.image || `/placeholder.svg?height=60&width=60&query=${formData.name}`,
      productType: productType || "standard",
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, uploadedFile: file })
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? `Edit ${getProductTypeTitle()}` : `Add New ${getProductTypeTitle()}`}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : `Fill in the details to add a new ${getProductTypeTitle().toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
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
                  <Label htmlFor="stock">Stock Quantity</Label>
                  {(productType === "digital" || productType === "digital-card") && (
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
                    placeholder={formData.unlimitedStock ? "Unlimited" : "0"}
                    disabled={formData.unlimitedStock}
                    required={!formData.unlimitedStock && productType !== "digital"}
                  />
                </div>
              </div>

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
                        <div className="space-y-2 max-h-40 overflow-y-auto">
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
                          Use {"{code}"} as a placeholder that will be replaced with the actual code when sending emails.
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
                          No custom fields configured. Add fields above to collect additional information from customers.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {productType === "bundle" && (
                <div className="space-y-4">
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
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {productType === "service"
                      ? "Upload portfolio samples or service images"
                      : productType === "digital-card"
                        ? "Upload card design or preview images"
                        : "Upload product images or screenshots"}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">Supported formats: JPG, PNG, GIF (Max 5MB each)</p>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
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