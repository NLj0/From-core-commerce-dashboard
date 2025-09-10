import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary text-primary [a&]:hover:bg-primary/10",
        secondary:
          "border-secondary text-secondary [a&]:hover:bg-secondary/10",
        destructive:
          "border-destructive text-destructive [a&]:hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
          
        "badge-emerald":
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 [a&]:hover:bg-emerald-500/20 dark:[a&]:hover:bg-emerald-500/30",
          
        "badge-amber": 
          "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 [a&]:hover:bg-amber-500/20 dark:[a&]:hover:bg-amber-500/30",

        "badge-rose": 
          "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 [a&]:hover:bg-rose-500/20 dark:[a&]:hover:bg-rose-500/30",

        "badge-gray": 
          "border-gray-400/30 bg-gray-500/10 text-gray-700 dark:text-gray-300 [a&]:hover:bg-gray-500/20 dark:[a&]:hover:bg-gray-500/30",

        "badge-blue": 
          "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 [a&]:hover:bg-blue-500/20 dark:[a&]:hover:bg-blue-500/30",

        "badge-violet": 
          "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 [a&]:hover:bg-violet-500/20 dark:[a&]:hover:bg-violet-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
