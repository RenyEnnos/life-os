import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  tags: string[]
  transaction_date: string
}

const Finances: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    tags: '',
    transaction_date: new Date().toISOString().split('T')[0]
  })
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 })

  useEffect(() => {
    fetchTransactions()
    fetchSummary()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await apiFetch('/api/finances')
      if (data.success) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const data = await apiFetch(`/api/finances/summary?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`)
      if (data.success) {
        setSummary(data.data)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tagsArray = newTransaction.tags.split(',').map(t => t.trim()).filter(t => t)

      const data = await apiFetch('/api/finances', {
        method: 'POST',
        body: JSON.stringify({
          ...newTransaction,
          amount: Number(newTransaction.amount),
          tags: tagsArray
        })
      })

      if (data.success) {
        setTransactions([data.data, ...transactions])
        fetchSummary()
        setShowNewForm(false)
        setNewTransaction({
          type: 'expense',
          amount: '',
          description: '',
          tags: '',
          transaction_date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return
    try {
      const data = await apiFetch(`/api/finances/${id}`, {
        method: 'DELETE'
      })

      if (data.success) {
        setTransactions(transactions.filter(t => t.id !== id))
        fetchSummary()
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400 font-mono">FINANÇAS</h1>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="btn-brutalist px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            NOVA TRANSAÇÃO
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 font-mono">RECEITAS</p>
                  <p className="text-2xl font-bold text-green-400 font-mono mt-1">
                    R$ {summary.income.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-900/20 rounded-full text-green-400">
                  <TrendingUp size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 font-mono">DESPESAS</p>
                  <p className="text-2xl font-bold text-red-400 font-mono mt-1">
                    R$ {summary.expenses.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-red-900/20 rounded-full text-red-400">
                  <TrendingDown size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-mono text-gray-400">BALANÇO</p>
                  <p className={`text-2xl font-bold font-mono mt-1 ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {summary.balance.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-full text-white">
                  <DollarSign size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showNewForm && (
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle>Nova Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Tipo</label>
                    <select
                      value={newTransaction.type}
                      onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Data</label>
                    <input
                      type="date"
                      value={newTransaction.transaction_date}
                      onChange={e => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Tags</label>
                    <input
                      type="text"
                      value={newTransaction.tags}
                      onChange={e => setNewTransaction({ ...newTransaction, tags: e.target.value })}
                      className="w-full bg-black border border-green-900 focus:border-green-400 text-white p-2 rounded font-mono"
                      placeholder="mercado, lazer"
                    />
                  </div>
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

        <div className="space-y-2">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-700 rounded hover:border-green-400 transition-colors bg-black"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                  {transaction.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <h3 className="font-mono text-white">{transaction.description}</h3>
                  <div className="text-xs text-gray-400 font-mono">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                    {transaction.tags && transaction.tags.length > 0 && ` • ${transaction.tags.join(', ')}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-mono font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {Number(transaction.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Finances