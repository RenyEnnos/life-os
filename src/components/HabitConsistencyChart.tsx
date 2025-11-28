import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface HabitConsistencyChartProps {
  percentage: number
  weeklyData: number[]
}

const HabitConsistencyChart: React.FC<HabitConsistencyChartProps> = ({ percentage, weeklyData }) => {
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const maxValue = Math.max(...weeklyData, 1)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>CONSISTÊNCIA DE HÁBITOS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl font-mono font-bold text-green-400">
            {percentage}%
          </div>
          <div className="text-sm text-gray-400">
            completos hoje
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            {days.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          
          <div className="flex gap-1 h-16 items-end">
            {weeklyData.map((value, index) => {
              const height = (value / maxValue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full transition-all duration-300 ${
                      value > 0 ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HabitConsistencyChart