import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import type { HealthMetric } from '../../shared/types'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'

const Health: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [metricType, setMetricType] = useState('steps')
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [error, setError] = useState<string|null>(null)
  const load = async () => { try { setMetrics(await apiFetch('/api/health')) } catch (e:any) { setError(e.message) } }
  useEffect(()=>{ load() }, [])
  const createMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await apiFetch('/api/health', { method: 'POST', body: JSON.stringify({ metric_type: metricType, value: Number(value), unit, recorded_date: date }) }); setValue(''); setUnit(''); await load() } catch (e:any) { setError(e.message) }
  }
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <SectionTitle className="text-3xl mb-4">SAÚDE</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <form onSubmit={createMetric} className="border border-green-700 p-3 mb-4 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select className="bg-transparent border border-green-700 p-2 text-green-300" value={metricType} onChange={(e)=>setMetricType(e.target.value)}>
              <option value="steps">Passos</option>
              <option value="sleep">Sono</option>
              <option value="heart_rate">Frequência</option>
              <option value="spo2">SpO₂</option>
              <option value="weight">Peso</option>
            </select>
            <Input placeholder="Valor" value={value} onChange={(e)=>setValue(e.target.value)} />
            <Input placeholder="Unidade" value={unit} onChange={(e)=>setUnit(e.target.value)} />
            <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <Button>Registrar</Button>
          </div>
        </form>
        <ul className="space-y-2">
          {metrics.map(m => (
            <li key={m.id} className="border border-green-700 p-3 bg-black/40">
              <div className="text-green-300 font-mono">{m.metric_type}: {m.value} {m.unit} — {m.recorded_date}</div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Health
