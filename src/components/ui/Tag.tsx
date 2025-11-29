import React from 'react'

type Props = { children: React.ReactNode; color?: 'green'|'gray'|'red' } & React.HTMLAttributes<HTMLSpanElement>

export default function Tag({ children, color='green', className='', ...props }: Props) {
  const base = 'inline-flex items-center px-2 py-1 text-xs font-mono border '
  const variants: Record<string,string> = {
    green: 'border-green-700 text-green-400',
    gray: 'border-gray-700 text-gray-400',
    red: 'border-red-700 text-red-400'
  }
  return <span {...props} className={`${base}${variants[color]} ${className}`.trim()}>{children}</span>
}
