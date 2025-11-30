import { useState } from 'react';
import { Trophy, Star, Gift, Lock, Unlock, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRewards } from '@/hooks/useRewards';
import type { Reward, Achievement } from '../../../shared/types';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis
} from 'recharts';

export default function RewardsPage() {
    const { rewards, achievements, lifeScore, isLoading, createReward, deleteReward } = useRewards();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const score = lifeScore?.score || 0;
    const maxScore = 100; // Assuming 100 is max for visualization
    const scoreData = [{ name: 'Score', value: score, fill: '#adfa1d' }];

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="RECOMPENSAS & CONQUISTAS"
                subtitle="Sistema de incentivos e progressão."
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus size={18} />
                        CRIAR RECOMPENSA
                    </Button>
                }
            />

            {isLoading ? (
                <div className="text-center py-20 text-muted-foreground font-mono animate-pulse">
                    CALCULANDO SCORE DE VIDA...
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Life Score Card */}
                    <Card className="md:col-span-1 p-6 border-border bg-card flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                        <h3 className="font-mono font-bold text-lg mb-2 flex items-center gap-2 z-10">
                            <Trophy size={20} className="text-primary" />
                            LIFE SCORE
                        </h3>

                        <div className="h-[200px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    barSize={20}
                                    data={scoreData}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <PolarAngleAxis type="number" domain={[0, maxScore]} angleAxisId={0} tick={false} />
                                    <RadialBar background dataKey="value" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                                <span className="text-5xl font-bold font-mono text-primary">{score}</span>
                                <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">Pontos</span>
                            </div>
                        </div>

                        {/* Se desejar detalhamento por áreas, amplie o tipo LifeScore e ajuste aqui */}
                    </Card>

                    <div className="md:col-span-2 space-y-6">
                        {(!rewards?.length && !achievements?.length) ? (
                            <EmptyState
                                icon={Trophy}
                                title="SEM GAMIFICAÇÃO"
                                description="Nenhum incentivo configurado. Defina recompensas para estimular a execução."
                                action={
                                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                                        <Plus size={16} /> CRIAR RECOMPENSA
                                    </Button>
                                }
                            />
                        ) : (
                            <>
                                {/* Rewards List */}
                                <Card className="p-6 border-border bg-card">
                                    <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                                        <Gift size={20} className="text-primary" />
                                        INCENTIVOS
                                    </h3>

                                    {!rewards?.length ? (
                                        <div className="text-center py-6 text-muted-foreground font-mono text-sm">
                                            Nenhum incentivo ativo.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {rewards.map((r: Reward) => (
                                                <div key={r.id} className="p-3 bg-surface rounded border border-border flex justify-between items-center group">
                                                    <div>
                                                        <div className="font-bold font-mono text-foreground">{r.title}</div>
                                                        <div className="text-xs text-muted-foreground font-mono">{r.points_required} pontos</div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant={score >= r.points_required ? "primary" : "outline"}
                                                            disabled={score < r.points_required}
                                                            className="h-8 text-xs"
                                                        >
                                                            RESGATAR
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                                            onClick={() => deleteReward.mutate(r.id)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>

                                {/* Achievements Grid */}
                                <Card className="p-6 border-border bg-card">
                                    <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                                        <Star size={20} className="text-primary" />
                                        DESBLOQUEIOS
                                    </h3>

                                    {!achievements?.length ? (
                                        <div className="text-center py-6 text-muted-foreground font-mono text-sm">
                                            Nenhum desbloqueio registrado.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {achievements.map((a: Achievement) => (
                                                <div key={a.id} className="flex flex-col items-center text-center p-3 bg-surface/50 rounded border border-primary/20">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                                                        <Unlock size={20} />
                                                    </div>
                                                    <div className="font-bold font-mono text-xs text-foreground">{a.title}</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono mt-1">{a.description}</div>
                                                </div>
                                            ))}
                                            {/* Placeholder locked achievements */}
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex flex-col items-center text-center p-3 bg-surface/20 rounded border border-border opacity-50 grayscale">
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2 text-muted-foreground">
                                                        <Lock size={20} />
                                                    </div>
                                                    <div className="font-bold font-mono text-xs text-muted-foreground">Bloqueado</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono mt-1">???</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <RewardModal onClose={() => setIsModalOpen(false)} onSubmit={createReward.mutate} />
            )}
        </div>
    );
}

 

function RewardModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (payload: Partial<Reward>) => void }) {
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVA RECOMPENSA</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Título (ex: Jantar fora)"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Pontos Necessários"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={points}
                        onChange={e => setPoints(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ title, points_required: Number(points) });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
