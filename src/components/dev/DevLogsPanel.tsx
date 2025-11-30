import React from 'react'

type Props = { calls: number; avgMs: number; errors: number }

export default function DevLogsPanel({ calls, avgMs, errors }: Props) {
  return (
    <div className="border border-green-700 p-4 bg-black/40 font-mono">
      <div className="text-green-400 mb-2">Dev Mode / Logs</div>
      <div className="text-green-300">Chamadas IA: {calls}</div>
      <div className="text-green-300">Tempo médio de resposta: {avgMs} ms</div>
      <div className="text-green-300">Erros recentes: {errors}</div>
    </div>
  )
}
