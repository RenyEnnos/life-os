import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LifeScoreCard from '../components/LifeScoreCard'
import HabitConsistencyChart from '../components/HabitConsistencyChart'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { apiFetch } from '../lib/api'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [lifeScore, setLifeScore] = useState({
    score: 78,
    trend: 'up' as const,
    statusText: 'Ótimo progresso'
  })
  const [habitData, setHabitData] = useState({
    percentage: 85,
    weeklyData: [1, 1, 0, 1, 1, 0, 1]
  })
  const [todayAgenda, setTodayAgenda] = useState<any[]>([])
  const [healthSnapshot, setHealthSnapshot] = useState<any[]>([])
  const [financeSummary, setFinanceSummary] = useState({
    balance: 0,
    expenses: 0,
    budgetProgress: 0
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [tasksRes, habitsRes, healthRes, financesRes] = await Promise.all([
          apiFetch('/api/tasks'),
          apiFetch('/api/habits'),
          apiFetch('/api/health'),
          apiFetch(`/api/finances/summary?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`)
        ])

        if (tasksRes.success) {
          const today = new Date().toISOString().split('T')[0]
          const todaysTasks = tasksRes.data.filter((t: any) => t.due_date === today)
          setTodayAgenda(todaysTasks.map((t: any) => ({
            time: '09:00', // Placeholder
            title: t.title,
            tag: t.tags[0] || 'geral',
            color: 'green'
          })))
        }

        if (habitsRes.success) {
          // Logic to calculate habit consistency could go here
          // For now, we keep the mock data for the chart
        }

        if (healthRes.success) {
          const metrics = healthRes.data.slice(0, 4).map((m: any) => ({
            label: m.metric_type,
            value: m.value.toString(),
            status: 'good' // Placeholder logic
          }))
          setHealthSnapshot(metrics)
        }

        if (financesRes.success) {
          setFinanceSummary({
            balance: financesRes.data.balance,
            expenses: financesRes.data.expenses,
            budgetProgress: 65 // Placeholder
          })
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }
    loadDashboardData()
  }, [])

  const quickActions = [
    { label: 'Nova Tarefa', action: () => navigate('/tasks') },
    { label: 'Novo Hábito', action: () => navigate('/habits') },
    { label: 'Saúde', action: () => navigate('/health') },
    { label: 'Transação', action: () => navigate('/finances') }
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400 font-mono">DASHBOARD</h1>
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
          <HabitConsistencyChart {...habitData} />
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
                {todayAgenda.length > 0 ? (
                  todayAgenda.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-700 rounded">
                      <div className="text-sm font-mono text-gray-400 w-12">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className={`text-xs text-${item.color}-400`}>#{item.tag}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-400`}></div>
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
                {healthSnapshot.length > 0 ? (
                  healthSnapshot.map((metric, index) => (
                    <div key={index} className="text-center p-3 border border-gray-700 rounded">
                      <div className="text-lg font-mono font-bold text-green-400">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        {metric.label}
                      </div>
                      <div className={`text-xs mt-1 ${metric.status === 'good' ? 'text-green-400' :
                        metric.status === 'normal' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                        {metric.status}
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
                  <span className="text-gray-400">Balanço do mês</span>
                  <span className="text-2xl font-mono font-bold text-green-400">
                    R$ {financeSummary.balance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gastos</span>
                  <span className="text-lg font-mono text-red-400">
                    R$ {financeSummary.expenses.toFixed(2)}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Progresso do orçamento</span>
                    <span className="text-sm font-mono">{financeSummary.budgetProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${financeSummary.budgetProgress}%` }}
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
                    className="p-3 border border-gray-700 rounded hover:border-green-400 hover:text-green-400 transition-colors text-sm font-mono"
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