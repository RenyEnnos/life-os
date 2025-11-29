import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'danger'|'success' }

export default function Button({ variant='default', className='', ...props }: Props) {
  const base = 'border font-mono px-3 py-2 transition-colors '
  const variants: Record<string,string> = {
    default: 'border-green-600 text-green-400 hover:bg-green-900/30',
    danger: 'border-red-700 text-red-400 hover:bg-red-900/30',
    success: 'border-green-700 text-green-500 hover:bg-green-900/30'
  }
  return <button {...props} className={`${base}${variants[variant]} ${className}`.trim()} />
}
