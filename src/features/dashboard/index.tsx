import { useEffect, useState, useRef } from 'react'
import { apiFetch } from '@/shared/api/http'
import { useDashboardIdentity } from '@/features/dashboard/hooks/useDashboardIdentity'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'

// Components
import { AgoraSection } from '@/features/dashboard/components/AgoraSection'
import { FinanceWidget } from '@/features/dashboard/widgets/FinanceWidget'
import { HabitWidget } from '@/features/dashboard/widgets/HabitWidget'
import { JournalWidget } from '@/features/dashboard/widgets/JournalWidget'
import { TaskWidget } from '@/features/dashboard/widgets/TaskWidget'
import { XpHero } from '@/features/dashboard/components/gamification/XpHero'
import { Zone1_Now } from '@/features/dashboard/components/Zone1_Now'
import { AttributeRadar } from '@/features/dashboard/components/gamification/AttributeRadar'
import { LevelUpToast } from '@/features/dashboard/components/gamification/LevelUpToast'
import { WidgetShell } from '@/features/dashboard/widgets/WidgetShell'
import { FocusOverlay } from '@/features/focus/components/FocusOverlay'
import { FocusTimerLogic } from '@/features/focus/components/FocusTimerLogic'
import { CloudRain, ScanFace } from 'lucide-react'

type WeatherData = { temp?: number; summary?: string; location?: string }

export default function DashboardPage() {
  const { user, loading: idLoading } = useDashboardIdentity()
  const { lifeScore, isLoading } = useDashboardData()
  const [weather, setWeather] = useState<WeatherData | null>(null)

  // Track previous level for toast
  const prevLevelRef = useRef<number | undefined>(undefined);
  const [levelUpContext, setLevelUpContext] = useState<{ current: number, prev: number | undefined }>({ current: 1, prev: undefined });

  useEffect(() => {
    if (lifeScore?.level) {
      if (prevLevelRef.current !== undefined && lifeScore.level > prevLevelRef.current) {
        setLevelUpContext({ current: lifeScore.level, prev: prevLevelRef.current });
      }
      prevLevelRef.current = lifeScore.level;
    }
  }, [lifeScore?.level]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await apiFetch<WeatherData>('/api/context/weather')
        setWeather(data)
      } catch {
        setWeather(null)
      }
    }
    loadWeather()
  }, [])

  return (
    <div className="dashboard-shell relative min-h-screen w-full bg-black text-zinc-200 font-display selection:bg-primary/30 selection:text-white">
      <FocusTimerLogic />
      <FocusOverlay />
      <LevelUpToast level={levelUpContext.current} prevLevel={levelUpContext.prev} />

      <main className="flex-1 min-h-screen overflow-visible p-4 lg:p-8 relative custom-scrollbar max-w-[1600px] mx-auto">

        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-1">Nexus</h2>
            <h1 className="text-3xl lg:text-4xl font-light text-white tracking-tight">Agora Dinâmico</h1>
            <p className="text-sm text-zinc-500 mt-1">Painel de Controle Unificado v2.0</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Weather Pill */}
            {weather && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm backdrop-blur-md">
                <CloudRain size={16} className="text-blue-400" />
                <span>{weather.temp}° {weather.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              {idLoading ? 'Carregando...' : (user?.name || 'Usuário')}
            </div>
          </div>
        </header>

        {/* Gamification Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <XpHero lifeScore={lifeScore} isLoading={isLoading} />
            {/* Synapse (Search/Suggestion) below Hero */}
            <div className="mt-6 space-y-6">
              <Zone1_Now />
              <AgoraSection />
            </div>
          </div>
          <div className="h-full min-h-[300px]">
            <WidgetShell
              title="Atributos"
              subtitle="Radar de Evolução"
              icon={<ScanFace size={18} className="text-purple-400" />}
              className="h-full"
            >
              <AttributeRadar lifeScore={lifeScore} isLoading={isLoading} className="h-[250px]" />
            </WidgetShell>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {/* Column 1: Finance */}
          <div className="h-[400px]">
            <FinanceWidget />
          </div>

          {/* Column 2: Habits */}
          <div className="h-[400px]">
            <HabitWidget />
          </div>

          {/* Column 3: Journal */}
          <div className="h-[400px]">
            <JournalWidget />
          </div>

          {/* Column 4: Tasks */}
          <div className="h-[400px]">
            <TaskWidget />
          </div>

        </div>

      </main>
    </div>
  )
}
