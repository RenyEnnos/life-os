import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Plus, Check, X, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface Habit {
  id: string
  title: string
  description: string
  type: 'binary' | 'numeric'
  goal: number
  schedule: any
  active: boolean
}

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewHabitForm, setShowNewHabitForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ title: '', description: '', type: 'binary', goal: 1 })

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const data = await apiFetch('/api/habits')
      if (data.success) {
        setHabits(data.data)
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await apiFetch('/api/habits', {
        method: 'POST',
        body: JSON.stringify(newHabit)
      })

      if (data.success) {
        setHabits([data.data, ...habits])
        setShowNewHabitForm(false)
        setNewHabit({ title: '', description: '', type: 'binary', goal: 1 })
      }
    } catch (error) {
      console.error('Error creating habit:', error)
    }
  }

  const handleDeleteHabit = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este hábito?')) return
    try {
      const data = await apiFetch(`/api/habits/${id}`, {
        method: 'DELETE'
      })

      if (data.success) {
        setHabits(habits.filter(h => h.id !== id))
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const logHabit = async (id: string, value: number) => {
    try {
      const data = await apiFetch(`/api/habits/${id}/log`, {
        method: 'POST',
        body: JSON.stringify({ value, date: new Date().toISOString().split('T')[0] })
      })

      if (data.success) {
        alert('Hábito registrado!')
      }
    } catch (error) {
      console.error('Error logging habit:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400 font-mono">HÁBITOS</h1>
          <button
            onClick={() => setShowNewHabitForm(!showNewHabitForm)}
            className="btn-brutalist px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            NOVO HÁBITO
          </button>
        </div>

        {showNewHabitForm && (
          <Card className="border-green-500/50">
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
                    className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newHabit.description}
                    onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewHabitForm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white font-mono"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="btn-brutalist px-4 py-2"
                  >
                    SALVAR
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => (
            <Card key={habit.id} className="hover:border-green-400 transition-colors">
              <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle className="text-xl">{habit.title}</CardTitle>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
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
                    onClick={() => logHabit(habit.id, 1)}
                    className="flex items-center gap-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 px-3 py-1 rounded transition-colors"
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