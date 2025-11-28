import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface LifeScoreCardProps {
  score: number
  trend: 'up' | 'down' | 'stable'
  statusText: string
}

const LifeScoreCard: React.FC<LifeScoreCardProps> = ({ score, trend, statusText }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️'
      case 'down':
        return '↘️'
      default:
        return '→'
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-yellow-400'
    }
  }

  return (
    <Card variant="neon" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>LIFE SCORE</span>
          <span className={`text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="text-6xl font-mono font-bold text-green-400 drop-shadow-lg">
            {score}
          </div>
          <div className="absolute -inset-1 bg-green-400 opacity-20 blur-xl rounded-full"></div>
        </div>
        <div className="text-center">
          <p className="text-green-300 font-mono text-sm uppercase tracking-wide">
            {statusText}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Baseado em hábitos, tarefas, saúde e finanças
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default LifeScoreCard