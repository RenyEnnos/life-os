import React from 'react'
import { cn } from '@/shared/lib/cn'

type Props = { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>

export default function SectionTitle({ children, className, ...props }: Props) {
  return <h2 {...props} className={cn("text-green-400 font-mono font-bold", className)}>{children}</h2>
}
