import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, CloudRain, Plus, Trash2, Wallet, ArrowRight, NotebookPen, Coins } from 'lucide-react'
import { useDashboardIdentity } from '@/features/dashboard/hooks/useDashboardIdentity'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { AgoraSection } from '@/features/dashboard/components/AgoraSection'
import { tasksApi } from '@/features/tasks/api/tasks.api'
import { habitsApi } from '@/features/habits/api/habits.api'
import { symbiosisApi } from '@/features/symbiosis/api/symbiosis.api'
import { financesApi } from '@/features/finances/api/finances.api'
import { journalApi } from '@/features/journal/api/journal.api'
import type { Task } from '@/features/tasks/types'
import type { Habit, SymbiosisLink, FinanceSummary, JournalEntry } from '@/shared/types'
import { apiFetch } from '@/shared/api/http'

type WeatherData = { temp?: number; summary?: string; location?: string }
type DashboardTask = Task & { due_date?: string | null; description?: string | null; created_at?: string; completed?: boolean | null }

export default function DashboardPage() {
  const qc = useQueryClient()
  const { user, loading: idLoading } = useDashboardIdentity()
  const { stats } = useDashboardStats()
  const { tasks, habits, agenda, finance, habitConsistency, symbiosisLinks, vitalLoad, lifeScore, isLoading } = useDashboardData()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDue, setNewTaskDue] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [linkTaskId, setLinkTaskId] = useState('')
  const [linkHabitId, setLinkHabitId] = useState('')
  const [linkImpact, setLinkImpact] = useState(1)
  const [linkNotes, setLinkNotes] = useState('')
  const [logHabitId, setLogHabitId] = useState('')
  const [financeType, setFinanceType] = useState<'income' | 'expense'>('expense')
  const [financeAmount, setFinanceAmount] = useState('')
  const [financeDesc, setFinanceDesc] = useState('')
  const [financeCategory, setFinanceCategory] = useState('General')
  const [journalTitle, setJournalTitle] = useState('')
  const [journalContent, setJournalContent] = useState('')

  // Fetch weather (best-effort)
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

  const invalidateAllTasks = () => {
    qc.invalidateQueries({ queryKey: ['tasks'] })
    qc.invalidateQueries({ queryKey: ['tasks', user?.id] })
  }

  const invalidateDashboard = () => {
    invalidateAllTasks()
    qc.invalidateQueries({ queryKey: ['finance', 'summary', user?.id] })
    qc.invalidateQueries({ queryKey: ['symbiosis', user?.id] })
  }

  const createTask = useMutation({
    mutationFn: (payload: Partial<DashboardTask>) => tasksApi.create(payload as any),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['tasks', user?.id] })
      const prev = qc.getQueryData<DashboardTask[]>(['tasks', user?.id]) || []
      const optimistic: DashboardTask = {
        id: `tmp-${Date.now()}`,
        title: payload.title || 'Tarefa',
        due_date: payload.due_date || null,
        description: payload.description || null,
        created_at: new Date().toISOString(),
        completed: false,
        tags: [],
        priority: payload.priority,
        user_id: user?.id || ''
      } as any
      qc.setQueryData(['tasks', user?.id], [optimistic, ...prev])
      return { prev }
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData(['tasks', user?.id], ctx.prev)
    },
    onSettled: () => invalidateAllTasks(),
  })

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => tasksApi.update(id, { completed }),
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries({ queryKey: ['tasks', user?.id] })
      const prev = qc.getQueryData<DashboardTask[]>(['tasks', user?.id]) || []
      qc.setQueryData(['tasks', user?.id], prev.map(t => t.id === id ? { ...t, completed } : t))
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['tasks', user?.id], ctx.prev) },
    onSettled: () => invalidateAllTasks(),
  })

  const createLink = useMutation({
    mutationFn: () => symbiosisApi.create({
      task_id: linkTaskId,
      habit_id: linkHabitId,
      impact_vital: linkImpact,
      notes: linkNotes || undefined
    }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['symbiosis', user?.id] })
      const prev = qc.getQueryData<SymbiosisLink[]>(['symbiosis', user?.id]) || []
      const optimistic: SymbiosisLink = {
        id: `tmp-link-${Date.now()}`,
        task_id: linkTaskId,
        habit_id: linkHabitId,
        impact_vital: linkImpact,
        notes: linkNotes,
      }
      qc.setQueryData(['symbiosis', user?.id], [optimistic, ...prev])
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['symbiosis', user?.id], ctx.prev) },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['symbiosis', user?.id] })
      qc.invalidateQueries({ queryKey: ['habits', user?.id] })
      setLinkNotes('')
      setLinkHabitId('')
      setLinkTaskId('')
      setLinkImpact(1)
    }
  })

  const deleteLink = useMutation({
    mutationFn: (id: string) => symbiosisApi.delete(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['symbiosis', user?.id] })
      const prev = qc.getQueryData<SymbiosisLink[]>(['symbiosis', user?.id]) || []
      qc.setQueryData(['symbiosis', user?.id], prev.filter((l) => l.id !== id))
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['symbiosis', user?.id], ctx.prev) },
    onSettled: () => qc.invalidateQueries({ queryKey: ['symbiosis', user?.id] })
  })

  const logHabit = useMutation({
    mutationFn: (habitId: string) => {
      const today = new Date().toISOString().split('T')[0]
      return habitsApi.log(user?.id || '', habitId, 1, today)
    },
    onMutate: async (habitId: string) => {
      await qc.cancelQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'habits' && q.queryKey[1] === 'logs' })
      const prev = qc.getQueryData<any>(['habits', 'logs']) || []
      const today = new Date().toISOString().split('T')[0]
      const optimistic = [...prev, { habit_id: habitId, date: today }]
      qc.setQueryData(['habits', 'logs'], optimistic)
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['habits', 'logs'], ctx.prev) },
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'habits' && q.queryKey[1] === 'logs'
      })
      qc.invalidateQueries({ queryKey: ['habits', user?.id] })
    }
  })

  const createFinance = useMutation({
    mutationFn: () => financesApi.create({
      type: financeType,
      amount: Number(financeAmount),
      description: financeDesc,
      category: financeCategory || 'General',
      transaction_date: new Date().toISOString()
    }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['finance', 'summary', user?.id] })
      const prev = qc.getQueryData<FinanceSummary>(['finance', 'summary', user?.id]) || { income: 0, expenses: 0, balance: 0 }
      const delta = Number(financeAmount) || 0
      const income = prev.income + (financeType === 'income' ? delta : 0)
      const expenses = prev.expenses + (financeType === 'expense' ? delta : 0)
      const optimistic = { ...prev, income, expenses, balance: income - expenses }
      qc.setQueryData(['finance', 'summary', user?.id], optimistic)
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['finance', 'summary', user?.id], ctx.prev) },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['finance', 'summary', user?.id] })
      setFinanceAmount('')
      setFinanceDesc('')
    }
  })

  const createJournal = useMutation({
    mutationFn: () => journalApi.create({
      title: journalTitle || 'Entrada rápida',
      content: journalContent,
      entry_date: new Date().toISOString().split('T')[0]
    }),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['journal', user?.id] })
      setJournalTitle('')
      setJournalContent('')
    }
  })

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return
    const payload: Partial<Task & { due_date?: string }> = { title: newTaskTitle.trim() }
    if (newTaskDue) payload.due_date = new Date(`${newTaskDue}T00:00:00`).toISOString()
    await createTask.mutateAsync(payload)
    setNewTaskTitle('')
    setNewTaskDue('')
  }

  const todaysTasks = useMemo(() => agenda || [], [agenda])

  const findHabit = (id: string) => habits.find((h: Habit) => (h as any).id === id)
  const findTask = (id: string) => tasks.find((t: any) => t.id === id)

  const renderTaskItem = (task: any) => {
    const due = task.due_date ? new Date(task.due_date) : null
    const dueLabel = due ? new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit' }).format(due) : 'Sem horário'
    return (
      <label key={task.id} className="group flex gap-3 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer items-start">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border border-zinc-700 bg-transparent checked:border-primary checked:bg-primary focus:ring-0"
          checked={!!task.completed}
          onChange={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
        />
        <div className="flex flex-col gap-1">
          <p className={`text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{task.title}</p>
          <span className="text-xs text-zinc-500">{dueLabel}</span>
        </div>
      </label>
    )
  }

  const symbiosisList = symbiosisLinks || []
  const { data: journalEntries = [] } = useQuery<JournalEntry[]>({
    queryKey: ['journal', user?.id],
    queryFn: () => journalApi.list(user?.id),
    enabled: !!user
  })

  return (
    <div className="dashboard-shell relative min-h-screen w-full overflow-hidden bg-black text-zinc-200 font-display selection:bg-primary/30 selection:text-white">
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-8 relative custom-scrollbar">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-1">Nexus</h2>
            <h1 className="text-3xl lg:text-4xl font-light text-white tracking-tight">Agora Dinâmico</h1>
            <p className="text-sm text-zinc-500 mt-1">Seu cockpit reflete dados reais: tarefas, hábitos, finanças e vínculos.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              {idLoading ? 'Carregando perfil...' : (user?.name || 'Usuário ativo')}
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
              XP: {lifeScore?.current_xp ?? 0} • Nível {lifeScore?.level ?? 1}
            </div>
          </div>
        </header>

        <AgoraSection />

        <div className="grid gap-4 lg:grid-cols-3 mt-6">
          {/* Tasks / Agenda */}
          <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Missão de Hoje</p>
                <h3 className="text-lg font-semibold text-white">Agenda e capturas rápidas</h3>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Adicionar tarefa..."
                  className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateTask}
                  disabled={createTask.isPending || !newTaskTitle.trim()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-primary/80 disabled:opacity-50"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
            </div>

            {isLoading && <p className="text-zinc-500 text-sm">Carregando tarefas...</p>}
            {!isLoading && todaysTasks.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-400">
                Nenhuma tarefa para hoje. Capture uma acima para começar.
              </div>
            )}
            <div className="flex flex-col gap-2">
              {todaysTasks.map(renderTaskItem)}
            </div>
          </div>

          {/* Weather + Finance */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Clima</p>
                <h3 className="text-lg font-semibold text-white">{weather?.location || 'Local'}</h3>
              </div>
              <CloudRain className="text-blue-400" size={22} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-light text-white">{weather?.temp ?? '—'}°</span>
              <span className="text-sm text-zinc-400">{weather?.summary || 'Aguardando dados'}</span>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Wallet size={16} />
                  <span>Finanças</span>
                </div>
                <span className={`text-sm ${finance.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {finance.balance >= 0 ? '+' : ''}{finance.balance?.toFixed(2) ?? '0.00'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Receitas: {finance.income?.toFixed(2) ?? '0.00'} • Despesas: {finance.expenses?.toFixed(2) ?? '0.00'}</p>
            </div>
          </div>

          {/* Habit Consistency */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ritmo de hábitos</p>
                <h3 className="text-lg font-semibold text-white">{habitConsistency.percentage}% hoje</h3>
              </div>
              <span className="text-xs text-zinc-400">Últimos 7 dias</span>
            </div>
            <div className="flex items-end gap-1 h-20">
              {habitConsistency.weeklyData.map((v, idx) => (
                <div key={idx} className="flex-1 bg-white/10 rounded-sm" style={{ height: `${Math.max(v, 1) * 15}px` }} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <select
                value={logHabitId}
                onChange={(e) => setLogHabitId(e.target.value)}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Registrar hábito de hoje...</option>
                {habits.map((h) => <option key={(h as any).id} value={(h as any).id}>{(h as any).title || (h as any).name}</option>)}
              </select>
              <button
                type="button"
                onClick={() => logHabitId && logHabit.mutate(logHabitId)}
                disabled={!logHabitId || logHabit.isPending}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-primary/80 disabled:opacity-50"
              >
                Logar
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Auto-refresh habilitado via SSE quando logs chegam.</p>
          </div>

          {/* Symbiosis */}
          <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Symbiosis</p>
                <h3 className="text-lg font-semibold text-white">Vínculos tarefa ↔ hábito</h3>
                <p className="text-xs text-zinc-500">Impacto vital: {vitalLoad.totalImpact} • {vitalLoad.label}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">{symbiosisList.length} vínculos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <select
                value={linkTaskId}
                onChange={(e) => setLinkTaskId(e.target.value)}
                className="col-span-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Selecione tarefa</option>
                {tasks.map((t) => <option key={t.id} value={t.id}>{(t as any).title || 'Tarefa'}</option>)}
              </select>
              <select
                value={linkHabitId}
                onChange={(e) => setLinkHabitId(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Selecione hábito</option>
                {habits.map((h) => <option key={(h as any).id} value={(h as any).id}>{(h as any).title || (h as any).name || 'Hábito'}</option>)}
              </select>
              <input
                type="number"
                min={-5}
                max={5}
                value={linkImpact}
                onChange={(e) => setLinkImpact(Number(e.target.value))}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Impacto"
              />
              <input
                value={linkNotes}
                onChange={(e) => setLinkNotes(e.target.value)}
                placeholder="Notas (opcional)"
                className="md:col-span-3 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => createLink.mutate()}
                disabled={!linkTaskId || !linkHabitId || createLink.isPending}
                className="col-span-1 md:col-span-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-primary/80 disabled:opacity-50"
              >
                <ArrowRight size={16} /> Criar vínculo
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {symbiosisList.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-400">
                  Nenhum vínculo criado. Conecte uma tarefa e hábito para calcular carga vital.
                </div>
              )}
              {symbiosisList.map((link: SymbiosisLink) => {
                const task = findTask(link.task_id)
                const habit = findHabit(link.habit_id)
                return (
                  <div key={link.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                    <div className="flex flex-col">
                      <span className="text-sm text-white">{task ? (task as any).title : 'Tarefa'}</span>
                      <span className="text-xs text-zinc-500">{habit ? (habit as any).title || (habit as any).name : 'Hábito'}</span>
                      <span className="text-xs text-amber-300">Impacto: {link.impact_vital}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteLink.mutate(link.id)}
                      className="text-zinc-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Finance Quick Capture */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Finanças</p>
                <h3 className="text-lg font-semibold text-white">Registrar transação</h3>
              </div>
              <Coins className="text-amber-300" size={18} />
            </div>
            <div className="flex gap-2 mb-2">
              <select
                value={financeType}
                onChange={(e) => setFinanceType(e.target.value as 'income' | 'expense')}
                className="w-28 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
              <input
                value={financeAmount}
                onChange={(e) => setFinanceAmount(e.target.value)}
                placeholder="Valor"
                type="number"
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <input
              value={financeDesc}
              onChange={(e) => setFinanceDesc(e.target.value)}
              placeholder="Descrição"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none mb-2"
            />
            <input
              value={financeCategory}
              onChange={(e) => setFinanceCategory(e.target.value)}
              placeholder="Categoria"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none mb-3"
            />
            <button
              type="button"
              onClick={() => financeAmount && financeDesc && createFinance.mutate()}
              disabled={createFinance.isPending || !financeAmount || !financeDesc}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-primary/80 disabled:opacity-50"
            >
              {createFinance.isPending ? 'Enviando...' : 'Registrar'}
            </button>
          </div>

          {/* Journal Quick Capture */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Journal</p>
                <h3 className="text-lg font-semibold text-white">Captura rápida</h3>
              </div>
              <NotebookPen className="text-sky-300" size={18} />
            </div>
            <input
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              placeholder="Título"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none mb-2"
            />
            <textarea
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              placeholder="O que aconteceu?"
              rows={3}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none mb-3 resize-none"
            />
            <button
              type="button"
              onClick={() => journalContent.trim() && createJournal.mutate()}
              disabled={createJournal.isPending || !journalContent.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-sm font-semibold hover:bg-primary/80 disabled:opacity-50 mb-3"
            >
              {createJournal.isPending ? 'Salvando...' : 'Salvar'}
            </button>
            <div className="space-y-1">
              {journalEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="text-xs text-zinc-300 border border-white/5 rounded-lg p-2 bg-white/[0.02]">
                  <div className="font-semibold text-white">{entry.title || 'Entrada'}</div>
                  <div className="text-zinc-500 line-clamp-2">{entry.content || 'Sem conteúdo'}</div>
                </div>
              ))}
              {!journalEntries.length && (
                <p className="text-xs text-zinc-500">Sem entradas ainda.</p>
              )}
            </div>
          </div>

          {/* Quick status */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Status</p>
                <h3 className="text-lg font-semibold text-white">Fluxo em tempo real</h3>
              </div>
              <CheckCircle2 className="text-emerald-400" size={18} />
            </div>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• SSE ativo para tasks/hábitos/finanças/symbiosis</li>
              <li>• {stats?.completionRate ?? 0}% de conclusão geral</li>
              <li>• {tasks.length} tarefas totais • {habitConsistency.weeklyData.reduce((a, b) => a + b, 0)} logs/semana</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
