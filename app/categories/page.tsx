"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, MoreHorizontal, Edit, Trash2, Plus, FolderOpen, CheckCircle, XCircle, Package, AlertCircle, Loader2 } from "lucide-react"
import { CategoryDialog } from "@/components/category-dialog"
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string

interface Category {
	id: string
	name: string
	description: string
	image: string
	productsCount: number
	status: string
	createdDate: string
	seo: {
		metaTitle: string
		metaDescription: string
		keywords: string
	}
}

function getStatusBadge(status: string, t: TranslateFn, isRTL: boolean) {
	const iconMargin = isRTL ? "ml-1" : "mr-1"
	switch (status) {
		case "active":
			return (
				<Badge variant="success">
					<CheckCircle className={`${iconMargin} h-3 w-3`} />
					{t("common.active")}
				</Badge>
			)
		case "inactive":
			return (
				<Badge variant="gray">
					<XCircle className={`${iconMargin} h-3 w-3`} />
					{t("common.inactive")}
				</Badge>
			)
		default: {
			const fallbackKey = `categories.${status}`
			const label = t(fallbackKey)
			return <Badge variant="outline">{label !== fallbackKey ? label : status}</Badge>
		}
	}
}

export default function CategoriesPage() {
	const { t, dir } = useLanguage()
	const isRTL = dir === "rtl"
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isDeleting, setIsDeleting] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [sortBy, setSortBy] = useState("name")
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	// Fetch categories on component mount
	useEffect(() => {
		fetchCategories()
	}, [])

	const fetchCategories = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)
			const response = await fetch('/api/categories')
			if (!response.ok) {
				throw new Error('Failed to fetch categories')
			}
			const data = await response.json()
			setCategories(data)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
			setError(errorMessage)
			console.error('Error fetching categories:', err)
			// Auto-dismiss error after 5 seconds
			setTimeout(() => setError(null), 5000)
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Memoized filtered categories
	const filteredCategories = useMemo(() => {
		return categories
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
	}, [categories, searchTerm, statusFilter, sortBy])

	const showingLabel = t("categories.showingCount")
		.replace("{current}", filteredCategories.length.toString())
		.replace("{total}", categories.length.toString())

	const handleAddCategory = useCallback(() => {
		setSelectedCategory(null)
		setIsDialogOpen(true)
	}, [])

	const handleEditCategory = useCallback((category: Category) => {
		setSelectedCategory(category)
		setIsDialogOpen(true)
	}, [])

	const handleDeleteCategory = useCallback(async (categoryId: string) => {
		if (!window.confirm(t("categories.deleteConfirm"))) {
			return
		}

		try {
			setIsDeleting(categoryId)
			const response = await fetch(`/api/categories/${categoryId}`, {
				method: 'DELETE'
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to delete category')
			}

			setCategories(categories.filter((cat) => cat.id !== categoryId))
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to delete category'
			setError(errorMessage)
			setTimeout(() => setError(null), 5000)
			console.error('Error deleting category:', err)
		} finally {
			setIsDeleting(null)
		}
	}, [categories, t])

	const handleSaveCategory = useCallback((categoryData: Category) => {
		// Update categories list with new/updated category
		const existingIndex = categories.findIndex(cat => cat.id === categoryData.id)
		if (existingIndex >= 0) {
			// Update existing category
			const updatedCategories = [...categories]
			updatedCategories[existingIndex] = categoryData
			setCategories(updatedCategories)
		} else {
			// Add new category
			setCategories([...categories, categoryData])
		}
		setIsDialogOpen(false)
	}, [categories])

	const totalCategories = categories.length
	const activeCategories = categories.filter((c) => c.status === "active").length
	const totalProducts = categories.reduce((sum, cat) => sum + cat.productsCount, 0)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen" dir={dir}>
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
					<p className="text-muted-foreground">{t("common.loading")}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6" dir={dir}>
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className={isRTL ? "text-right" : "text-left"}>
					<h1 className="text-3xl font-bold text-foreground">{t("categories.title")}</h1>
					<p className="text-muted-foreground mt-2">{t("categories.subtitle")}</p>
				</div>
				<Button
					className={`flex items-center gap-2 text-white ${isRTL ? "flex-row-reverse" : ""}`}
					onClick={handleAddCategory}
				>
					<Plus className="h-4 w-4" />
					{t("categories.addCategory")}
				</Button>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("categories.totalCategories")}</CardTitle>
						<FolderOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCategories}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("categories.activeCategoriesLabel")}</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{activeCategories}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("categories.totalProductsLabel")}</CardTitle>
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
					<CardTitle>{t("categories.categoryManagement")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex flex-1 gap-4">
							<div className="relative flex-1 max-w-sm">
								<Search
									className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${
										isRTL ? "right-3" : "left-3"
									}`}
									aria-hidden="true"
								/>
								<Input
									placeholder={t("categories.searchCategories")}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className={isRTL ? "pr-10 text-right" : "pl-10"}
									aria-label={t("categories.searchCategories")}
								/>
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger
									className={`w-[140px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
									aria-label={t("common.status")}
								>
									<SelectValue placeholder={t("common.status")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
										{t("categories.allStatuses")}
									</SelectItem>
									<SelectItem value="active" className={isRTL ? "justify-end text-right" : ""}>
										{t("common.active")}
									</SelectItem>
									<SelectItem value="inactive" className={isRTL ? "justify-end text-right" : ""}>
										{t("common.inactive")}
									</SelectItem>
								</SelectContent>
							</Select>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger
									className={`w-[140px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
									aria-label={t("categories.sortBy")}
								>
									<SelectValue placeholder={t("categories.sortBy")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name" className={isRTL ? "justify-end text-right" : ""}>
										{t("categories.sortOptions.name")}
									</SelectItem>
									<SelectItem value="status" className={isRTL ? "justify-end text-right" : ""}>
										{t("categories.sortOptions.status")}
									</SelectItem>
									<SelectItem value="products" className={isRTL ? "justify-end text-right" : ""}>
										{t("categories.sortOptions.products")}
									</SelectItem>
									<SelectItem value="date" className={isRTL ? "justify-end text-right" : ""}>
										{t("categories.sortOptions.date")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="text-sm text-muted-foreground text-center md:text-right">{showingLabel}</div>
					</div>
				</CardContent>
			</Card>

			{/* Categories Table */}
			<Card>
				<CardContent className="p-0">
					{filteredCategories.length === 0 ? (
						// Empty State
						<div className="p-8 md:p-12">
							<div className="text-center">
								<FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
								<h3 className="text-lg font-semibold mb-2">{t("categories.noCategories")}</h3>
								<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
									{searchTerm || statusFilter !== "all" 
										? t("categories.noFilterResults")
										: t("categories.noData")}
								</p>
								{!searchTerm && statusFilter === "all" && (
									<Button onClick={handleAddCategory} className="flex items-center gap-2 mx-auto">
										<Plus className="h-4 w-4" />
										{t("categories.addCategory")}
									</Button>
								)}
							</div>
						</div>
					) : (
						<>
							<div className="hidden md:block">
								<Table>
									<TableHeader>
										<TableRow className={isRTL ? "text-right" : ""}>
											<TableHead className={isRTL ? "text-right" : ""}>{t("categories.categoryColumn")}</TableHead>
											<TableHead className={isRTL ? "text-right" : ""}>{t("categories.descriptionColumn")}</TableHead>
											<TableHead className={isRTL ? "text-right" : ""}>{t("categories.productsColumn")}</TableHead>
											<TableHead className={isRTL ? "text-right" : ""}>{t("categories.statusColumn")}</TableHead>
											<TableHead className={isRTL ? "text-right" : ""}>{t("categories.createdColumn")}</TableHead>
											<TableHead className={`w-[70px] ${isRTL ? "text-right" : ""}`}>{t("common.actions")}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredCategories.map((category) => (
											<TableRow key={category.id} className={isRTL ? "text-right" : ""}>
												<TableCell className={isRTL ? "text-right" : ""}>
													<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
														<img
															src={category.image || "/placeholder.svg"}
															alt={category.name}
															className="h-10 w-10 rounded-lg object-cover"
														/>
														<div className={isRTL ? "text-left" : ""}>
															<div className="font-medium">{category.name}</div>
															<div className={`text-xs text-muted-foreground font-mono ${isRTL ? "text-right" : ""}`} dir="ltr">
																{category.id}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell className={isRTL ? "text-right" : ""}>
													<div className={`max-w-xs truncate text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
														{category.description}
													</div>
												</TableCell>
												<TableCell className={isRTL ? "text-right" : ""}>
													<div className="font-medium">{category.productsCount}</div>
												</TableCell>
												<TableCell className={isRTL ? "text-right" : ""}>{getStatusBadge(category.status, t, isRTL)}</TableCell>
												<TableCell className={`text-muted-foreground ${isRTL ? "text-right" : ""}`} dir="ltr">
													{category.createdDate}
												</TableCell>
												<TableCell className={isRTL ? "text-right" : ""}>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon" disabled={isDeleting === category.id}>
																{isDeleting === category.id ? (
																	<Loader2 className="h-4 w-4 animate-spin" />
																) : (
																	<MoreHorizontal className="h-4 w-4" />
																)}
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align={isRTL ? "start" : "end"}>
															<DropdownMenuItem
																onClick={() => handleEditCategory(category)}
																className={`hover:bg-accent/30 transition-colors ${isRTL ? "justify-end text-right" : ""}`}
															>
																<Edit className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
																{t("categories.editCategory")}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleDeleteCategory(category.id)}
																className={`text-destructive hover:bg-destructive/20 transition-colors ${isRTL ? "justify-end text-right" : ""}`}
																disabled={isDeleting === category.id}
															>
																<Trash2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
																{t("categories.deleteCategory")}
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
							<div className="md:hidden space-y-4 p-4">
								{filteredCategories.map((category) => (
									<Card key={category.id} className="p-4">
										<div className="space-y-3">
											<div className={`flex items-center justify-between ${isRTL ? "text-left" : ""}`}>
												<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
													<img
														src={category.image || "/placeholder.svg"}
														alt={category.name}
														className="h-12 w-12 rounded-lg object-cover"
													/>
													<div>
														<div className="font-medium text-base">{category.name}</div>
														<div className={`text-xs text-muted-foreground font-mono ${isRTL ? "text-right" : ""}`} dir="ltr">
															{category.id}
														</div>
													</div>
												</div>
												{getStatusBadge(category.status, t, isRTL)}
											</div>

											<div className="text-sm text-muted-foreground">{category.description}</div>

											<div className={`flex items-center justify-between pt-2 border-t ${isRTL ? "flex-row-reverse" : ""}`}>
												<div className={`flex items-center gap-4 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
													<div className="flex items-center gap-1">
														<Package className="h-4 w-4 text-muted-foreground" />
														<span className="font-medium">{category.productsCount}</span>
														<span className="text-muted-foreground">{t("categories.productsLabel")}</span>
													</div>
													<div className="text-muted-foreground">
														{t("categories.createdOn").replace("{date}", category.createdDate)}
													</div>
												</div>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === category.id}>
															{isDeleting === category.id ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<MoreHorizontal className="h-4 w-4" />
															)}
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align={isRTL ? "start" : "end"}>
														<DropdownMenuItem
															onClick={() => handleEditCategory(category)}
															className={`hover:bg-accent/20 transition-colors ${isRTL ? "justify-end text-right" : ""}`}
														>
															<Edit className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
															{t("categories.editCategory")}
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteCategory(category.id)}
															className={`text-destructive hover:bg-destructive/40 transition-colors ${isRTL ? "justify-end text-right" : ""}`}
															disabled={isDeleting === category.id}
														>
															<Trash2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
															{t("categories.deleteCategory")}
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</Card>
								))}
							</div>
						</>
					)}
				</CardContent>
			</Card>

		<CategoryDialog
			open={isDialogOpen}
			onOpenChange={setIsDialogOpen}
			category={selectedCategory}
			onSave={handleSaveCategory}
		/>
	</div>
)
}