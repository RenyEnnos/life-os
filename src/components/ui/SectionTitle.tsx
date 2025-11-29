import React from 'react'

type Props = { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>

export default function SectionTitle({ children, className='', ...props }: Props) {
  return <h2 {...props} className={`text-green-400 font-mono font-bold ${className}`.trim()}>{children}</h2>
}
