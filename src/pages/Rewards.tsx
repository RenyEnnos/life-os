import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'

interface Reward { id:string; title:string; points_required:number; achieved:boolean }

const Rewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState('')
  const [error, setError] = useState<string|null>(null)
  const load = async () => { try { setRewards(await apiFetch('/api/rewards')) } catch (e:any) { setError(e.message) } }
  useEffect(()=>{ load() }, [])
  const createReward = async (e: React.FormEvent) => { e.preventDefault(); try { await apiFetch('/api/rewards', { method:'POST', body: JSON.stringify({ title, points_required: Number(points) }) }); setTitle(''); setPoints(''); await load() } catch(e:any){ setError(e.message) } }
  const toggleAchieved = async (r: Reward) => { try { await apiFetch(`/api/rewards/${r.id}`, { method:'PUT', body: JSON.stringify({ achieved: !r.achieved }) }); await load() } catch(e:any){ setError(e.message) } }
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <SectionTitle className="text-3xl mb-4">RECOMPENSAS & SCORE</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <form onSubmit={createReward} className="border border-green-700 p-3 mb-4 bg-black/40 flex gap-3">
          <Input className="flex-1" placeholder="Nova recompensa" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <Input className="w-28" placeholder="Pontos" value={points} onChange={(e)=>setPoints(e.target.value)} />
          <Button>Criar</Button>
        </form>
        <ul className="space-y-2">
          {rewards.map(r => (
            <li key={r.id} className="border border-green-700 p-3 bg-black/40 flex justify-between">
              <div className="text-green-300 font-mono">{r.title} — {r.points_required} pts</div>
              <Button onClick={()=>toggleAchieved(r)} variant={r.achieved?'success':'default'}>{r.achieved?'Concluída':'Disponível'}</Button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Rewards
