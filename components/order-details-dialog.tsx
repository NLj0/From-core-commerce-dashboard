"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Hash,
  Download,
  Mail,
  FileText,
  Copy,
  Eye,
} from "lucide-react"
import { useState } from "react"

interface Order {
  id: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  products: Array<{
    name: string
    quantity: number
    price: number
    type?: string
    deliveryMethod?: string
    downloadLink?: string
    emailCode?: string
    files?: Array<{
      name: string
      url: string
      type: string
    }>
    customerFiles?: Array<{
      name: string
      url: string
      uploadedAt: string
    }>
  }>
  total: number
  status: string
  date: string
  shippingAddress: string
  paymentMethod: string
  trackingNumber: string | null
  deliveryMethod?: string
  downloadExpiry?: string | null
}

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onUpdateStatus: (orderId: string, status: string) => void
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="success">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="info">
          <Package className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      )
    case "delivered":
      return (
        <Badge variant="violet">
          <Truck className="mr-1 h-3 w-3" />
          Delivered
        </Badge>
      )
    case "pending":
      return <Badge variant="warning">Pending</Badge>
    case "cancelled":
      return (
        <Badge variant="danger">
          <XCircle className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function OrderDetailsDialog({ open, onOpenChange, order, onUpdateStatus }: OrderDetailsDialogProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  if (!order) return null

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(order.id, newStatus)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details - {order.id}
            {getStatusBadge(order.status)}
          </DialogTitle>
          <DialogDescription>Complete order information and management options.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={order.customer.avatar || "/placeholder.svg"} alt={order.customer.name} />
                <AvatarFallback>
                  {order.customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{order.customer.name}</div>
                <div className="text-sm text-muted-foreground">{order.customer.email}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Items & Delivery</h3>
            <div className="space-y-4">
              {order.products.map((product, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {product.quantity}</div>
                      {product.type && (
                        <Badge variant="outline" className="mt-1">
                          {product.type}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(product.price * product.quantity).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">${product.price.toFixed(2)} each</div>
                    </div>
                  </div>

                  {product.deliveryMethod && (
                    <div className="space-y-3 border-t pt-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{product.deliveryMethod}</Badge>
                      </div>

                      {/* Download Link */}
                      {product.downloadLink && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">Download Available</span>
                            </div>
                            <Button size="sm" onClick={() => window.open(product.downloadLink, "_blank")}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                          {order.downloadExpiry && (
                            <p className="text-xs text-muted-foreground mt-1">Expires: {order.downloadExpiry}</p>
                          )}
                        </div>
                      )}

                      {/* Email Code */}
                      {product.emailCode && (
                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">Access Code</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(product.emailCode!, `code-${index}`)}
                            >
                              {copiedCode === `code-${index}` ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <Copy className="h-4 w-4 mr-1" />
                              )}
                              {copiedCode === `code-${index}` ? "Copied!" : "Copy Code"}
                            </Button>
                          </div>
                          <div className="mt-2 font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                            {product.emailCode}
                          </div>
                        </div>
                      )}

                      {/* Files on Order Page */}
                      {product.files && product.files.length > 0 && (
                        <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Order Files</span>
                          </div>
                          <div className="space-y-2">
                            {product.files.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm">{file.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {file.type}
                                  </Badge>
                                </div>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => downloadFile(file.url, file.name)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Customer Uploaded Files */}
                      {product.customerFiles && product.customerFiles.length > 0 && (
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Customer Files</span>
                            <Badge variant="outline">{product.customerFiles.length}/3</Badge>
                          </div>
                          <div className="space-y-2">
                            {product.customerFiles.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <div>
                                    <span className="text-sm">{file.name}</span>
                                    <div className="text-xs text-muted-foreground">Uploaded: {file.uploadedAt}</div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => downloadFile(file.url, file.name)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{order.shippingAddress}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Tracking Information
              </h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-mono">{order.trackingNumber}</p>
              </div>
            </div>
          )}

          {/* Status Management */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Update Order Status</h3>
            <div className="flex items-center gap-3">
              <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">Order placed on {order.date}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
