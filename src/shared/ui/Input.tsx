import * as React from "react"
import { cn } from "@/shared/lib/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 backdrop-blur-xl transition-all duration-300",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600",
            "focus-visible:outline-none focus-visible:border-white/15 focus-visible:bg-white/7 focus-visible:ring-1 focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 backdrop-blur-xl transition-all",
            "placeholder:text-zinc-600 focus-visible:outline-none focus-visible:border-white/15 focus-visible:bg-white/7 focus-visible:ring-1 focus-visible:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
TextArea.displayName = "TextArea"

export { Input, TextArea }
