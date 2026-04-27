import { useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import { JournalEntryList } from '../components/JournalEntryList';
import { JournalEditor } from '../components/JournalEditor';
import { ResonancePanel } from '../components/resonance/ResonancePanel';
import { WeeklyReflectionCard } from '../components/WeeklyReflectionCard';
import { JournalEntry } from '@/shared/types';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const JournalPage = () => {
  const { entries, isLoading, createEntry, updateEntry, deleteEntry } = useJournal();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setIsCreating(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsCreating(false);
  };

  const handleSave = async (data: Partial<JournalEntry>) => {
    if (selectedEntry) {
      await updateEntry.mutateAsync({ id: selectedEntry.id, updates: data });
    } else {
      await createEntry.mutateAsync(data);
    }
    setSelectedEntry(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setSelectedEntry(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      await deleteEntry.mutateAsync(id);
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-oled text-white font-display selection:bg-primary/30">
      {/* Entries Sidebar */}
      <aside className="w-80 glass flex flex-col h-full border-r border-white/5 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Entradas</h2>
          <Button variant="ghost" size="icon" onClick={handleNewEntry} className="hover:bg-primary/10 text-primary">
            <Plus size={18} />
          </Button>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <JournalEntryList
              entries={entries || []}
              onEdit={handleEditEntry}
              onDelete={handleDelete}
              compact
            />
          )}
        </div>
      </aside>

      {/* Main Writing Area / Content */}
      <main className="flex-1 relative h-full overflow-hidden">
        {selectedEntry || isCreating ? (
          <JournalEditor
            entry={selectedEntry || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
            <div className="max-w-4xl mx-auto space-y-12">
              <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-zinc-500">
                  <BookOpen size={18} />
                  <span className="text-xs font-mono uppercase tracking-[0.3em]">Diário de Bordo</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter">Sua Jornada.</h1>
              </header>

              <WeeklyReflectionCard />

              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] text-zinc-500 gap-4">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-white/50">Pronto para escrever?</h3>
                  <p className="text-sm">Selecione uma entrada ou crie uma nova para capturar seus pensamentos.</p>
                </div>
                <Button onClick={handleNewEntry} className="mt-4 gap-2 bg-primary hover:bg-primary/90 text-black font-bold px-8 py-6 rounded-2xl">
                  <Plus size={20} />
                  NOVA ENTRADA
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Insights Sidebar */}
      <aside className="w-80 glass border-l border-white/5 h-full overflow-y-auto custom-scrollbar p-4 hidden lg:block shrink-0">
        <ResonancePanel entryId={selectedEntry?.id} />
      </aside>
    </div>
  );
};

