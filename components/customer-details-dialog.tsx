"use client"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  DollarSign,
  Bell,
  MessageSquare,
  CheckCircle,
  Package,
  Truck,
  XCircle,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  totalOrders: number
  totalSpent: number
  lastActivity: string
  joinDate: string
  status: string
  address: string
  orderHistory: Array<{
    id: string
    date: string
    total: number
    status: string
  }>
  preferences: {
    newsletter: boolean
    smsUpdates: boolean
    category: string
  }
}

interface CustomerDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
}

function getStatusBadge(status: string) {
  switch (status) {
    case "vip":
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          VIP
        </Badge>
      )
    case "active":
      return (
        <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
          Active
        </Badge>
      )
    case "new":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          New
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getOrderStatusBadge(status: string) {
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

export function CustomerDetailsDialog({ open, onOpenChange, customer }: CustomerDetailsDialogProps) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
              <AvatarFallback>
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                {customer.name}
                {getStatusBadge(customer.status)}
              </div>
              <div className="text-sm text-muted-foreground font-normal">{customer.id}</div>
            </div>
          </DialogTitle>
          <DialogDescription>Complete customer profile and order history.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customer.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Customer Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{customer.joinDate}</div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">{customer.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Last Activity</div>
                    <div className="text-sm text-muted-foreground">{customer.lastActivity}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Newsletter</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.preferences.newsletter ? "Subscribed" : "Not subscribed"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">SMS Updates</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.preferences.smsUpdates ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Favorite Category</div>
                  <div className="text-sm text-muted-foreground">{customer.preferences.category}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Order History</h3>
            {customer.orderHistory.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.orderHistory.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono font-medium">{order.id}</TableCell>
                          <TableCell className="text-muted-foreground">{order.date}</TableCell>
                          <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                          <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
