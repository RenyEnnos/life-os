import React from 'react';
import { useSyncConflictStore, SyncConflict } from '@/shared/stores/useSyncConflictStore';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle, ChevronRight, Server, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/shared/api/http';

export function ConflictResolutionModal() {
  const { conflicts, resolveConflict } = useSyncConflictStore();
  const currentConflict = conflicts[0];

  if (!currentConflict) return null;

  const handleResolve = async (resolution: 'local' | 'server') => {
    if (resolution === 'local') {
      try {
        // Retry the local change, forcing it (server implementation should handle force)
        await apiClient.put(currentConflict.endpoint, { 
          ...currentConflict.localData,
          force: true // Signal to server to accept this version
        });
      } catch (err) {
        console.error('Failed to force local resolution:', err);
      }
    }
    
    // For both 'local' (after successful retry) and 'server' (just discard local),
    // we remove it from the conflict store
    resolveConflict(currentConflict.id);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Conflito de Sincronização</h2>
            <p className="text-sm text-zinc-400">
              Detectamos alterações diferentes para o mesmo item em outro dispositivo.
            </p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local Version */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
              <Smartphone size={16} />
              <span>Sua Versão (Local)</span>
            </div>
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl h-48 overflow-auto text-xs font-mono text-zinc-300">
              <pre>{JSON.stringify(currentConflict.localData, null, 2)}</pre>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-500"
              onClick={() => handleResolve('local')}
            >
              Manter Minha Versão
            </Button>
          </div>

          {/* Server Version */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <Server size={16} />
              <span>Versão do Servidor</span>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl h-48 overflow-auto text-xs font-mono text-zinc-300">
              <pre>{JSON.stringify(currentConflict.serverData, null, 2)}</pre>
            </div>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-500"
              onClick={() => handleResolve('server')}
            >
              Usar Versão do Servidor
            </Button>
          </div>
        </div>

        <div className="p-6 bg-zinc-800/50 flex justify-between items-center text-xs text-zinc-500">
          <span>Item: {currentConflict.table} ({currentConflict.itemId})</span>
          <span>{conflicts.length} conflito(s) pendente(s)</span>
        </div>
      </motion.div>
    </div>
  );
}
