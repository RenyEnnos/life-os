import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'

interface Project { id:string; name:string; description?:string }

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string>('')
  const [swot, setSwot] = useState<any>({ strengths:[], weaknesses:[], opportunities:[], threats:[] })
  const [error, setError] = useState<string|null>(null)
  const load = async () => { try { setProjects(await apiFetch('/api/projects')) } catch (e:any) { setError(e.message) } }
  useEffect(()=>{ load() }, [])
  const createProject = async (e: React.FormEvent) => { e.preventDefault(); try { await apiFetch('/api/projects', { method:'POST', body: JSON.stringify({ name }) }); setName(''); await load() } catch(e:any){ setError(e.message) } }
  const loadSwot = async (id: string) => { setSelected(id); try { const data = await apiFetch(`/api/projects/${id}/swot`); setSwot({ list:data }) } catch(e:any){ setError(e.message) } }
  const aiSwot = async () => { if (!selected) return; try { const json = await apiFetch('/api/ai/swot-analysis', { method:'POST', body: JSON.stringify({ projectId: selected, context: {} }) }); setSwot(json) } catch(e:any){ setError(e.message) } }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <SectionTitle className="text-3xl mb-4">PROJETOS & FOFA</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <form onSubmit={createProject} className="border border-green-700 p-3 mb-4 bg-black/40 flex gap-3">
          <Input className="flex-1" placeholder="Novo projeto" value={name} onChange={(e)=>setName(e.target.value)} />
          <Button>Criar</Button>
        </form>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-green-400 font-mono mb-2">Lista</h2>
            <ul className="space-y-2">
              {projects.map(p => (
                <li key={p.id} className={`border border-green-700 p-3 bg-black/40 cursor-pointer ${selected===p.id?'ring-2 ring-green-500':''}`} onClick={()=>loadSwot(p.id)}>
                  <div className="text-green-300 font-mono">{p.name}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle className="mb-2">FOFA</SectionTitle>
            <Button onClick={aiSwot} className="mb-3">Assistir com IA</Button>
            {swot.strengths && (
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-green-700 p-3"><div className="text-green-400 font-mono">Forças</div><ul className="text-green-300 list-disc ml-5">{swot.strengths.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ul></div>
                <div className="border border-green-700 p-3"><div className="text-green-400 font-mono">Fraquezas</div><ul className="text-green-300 list-disc ml-5">{swot.weaknesses.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ul></div>
                <div className="border border-green-700 p-3"><div className="text-green-400 font-mono">Oportunidades</div><ul className="text-green-300 list-disc ml-5">{swot.opportunities.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ul></div>
                <div className="border border-green-700 p-3"><div className="text-green-400 font-mono">Ameaças</div><ul className="text-green-300 list-disc ml-5">{swot.threats.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ul></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Projects
