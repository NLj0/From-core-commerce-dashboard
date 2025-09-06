"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X, Package, Percent, DollarSign, Users, Clock, Target, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon?: any
  onSave?: (coupon: any) => void
}

// Enhanced mock products with categories and more details
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 199.99,
    category: "Electronics",
    stock: 45,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 299.99,
    category: "Electronics",
    stock: 23,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Gaming Mouse",
    price: 79.99,
    category: "Electronics",
    stock: 67,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    price: 149.99,
    category: "Electronics",
    stock: 34,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "USB-C Hub",
    price: 89.99,
    category: "Electronics",
    stock: 56,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 129.99,
    category: "Electronics",
    stock: 78,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Cotton T-Shirt",
    price: 29.99,
    category: "Clothing",
    stock: 120,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Denim Jeans",
    price: 79.99,
    category: "Clothing",
    stock: 89,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Running Shoes",
    price: 159.99,
    category: "Clothing",
    stock: 45,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    name: "Coffee Mug",
    price: 19.99,
    category: "Home",
    stock: 234,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "11",
    name: "Desk Lamp",
    price: 89.99,
    category: "Home",
    stock: 67,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12",
    name: "Plant Pot",
    price: 34.99,
    category: "Home",
    stock: 123,
    image: "/placeholder.svg?height=40&width=40",
  },
]

const categories = ["All Categories", "Electronics", "Clothing", "Home"]

export function CouponDialog({ open, onOpenChange, coupon, onSave }: CouponDialogProps) {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || "",
    startDate: coupon?.startDate ? new Date(coupon.startDate) : undefined,
    endDate: coupon?.endDate ? new Date(coupon.endDate) : undefined,
    hasUsageLimit: coupon?.usageLimit ? true : false,
    usageLimit: coupon?.usageLimit || "",
    hasMinOrderValue: coupon?.minOrderValue ? true : false,
    minOrderValue: coupon?.minOrderValue || "",
    appliesTo: coupon?.appliesTo || "all",
    selectedProducts: coupon?.products || [],
    description: coupon?.description || "",
    isActive: coupon?.status === "active" || true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [productSearch, setProductSearch] = useState("")
  const [productCategory, setProductCategory] = useState("All Categories")
  const [selectAll, setSelectAll] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required"
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters"
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0"
    }

    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%"
    }

    if (formData.hasUsageLimit && (!formData.usageLimit || formData.usageLimit <= 0)) {
      newErrors.usageLimit = "Usage limit must be greater than 0"
    }

    if (formData.hasMinOrderValue && (!formData.minOrderValue || formData.minOrderValue < 0)) {
      newErrors.minOrderValue = "Minimum order value must be 0 or greater"
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date"
    }

    if (formData.appliesTo === "selected" && formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = "Please select at least one product"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const couponData = {
      ...formData,
      usageLimit: formData.hasUsageLimit ? formData.usageLimit : null,
      minOrderValue: formData.hasMinOrderValue ? formData.minOrderValue : 0,
      status: formData.isActive ? "active" : "disabled",
    }

    onSave?.(couponData)
    onOpenChange(false)
  }

  const handleProductToggle = (product: any) => {
    const isSelected = formData.selectedProducts.some((p: any) => p.id === product.id)
    if (isSelected) {
      handleInputChange(
        "selectedProducts",
        formData.selectedProducts.filter((p: any) => p.id !== product.id),
      )
    } else {
      handleInputChange("selectedProducts", [...formData.selectedProducts, product])
    }
  }

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase())
    const matchesCategory = productCategory === "All Categories" || product.category === productCategory
    const notSelected = !formData.selectedProducts.some((p: any) => p.id === product.id)
    return matchesSearch && matchesCategory && notSelected
  })

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all filtered products
      const filteredIds = filteredProducts.map((p) => p.id)
      handleInputChange(
        "selectedProducts",
        formData.selectedProducts.filter((p: any) => !filteredIds.includes(p.id)),
      )
    } else {
      // Select all filtered products
      handleInputChange("selectedProducts", [...formData.selectedProducts, ...filteredProducts])
    }
    setSelectAll(!selectAll)
  }

  const handleBulkSelectByCategory = (category: string) => {
    const categoryProducts = mockProducts.filter(
      (p) => p.category === category && !formData.selectedProducts.some((selected: any) => selected.id === p.id),
    )
    handleInputChange("selectedProducts", [...formData.selectedProducts, ...categoryProducts])
  }

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    handleInputChange("code", result)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            {coupon ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
          <DialogDescription>
            {coupon ? "Update coupon details and settings" : "Create a new discount coupon for your customers"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="e.g., WELCOME20"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    className={errors.code ? "border-destructive" : ""}
                  />
                  <Button type="button" variant="outline" onClick={generateCouponCode}>
                    Generate
                  </Button>
                </div>
                {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleInputChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Percentage (%)
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fixed Amount ($)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value * {formData.discountType === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={formData.discountType === "percentage" ? "20" : "50"}
                  value={formData.discountValue}
                  onChange={(e) => handleInputChange("discountValue", Number.parseFloat(e.target.value) || "")}
                  className={errors.discountValue ? "border-destructive" : ""}
                />
                {errors.discountValue && <p className="text-sm text-destructive">{errors.discountValue}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                  <Label className="text-sm">{formData.isActive ? "Active" : "Disabled"}</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this coupon..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Validity Period */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Validity Period</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleInputChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Usage Limits</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.hasUsageLimit}
                  onCheckedChange={(checked) => handleInputChange("hasUsageLimit", checked)}
                />
                <Label>Set usage limit</Label>
              </div>

              {formData.hasUsageLimit && (
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Maximum Uses</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="100"
                    value={formData.usageLimit}
                    onChange={(e) => handleInputChange("usageLimit", Number.parseInt(e.target.value) || "")}
                    className={errors.usageLimit ? "border-destructive" : ""}
                  />
                  {errors.usageLimit && <p className="text-sm text-destructive">{errors.usageLimit}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.hasMinOrderValue}
                  onCheckedChange={(checked) => handleInputChange("hasMinOrderValue", checked)}
                />
                <Label>Set minimum order value</Label>
              </div>

              {formData.hasMinOrderValue && (
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">Minimum Order Value ($)</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    placeholder="50"
                    value={formData.minOrderValue}
                    onChange={(e) => handleInputChange("minOrderValue", Number.parseFloat(e.target.value) || "")}
                    className={errors.minOrderValue ? "border-destructive" : ""}
                  />
                  {errors.minOrderValue && <p className="text-sm text-destructive">{errors.minOrderValue}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Apply Coupon To</h3>
            </div>

            <div className="space-y-4">
              <Select value={formData.appliesTo} onValueChange={(value) => handleInputChange("appliesTo", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="selected">Selected Products</SelectItem>
                </SelectContent>
              </Select>

              {formData.appliesTo === "selected" && (
                <div className="space-y-4">
                  <Label>Select Products</Label>
                  {errors.selectedProducts && <p className="text-sm text-destructive">{errors.selectedProducts}</p>}

                  {/* Selected Products Summary */}
                  {formData.selectedProducts.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">
                          Selected Products ({formData.selectedProducts.length}):
                        </Label>
                        <Button variant="outline" size="sm" onClick={() => handleInputChange("selectedProducts", [])}>
                          Clear All
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {formData.selectedProducts.map((product: any) => (
                          <Badge key={product.id} variant="secondary" className="flex items-center gap-1">
                            {product.name}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleProductToggle(product)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Search and Filters */}
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={productCategory} onValueChange={setProductCategory}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bulk Selection Options */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={filteredProducts.length === 0}
                      >
                        {selectAll ? "Deselect" : "Select"} All Visible ({filteredProducts.length})
                      </Button>
                      {categories.slice(1).map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkSelectByCategory(category)}
                        >
                          Add All {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Available Products Grid */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Available Products ({filteredProducts.length}):
                    </Label>
                    <div className="max-h-64 overflow-y-auto border rounded-md p-3">
                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No products found</p>
                          <p className="text-xs">Try adjusting your search or filters</p>
                        </div>
                      ) : (
                        <div className="grid gap-2 md:grid-cols-2">
                          {filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer border"
                              onClick={() => handleProductToggle(product)}
                            >
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{product.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>${product.price}</span>
                                  <span>•</span>
                                  <span>{product.category}</span>
                                  <span>•</span>
                                  <span>{product.stock} in stock</span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            {coupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
