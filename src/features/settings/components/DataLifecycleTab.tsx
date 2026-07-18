import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { clearPrivateClientData, withClientData } from '@/shared/privacy/clientData';

export default function DataLifecycleTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const exportData = async () => {
    if (!user) return;
    setBusy(true);
    setMessage('');
    try {
      const data = await withClientData(await authApi.exportPersonalData(password), user.id);
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `lifeos-account-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage('Export created on this device.');
    } catch {
      setMessage('Export failed. Check your password and try again.');
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    setBusy(true);
    setMessage('');
    try {
      await authApi.deleteAccount(password, confirmation);
    } catch {
      setMessage('Deletion failed. Your account remains active.');
      setBusy(false);
      return;
    }
    let localCleanupComplete = false;
    try {
      localCleanupComplete = await clearPrivateClientData(user.id);
    } finally {
      navigate('/login', { replace: true, state: { accountDeleted: true, localCleanupComplete } });
    }
  };

  return (
    <section className="space-y-8" aria-labelledby="data-lifecycle-title">
      <div>
        <h2 id="data-lifecycle-title" className="text-xl font-semibold text-white">Your data</h2>
        <p className="mt-2 text-sm text-zinc-400">External analytics, replay and error processors are disabled.</p>
      </div>
      <label className="block text-sm text-zinc-300">
        Current password
        <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white" />
      </label>
      <button type="button" disabled={busy || !password} onClick={exportData} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">
        Download my data
      </button>
      <div className="rounded-xl border border-red-500/30 p-4">
        <p className="text-sm text-zinc-300">Deletion removes your account, workspace and retained recovery snapshots. Type DELETE MY ACCOUNT to confirm.</p>
        <label className="mt-4 block text-sm text-zinc-300">
          Confirmation
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-lg border border-red-500/30 bg-black/30 p-3 text-white" />
        </label>
        <button type="button" disabled={busy || !password || confirmation !== 'DELETE MY ACCOUNT'} onClick={deleteAccount} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          Permanently delete account
        </button>
      </div>
      {message && <p role="status" className="text-sm text-zinc-300">{message}</p>}
    </section>
  );
}
