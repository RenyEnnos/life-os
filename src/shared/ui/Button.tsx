import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-white/25 via-white/12 to-white/8 text-zinc-900 border border-white/50 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.18)] hover:from-white/35 hover:via-white/16 hover:to-white/12 hover:shadow-[0_16px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(255,255,255,0.14)]",
        primary:
          "bg-gradient-to-b from-white/18 via-white/12 to-white/8 text-zinc-50 border border-white/35 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.16)] hover:from-white/24 hover:via-white/16 hover:to-white/10 hover:shadow-[0_16px_52px_rgba(0,0,0,0.52),0_0_28px_rgba(255,255,255,0.14)]",
        destructive:
          "border border-red-200/30 bg-gradient-to-b from-red-500/25 via-red-500/18 to-red-500/10 text-red-50 shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:from-red-500/30 hover:via-red-500/22 hover:to-red-500/14 hover:shadow-[0_14px_45px_rgba(0,0,0,0.5),0_0_25px_rgba(248,113,113,0.2)]",
        outline:
          "border border-white/18 bg-white/5 text-zinc-100 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-white/10 hover:border-white/26",
        secondary:
          "bg-white/8 text-zinc-100 border border-white/18 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:bg-white/12",
        ghost: "text-zinc-100 hover:bg-white/5 hover:text-white",
        link: "text-zinc-200 underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/60",
        glass: "bg-white/10 border border-white/25 text-zinc-100 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:bg-white/14 hover:shadow-[0_16px_48px_rgba(0,0,0,0.52),0_0_22px_rgba(255,255,255,0.14)]"
      },
      size: {
        default: "h-10 px-4 py-2",
        md: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
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
