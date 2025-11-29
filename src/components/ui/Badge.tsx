import React from 'react'

type Props = { children: React.ReactNode; tone?: 'success'|'warning'|'danger' } & React.HTMLAttributes<HTMLSpanElement>

export default function Badge({ children, tone='success', className='', ...props }: Props) {
  const base = 'inline-block px-2 py-1 text-xs font-mono '
  const variants: Record<string,string> = {
    success: 'text-green-400 border border-green-700',
    warning: 'text-yellow-400 border border-yellow-700',
    danger: 'text-red-400 border border-red-700'
  }
  return <span {...props} className={`${base}${variants[tone]} ${className}`.trim()}>{children}</span>
}
