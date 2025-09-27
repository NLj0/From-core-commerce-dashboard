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
import { Search, MoreHorizontal, Eye, Mail, Phone, ShoppingBag, DollarSign } from "lucide-react"
import { CustomerDetailsDialog } from "@/components/customer-details-dialog"

// Mock customers data
const mockCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    totalOrders: 12,
    totalSpent: 2847.65,
    lastActivity: "2024-01-15",
    joinDate: "2023-03-15",
    status: "active",
    address: "123 Main St, New York, NY 10001",
    orderHistory: [
      { id: "ORD-001", date: "2024-01-15", total: 359.97, status: "completed" },
      { id: "ORD-015", date: "2024-01-10", total: 199.99, status: "completed" },
      { id: "ORD-028", date: "2024-01-05", total: 89.99, status: "completed" },
    ],
    preferences: {
      newsletter: true,
      smsUpdates: false,
      category: "Electronics",
    },
  },
  {
    id: "CUST-002",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    totalOrders: 8,
    totalSpent: 1456.32,
    lastActivity: "2024-01-14",
    joinDate: "2023-06-20",
    status: "active",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    orderHistory: [
      { id: "ORD-002", date: "2024-01-14", total: 199.99, status: "processing" },
      { id: "ORD-022", date: "2024-01-08", total: 299.99, status: "completed" },
    ],
    preferences: {
      newsletter: true,
      smsUpdates: true,
      category: "Fashion",
    },
  },
  {
    id: "CUST-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    totalOrders: 15,
    totalSpent: 3245.78,
    lastActivity: "2024-01-13",
    joinDate: "2023-01-10",
    status: "vip",
    address: "789 Pine St, Chicago, IL 60601",
    orderHistory: [
      { id: "ORD-003", date: "2024-01-13", total: 169.98, status: "shipped" },
      { id: "ORD-018", date: "2024-01-07", total: 449.99, status: "completed" },
      { id: "ORD-025", date: "2024-01-02", total: 89.99, status: "completed" },
    ],
    preferences: {
      newsletter: true,
      smsUpdates: true,
      category: "Electronics",
    },
  },
  {
    id: "CUST-004",
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    totalOrders: 5,
    totalSpent: 789.45,
    lastActivity: "2024-01-12",
    joinDate: "2023-09-05",
    status: "active",
    address: "321 Elm St, Miami, FL 33101",
    orderHistory: [
      { id: "ORD-004", date: "2024-01-12", total: 149.99, status: "completed" },
      { id: "ORD-019", date: "2024-01-06", total: 79.99, status: "completed" },
    ],
    preferences: {
      newsletter: false,
      smsUpdates: false,
      category: "Home",
    },
  },
  {
    id: "CUST-005",
    name: "Alex Brown",
    email: "alex@example.com",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=40&width=40",
    totalOrders: 2,
    totalSpent: 159.98,
    lastActivity: "2024-01-11",
    joinDate: "2023-12-01",
    status: "new",
    address: "654 Maple Dr, Seattle, WA 98101",
    orderHistory: [
      { id: "ORD-005", date: "2024-01-11", total: 89.97, status: "cancelled" },
      { id: "ORD-021", date: "2024-01-04", total: 70.01, status: "completed" },
    ],
    preferences: {
      newsletter: true,
      smsUpdates: false,
      category: "Accessories",
    },
  },
  {
    id: "CUST-006",
    name: "Lisa Chen",
    email: "lisa@example.com",
    phone: "+1 (555) 678-9012",
    avatar: "/placeholder.svg?height=40&width=40",
    totalOrders: 0,
    totalSpent: 0,
    lastActivity: "2024-01-16",
    joinDate: "2024-01-16",
    status: "inactive",
    address: "987 Cedar Ln, Boston, MA 02101",
    orderHistory: [],
    preferences: {
      newsletter: false,
      smsUpdates: false,
      category: "Electronics",
    },
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "vip":
      return <Badge variant="violet">VIP</Badge>
    case "active":
      return <Badge variant="success">Active</Badge>
    case "new":
      return <Badge variant="info">New</Badge>
    case "inactive":
      return <Badge variant="gray">Inactive</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof mockCustomers)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewCustomer = (customer: (typeof mockCustomers)[0]) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  // Calculate summary stats
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active" || c.status === "vip").length
  const newCustomers = customers.filter((c) => c.status === "new").length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-2">Manage your customer relationships and track their activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
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
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">{customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-xs text-muted-foreground">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{customer.totalOrders}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.lastActivity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4 p-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="p-4">
                <div className="space-y-3">
                  {/* Customer Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.id}</div>
                      </div>
                    </div>
                    {getStatusBadge(customer.status)}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-1">
                    <div className="text-sm">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{customer.totalOrders}</span>
                        <span className="text-xs text-muted-foreground">orders</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">${customer.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Last: {customer.lastActivity}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} customer={selectedCustomer} />
    </div>
  )
}
