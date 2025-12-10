import * as React from "react"
import { cn } from "@/shared/lib/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {/* Glow effect on focus (invisible by default) */}
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition duration-500 group-focus-within:opacity-100 -z-10 blur-md pointer-events-none" />

        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-white/5 bg-black/20 px-4 py-2 text-sm text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-zinc-600",
            "focus-visible:outline-none focus-visible:border-white/10 focus-visible:bg-black/40 focus-visible:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]",
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
      <div className="relative group w-full">
        {/* Glow effect on focus (invisible by default) */}
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition duration-500 group-focus-within:opacity-100 -z-10 blur-md pointer-events-none" />

        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-white/5 bg-black/20 px-4 py-3 text-sm text-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all",
            "placeholder:text-zinc-600",
            "focus-visible:outline-none focus-visible:border-white/10 focus-visible:bg-black/40 focus-visible:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]",
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
