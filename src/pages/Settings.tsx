import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import Button from '../components/ui/Button'
import Toggle from '../components/ui/Toggle'
import SectionTitle from '../components/ui/SectionTitle'

const Settings: React.FC = () => {
  const [prefs, setPrefs] = useState<any>({ lowIA:false, autoClassifyFinance:true })
  const [logs, setLogs] = useState<{ calls:number, avgMs:number, errors:number }>({ calls:0, avgMs:0, errors:0 })
  const [error, setError] = useState<string|null>(null)
  const load = async () => {
    try {
      const me = await apiFetch('/api/user/me')
      setPrefs(me.preferences || {})
      // simplistic logs aggregation via export json
      const json = await apiFetch('/api/export/json')
      const aiLogs = (json.ai_logs || [])
      const calls = aiLogs.length
      const avgMs = calls ? Math.round(aiLogs.reduce((a:any,b:any)=>a+(b.response_time_ms||0),0)/calls) : 0
      const errors = aiLogs.filter((l:any)=>l.success===false).length
      setLogs({ calls, avgMs, errors })
    } catch (e:any) { setError(e.message) }
  }
  useEffect(()=>{ load() }, [])
  const savePrefs = async () => {
    try { await apiFetch('/api/user/preferences', { method: 'PUT', body: JSON.stringify(prefs) }) } catch (e:any) { setError(e.message) }
  }
  const exportJson = () => { window.location.href = '/api/export/json' }
  const exportCsv = (type:string) => { window.location.href = `/api/export/csv?type=${type}` }
  const connectCalendar = async () => { const r = await apiFetch('/api/calendar/auth-url'); window.location.href = r.url }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <SectionTitle className="text-3xl mb-4">CONFIGURAÇÕES & DEV LOGS</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-green-700 p-4 bg-black/40">
            <SectionTitle className="mb-2">Preferências</SectionTitle>
            <div className="flex items-center gap-2 text-green-300 font-mono mb-2"><Toggle checked={!!prefs.lowIA} onChange={(v)=>setPrefs({ ...prefs, lowIA: v })} /> Modo Low-IA</div>
            <div className="flex items-center gap-2 text-green-300 font-mono mb-4"><Toggle checked={!!prefs.autoClassifyFinance} onChange={(v)=>setPrefs({ ...prefs, autoClassifyFinance: v })} /> Classificação automática financeira</div>
            <Button onClick={savePrefs}>Salvar preferências</Button>
            <div className="mt-4">
              <button onClick={connectCalendar} className="border border-green-600 text-green-400 font-mono px-3 py-2">Conectar Google Calendar</button>
            </div>
          </div>
          <div className="border border-green-700 p-4 bg-black/40">
            <SectionTitle className="mb-2">Exportação</SectionTitle>
            <div className="flex gap-3">
              <Button onClick={exportJson}>Exportar JSON</Button>
              <Button onClick={()=>exportCsv('transactions')}>CSV Finanças</Button>
              <Button onClick={()=>exportCsv('tasks')}>CSV Tarefas</Button>
              <Button onClick={()=>exportCsv('habits')}>CSV Hábitos</Button>
            </div>
          </div>
        </div>
        <div className="border border-green-700 p-4 bg-black/40 mt-6 font-mono">
          <SectionTitle className="mb-2">Dev Mode / Logs</SectionTitle>
          <div className="text-green-300">Chamadas IA: {logs.calls}</div>
          <div className="text-green-300">Tempo médio de resposta: {logs.avgMs} ms</div>
          <div className="text-green-300">Erros recentes: {logs.errors}</div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
