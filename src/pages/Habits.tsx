import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import type { Habit } from '../../shared/types'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'
import HeatmapWeekly from '../components/charts/HeatmapWeekly'

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string|null>(null)
  const load = async () => {
    try { setHabits(await apiFetch('/api/habits')) } catch (e: any) { setError(e.message) }
  }
  useEffect(() => { load() }, [])
  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await apiFetch('/api/habits', { method: 'POST', body: JSON.stringify({ title }) }); setTitle(''); await load() } catch (e:any) { setError(e.message) }
  }
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <SectionTitle className="text-3xl mb-4">HÁBITOS & ROTINAS</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <form onSubmit={createHabit} className="border border-green-700 p-3 mb-4 bg-black/40">
          <div className="flex gap-3">
            <Input className="flex-1" placeholder="Novo hábito" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <Button>Criar</Button>
          </div>
        </form>
        <ul className="space-y-2">
          {habits.map(h => (
            <li key={h.id} className="border border-green-700 p-3 bg-black/40">
              <div className="text-green-300 font-mono">{h.title}</div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <SectionTitle className="mb-2">Heatmap Semanal</SectionTitle>
          <HeatmapWeekly data={['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((d,i)=>({ label: d, value: Math.round(Math.random()*2) }))} />
        </div>
      </div>
    </Layout>
  )
}

export default Habits
