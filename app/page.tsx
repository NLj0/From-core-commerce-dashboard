import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircleDollarSign, ShoppingCart, Target, TrendingDown, TrendingUp, Users, Eye } from "lucide-react"
import { AnalyticsChart } from "@/components/analytics-chart"

// Mock data for demonstration
const stats = [
  {
    title: "Page Views",
    value: "18,450",
    change: "+9%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Total Sales",
    value: "$712K",
    change: "+14%",
    trend: "up",
    icon: CircleDollarSign,
  },
  {
    title: "New Orders",
    value: "441",
    change: "+7%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.4%",
    change: "+0.4%",
    trend: "up",
    icon: Target,
  },
]

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    product: "Wireless Headphones",
    amount: "$299.99",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    product: "Smart Watch",
    amount: "$199.99",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    product: "Laptop Stand",
    amount: "$79.99",
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "#ORD-004",
    customer: "Emma Davis",
    email: "emma@example.com",
    product: "Bluetooth Speaker",
    amount: "$149.99",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "#ORD-005",
    customer: "Alex Brown",
    email: "alex@example.com",
    product: "Phone Case",
    amount: "$29.99",
    status: "processing",
    date: "2024-01-13",
  },
]

const topProducts = [
  {
    name: "Wireless Headphones",
    sales: 234,
    revenue: "$70,166",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Smart Watch",
    sales: 189,
    revenue: "$37,800",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Bluetooth Speaker",
    sales: 156,
    revenue: "$23,400",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Laptop Stand",
    sales: 98,
    revenue: "$7,840",
    image: "/placeholder.svg?height=40&width=40",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="badge-emerald">
          Completed
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="badge-amber">
          Processing
        </Badge>
      )
    case "shipped":
      return (
        <Badge variant="badge-blue">
          Shipped
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your store performance and manage your business efficiently.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
                    <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-sm font-medium">{product.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${order.customer}`} />
                          <AvatarFallback>
                            {order.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="font-medium">{order.amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {recentOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="space-y-2">
                  {/* Line 1: Order ID, Customer Name, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <span className="text-sm">{order.customer}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  {/* Line 2: Date, Total Price */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{order.date}</span>
                    <span className="font-medium text-foreground">{order.amount}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
