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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ChevronDown } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 299.99,
    stock: 45,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    category: "Electronics",
    sku: "WH-001",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    stock: 23,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    category: "Electronics",
    sku: "SW-002",
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 149.99,
    stock: 0,
    status: "out_of_stock",
    image: "/placeholder.svg?height=60&width=60",
    category: "Electronics",
    sku: "BS-003",
  },
  {
    id: "4",
    name: "Laptop Stand",
    price: 79.99,
    stock: 67,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    category: "Accessories",
    sku: "LS-004",
  },
  {
    id: "5",
    name: "Phone Case",
    price: 29.99,
    stock: 156,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    category: "Accessories",
    sku: "PC-005",
  },
  {
    id: "6",
    name: "Gaming Mouse",
    price: 89.99,
    stock: 12,
    status: "low_stock",
    image: "/placeholder.svg?height=60&width=60",
    category: "Electronics",
    sku: "GM-006",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
          Active
        </Badge>
      )
    case "out_of_stock":
      return (
        <Badge variant="destructive" className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
          Out of Stock
        </Badge>
      )
    case "low_stock":
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20">
          Low Stock
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<(typeof mockProducts)[0] | null>(null)
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null)

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleAddProduct = (productType: string) => {
    setEditingProduct(null)
    setSelectedProductType(productType)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: (typeof mockProducts)[0]) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)))
    } else {
      // Add new product
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        status: productData.stock > 0 ? (productData.stock < 20 ? "low_stock" : "active") : "out_of_stock",
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">Manage your product inventory and catalog.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 w-full md:w-auto bg-primary text-white rounded-xl shadow-md hover:bg-primary/90" size="sm">
              <Plus className="h-4 w-4" />
              Add Product
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleAddProduct("digital")} className="hover:bg-emerald-500/20">
              <div className="flex flex-col items-start">
                <span className="font-medium">Digital Product</span>
                <span className="text-xs">Files, courses, software</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddProduct("digital-card")} className="hover:bg-emerald-500/20">
              <div className="flex flex-col items-start">
                <span className="font-medium">Digital Card</span>
                <span className="text-xs">Coupons, recharge codes</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddProduct("service")} className="hover:bg-emerald-500/20">
              <div className="flex flex-col items-start">
                <span className="font-medium">On-Demand Service</span>
                <span className="text-xs">Design, consulting, writing</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddProduct("bundle")} className="hover:bg-emerald-500/20">
              <div className="flex flex-col items-start">
                <span className="font-medium">Bundle Products</span>
                <span className="text-xs">Multi-product packages</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 md:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1 md:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="flex-1 md:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table - Desktop */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Product</TableHead>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-lg">
                          <AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
                          <AvatarFallback className="rounded-lg">{product.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm md:text-base">{product.name}</div>
                          <div className="text-xs md:text-sm text-muted-foreground">
                            <span className="lg:hidden">{product.category} • </span>
                            <span className="md:hidden">{product.sku}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{product.sku}</TableCell>
                    <TableCell className="font-medium text-sm md:text-base">${product.price}</TableCell>
                    <TableCell>
                      <span className={`text-sm md:text-base ${product.stock < 20 ? "text-orange-600" : ""}`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{product.category}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="hover:bg-emerald-500/20">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-emerald-500/20" onClick={() => handleEditProduct(product)} >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="hover:bg-destructive"
                          >
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
          </div>
        </CardContent>
      </Card>

      {/* Products Table - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="space-y-3">
              {/* Line 1: Product Image + Name + Price */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
                  <AvatarFallback className="rounded-lg">{product.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="font-bold text-lg">${product.price}</div>
                </div>
              </div>
              {/* Line 2: Stock + Status + Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Stock: </span>
                    <span className={product.stock < 20 ? "text-orange-600" : ""}>{product.stock}</span>
                  </div>
                  {getStatusBadge(product.status)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product Dialog */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        productType={selectedProductType}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
