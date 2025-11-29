import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LifeScoreCard from '../components/LifeScoreCard'
import HabitConsistencyChart from '../components/HabitConsistencyChart'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useDashboardData } from '../hooks/useDashboardData'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import DonutChart from '../components/charts/DonutChart'
import Tabs from '../components/ui/Tabs'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { lifeScore, agenda, health, finance } = useDashboardData()
  const [habitData, setHabitData] = useState({
    percentage: 85,
    weeklyData: [1, 1, 0, 1, 1, 0, 1]
  })
  const [period, setPeriod] = useState<'7'|'30'|'90'>('7')

  const quickActions = [
    { label: 'Nova Tarefa', action: () => console.log('Nova tarefa') },
    { label: 'Novo Hábito', action: () => console.log('Novo hábito') },
    { label: 'Diário', action: () => console.log('Nova entrada') },
    { label: 'Transação', action: () => console.log('Nova transação') }
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
                {agenda.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-700 rounded">
                    <div className="text-sm font-mono text-gray-400 w-12">
                      {item.due_date ? new Date(item.due_date).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) : '--:--'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.title}</div>
                      <div className={`text-xs text-green-400`}>#{(item.tags?.[0]||'tarefa')}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full bg-green-400`}></div>
                  </div>
                ))}
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
                {health.slice(-4).map((metric: any, index: number) => (
                  <div key={index} className="text-center p-3 border border-gray-700 rounded">
                    <div className="text-lg font-mono font-bold text-green-400">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">
                      {metric.metric_type}
                    </div>
                    <div className={`text-xs mt-1 text-green-400`}>recente</div>
                  </div>
                ))}
              </div>
              {/* Steps line chart */}
              <div className="mt-4">
                <LineChart data={health.filter((m:any)=>m.metric_type==='steps').map((m:any)=>({ day: m.recorded_date, value: Number(m.value) }))} xKey="day" yKey="value" />
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
                    R$ {finance.balance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gastos</span>
                  <span className="text-lg font-mono text-red-400">
                    R$ {finance.expense.toFixed(2)}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Progresso do orçamento</span>
                    <span className="text-sm font-mono">{Math.min(100, Math.round((finance.expense/(finance.income||1))*100))}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((finance.expense/(finance.income||1))*100))}%` }}
                    ></div>
                  </div>
                  <div className="mt-4">
                    <Tabs tabs={[{id:'7',label:'7d'},{id:'30',label:'30d'},{id:'90',label:'90d'}]} onChange={(id)=> setPeriod(id as any)} />
                    <div className="mt-3">
                      <BarChart data={[{ label: 'Income', value: finance.income }, { label: 'Expense', value: finance.expense }]} xKey="label" yKey="value" />
                    </div>
                    <div className="mt-3">
                      <DonutChart data={[{ name: 'Income', value: finance.income }, { name: 'Expense', value: finance.expense }]} />
                    </div>
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
