"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Percent, Calendar, Users, TrendingUp } from "lucide-react"
import { CouponDialog } from "@/components/coupon-dialog"

// Mock coupon data
const mockCoupons = [
  {
    id: "1",
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 1000,
    usageCount: 245,
    minOrderValue: 50,
    appliesTo: "all",
    status: "active",
    products: [],
  },
  {
    id: "2",
    code: "SAVE50",
    discountType: "fixed",
    discountValue: 50,
    startDate: "2024-02-01",
    endDate: "2024-03-31",
    usageLimit: 500,
    usageCount: 89,
    minOrderValue: 200,
    appliesTo: "selected",
    status: "active",
    products: ["Wireless Headphones", "Smart Watch"],
  },
  {
    id: "3",
    code: "EXPIRED10",
    discountType: "percentage",
    discountValue: 10,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    usageLimit: 200,
    usageCount: 200,
    minOrderValue: 0,
    appliesTo: "all",
    status: "expired",
    products: [],
  },
  {
    id: "4",
    code: "NEWUSER",
    discountType: "fixed",
    discountValue: 25,
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    usageLimit: 300,
    usageCount: 156,
    minOrderValue: 100,
    appliesTo: "selected",
    status: "active",
    products: ["Gaming Mouse", "Mechanical Keyboard"],
  },
  {
    id: "5",
    code: "DISABLED15",
    discountType: "percentage",
    discountValue: 15,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 100,
    usageCount: 45,
    minOrderValue: 75,
    appliesTo: "all",
    status: "disabled",
    products: [],
  },
]

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)

  const filteredCoupons = mockCoupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCoupons = mockCoupons.length
  const activeCoupons = mockCoupons.filter((c) => c.status === "active").length
  const totalUsage = mockCoupons.reduce((sum, c) => sum + c.usageCount, 0)
  const totalSavings = mockCoupons.reduce((sum, c) => {
    if (c.discountType === "percentage") {
      return sum + c.usageCount * 25 // Estimated average savings per use
    } else {
      return sum + c.usageCount * c.discountValue
    }
  }, 0)

  const handleCreateCoupon = () => {
    setEditingCoupon(null)
    setDialogOpen(true)
  }

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon)
    setDialogOpen(true)
  }

  const handleSaveCoupon = (couponData: any) => {
    console.log("Saving coupon:", couponData)
    // Here you would typically save to your backend
    // For now, just log the data
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "expired":
        return <Badge variant="gray">Expired</Badge>
      case "disabled":
        return <Badge variant="danger">Disabled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDiscount = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `$${value}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coupons & Discounts</h1>
          <p className="text-muted-foreground">Manage discount codes and promotional offers</p>
        </div>
        <Button className="text-white bg-emerald-600 hover:bg-emerald-700" onClick={handleCreateCoupon}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoupons}</div>
            <p className="text-xs text-muted-foreground">{activeCoupons} active coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Customer savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((activeCoupons / totalCoupons) * 100)}%</div>
            <p className="text-xs text-muted-foreground">Of total coupons</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 md:w-[300px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredCoupons.length} of {totalCoupons} coupons
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity Period</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{formatDiscount(coupon.discountType, coupon.discountValue)}</span>
                    {coupon.minOrderValue > 0 && (
                      <span className="text-xs text-muted-foreground">Min: ${coupon.minOrderValue}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {coupon.usageCount} / {coupon.usageLimit || "∞"}
                    </span>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{
                          width: coupon.usageLimit
                            ? `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {coupon.appliesTo === "all" ? (
                    <span className="text-sm">All Products</span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Selected Products</span>
                      <span className="text-xs text-muted-foreground">
                        {coupon.products.slice(0, 2).join(", ")}
                        {coupon.products.length > 2 && ` +${coupon.products.length - 2} more`}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon.id} className="p-4">
            <div className="space-y-3">
              {/* First Line: Code, Discount, Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{coupon.code}</span>
                  <Badge variant="outline" className="text-xs">
                    {formatDiscount(coupon.discountType, coupon.discountValue)}
                  </Badge>
                </div>
                {getStatusBadge(coupon.status)}
              </div>

              {/* Second Line: Usage, Validity, Actions */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>
                    {coupon.usageCount}/{coupon.usageLimit || "∞"} used
                  </span>
                  <span>Until {formatDate(coupon.endDate)}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Additional Info */}
              {coupon.appliesTo === "selected" && (
                <div className="text-xs text-muted-foreground">
                  Applies to: {coupon.products.slice(0, 2).join(", ")}
                  {coupon.products.length > 2 && ` +${coupon.products.length - 2} more`}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Coupon Dialog */}
      <CouponDialog open={dialogOpen} onOpenChange={setDialogOpen} coupon={editingCoupon} onSave={handleSaveCoupon} />
    </div>
  )
}
