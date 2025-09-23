"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CustomerFileUpload } from "./customer-file-upload"
import { ShoppingCart, CreditCard, User } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  customFields?: Array<{
    id: string
    type: "text" | "textarea" | "image" | "dropdown"
    label: string
    required: boolean
    options?: string[]
  }>
}

interface CheckoutFormProps {
  products: Product[]
  onCheckout: (orderData: any) => void
}

export function CheckoutForm({ products, onCheckout }: CheckoutFormProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  })
  const [productCustomData, setProductCustomData] = useState<Record<string, any>>({})
  const [productFiles, setProductFiles] = useState<Record<string, any>>({})

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0)

  const handleCustomFieldsChange = (productId: string, fields: Record<string, any>) => {
    setProductCustomData((prev) => ({
      ...prev,
      [productId]: fields,
    }))
  }

  const handleFilesChange = (productId: string, files: any[]) => {
    setProductFiles((prev) => ({
      ...prev,
      [productId]: files,
    }))
  }

  const handleCheckout = () => {
    const orderData = {
      customer: customerInfo,
      products: products.map((product) => ({
        ...product,
        customData: productCustomData[product.id] || {},
        files: productFiles[product.id] || [],
      })),
      total,
      timestamp: new Date().toISOString(),
    }

    onCheckout(orderData)
  }

  const hasCustomFields = products.some((product) => product.customFields && product.customFields.length > 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">Qty: {product.quantity}</div>
                  {product.customFields && product.customFields.length > 0 && (
                    <Badge variant="outline" className="mt-1">
                      Custom fields required
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">${(product.price * product.quantity).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">${product.price.toFixed(2)} each</div>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Fields for Products */}
      {hasCustomFields && (
        <div className="space-y-6">
          {products.map(
            (product) =>
              product.customFields &&
              product.customFields.length > 0 && (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name} - Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomerFileUpload
                      customFields={product.customFields}
                      onFieldsChange={(fields) => handleCustomFieldsChange(product.id, fields)}
                      onFilesChange={(files) => handleFilesChange(product.id, files)}
                      productName={product.name}
                    />
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      )}

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input id="expiryDate" placeholder="MM/YY" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV *</Label>
              <Input id="cvv" placeholder="123" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card *</Label>
              <Input id="cardName" placeholder="John Doe" required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <div className="flex justify-end">
        <Button onClick={handleCheckout} size="lg" className="w-full md:w-auto">
          Complete Order - ${total.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}
