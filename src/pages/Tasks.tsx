import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'
import { Task } from '../../shared/types'

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [page, setPage] = useState(1)

  const load = async () => {
    try {
      setLoading(true)
      const data = await apiFetch(`/api/tasks?page=${page}&pageSize=20`)
      setTasks(data)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, due_date: dueDate || null, tags: [] })
      })
      setTitle('')
      setDueDate('')
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const toggleComplete = async (task: Task) => {
    try {
      await apiFetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed })
      })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const removeTask = async (task: Task) => {
    try {
      await apiFetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <SectionTitle className="text-3xl mb-4">TAREFAS & CALENDÁRIO</SectionTitle>
        {error && <div className="border border-red-600 text-red-400 p-3 mb-4 font-mono">{error}</div>}

        <form onSubmit={createTask} className="border border-green-700 p-4 mb-6 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Button type="submit">Nova tarefa</Button>
          </div>
        </form>
        {loading ? (
          <div className="text-gray-400">Carregando...</div>
        ) : (
          <ul className="space-y-2">
            {tasks.map(t => (
              <li key={t.id} className="flex items-center justify-between border border-green-700 p-3 bg-black/40">
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleComplete(t)}
                      className={`w-4 h-4 border ${t.completed ? 'bg-green-500 border-green-500' : 'border-green-600'} mr-2`}
                      aria-label="Completar"
                    />
                    <span className={`font-mono ${t.completed ? 'line-through text-green-700' : 'text-green-300'}`}>{t.title}</span>
                  </div>
                  {t.due_date && (
                    <div className="text-xs text-gray-400 mt-1 font-mono">{new Date(t.due_date).toLocaleString('pt-BR')}</div>
                  )}
                </div>
                <Button variant="danger" onClick={() => removeTask(t)}>Remover</Button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between mt-4">
          <Button onClick={()=> setPage(Math.max(1, page-1))}>Anterior</Button>
          <div className="text-green-300 font-mono">Página {page}</div>
          <Button onClick={()=> setPage(page+1)}>Próxima</Button>
        </div>
      </div>
    </Layout>
  )
}

export default Tasks
