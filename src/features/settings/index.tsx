import { useState } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import LineChart from '@/components/charts/LineChart';
import { usePerfStats } from '@/hooks/usePerfStats';
import { useAuth } from '@/contexts/AuthContext';
import { useAI } from '@/hooks/useAI';
import { apiFetch } from '@/lib/api';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const { updateThemePreference } = useAuth();
    const { logs, isLoadingLogs } = useAI();
    const [isLowIA, setIsLowIA] = useState(user?.preferences?.low_ia_mode || false);
    const [isSaving, setIsSaving] = useState(false);
    const [endpointFilter, setEndpointFilter] = useState<'ALL' | string>('ALL');
    const [windowHrs, setWindowHrs] = useState(24);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const { stats, seriesByTime, loading, error, clearHistory } = usePerfStats(endpointFilter, windowHrs * 60 * 60 * 1000, autoRefresh, 5000);
    const { isDark, toggleTheme } = useTheme();

    const toggleLowIA = async () => {
        setIsSaving(true);
        const newValue = !isLowIA;
        setIsLowIA(newValue);

        try {
            await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    preferences: {
                        ...user?.preferences,
                        low_ia_mode: newValue
                    }
                })
            });
            // Ideally we should update the context user here, but for now we rely on local state
            // and next page load will fetch fresh user data
        } catch (error) {
            console.error('Failed to update preferences', error);
            setIsLowIA(!newValue); // Revert on error
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageTitle title="CONFIGURAÇÕES" subtitle="Parâmetros do sistema e logs de execução." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>TEMA</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                            <div>
                                <h3 className="font-medium text-foreground">Modo de tema</h3>
                                <p className="text-sm text-muted-foreground">Preferência aplicada e sincronizada com perfil.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant={isDark ? 'outline' : 'primary'} size="icon" aria-label="Tema claro" onClick={() => { if (isDark) { toggleTheme(); updateThemePreference('light') } }}>
                                    <Sun size={16} />
                                </Button>
                                <Button variant={isDark ? 'primary' : 'outline'} size="icon" aria-label="Tema escuro" onClick={() => { if (!isDark) { toggleTheme(); updateThemePreference('dark') } }}>
                                    <Moon size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>PREFERÊNCIAS DE IA</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                            <div>
                                <h3 className="font-medium text-foreground">MODO LOW-IA</h3>
                                <p className="text-sm text-muted-foreground">
                                    Execução manual de IA. Desativa gatilhos automáticos para otimização de recursos.
                                </p>
                            </div>
                            <Button
                                variant={isLowIA ? 'primary' : 'outline'}
                                onClick={toggleLowIA}
                                disabled={isSaving}
                            >
                                {isLowIA ? 'ATIVADO' : 'DESATIVADO'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>DEV MODE: LOGS DE EXECUÇÃO</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingLogs ? (
                            <div className="text-center py-4">CARREGANDO LOGS...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-surface">
                                        <tr>
                                            <th className="px-4 py-2">DATA/HORA</th>
                                            <th className="px-4 py-2">FUNÇÃO</th>
                                            <th className="px-4 py-2">STATUS</th>
                                            <th className="px-4 py-2">ERRO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs?.map((log) => (
                                            <tr key={log.id} className="border-b border-border hover:bg-surface/50">
                                                <td className="px-4 py-2 font-mono">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 font-mono text-primary">
                                                    {log.function_name}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${log.success
                                                        ? 'bg-green-500/20 text-green-500'
                                                        : 'bg-red-500/20 text-red-500'
                                                        }`}>
                                                        {log.success ? 'SUCESSO' : 'FALHA'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-red-400 truncate max-w-xs">
                                                    {log.error_message || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!logs || logs.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                    Nenhum log de execução registrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>MONITORAMENTO DE DESEMPENHO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-muted-foreground">Endpoint</label>
                                <select
                                    value={endpointFilter}
                                    onChange={(e) => setEndpointFilter(e.target.value)}
                                    className="bg-transparent border border-border rounded px-3 py-2 text-sm"
                                >
                                    <option value="ALL">ALL</option>
                                    {(() => {
                                        const counts = new Map<string, number>()
                                        for (const s of (stats?.series || [])) {
                                            const ep = s.endpoint as string
                                            counts.set(ep, (counts.get(ep) || 0) + 1)
                                        }
                                        return Array.from(counts.entries())
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([ep, count]) => (
                                                <option key={ep} value={ep}>{`${ep} (${count})`}</option>
                                            ))
                                    })()}
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-muted-foreground">Janela</label>
                                <select
                                    value={windowHrs}
                                    onChange={(e) => setWindowHrs(Number(e.target.value))}
                                    className="bg-transparent border border-border rounded px-3 py-2 text-sm"
                                >
                                    <option value={1}>1h</option>
                                    <option value={6}>6h</option>
                                    <option value={24}>24h</option>
                                </select>
                                <Button variant="outline" onClick={clearHistory}>Limpar histórico</Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded">
                            <div className="text-sm">AUTO-REFRESH: <span className={`font-mono ${autoRefresh ? 'text-green-500' : 'text-yellow-400'}`}>{autoRefresh ? 'ATIVO' : 'PAUSADO'}</span></div>
                            <div className="flex items-center gap-3">
                                <Button variant={autoRefresh ? 'destructive' : 'primary'} onClick={() => setAutoRefresh(v => !v)}>
                                    {autoRefresh ? 'PAUSAR' : 'CONTINUAR'}
                                </Button>
                                <Button variant="outline" onClick={() => { setAutoRefresh(false); setTimeout(() => setAutoRefresh(true), 0) }}>Atualizar agora</Button>
                            </div>
                        </div>
                        {loading && (
                            <div className="text-center py-2">CARREGANDO MÉTRICAS...</div>
                        )}
                        {error && (
                            <div className="text-center py-2 text-red-500">{error}</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="mb-2 text-sm text-muted-foreground">Throughput/min</div>
                                <LineChart data={seriesByTime} xKey="time" yKey="throughput" color="#0df20d" />
                            </div>
                            <div>
                                <div className="mb-2 text-sm text-muted-foreground">Latência p95 (ms)</div>
                                <LineChart data={seriesByTime} xKey="time" yKey="p95" color="#f2b90d" />
                            </div>
                            <div>
                                <div className="mb-2 text-sm text-muted-foreground">Taxa de erros (%)</div>
                                <LineChart data={seriesByTime} xKey="time" yKey="errorsPct" color="#f20d0d" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-3 border border-border rounded">
                                <div className="text-xs text-muted-foreground">Throughput</div>
                                <div className="font-mono text-primary text-lg">{stats?.throughput ?? 0}</div>
                            </div>
                            <div className="p-3 border border-border rounded">
                                <div className="text-xs text-muted-foreground">Latência média (ms)</div>
                                <div className="font-mono text-primary text-lg">{stats?.avgMs ?? 0}</div>
                            </div>
                            <div className="p-3 border border-border rounded">
                                <div className="text-xs text-muted-foreground">p95 (ms)</div>
                                <div className="font-mono text-primary text-lg">{stats?.p95 ?? 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
