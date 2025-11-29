import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export function Input(props: Props) {
  const cls = 'bg-transparent border border-green-700 p-2 text-green-300 placeholder-green-700 focus:outline-none'
  return <input {...props} className={`${cls} ${props.className||''}`.trim()} />
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea(props: TextAreaProps) {
  const cls = 'bg-transparent border border-green-700 p-2 text-green-300 placeholder-green-700 focus:outline-none'
  return <textarea {...props} className={`${cls} ${props.className||''}`.trim()} />
}
