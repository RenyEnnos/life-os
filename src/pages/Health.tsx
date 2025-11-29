import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Plus, Activity, Heart, Moon, Footprints, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface HealthMetric {
  id: string
  metric_type: string
  value: number
  unit: string
  recorded_date: string
}

const Health: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newMetric, setNewMetric] = useState({
    metric_type: 'steps',
    value: '',
    unit: 'steps',
    recorded_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const data = await apiFetch('/api/health')
      if (data.success) {
        setMetrics(data.data)
      }
    } catch (error) {
      console.error('Error fetching health metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await apiFetch('/api/health', {
        method: 'POST',
        body: JSON.stringify({
          ...newMetric,
          value: Number(newMetric.value)
        })
      })

      if (data.success) {
        setMetrics([data.data, ...metrics])
        setShowNewForm(false)
        setNewMetric({
          metric_type: 'steps',
          value: '',
          unit: 'steps',
          recorded_date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error creating metric:', error)
    }
  }

  const handleDeleteMetric = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return
    try {
      const data = await apiFetch(`/api/health/${id}`, {
        method: 'DELETE'
      })

      if (data.success) {
        setMetrics(metrics.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error('Error deleting metric:', error)
    }
  }

  const getIconForMetric = (type: string) => {
    switch (type) {
      case 'steps': return <Footprints size={20} />
      case 'sleep': return <Moon size={20} />
      case 'heart_rate': return <Heart size={20} />
      default: return <Activity size={20} />
    }
  }

  const getLabelForMetric = (type: string) => {
    switch (type) {
      case 'steps': return 'Passos'
      case 'sleep': return 'Sono'
      case 'heart_rate': return 'Batimentos'
      case 'weight': return 'Peso'
      default: return type
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400 font-mono">SAÚDE</h1>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="btn-brutalist px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            NOVO REGISTRO
          </button>
        </div>

        {showNewForm && (
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle>Novo Registro de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMetric} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Métrica</label>
                    <select
                      value={newMetric.metric_type}
                      onChange={e => {
                        const type = e.target.value
                        let unit = ''
                        if (type === 'steps') unit = 'steps'
                        if (type === 'sleep') unit = 'hours'
                        if (type === 'heart_rate') unit = 'bpm'
                        if (type === 'weight') unit = 'kg'
                        setNewMetric({ ...newMetric, metric_type: type, unit })
                      }}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    >
                      <option value="steps">Passos</option>
                      <option value="sleep">Sono</option>
                      <option value="heart_rate">Batimentos Cardíacos</option>
                      <option value="weight">Peso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Valor ({newMetric.unit})</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMetric.value}
                      onChange={e => setNewMetric({ ...newMetric, value: e.target.value })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Data</label>
                  <input
                    type="date"
                    value={newMetric.recorded_date}
                    onChange={e => setNewMetric({ ...newMetric, recorded_date: e.target.value })}
                    className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
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
          {metrics.map(metric => (
            <Card key={metric.id} className="hover:border-green-400 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-900/20 rounded-full text-green-400">
                      {getIconForMetric(metric.metric_type)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-mono uppercase">
                        {getLabelForMetric(metric.metric_type)}
                      </p>
                      <p className="text-xl font-bold text-white font-mono">
                        {metric.value} <span className="text-xs text-gray-500">{metric.unit}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMetric(metric.id)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500 font-mono text-right">
                  {new Date(metric.recorded_date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Health