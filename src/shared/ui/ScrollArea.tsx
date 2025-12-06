import * as React from "react"
import { cn } from "@/shared/lib/cn"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
    return (
        <div className={cn("relative overflow-auto", className)} {...props}>
            {children}
        </div>
    )
}
