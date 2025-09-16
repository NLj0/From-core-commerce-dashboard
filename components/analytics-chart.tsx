"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 5000, orders: 320 },
  { name: "Apr", sales: 4500, orders: 280 },
  { name: "May", sales: 6000, orders: 390 },
  { name: "Jun", sales: 5500, orders: 350 },
  { name: "Jul", sales: 7000, orders: 450 },
]

export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
              fontWeight: "500",
            }}
            dy={10}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
              fontWeight: "500",
            }}
            dx={-10}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
              fontWeight: "500",
            }}
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
              marginBottom: "4px",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="hsl(var(--chart-1))"
            strokeWidth={3}
            fill="url(#salesGradient)"
            name="Sales ($)"
            yAxisId="left"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="hsl(var(--chart-2))"
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
