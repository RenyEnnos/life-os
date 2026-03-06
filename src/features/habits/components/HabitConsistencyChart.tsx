import React from 'react'
import { Card, CardHeader, CardTitle } from '@/shared/ui/Card'
import { BarChart, Text, Flex, BadgeDelta } from "@tremor/react";

interface HabitConsistencyChartProps {
  percentage: number
  weeklyData: number[]
}

const HabitConsistencyChart: React.FC<HabitConsistencyChartProps> = ({ percentage, weeklyData }) => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  const chartData = weeklyData.map((value, index) => ({
    name: days[index],
    "Completos": value,
  }));

  // Calculate delta (today vs average)
  const average = weeklyData.reduce((a, b) => a + b, 0) / (weeklyData.length || 1);
  const todayValue = weeklyData[new Date().getDay()];
  const isAboveAverage = todayValue >= average;

  return (
    <Card className="h-full bg-zinc-900/40 backdrop-blur-xl border-white/5">
      <CardHeader className="pb-2">
        <Flex>
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-zinc-500">Consistência</CardTitle>
          <BadgeDelta 
            deltaType={isAboveAverage ? "moderateIncrease" : "moderateDecrease"}
            size="xs"
          >
            {percentage}%
          </BadgeDelta>
        </Flex>
      </CardHeader>
      <div className="px-6 pb-6">
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tracking-tighter tabular-nums">{percentage}%</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Atividade Hoje</span>
          </div>
        </div>
        
        <BarChart
          className="h-32 mt-6"
          data={chartData}
          index="name"
          categories={["Completos"]}
          colors={["emerald"]}
          showXAxis={true}
          showYAxis={false}
          showLegend={false}
          showGridLines={false}
          autoMinValue={true}
        />
        
        <Text className="mt-4 text-[10px] text-center text-zinc-600 uppercase tracking-tighter">
          Últimos 7 ciclos de rotação sincronizados
        </Text>
      </div>
    </Card>
  )
}

export default HabitConsistencyChart
