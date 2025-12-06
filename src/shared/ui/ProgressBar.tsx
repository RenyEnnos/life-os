import React from 'react'

type Props = { value: number }

export default function ProgressBar({ value }: Props) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full bg-gray-700 h-2">
      <div className="bg-green-500 h-2" style={{ width: `${v}%` }}></div>
    </div>
  )
}
