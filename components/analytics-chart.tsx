"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { name: "Jan", pageViews: 12800, sales: 4200, orders: 240, newCustomers: 96 },
  { name: "Feb", pageViews: 10950, sales: 3600, orders: 210, newCustomers: 82 },
  { name: "Mar", pageViews: 15600, sales: 5400, orders: 318, newCustomers: 123 },
  { name: "Apr", pageViews: 14820, sales: 5080, orders: 295, newCustomers: 110 },
  { name: "May", pageViews: 17240, sales: 6290, orders: 382, newCustomers: 136 },
  { name: "Jun", pageViews: 16510, sales: 5880, orders: 348, newCustomers: 128 },
  { name: "Jul", pageViews: 18450, sales: 7120, orders: 441, newCustomers: 149 },
]

const numberFormatter = new Intl.NumberFormat("en-US")
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const formatTooltipValue = (value: number, name: string) => {
  switch (name) {
    case "Page Views":
      return [numberFormatter.format(value), name]
    case "Sales ($)":
      return [currencyFormatter.format(value), "Sales"]
    case "Orders":
    case "New Customers":
      return [numberFormatter.format(value), name]
    default:
      return [value, name]
  }
}

export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="newCustomersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
              <stop offset="55%" stopColor="#ec4899" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
              <stop offset="55%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f88628" stopOpacity={0.8} />
              <stop offset="55%" stopColor="#f88628" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="55%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 156, 156)" strokeOpacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: "500" }}
            dy={10}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fontWeight: "500" }}
            tickFormatter={(value: number) => compactNumberFormatter.format(value)}
            dx={-10}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: "500" }}
            tickFormatter={(value: number) => numberFormatter.format(value)}
            dx={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ 
              color: "hsl(var(--foreground))", 
              fontWeight: "600",
              marginBottom: "4px"
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value, name) => formatTooltipValue(value as number, name as string)}
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#pageViewsGradient)"
            name="Page Views"
            yAxisId="left"
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#f88628"
            strokeWidth={3}
            fill="url(#salesGradient)"
            name="Sales ($)"
            yAxisId="left"
          />
          <Area
            type="monotone"
            dataKey="newCustomers"
            stroke="#ec4899"
            strokeWidth={2}
            fill="url(#newCustomersGradient)"
            name="New Customers"
            yAxisId="right"
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#ordersGradient)"
            name="Orders"
            yAxisId="right"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
