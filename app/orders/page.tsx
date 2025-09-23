"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Edit, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import { OrderDetailsDialog } from "@/components/order-details-dialog"

const mockOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    products: [
      {
        name: "Premium WordPress Theme",
        quantity: 1,
        price: 299.99,
        type: "digital",
        deliveryMethod: "File displayed on Order Page",
        files: [
          { name: "theme-files.zip", url: "/downloads/theme-files.zip", type: "ZIP" },
          { name: "documentation.pdf", url: "/downloads/docs.pdf", type: "PDF" },
        ],
      },
      {
        name: "Logo Design Package",
        quantity: 1,
        price: 149.99,
        type: "service",
        deliveryMethod: "Upload file after completion",
        customerFiles: [
          { name: "logo-brief.pdf", url: "/uploads/logo-brief.pdf", uploadedAt: "2024-01-15 10:30" },
          { name: "brand-colors.png", url: "/uploads/brand-colors.png", uploadedAt: "2024-01-15 10:32" },
        ],
      },
    ],
    total: 449.98,
    status: "completed",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
    deliveryMethod: "Email + Download",
    downloadExpiry: "2024-02-15",
    shippingAddress: "123 Main St, Springfield",
    trackingNumber: "TRACK-001",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    products: [
      {
        name: "Digital Marketing Course",
        quantity: 1,
        price: 199.99,
        type: "digital",
        deliveryMethod: "Code sent by Email",
        emailCode: "DMC-2024-SARAH-7X9K",
      },
    ],
    total: 199.99,
    status: "processing",
    date: "2024-01-15",
    paymentMethod: "PayPal",
    deliveryMethod: "Email Access",
    downloadExpiry: null,
    shippingAddress: "456 Oak Ave, Springfield",
    trackingNumber: "TRACK-002",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    products: [
      {
        name: "Stock Photo Bundle",
        quantity: 1,
        price: 79.99,
        type: "digital",
        deliveryMethod: "Direct Download Link",
        downloadLink: "https://downloads.example.com/stock-photos-bundle",
      },
      {
        name: "Video Editing Service",
        quantity: 1,
        price: 89.99,
        type: "service",
        deliveryMethod: "Send by Email",
        customerFiles: [
          { name: "raw-footage.mp4", url: "/uploads/raw-footage.mp4", uploadedAt: "2024-01-14 14:20" },
          { name: "editing-notes.txt", url: "/uploads/editing-notes.txt", uploadedAt: "2024-01-14 14:22" },
          { name: "music-preference.mp3", url: "/uploads/music-preference.mp3", uploadedAt: "2024-01-14 14:25" },
        ],
      },
    ],
    total: 169.98,
    status: "delivered",
    date: "2024-01-14",
    paymentMethod: "Credit Card",
    deliveryMethod: "Download Link",
    downloadExpiry: "2024-02-14",
    shippingAddress: "789 Pine Rd, Springfield",
    trackingNumber: "TRACK-003",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Emma Davis",
      email: "emma@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    products: [
      {
        name: "UI/UX Design Templates",
        quantity: 1,
        price: 149.99,
        type: "digital",
        deliveryMethod: "File displayed on Order Page",
        files: [
          { name: "ui-templates.sketch", url: "/downloads/ui-templates.sketch", type: "SKETCH" },
          { name: "design-system.fig", url: "/downloads/design-system.fig", type: "FIGMA" },
        ],
      },
    ],
    total: 149.99,
    status: "completed",
    date: "2024-01-14",
    paymentMethod: "Apple Pay",
    deliveryMethod: "Instant Download",
    downloadExpiry: "2024-03-14",
    shippingAddress: "321 Birch Blvd, Springfield",
    trackingNumber: "TRACK-004",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Alex Brown",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    products: [
      { name: "SEO Audit Service", quantity: 1, price: 299.99, type: "service", deliveryMethod: "Send by Email" },
    ],
    total: 299.99,
    status: "cancelled",
    date: "2024-01-13",
    paymentMethod: "Credit Card",
    deliveryMethod: "Email Report",
    downloadExpiry: null,
    shippingAddress: "654 Cedar St, Springfield",
    trackingNumber: "TRACK-005",
  },
  {
    id: "ORD-006",
    customer: {
      name: "Lisa Chen",
      email: "lisa@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    products: [
      {
        name: "E-book Collection",
        quantity: 1,
        price: 99.99,
        type: "digital",
        deliveryMethod: "Code sent by Email",
        emailCode: "EBOOK-2024-LISA-M3N8",
      },
      {
        name: "Content Writing Service",
        quantity: 1,
        price: 199.99,
        type: "service",
        deliveryMethod: "Upload file after completion",
      },
    ],
    total: 299.98,
    status: "pending",
    date: "2024-01-16",
    paymentMethod: "Credit Card",
    deliveryMethod: "Email + Download",
    downloadExpiry: null,
    shippingAddress: "987 Maple Ln, Springfield",
    trackingNumber: "TRACK-006",
  },
]

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
          <Clock className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      )
    case "delivered":
      return (
        <Badge variant="violet">
          <Download className="mr-1 h-3 w-3" />
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

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  // Calculate summary stats
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const processingOrders = orders.filter((o) => o.status === "processing").length
  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">Track and manage all digital orders and services.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
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
                          <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="text-sm">
                            {product.quantity}x {product.name}
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{order.products.length - 2} more</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "processing")}>
                            <Edit className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "delivered")}>
                            <Download className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "completed")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden">
            <div className="divide-y">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  {/* Line 1: Order ID + Customer Name + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-sm">{order.id}</span>
                      <span className="font-medium">{order.customer.name}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Line 2: Date + Total Price + Delivery Method */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{order.date}</span>
                      <span className="font-medium text-foreground">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">{order.deliveryMethod}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "processing")}>
                            <Edit className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "delivered")}>
                            <Download className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "completed")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  )
}
