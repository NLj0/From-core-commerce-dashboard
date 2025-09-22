"use client"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, Hash } from "lucide-react"

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
  }>
  total: number
  status: string
  date: string
  shippingAddress: string
  paymentMethod: string
  trackingNumber: string | null
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
        <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Package className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      )
    case "shipped":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <Truck className="mr-1 h-3 w-3" />
          Shipped
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function OrderDetailsDialog({ open, onOpenChange, order, onUpdateStatus }: OrderDetailsDialogProps) {
  if (!order) return null

  const handleStatusChange = (newStatus: string) => {
    onUpdateStatus(order.id, newStatus)
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
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.products.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">Quantity: {product.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(product.price * product.quantity).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">${product.price.toFixed(2)} each</div>
                  </div>
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
                  <SelectItem value="shipped">Shipped</SelectItem>
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
