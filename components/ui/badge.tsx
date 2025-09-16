import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-primary text-primary [a&]:hover:bg-primary/10",
        secondary: "border-secondary text-secondary [a&]:hover:bg-secondary/10",
        destructive:
          "border-destructive text-destructive [a&]:hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        "badge-emerald":
          "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-900",
        emerald:
          "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-900",
        success:
          "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-900",

        "badge-amber":
          "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 dark:hover:bg-amber-900",
        amber:
          "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 dark:hover:bg-amber-900",
        warning:
          "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 dark:hover:bg-amber-900",

        "badge-rose":
          "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 dark:hover:bg-rose-900",
        rose: "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 dark:hover:bg-rose-900",
        danger:
          "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 dark:hover:bg-rose-900",

        "badge-gray":
          "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-900",
        gray: "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-900",

        "badge-blue":
          "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900",
        blue: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900",
        info: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900",

        "badge-violet":
          "bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800 dark:hover:bg-violet-900",
        violet:
          "bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800 dark:hover:bg-violet-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
