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
import { Upload, X } from "lucide-react"

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
    // Bundle fields
    bundleProducts: [] as string[],
    bundleDelivery: "combined",
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
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
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

                  {(formData.deliveryMethod === "code" || formData.deliveryMethod === "email") &&
                    productType === "digital-card" && (
                      <div className="space-y-2">
                        <Label>Codes</Label>
                        {formData.codes.map((code, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={code}
                              onChange={(e) => updateCode(index, e.target.value)}
                              placeholder="Enter code"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => removeCode(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addCode}>
                          Add Code
                        </Button>
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
                </div>
              )}

              {productType === "bundle" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bundle Contents</Label>
                    <p className="text-sm text-muted-foreground">Select products to include in this bundle</p>
                    {/* This would typically be a multi-select component with existing products */}
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
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {productType === "service" ? "Upload portfolio samples or service images" : "Upload product images"}
                  </p>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
