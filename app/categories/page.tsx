"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, Plus, FolderOpen, CheckCircle, XCircle, Package } from "lucide-react"
import { CategoryDialog } from "@/components/category-dialog"

// Mock categories data
const mockCategories = [
  {
    id: "CAT-001",
    name: "Digital Products",
    description: "Software, templates, and digital downloads",
    image: "/placeholder.svg?height=60&width=60",
    productsCount: 45,
    status: "active",
    createdDate: "2024-01-10",
    seo: {
      metaTitle: "Digital Products - Premium Templates & Software",
      metaDescription:
        "Discover our collection of premium digital products including templates, software, and digital downloads.",
      keywords: "digital products, templates, software, downloads",
    },
  },
  {
    id: "CAT-002",
    name: "Digital Cards",
    description: "Gift cards, vouchers, and digital certificates",
    image: "/placeholder.svg?height=60&width=60",
    productsCount: 12,
    status: "active",
    createdDate: "2024-01-08",
    seo: {
      metaTitle: "Digital Gift Cards & Vouchers",
      metaDescription: "Purchase digital gift cards and vouchers for various services and products.",
      keywords: "gift cards, vouchers, digital certificates",
    },
  },
  {
    id: "CAT-003",
    name: "Services",
    description: "Professional services and consultations",
    image: "/placeholder.svg?height=60&width=60",
    productsCount: 28,
    status: "active",
    createdDate: "2024-01-05",
    seo: {
      metaTitle: "Professional Services & Consultations",
      metaDescription: "Expert professional services including consulting, design, and development services.",
      keywords: "professional services, consulting, design, development",
    },
  },
  {
    id: "CAT-004",
    name: "Bundles",
    description: "Product bundles and package deals",
    image: "/placeholder.svg?height=60&width=60",
    productsCount: 8,
    status: "active",
    createdDate: "2024-01-03",
    seo: {
      metaTitle: "Product Bundles & Package Deals",
      metaDescription: "Save more with our carefully curated product bundles and package deals.",
      keywords: "bundles, packages, deals, combo",
    },
  },
  {
    id: "CAT-005",
    name: "Software",
    description: "Applications and software solutions",
    image: "/placeholder.svg?height=60&width=60",
    productsCount: 15,
    status: "inactive",
    createdDate: "2023-12-28",
    seo: {
      metaTitle: "Software Applications & Solutions",
      metaDescription: "Professional software applications and solutions for business and personal use.",
      keywords: "software, applications, solutions, tools",
    },
  },
  {
    id: "CAT-006",
    name: "Templates",
    description: "Design templates and themes",
    image: "/placeholder.svg?height=60&width=60",
    productsCount: 32,
    status: "active",
    createdDate: "2023-12-25",
    seo: {
      metaTitle: "Design Templates & Themes",
      metaDescription: "Professional design templates and themes for websites, presentations, and more.",
      keywords: "templates, themes, design, graphics",
    },
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="secondary" className="bg-gray-200/10 text-gray-200 hover:bg-gray-200/20">
          <XCircle className="mr-1 h-3 w-3" />
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedCategory, setSelectedCategory] = useState<(typeof mockCategories)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || category.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "status":
          return a.status.localeCompare(b.status)
        case "products":
          return b.productsCount - a.productsCount
        case "date":
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        default:
          return 0
      }
    })

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: (typeof mockCategories)[0]) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId))
    }
  }

  const handleSaveCategory = (categoryData: any) => {
    if (selectedCategory) {
      // Edit existing category
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, ...categoryData, id: selectedCategory.id } : cat,
        ),
      )
    } else {
      // Add new category
      const newCategory = {
        ...categoryData,
        id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
        productsCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setCategories([...categories, newCategory])
    }
    setIsDialogOpen(false)
  }

  // Calculate summary stats
  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.status === "active").length
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productsCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Categories</h1>
        <p className="text-muted-foreground mt-2">Organize and manage your product categories.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Category Management</CardTitle>
            <Button className="text-white" onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4 text-white" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredCategories.length} of {categories.length} categories
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{category.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-muted-foreground">{category.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{category.productsCount}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{category.createdDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="divide-y">
              {filteredCategories.map((category) => (
                <div key={category.id} className="p-4 space-y-3">
                  {/* Line 1: Category Image + Name + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground">{category.id}</div>
                      </div>
                    </div>
                    {getStatusBadge(category.status)}
                  </div>

                  {/* Line 2: Description + Products Count + Actions */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1 mr-4">
                      <div className="text-muted-foreground truncate">{category.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {category.productsCount} products • {category.createdDate}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
