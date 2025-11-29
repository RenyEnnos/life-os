import { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useAI } from '@/hooks/useAI';
import { apiFetch } from '@/lib/api';

export default function SettingsPage() {
    const { user } = useAuth();
    const { logs, isLoadingLogs } = useAI();
    const [isLowIA, setIsLowIA] = useState(user?.preferences?.low_ia_mode || false);
    const [isSaving, setIsSaving] = useState(false);

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
            </div>
        </div>
    );
}
