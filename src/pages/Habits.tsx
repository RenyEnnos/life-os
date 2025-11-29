import React, { useState } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Plus, Check, Trash2 } from 'lucide-react'
import { useHabits } from '../hooks/useHabits'

const Habits: React.FC = () => {
  const { habits, isLoading, createHabit, deleteHabit, logHabit } = useHabits()
  const [showNewHabitForm, setShowNewHabitForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ title: '', description: '', type: 'binary', goal: 1 })

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    createHabit.mutate({
      ...newHabit,
      type: newHabit.type as 'binary' | 'metric',
      active: true,
      schedule: { frequency: 'daily' }
    }, {
      onSuccess: () => {
        setShowNewHabitForm(false)
        setNewHabit({ title: '', description: '', type: 'binary', goal: 1 })
      }
    })
  }

  const handleLogHabit = (id: string, value: number) => {
    const today = new Date().toISOString().split('T')[0]
    logHabit.mutate({ id, value, date: today }, {
      onSuccess: () => alert('Hábito registrado!')
    })
  }

  if (isLoading) return <Layout><div className="text-primary font-mono">Carregando hábitos...</div></Layout>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary font-mono">HÁBITOS</h1>
          <Button
            onClick={() => setShowNewHabitForm(!showNewHabitForm)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            NOVO HÁBITO
          </Button>
        </div>

        {showNewHabitForm && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Criar Novo Hábito</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Título</label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={e => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newHabit.description}
                    onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowNewHabitForm(false)}
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
          {habits?.map(habit => (
            <Card key={habit.id} className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle className="text-xl">{habit.title}</CardTitle>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza?')) deleteHabit.mutate(habit.id)
                  }}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">{habit.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs font-mono text-green-800 bg-green-900/20 px-2 py-1 rounded">
                    {habit.type === 'binary' ? 'SIM/NÃO' : `META: ${habit.goal}`}
                  </div>
                  <button
                    onClick={() => handleLogHabit(habit.id, 1)}
                    className="flex items-center gap-2 bg-green-900/30 hover:bg-green-900/50 text-primary px-3 py-1 rounded transition-colors"
                  >
                    <Check size={16} />
                    MARCAR
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Habits