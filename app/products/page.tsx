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
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string

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

export default function ProductsPage() {
	const { t, dir } = useLanguage()
	const isRTL = dir === "rtl"
	const [products, setProducts] = useState(mockProducts)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<(typeof mockProducts)[0] | null>(null)
	const [selectedProductType, setSelectedProductType] = useState<string | null>(null)

	const filteredProducts = products.filter((product) => {
		const matchesSearch =
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.sku.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = statusFilter === "all" || product.status === statusFilter
		const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

		return matchesSearch && matchesStatus && matchesCategory
	})

	const showingLabel = t("products.showingCount")
		.replace("{current}", filteredProducts.length.toString())
		.replace("{total}", products.length.toString())

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
			setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)))
		} else {
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
		<div className="space-y-4 md:space-y-6" dir={dir}>
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className={isRTL ? "text-right" : "text-left"}>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("products.title")}</h1>
					<p className="text-muted-foreground mt-1 md:mt-2">{t("products.subtitle")}</p>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className={`flex items-center gap-2 text-white ${isRTL ? "flex-row-reverse" : ""}`}>
							<Plus className="h-4 w-4" />
							{t("products.addProduct")}
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					  <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
						<DropdownMenuItem
							onClick={() => handleAddProduct("digital")}
							className={`hover:bg-emerald-500/20 ${isRTL ? "justify-end text-right" : ""}`}
						>
							<div className={`flex flex-col text-muted-foreground ${isRTL ? "items-end text-right" : "items-start"}`}>
								<span className="font-medium text-foreground">{t("products.menuDigitalTitle")}</span>
								<span className="text-xs">{t("products.menuDigitalDescription")}</span>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleAddProduct("digital-card")}
							className={`hover:bg-emerald-500/20 ${isRTL ? "justify-end text-right" : ""}`}
						>
							<div className={`flex flex-col text-muted-foreground ${isRTL ? "items-end text-right" : "items-start"}`}>
								<span className="font-medium text-foreground">{t("products.menuDigitalCardTitle")}</span>
								<span className="text-xs">{t("products.menuDigitalCardDescription")}</span>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleAddProduct("service")}
							className={`hover:bg-emerald-500/20 ${isRTL ? "justify-end text-right" : ""}`}
						>
							<div className={`flex flex-col text-muted-foreground ${isRTL ? "items-end text-right" : "items-start"}`}>
								<span className="font-medium text-foreground">{t("products.menuServiceTitle")}</span>
								<span className="text-xs">{t("products.menuServiceDescription")}</span>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleAddProduct("bundle")}
							className={`hover:bg-emerald-500/20 ${isRTL ? "justify-end text-right" : ""}`}
						>
							<div className={`flex flex-col text-muted-foreground ${isRTL ? "items-end text-right" : "items-start"}`}>
								<span className="font-medium text-foreground">{t("products.menuBundleTitle")}</span>
								<span className="text-xs">{t("products.menuBundleDescription")}</span>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
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
								{filteredProducts.map((product) => (
														<TableRow key={product.id}>
															<TableCell className="min-w-[200px]">
																<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
																	<Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-lg">
																		<AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
																		<AvatarFallback className="rounded-lg">{product.name.charAt(0)}</AvatarFallback>
																	</Avatar>
																	<div className={`space-y-1 ${isRTL ? "text-left" : ""}`}>
																		<div className="font-medium text-sm md:text-base">{product.name}</div>
																		<div className={`text-xs md:text-sm text-muted-foreground flex items-center gap-1 ${isRTL ? "text-left" : ""}`}>
																			<span className="lg:hidden">{getCategoryLabel(product.category, t)}</span>
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
																<span className={`text-sm md:text-base ${product.stock < 20 ? "text-orange-600" : ""}`}>
																	{product.stock}
																</span>
															</TableCell>
															<TableCell className={isRTL ? "text-right" : ""}>{getStatusBadge(product.status, t)}</TableCell>
															<TableCell className={`hidden lg:table-cell ${isRTL ? "text-right" : ""}`}>
																{getCategoryLabel(product.category, t)}
															</TableCell>
															<TableCell className={isRTL ? "text-right" : ""}>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align={isRTL ? "start" : "end"}>
													<DropdownMenuItem className={isRTL ? "justify-end text-right" : ""}>
														<Eye className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("common.view")}
													</DropdownMenuItem>
													<DropdownMenuItem
														className={`hover:bg-emerald-500/20 ${isRTL ? "justify-end text-right" : ""}`}
														onClick={() => handleEditProduct(product)}
													>
														<Edit className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("common.edit")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteProduct(product.id)}
														className={`text-destructive hover:bg-destructive/10 focus:text-destructive ${
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

			{/* Products Table - Mobile */}
			<div className="md:hidden space-y-4">
				{filteredProducts.map((product) => (
					<Card key={product.id} className="p-4">
						<div className="space-y-3">
							<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
								<Avatar className="h-12 w-12 rounded-lg">
									<AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
									<AvatarFallback className="rounded-lg">{product.name.charAt(0)}</AvatarFallback>
								</Avatar>
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
										<span className={product.stock < 20 ? "text-orange-600" : ""}>{product.stock}</span>
									</div>
									{getStatusBadge(product.status, t)}
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
