import React from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LifeScoreCard from '../components/LifeScoreCard'
import HabitConsistencyChart from '../components/HabitConsistencyChart'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useDashboardData } from '../hooks/useDashboardData'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { lifeScore, agenda, health, finance, habitConsistency, isLoading } = useDashboardData()

  const quickActions = [
    { label: 'Nova Tarefa', action: () => navigate('/tasks') },
    { label: 'Novo Hábito', action: () => navigate('/habits') },
    { label: 'Saúde', action: () => navigate('/health') },
    { label: 'Transação', action: () => navigate('/finances') }
  ]

  if (isLoading) return <Layout><div className="text-primary font-mono">Carregando dashboard...</div></Layout>

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary font-mono">DASHBOARD</h1>
          <div className="text-sm text-gray-400 font-mono">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Top Row - Life Score and Habit Consistency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LifeScoreCard {...lifeScore} />
          <HabitConsistencyChart {...habitConsistency} />
        </div>

        {/* Middle Row - Today's Agenda and Health Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Agenda */}
          <Card>
            <CardHeader>
              <CardTitle>AGENDA DE HOJE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agenda.length > 0 ? (
                  agenda.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-700 rounded">
                      <div className="text-sm font-mono text-gray-400 w-12">
                        09:00
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-xs text-green-400">#{item.tags?.[0] || 'geral'}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm font-mono">Nenhuma tarefa para hoje.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Health Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle>SNAPSHOT DE SAÚDE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {health.length > 0 ? (
                  health.map((metric: any, index: number) => (
                    <div key={index} className="text-center p-3 border border-gray-700 rounded">
                      <div className="text-lg font-mono font-bold text-primary">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        {metric.metric_type}
                      </div>
                      <div className="text-xs mt-1 text-primary">
                        Normal
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm font-mono col-span-2 text-center">Nenhum dado de saúde.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Finance Summary and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Finance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>RESUMO FINANCEIRO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Balanço</span>
                  <span className="text-2xl font-mono font-bold text-primary">
                    R$ {finance.balance?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gastos</span>
                  <span className="text-lg font-mono text-red-400">
                    R$ {finance.expense?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Receita</span>
                    <span className="text-sm font-mono text-green-400">R$ {finance.income?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: '50%' }} // Placeholder
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>AÇÕES RÁPIDAS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-3 border border-gray-700 rounded hover:border-primary hover:text-primary transition-colors text-sm font-mono"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard