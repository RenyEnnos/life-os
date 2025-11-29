import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Plus, Calendar, Tag, CheckCircle, Circle, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface Task {
  id: string
  title: string
  description: string
  due_date: string
  completed: boolean
  tags: string[]
  projects?: {
    name: string
    color: string
  }
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    tags: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const data = await apiFetch('/api/tasks')
      if (data.success) {
        setTasks(data.data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tagsArray = newTask.tags.split(',').map(t => t.trim()).filter(t => t)

      const data = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          ...newTask,
          tags: tagsArray
        })
      })

      if (data.success) {
        fetchTasks() // Refresh to get project details if needed, or just append
        setShowNewTaskForm(false)
        setNewTask({
          title: '',
          description: '',
          due_date: new Date().toISOString().split('T')[0],
          tags: ''
        })
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const toggleTaskCompletion = async (id: string, currentStatus: boolean) => {
    try {
      const data = await apiFetch(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !currentStatus })
      })

      if (data.success) {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return
    try {
      const data = await apiFetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      })

      if (data.success) {
        setTasks(tasks.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400 font-mono">TAREFAS</h1>
          <button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="btn-brutalist px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            NOVA TAREFA
          </button>
        </div>

        {showNewTaskForm && (
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle>Nova Tarefa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Título</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Data</label>
                    <input
                      type="date"
                      value={newTask.due_date}
                      onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Tags (sep. por vírgula)</label>
                    <input
                      type="text"
                      value={newTask.tags}
                      onChange={e => setNewTask({ ...newTask, tags: e.target.value })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                      placeholder="trabalho, urgente"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskForm(false)}
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

        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 border rounded transition-all ${task.completed
                ? 'border-gray-800 bg-gray-900/20 opacity-60'
                : 'border-gray-700 hover:border-green-400 bg-black'
                }`}
            >
              <button
                onClick={() => toggleTaskCompletion(task.id, task.completed)}
                className={`text-green-400 hover:scale-110 transition-transform`}
              >
                {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>

              <div className="flex-1">
                <h3 className={`font-mono text-lg ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 font-mono">
                  {task.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {task.tags.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Tasks