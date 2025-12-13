import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-primary/90 to-primary text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:brightness-110",
        primary:
          "bg-gradient-to-t from-primary/90 to-primary text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:brightness-110",
        destructive:
          "bg-gradient-to-t from-destructive/90 to-destructive text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:brightness-110",
        outline:
          "border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 hover:text-accent-foreground backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-white/5 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-black/40 backdrop-blur-md border border-white/5 text-zinc-100 shadow-xl hover:bg-white/5 transition-all duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        md: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
