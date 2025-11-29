import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import type { JournalEntry } from '../../shared/types'
import { Input, TextArea } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState<string>('')
  const [error, setError] = useState<string|null>(null)
  const load = async () => {
    try { setEntries(await apiFetch('/api/journal')) } catch (e:any) { setError(e.message) }
  }
  useEffect(() => { load() }, [])
  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await apiFetch('/api/journal', { method: 'POST', body: JSON.stringify({ entry_date: date, content }) }); setContent(''); await load() } catch (e:any) { setError(e.message) }
  }
  const generateSummary = async () => {
    try { const r = await apiFetch('/api/ai/daily-summary', { method: 'POST', body: JSON.stringify({ date }) }); setSummary(r.summary) } catch (e:any) { setError(e.message) }
  }
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <SectionTitle className="text-3xl mb-4">DIÁRIO</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <form onSubmit={createEntry} className="border border-green-700 p-3 mb-4 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <Button type="button" onClick={generateSummary}>Resumo por IA</Button>
            <Button>Salvar entrada</Button>
          </div>
          <TextArea className="w-full" rows={6} placeholder="Escreva seu diário..." value={content} onChange={(e)=>setContent(e.target.value)} />
        </form>
        {summary && <div className="border border-green-700 p-3 text-green-300 font-mono mb-4">{summary}</div>}
        <ul className="space-y-2">
          {entries.map(en => (
            <li key={en.id} className="border border-green-700 p-3 bg-black/40">
              <div className="text-green-300 font-mono">{en.entry_date} — {en.title || 'Entrada'}</div>
              {en.content && <div className="text-gray-300 mt-1 whitespace-pre-wrap">{en.content}</div>}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Journal
