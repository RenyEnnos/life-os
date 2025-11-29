import React, { useState } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Plus, Calendar, Tag, CheckCircle, Circle, Trash2 } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'

const Tasks: React.FC = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks()
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    tags: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const tagsArray = newTask.tags.split(',').map(t => t.trim()).filter(t => t)

    createTask.mutate({
      ...newTask,
      tags: tagsArray,
      completed: false
    }, {
      onSuccess: () => {
        setShowNewTaskForm(false)
        setNewTask({
          title: '',
          description: '',
          due_date: new Date().toISOString().split('T')[0],
          tags: '',
          priority: 'medium'
        })
      }
    })
  }

  if (isLoading) return <Layout><div className="text-primary font-mono">Carregando tarefas...</div></Layout>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary font-mono">TAREFAS</h1>
          <Button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            NOVA TAREFA
          </Button>
        </div>

        {showNewTaskForm && (
          <Card className="border-primary/50">
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
                    className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
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
                      className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Tags (sep. por vírgula)</label>
                    <input
                      type="text"
                      value={newTask.tags}
                      onChange={e => setNewTask({ ...newTask, tags: e.target.value })}
                      className="w-full bg-black border border-secondary focus:border-primary text-white p-2 rounded font-mono outline-none"
                      placeholder="trabalho, urgente"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowNewTaskForm(false)}
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

        <div className="space-y-2">
          {tasks?.map(task => (
            <div
              key={task.id}
              className={`group flex items-center gap-4 p-4 border rounded transition-all ${task.completed
                ? 'border-gray-800 bg-gray-900/20 opacity-60'
                : 'border-gray-700 hover:border-primary bg-black'
                }`}
            >
              <button
                onClick={() => updateTask.mutate({ id: task.id, completed: !task.completed })}
                className={`text-primary hover:scale-110 transition-transform`}
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
                onClick={() => {
                  if (confirm('Tem certeza?')) deleteTask.mutate(task.id)
                }}
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