"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User, Menu, ShoppingCart, Package, Star, UserPlus, AlertTriangle } from "lucide-react"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "order",
    icon: ShoppingCart,
    title: "New order received",
    message: "Order #1234 from John Doe",
    timestamp: "2h ago",
    unread: true,
  },
  {
    id: "2",
    type: "stock",
    icon: AlertTriangle,
    title: "Low stock alert",
    message: "Gaming Mouse has only 12 items left",
    timestamp: "4h ago",
    unread: true,
  },
  {
    id: "3",
    type: "customer",
    icon: UserPlus,
    title: "New customer registered",
    message: "Sarah Wilson joined your store",
    timestamp: "6h ago",
    unread: true,
  },
  {
    id: "4",
    type: "review",
    icon: Star,
    title: "New review received",
    message: "5-star review for Wireless Headphones",
    timestamp: "1d ago",
    unread: false,
  },
  {
    id: "5",
    type: "product",
    icon: Package,
    title: "Product updated",
    message: "Smart Watch price has been updated",
    timestamp: "2d ago",
    unread: false,
  },
]

function getNotificationColor(type: string) {
  switch (type) {
    case "order":
      return "text-green-600"
    case "stock":
      return "text-orange-600"
    case "customer":
      return "text-blue-600"
    case "review":
      return "text-yellow-600"
    case "product":
      return "text-purple-600"
    default:
      return "text-muted-foreground"
  }
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const unreadCount = mockNotifications.filter((n) => n.unread).length

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Hello, Ibrahim 👋</h2>
            <p className="text-sm text-muted-foreground">Welcome back to your dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[0.75rem] px-1 rounded-full text-xs flex items-center justify-center text-gray-200 bg-rose-700">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs h-auto p-1 hover:bg-emerald-500/40">
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto ">
              {mockNotifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer hover:bg-emerald-500/20">
                    <div className={`mt-0.5 ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {notification.unread && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center">
              <Button variant="ghost" size="sm" className="w-full hover:bg-emerald-500/40">
                View All Notifications
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 md:gap-3 px-2 md:px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Ibrahim" />
                <AvatarFallback>IB</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">Ibrahim</p>
                <p className="text-xs text-muted-foreground">ibrahim@store.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-emerald-500/20">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-emerald-500/20">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-400 hover:bg-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
