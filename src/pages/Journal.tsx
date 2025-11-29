import React, { useState } from 'react'
import Layout from '../components/Layout'
import { Input, TextArea } from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionTitle from '../components/ui/SectionTitle'
import { useJournal } from '../hooks/useJournal'
import { Sparkles } from 'lucide-react'

const Journal: React.FC = () => {
  const { entries, isLoading, createEntry, generateSummary } = useJournal()
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState<string>('')

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    createEntry.mutate({ entry_date: date, content }, {
      onSuccess: () => {
        setContent('')
      }
    })
  }

  const handleGenerateSummary = () => {
    generateSummary.mutate(date, {
      onSuccess: (data: any) => {
        setSummary(data.summary)
      }
    })
  }

  if (isLoading) return <Layout><div className="text-primary font-mono">Carregando diário...</div></Layout>

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <SectionTitle className="text-3xl">DIÁRIO</SectionTitle>

        <form onSubmit={handleCreateEntry} className="border border-green-700 p-4 bg-black/40 rounded-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full md:w-auto"
            />
            <Button
              type="button"
              onClick={handleGenerateSummary}
              disabled={generateSummary.isPending}
              className="flex items-center gap-2"
            >
              <Sparkles size={16} />
              {generateSummary.isPending ? 'Gerando...' : 'Resumo por IA'}
            </Button>
            <div className="flex-1"></div>
            <Button type="submit" disabled={createEntry.isPending}>
              {createEntry.isPending ? 'Salvando...' : 'Salvar entrada'}
            </Button>
          </div>
          <TextArea
            className="w-full min-h-[150px]"
            placeholder="Escreva seu diário..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>

        {summary && (
          <div className="border border-green-500/50 bg-green-900/10 p-4 rounded-lg">
            <h3 className="text-green-400 font-mono font-bold mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              RESUMO DO DIA
            </h3>
            <p className="text-green-300 font-mono text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="space-y-4">
          {entries?.map(en => (
            <div key={en.id} className="border border-gray-800 p-4 bg-black/40 rounded-lg hover:border-green-700 transition-colors">
              <div className="text-green-400 font-mono font-bold mb-2 border-b border-gray-800 pb-2">
                {new Date(en.entry_date).toLocaleDateString()}
                {en.title && <span className="text-gray-500 ml-2">— {en.title}</span>}
              </div>
              {en.content && <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap">{en.content}</div>}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Journal
