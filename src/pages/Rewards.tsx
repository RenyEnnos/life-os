import React, { useState } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Trophy, Plus, Check, Trash2 } from 'lucide-react'
import { useRewards } from '../hooks/useRewards'
import { Reward } from '../../shared/types'

const Rewards: React.FC = () => {
  const { rewards, isLoading, createReward, updateReward, deleteReward } = useRewards()
  const [showNewForm, setShowNewForm] = useState(false)
  const [newReward, setNewReward] = useState({ title: '', points_required: '' })

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault()
    createReward.mutate({
      title: newReward.title,
      points_required: Number(newReward.points_required),
      achieved: false,
      criteria: {}
    }, {
      onSuccess: () => {
        setShowNewForm(false)
        setNewReward({ title: '', points_required: '' })
      }
    })
  }

  const toggleAchieved = (reward: Reward) => {
    updateReward.mutate({
      id: reward.id,
      achieved: !reward.achieved
    })
  }

  if (isLoading) return <Layout><div className="text-primary font-mono">Carregando recompensas...</div></Layout>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary font-mono">RECOMPENSAS</h1>
          <Button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            NOVA RECOMPENSA
          </Button>
        </div>

        {showNewForm && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Nova Recompensa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateReward} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Título</label>
                    <input
                      type="text"
                      value={newReward.title}
                      onChange={e => setNewReward({ ...newReward, title: e.target.value })}
                      className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Pontos Necessários</label>
                    <input
                      type="number"
                      value={newReward.points_required}
                      onChange={e => setNewReward({ ...newReward, points_required: e.target.value })}
                      className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowNewForm(false)}
                  >
                    CANCELAR
                  </Button>
                  <Button type="submit">
                    SALVAR
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards?.map(reward => (
            <Card key={reward.id} className={`transition-colors ${reward.achieved ? 'border-green-500 bg-green-900/10' : 'hover:border-primary'}`}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${reward.achieved ? 'bg-green-500 text-black' : 'bg-primary/20 text-primary'}`}>
                      <Trophy size={20} />
                    </div>
                    <div>
                      <h3 className={`font-mono font-bold ${reward.achieved ? 'text-green-400' : 'text-white'}`}>
                        {reward.title}
                      </h3>
                      <p className="text-sm text-gray-400 font-mono">
                        {reward.points_required} PTS
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAchieved(reward)}
                      className={`p-2 rounded-full transition-colors ${reward.achieved ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                      title={reward.achieved ? "Marcar como não concluída" : "Marcar como concluída"}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza?')) deleteReward.mutate(reward.id)
                      }}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Rewards
