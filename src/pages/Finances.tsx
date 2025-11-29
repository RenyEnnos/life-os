import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { apiFetch } from '../lib/api'
import type { Transaction } from '../../shared/types'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'
import Toggle from '../components/ui/Toggle'

const Finances: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<{income:number, expense:number, balance:number}>({income:0,expense:0,balance:0})
  const [type, setType] = useState<'income'|'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [autoClassify, setAutoClassify] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const load = async () => {
    try {
      setTransactions(await apiFetch('/api/finance/transactions'))
      setSummary(await apiFetch('/api/finance/summary'))
    } catch (e:any) { setError(e.message) }
  }
  useEffect(()=>{ load() }, [])
  const createTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let tags: string[] = []
      if (autoClassify) {
        const r = await apiFetch('/api/ai/classify-transaction', { method: 'POST', body: JSON.stringify({ description }) })
        if (r.category && r.category !== 'unknown') tags = [r.category]
      }
      await apiFetch('/api/finance/transactions', { method: 'POST', body: JSON.stringify({ type, amount: Number(amount), description, transaction_date: date, tags }) })
      setAmount(''); setDescription('')
      await load()
    } catch (e:any) { setError(e.message) }
  }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <SectionTitle className="text-3xl mb-4">FINANÇAS</SectionTitle>
        {error && <div className="border border-red-700 text-red-400 p-2 font-mono mb-4">{error}</div>}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="border border-green-700 p-3 text-green-300 font-mono">Receitas: R$ {summary.income.toFixed(2)}</div>
          <div className="border border-green-700 p-3 text-green-300 font-mono">Despesas: R$ {summary.expense.toFixed(2)}</div>
          <div className="border border-green-700 p-3 text-green-300 font-mono">Saldo: R$ {summary.balance.toFixed(2)}</div>
        </div>
        <form onSubmit={createTransaction} className="border border-green-700 p-3 mb-4 bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
            <select className="bg-transparent border border-green-700 p-2 text-green-300" value={type} onChange={(e)=>setType(e.target.value as any)}>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
            <Input placeholder="Valor" value={amount} onChange={(e)=>setAmount(e.target.value)} />
            <Input placeholder="Descrição" value={description} onChange={(e)=>setDescription(e.target.value)} />
            <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <div className="flex items-center gap-2 text-green-300 font-mono"><Toggle checked={autoClassify} onChange={(v)=>setAutoClassify(v)} /> Auto classificar</div>
            <Button>Registrar</Button>
          </div>
        </form>
        <ul className="space-y-2">
          {transactions.map(t => (
            <li key={t.id} className="border border-green-700 p-3 bg-black/40 flex justify-between">
              <div className="text-green-300 font-mono">{t.transaction_date} — {t.type} R$ {t.amount.toFixed(2)} — {t.description}</div>
              {t.tags?.length ? <div className="text-xs text-green-500 font-mono">[{t.tags.join(', ')}]</div> : null}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Finances
