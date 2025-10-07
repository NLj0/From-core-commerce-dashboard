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
import { useLanguage } from "@/providers/language-provider"

type TranslateFn = (key: string) => string

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

function getStatusBadge(status: string, t: TranslateFn) {
	const key = `customers.statusOptions.${status}`
	const label = t(key)
	const text = label !== key ? label : status

	switch (status) {
		case "vip":
			return <Badge variant="violet">{text}</Badge>
		case "active":
			return <Badge variant="success">{text}</Badge>
		case "new":
			return <Badge variant="info">{text}</Badge>
		case "inactive":
			return <Badge variant="gray">{text}</Badge>
		default:
			return <Badge variant="outline">{text}</Badge>
	}
}

export default function CustomersPage() {
	const { t, dir } = useLanguage()
	const isRTL = dir === "rtl"
	const [customers, setCustomers] = useState(mockCustomers)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [selectedCustomer, setSelectedCustomer] = useState<(typeof mockCustomers)[0] | null>(null)
	const [isDetailsOpen, setIsDetailsOpen] = useState(false)

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

	const totalCustomers = customers.length
	const activeCustomers = customers.filter((c) => c.status === "active" || c.status === "vip").length
	const newCustomers = customers.filter((c) => c.status === "new").length
	const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)

	const showingLabel = t("customers.showingCount")
		.replace("{current}", filteredCustomers.length.toString())
		.replace("{total}", customers.length.toString())

	return (
		<div className="space-y-6" dir={dir}>
			{/* Header */}
			<div className={isRTL ? "text-right" : "text-left"}>
				<h1 className="text-3xl font-bold text-foreground">{t("customers.title")}</h1>
				<p className="text-muted-foreground mt-2">{t("customers.subtitle")}</p>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("customers.totalCustomers")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCustomers}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("customers.activeCustomersLabel")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("customers.newCustomers")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{newCustomers}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("customers.totalRevenue")}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold" dir="ltr">
							${totalRevenue.toFixed(2)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle>{t("customers.customerManagement")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex flex-1 gap-4">
							<div className="relative flex-1 max-w-sm">
								<Search
									className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${
										isRTL ? "right-3" : "left-3"
									}`}
								/>
								<Input
									placeholder={t("customers.searchCustomers")}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className={isRTL ? "pr-10 text-right" : "pl-10"}
								/>
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger
									className={`w-[140px] ${isRTL ? "justify-between text-right" : "justify-between"}`}
								>
									<SelectValue placeholder={t("common.status")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all" className={isRTL ? "justify-end text-right" : ""}>
										{t("customers.allStatuses")}
									</SelectItem>
									<SelectItem value="vip" className={isRTL ? "justify-end text-right" : ""}>
										{t("customers.statusOptions.vip")}
									</SelectItem>
									<SelectItem value="active" className={isRTL ? "justify-end text-right" : ""}>
										{t("customers.statusOptions.active")}
									</SelectItem>
									<SelectItem value="new" className={isRTL ? "justify-end text-right" : ""}>
										{t("customers.statusOptions.new")}
									</SelectItem>
									<SelectItem value="inactive" className={isRTL ? "justify-end text-right" : ""}>
										{t("customers.statusOptions.inactive")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="text-sm text-muted-foreground text-center md:text-right">{showingLabel}</div>
					</div>
				</CardContent>
			</Card>

			{/* Customers Table */}
			<Card>
				<CardContent className="p-0">
					<div className="hidden md:block">
						<Table>
							<TableHeader>
								<TableRow className={isRTL ? "text-right" : ""}>
									<TableHead className={isRTL ? "text-right" : ""}>{t("customers.customerColumn")}</TableHead>
									<TableHead className={isRTL ? "text-right" : ""}>{t("customers.contactColumn")}</TableHead>
									<TableHead className={isRTL ? "text-right" : ""}>{t("customers.ordersColumn")}</TableHead>
									<TableHead className={isRTL ? "text-right" : ""}>{t("customers.totalSpentColumn")}</TableHead>
									<TableHead className={isRTL ? "text-right" : ""}>{t("customers.statusColumn")}</TableHead>
									<TableHead className={isRTL ? "text-right" : ""}>{t("customers.lastActivityColumn")}</TableHead>
									<TableHead className={`w-[70px] ${isRTL ? "text-right" : ""}`}>{t("common.actions")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredCustomers.map((customer) => (
									<TableRow key={customer.id} className={isRTL ? "text-right" : ""}>
										<TableCell className={isRTL ? "text-left" : ""}>
											<div className={`flex items-center gap-3 ${isRTL ? "justify-start text-left" : ""}`}>
												<Avatar className="h-10 w-10">
													<AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
													<AvatarFallback>
														{customer.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className={isRTL ? "text-left" : ""}>
													<div className="font-medium">{customer.name}</div>
													<div className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`} dir="ltr">
														{customer.id}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell className={isRTL ? "text-right" : ""}>
											<div className={`space-y-1 ${isRTL ? "text-right" : ""}`} dir="ltr">
												<div className="text-sm">{customer.email}</div>
												<div className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>{customer.phone}</div>
											</div>
										</TableCell>
										<TableCell className={isRTL ? "text-right" : ""}>
											<div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
												<ShoppingBag className={`h-4 w-4 text-muted-foreground ${isRTL ? "order-1" : ""}`} />
												<span className="font-medium">{customer.totalOrders}</span>
											</div>
										</TableCell>
										<TableCell className={isRTL ? "text-right" : ""}>
											<div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
												<DollarSign className={`h-4 w-4 text-muted-foreground ${isRTL ? "order-1" : ""}`} />
												<span className={`font-medium ${isRTL ? "text-right" : ""}`} dir="ltr">${customer.totalSpent.toFixed(2)}</span>
											</div>
										</TableCell>
										<TableCell className={isRTL ? "text-right" : ""}>{getStatusBadge(customer.status, t)}</TableCell>
										<TableCell className={`text-muted-foreground ${isRTL ? "text-right" : ""}`} dir="ltr">
											{customer.lastActivity}
										</TableCell>
										<TableCell className={isRTL ? "text-right" : ""}>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align={isRTL ? "start" : "end"}>
													<DropdownMenuItem
														onClick={() => handleViewCustomer(customer)}
														className={isRTL ? "justify-end text-right" : ""}
													>
														<Eye className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("customers.viewProfile")}
													</DropdownMenuItem>
													<DropdownMenuItem className={isRTL ? "justify-end text-right" : ""}>
														<Mail className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("customers.sendEmail")}
													</DropdownMenuItem>
													<DropdownMenuItem className={isRTL ? "justify-end text-right" : ""}>
														<Phone className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("customers.callCustomer")}
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
									<div className={`flex items-center justify-between ${isRTL ? "text-right" : ""}`}>
										<div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
											<Avatar className="h-10 w-10">
												<AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
												<AvatarFallback>
													{customer.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className={isRTL ? "text-right" : ""}>
												<div className="font-medium">{customer.name}</div>
												<div className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`} dir="ltr">
													{customer.id}
												</div>
											</div>
										</div>
										{getStatusBadge(customer.status, t)}
									</div>

									<div className="space-y-1" dir="ltr">
										<div className="text-sm">{customer.email}</div>
										<div className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>{customer.phone}</div>
									</div>

									<div className={`flex items-center justify-between pt-2 border-t ${isRTL ? "flex-row-reverse" : ""}`}>
										<div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
											<div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse justify-end text-right" : ""}`}>
												<ShoppingBag className={`h-4 w-4 text-muted-foreground ${isRTL ? "order-1" : ""}`} />
												<span className={`text-sm font-medium ${isRTL ? "text-right" : ""}`}>{customer.totalOrders}</span>
												<span className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>{t("customers.ordersLabel")}</span>
											</div>
										<div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
												<DollarSign className={`h-4 w-4 text-muted-foreground ${isRTL ? "order-1" : ""}`} />
												<span className={`text-sm font-medium ${isRTL ? "text-right" : ""}`} dir="ltr">${customer.totalSpent.toFixed(2)}</span>
											</div>
										</div>
										<div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
											<span className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}>
												{t("customers.lastActivityLabel").replace("{date}", customer.lastActivity)}
											</span>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="h-8 w-8">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align={isRTL ? "start" : "end"}>
													<DropdownMenuItem
														onClick={() => handleViewCustomer(customer)}
														className={isRTL ? "justify-end text-right" : ""}
													>
														<Eye className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("customers.viewProfile")}
													</DropdownMenuItem>
													<DropdownMenuItem className={isRTL ? "justify-end text-right" : ""}>
														<Mail className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("customers.sendEmail")}
													</DropdownMenuItem>
													<DropdownMenuItem className={isRTL ? "justify-end text-right" : ""}>
														<Phone className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
														{t("customers.callCustomer")}
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

			<CustomerDetailsDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} customer={selectedCustomer} />
		</div>
	)
}
