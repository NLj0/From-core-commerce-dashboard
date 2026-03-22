"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string 

interface Product {
  id: string
  name: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  price: number
  costPrice?: number
  salePrice?: number
	stock: number
	quantity?: number | null // For compatibility
  sku: string
  barcode?: string
  status: string
  isActive: boolean
  isDigital: boolean
  weight?: number
  dimensions?: string
  tags: string[]
  images?: string // For compatibility
  discountType?: "percentage" | "amount"
  discountValue?: number
  discountStartDate?: string | null
  discountEndDate?: string | null
  createdAt: string
  updatedAt: string
  categoryId?: string
  category?: {
    id: string
    name: string
  }
  digitalSettings?: string | null
  deliveryMethod?: string | null
  codes?: string[]
  productType?: string | null
  unlimitedStock?: boolean
  trackQuantity?: boolean
  _count?: {
    reviews: number
  }
  averageRating: number
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

function getStatusBadge(status: string, t: TranslateFn) {
	switch (status) {
		case "active":
			return (
				<Badge variant="success">
					{t("common.active")}
				</Badge>
			)
		case "out_of_stock":
			return (
				<Badge variant="danger">
					{t("products.outOfStock")}
				</Badge>
			)
		case "low_stock":
			return (
				<Badge variant="warning">
					{t("products.lowStock")}
				</Badge>
			)
		default: {
			const fallbackKey = `products.${status}`
			const label = t(fallbackKey)
			return <Badge variant="outline">{label !== fallbackKey ? label : status}</Badge>
		}
	}
}

function getCategoryLabel(category: string, t: TranslateFn) {
	const key = `products.categoryOptions.${category}`
	const label = t(key)
	return label === key ? category : label
}

function getStockDisplay(product: Product): string {
	// For code-based delivery methods, show the number of codes
	if (product.deliveryMethod === "codes" || product.deliveryMethod === "code-email" || product.deliveryMethod === "code-order-page") {
		return (product.codes?.length ?? 0).toString()
	}
	
	// For other delivery methods, show stock if available
	if (product.unlimitedStock) {
		return "∞"
	}
	
	// Show manual stock value or quantity
	return ((product.stock ?? product.quantity) || 0).toString()
}

export default function ProductsPage() {
	const { t, dir } = useLanguage()
	const isRTL = dir === "rtl"
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [selectedProductType, setSelectedProductType] = useState<string | null>(null)
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		pages: 0
	})

	// جلب المنتجات من API
	const fetchProducts = async () => {
		try {
			setLoading(true)
			const params = new URLSearchParams({
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
			})
			
			if (searchTerm) params.append('search', searchTerm)
			if (categoryFilter !== 'all') params.append('category', categoryFilter)
			if (statusFilter === 'digital') params.append('digital', 'true')
			else if (statusFilter === 'physical') params.append('digital', 'false')

			const response = await fetch(`/api/products?${params}`)
					if (response.ok) {
						const data: ProductsResponse = await response.json()

					const normalizedProducts: Product[] = data.products.map((product) => {
							let parsedSettings: any = {}
							if (product.digitalSettings) {
								try {
									parsedSettings = JSON.parse(product.digitalSettings)
								} catch (error) {
									console.warn("Failed to parse digital settings for product", product.id, error)
									parsedSettings = {}
								}
							}

							const deliveryMethod: string | null = parsedSettings.deliveryMethod ?? product.deliveryMethod ?? null
							const codes: string[] = Array.isArray(parsedSettings.codes)
								? parsedSettings.codes.filter((code: unknown): code is string => typeof code === "string" && code.trim().length > 0)
								: product.codes ?? []

							const quantity = typeof product.quantity === "number" ? product.quantity : null
							const unlimitedStock =
								typeof product.unlimitedStock === "boolean"
									? product.unlimitedStock
									: (quantity ?? 0) >= 999999 || false

										return {
											...product,
											isDigital: product.isDigital || deliveryMethod !== "shipping",
											digitalSettings:
												product.digitalSettings ?? (Object.keys(parsedSettings).length ? JSON.stringify(parsedSettings) : null),
											deliveryMethod: deliveryMethod ?? null,
											codes,
											productType: "digital",
											quantity,
											stock: typeof product.stock === "number" ? product.stock : quantity ?? 0,
											unlimitedStock,
										}
					})

						setProducts(normalizedProducts)
						setPagination(data.pagination)
					}
		} catch (error) {
			console.error('Error fetching products:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts()
	}, [pagination.page, searchTerm, categoryFilter, statusFilter])

	const showingLabel = t("products.showingCount")
		.replace("{current}", products.length.toString())
		.replace("{total}", pagination.total.toString())

	const handleAddProduct = () => {
		setEditingProduct(null)
		setSelectedProductType("digital")
		setIsDialogOpen(true)
	}

	const handleEditProduct = (product: Product) => {
		setEditingProduct(product)
		setSelectedProductType("digital")
		setIsDialogOpen(true)
	}

	const handleDialogClose = (open: boolean) => {
		setIsDialogOpen(open)
		if (!open) {
			setEditingProduct(null)
			setSelectedProductType(null)
		}
	}

	const handleDeleteProduct = async (productId: string) => {
		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE'
			})
			if (response.ok) {
				await fetchProducts() // إعادة تحميل البيانات
			}
		} catch (error) {
			console.error('Error deleting product:', error)
		}
	}

	const handleSaveProduct = async (productData: any) => {
		try {
			const method = editingProduct ? 'PUT' : 'POST'
			const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
			
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(productData)
			})
			
			if (response.ok) {
				await fetchProducts() // إعادة تحميل البيانات
				setIsDialogOpen(false)
				setEditingProduct(null)
				setSelectedProductType(null)
			}
		} catch (error) {
			console.error('Error saving product:', error)
		}
	}

	return (
		<div className="space-y-4 md:space-y-6" dir={dir}>
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className={isRTL ? "text-right" : "text-left"}>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("products.title")}</h1>
					<p className="text-muted-foreground mt-1 md:mt-2">{t("products.subtitle")}</p>
				</div>
				<Button 
					onClick={handleAddProduct}
					className={`flex items-center gap-2 text-white ${isRTL ? "flex-row-reverse" : ""}`}
				>
					<Plus className="h-4 w-4" />
					{t("products.addProduct")}
				</Button>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-lg md:text-xl">{t("products.productManagement")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-3 md:flex-row md:items-center">
							<div className="relative flex-1">
								<Search
									className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${
										isRTL ? "right-3" : "left-3"
									}`}
								/>
								<Input
									placeholder={t("products.searchProducts")}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className={isRTL ? "pr-10 text-right" : "pl-10"}
								/>
							</div>
							<div className="flex gap-2 md:gap-4">
												<Select value={statusFilter} onValueChange={setStatusFilter}>
													<SelectTrigger
														className={`flex-1 md:w-[140px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
													>
										<SelectValue placeholder={t("common.status")} />
									</SelectTrigger>
													<SelectContent>
										<SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
											{t("products.allStatuses")}
										</SelectItem>
										<SelectItem value="active" className={isRTL ? "justify-end text-right" : ""}>
											{t("common.active")}
										</SelectItem>
										<SelectItem value="low_stock" className={isRTL ? "justify-end text-right" : ""}>
											{t("products.lowStock")}
										</SelectItem>
										<SelectItem value="out_of_stock" className={isRTL ? "justify-end text-right" : ""}>
											{t("products.outOfStock")}
										</SelectItem>
									</SelectContent>
								</Select>
												<Select value={categoryFilter} onValueChange={setCategoryFilter}>
													<SelectTrigger
														className={`flex-1 md:w-[140px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
													>
										<SelectValue placeholder={t("products.category")} />
									</SelectTrigger>
													<SelectContent>
										<SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
											{t("products.allCategories")}
										</SelectItem>
										<SelectItem value="Electronics" className={isRTL ? "justify-end text-right" : ""}>
											{getCategoryLabel("Electronics", t)}
										</SelectItem>
										<SelectItem value="Accessories" className={isRTL ? "justify-end text-right" : ""}>
											{getCategoryLabel("Accessories", t)}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="text-sm text-muted-foreground text-center md:text-right">{showingLabel}</div>
					</div>
				</CardContent>
			</Card>

			{/* Products Table - Desktop */}
			{products.length === 0 && !loading ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
						<div className={`text-center ${isRTL ? "" : ""}`}>
							<h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
								{t("products.noProducts")}
							</h3>
							<p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
								{t("products.noProductsDescription")}
							</p>
							<Button 
								onClick={handleAddProduct}
								className={`flex items-center gap-2 text-white mx-auto ${isRTL ? "flex-row-reverse" : ""}`}
							>
								<Plus className="h-4 w-4" />
								{t("products.addProduct")}
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
			<Card className="hidden md:block">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
											<TableHeader>
												<TableRow className={isRTL ? "text-right" : ""}>
													<TableHead className={`min-w-[200px] ${isRTL ? "text-right" : ""}`}>{t("products.product")}</TableHead>
													<TableHead className={`hidden md:table-cell ${isRTL ? "text-right" : ""}`}>
														{t("products.sku")}
													</TableHead>
													<TableHead className={isRTL ? "text-right" : ""}>{t("products.price")}</TableHead>
													<TableHead className={isRTL ? "text-right" : ""}>{t("products.stock")}</TableHead>
													<TableHead className={isRTL ? "text-right" : ""}>{t("common.status")}</TableHead>
													<TableHead className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
														{t("products.category")}
													</TableHead>
													<TableHead className={`w-[70px] ${isRTL ? "text-right" : ""}`}>{t("common.actions")}</TableHead>
												</TableRow>
											</TableHeader>
							<TableBody>
								{products.map((product: Product) => (
											<TableRow key={product.id}>
														<TableCell className="min-w-[200px]">
															<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
																<div className="relative group">
																	<Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-lg">
																		<AvatarImage src={product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg"} alt={product.name} />
																		<AvatarFallback className="rounded-lg">{product.name.charAt(0)}</AvatarFallback>
																	</Avatar>
																</div>
																	<div className={`space-y-1 ${isRTL ? "text-left" : ""}`}>
																		<div className="font-medium text-sm md:text-base">{product.name}</div>
																		<div className={`text-xs md:text-sm text-muted-foreground flex items-center gap-1 ${isRTL ? "text-left" : ""}`}>
																			<span className="lg:hidden">{product.category?.name || 'No category'}</span>
																			<span className="lg:hidden">•</span>
																			<span className="md:hidden" dir="ltr">
																				{product.sku}
																			</span>
																		</div>
																	</div>
																</div>
															</TableCell>
															<TableCell className={`hidden md:table-cell font-mono text-sm ${isRTL ? "text-right" : "text-left"}`} dir="ltr">
																{product.sku}
															</TableCell>
															<TableCell className={`font-medium text-sm md:text-base ${isRTL ? "text-right" : "text-left"}`} dir="ltr">
																${product.price}
															</TableCell>
															<TableCell className={isRTL ? "text-right" : ""}>
																<span className={`text-sm md:text-base ${(product.quantity || product.stock) < 20 ? "text-orange-600" : ""}`}>
																	{getStockDisplay(product)}
																</span>
															</TableCell>
															<TableCell className={isRTL ? "text-right" : ""}>
																{product.isActive ? (
																	<Badge variant="success">
																		{t("common.active")}
																	</Badge>
																) : (
																	<Badge variant="secondary">
																		{t("common.inactive")}
																	</Badge>
																)}
															</TableCell>
															<TableCell className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
																{product.category?.name || 'No category'}
															</TableCell>
															<TableCell className={isRTL ? "text-right" : ""}>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align={isRTL ? "start" : "end"}>
													<DropdownMenuItem className={isRTL ? "justify-end text-right" : "hover:bg-accent/50"}>
														<Eye className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("common.view")}
													</DropdownMenuItem>
													<DropdownMenuItem
														className={`hover:bg-accent/50 ${isRTL ? "justify-end text-right" : ""}`}
														onClick={() => handleEditProduct(product)}
													>
														<Edit className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("common.edit")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteProduct(product.id)}
														className={`text-destructive hover:bg-destructive/20 focus:text-destructive ${
															isRTL ? "justify-end text-right" : ""
														}`}
													>
														<Trash2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("common.delete")}
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
			)}

			{/* Products Table - Mobile */}
			{products.length === 0 && !loading ? (
				<Card className="md:hidden">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<div className={`text-center ${isRTL ? "" : ""}`}>
							<h3 className="text-lg font-semibold text-foreground mb-2">
								{t("products.noProducts")}
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{t("products.noProductsDescription")}
							</p>
							<Button 
								onClick={handleAddProduct}
								className={`flex items-center gap-2 text-white mx-auto ${isRTL ? "flex-row-reverse" : ""}`}
							>
								<Plus className="h-4 w-4" />
								{t("products.addProduct")}
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
			<div className="md:hidden space-y-4">
				{products.map((product: Product) => (
					<Card key={product.id} className="p-4">
						<div className="space-y-3">
							<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
								<div className="relative group">
									<Avatar className="h-12 w-12 rounded-lg">
										<AvatarImage src={product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg"} alt={product.name} />
										<AvatarFallback className="rounded-lg">{product.name.charAt(0)}</AvatarFallback>
									</Avatar>
									{product.images && (() => {
										try {
											const images = JSON.parse(product.images)
											return images.length > 1 ? (
												<div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col gap-1 z-50 bg-white p-2 rounded-lg shadow-lg border">
													{images.slice(0, 5).map((img: string, idx: number) => (
														<img
															key={idx}
															src={img}
															alt={`${product.name} ${idx + 1}`}
															className="w-12 h-12 rounded object-cover cursor-pointer hover:ring-2 hover:ring-primary"
														/>
													))}
													{images.length > 5 && (
														<span className="text-xs text-muted-foreground text-center">+{images.length - 5} more</span>
													)}
												</div>
											) : null
										} catch (e) {
											return null
										}
									})()}
								</div>
								<div className={`flex-1 ${isRTL ? "text-left" : ""}`}>
									<div className="font-medium text-sm">{product.name}</div>
									<div className="font-bold text-lg" dir="ltr">
										${product.price}
									</div>
								</div>
							</div>
							<div className={`flex items-center justify-between ${isRTL ? "text-right" : ""}`}>
								<div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
									<div className="text-sm">
										<span className="text-muted-foreground">{t("products.stock")}: </span>
										<span className={(product.quantity || product.stock) < 20 ? "text-orange-600" : ""}>{getStockDisplay(product)}</span>
									</div>
									{product.isActive ? (
										<Badge variant="success">
											{t("common.active")}
										</Badge>
									) : (
										<Badge variant="secondary">
											{t("common.inactive")}
										</Badge>
									)}
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									  <DropdownMenuContent align={isRTL ? "start" : "end"}>
										<DropdownMenuItem className={isRTL ? "justify-end text-right" : ""}>
											<Eye className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
											{t("common.view")}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleEditProduct(product)}
											className={`hover:bg-emerald-500/20 ${isRTL ? "justify-end text-right" : ""}`}
										>
											<Edit className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
											{t("common.edit")}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleDeleteProduct(product.id)}
											className={`text-destructive ${isRTL ? "justify-end text-right" : ""}`}
										>
											<Trash2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
											{t("common.delete")}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</Card>
				))}
			</div>
			)}

			<ProductDialog
				open={isDialogOpen}
				onOpenChange={handleDialogClose}
				product={editingProduct as any}
				productType={selectedProductType}
				onSave={handleSaveProduct}
			/>
		</div>
	)
}
