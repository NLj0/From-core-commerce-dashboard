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
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Search, Globe } from "lucide-react"

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
    // Bundle fields
    bundleProducts: [] as string[],
    bundleDelivery: "combined",
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
        bundleProducts: [],
        bundleDelivery: "combined",
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
        bundleProducts: [],
        bundleDelivery: "combined",
        unlimitedStock: false,
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      stock: formData.unlimitedStock ? null : Number.parseInt(formData.stock),
      category: formData.category,
      sku: formData.sku,
      image: formData.image || `/placeholder.svg?height=60&width=60&query=${formData.name}`,
      productType: productType || "standard",
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, uploadedFile: file })
    }
  }

  const getSEOPreview = () => {
    const title = formData.metaTitle || formData.name || "Product Title"
    const description = formData.metaDescription || formData.description || "Product description will appear here..."
    const url = `https://yourstore.com/products/${formData.name.toLowerCase().replace(/\s+/g, "-")}`

    return { title, description, url }
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
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
                    This is how your product will appear in Google search results
                  </div>
                </div>
              </div>
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
