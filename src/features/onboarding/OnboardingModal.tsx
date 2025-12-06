import { useState } from 'react';
import { Check, ArrowRight, Target, Heart, DollarSign, Quote } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';
import { CreateHabitForm } from '@/features/habits/components/CreateHabitForm';
import { CreateTaskForm } from '@/features/tasks/components/CreateTaskForm';
import { TransactionForm } from '@/features/finances/components/TransactionForm';
import { useHabits } from '@/features/habits/hooks/useHabits';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useTransactions } from '@/features/finances/hooks/useTransactions';
import { useOnboardingStore } from '@/shared/stores/onboardingStore';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'welcome' | 'focus' | 'habit' | 'task' | 'finance' | 'ready';

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [step, setStep] = useState<Step>('welcome');
    const [focus, setFocus] = useState<string | null>(null);

    const { createHabit } = useHabits();
    const { createTask } = useTasks();
    const { createTransaction } = useTransactions();
    const { completeOnboarding } = useOnboardingStore();

    if (!isOpen) return null;

    const next = () => {
        const flow: Step[] = ['welcome', 'focus', 'habit', 'task', 'finance', 'ready'];
        const idx = flow.indexOf(step);
        if (idx < flow.length - 1) setStep(flow[idx + 1]);
        else onClose(); // Fallback
    };

    const skipStep = () => next();

    const handleComplete = () => {
        completeOnboarding();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <Card className="w-full max-w-lg p-0 overflow-hidden border-primary/50 shadow-[0_0_50px_rgba(13,242,13,0.15)] bg-background">
                <div className="p-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* Header Pagers */}
                    <div className="flex justify-center gap-1 mb-6">
                        {['welcome', 'focus', 'habit', 'task', 'finance', 'ready'].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    s === step ? "bg-primary w-6" :
                                        (['welcome', 'focus', 'habit', 'task', 'finance', 'ready'].indexOf(s) < ['welcome', 'focus', 'habit', 'task', 'finance', 'ready'].indexOf(step)) ? "bg-primary/50" : "bg-border"
                                )}
                            />
                        ))}
                    </div>

                    {step === 'welcome' && (
                        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 ring-4 ring-primary/5">
                                <span className="text-4xl">🚀</span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-mono font-bold text-primary tracking-widest">LIFE OS</h2>
                                <p className="text-muted-foreground font-mono text-sm tracking-wider uppercase">Sistema Operacional Pessoal</p>
                            </div>
                            <p className="text-base font-sans text-foreground/80 leading-relaxed max-w-sm mx-auto">
                                Assuma o controle. Centralize sua vida, hábitos e finanças em uma interface de alta performance.
                            </p>
                            <Button onClick={next} className="w-full gap-2 group py-6 text-lg">
                                INICIAR CONFIGURAÇÃO <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    )}

                    {step === 'focus' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-mono font-bold text-foreground">DEFINIR FOCO PRIMÁRIO</h2>
                                <p className="text-xs font-mono text-muted-foreground uppercase">Qual área precisa de mais atenção agora?</p>
                            </div>

                            <div className="grid gap-3">
                                {[
                                    { id: 'productivity', icon: Target, label: 'PRODUTIVIDADE', sub: 'Execução e Rotinas' },
                                    { id: 'health', icon: Heart, label: 'BIO-RITMO', sub: 'Métricas Biológicas' },
                                    { id: 'finances', icon: DollarSign, label: 'CAPITAL', sub: 'Gestão de Recursos' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setFocus(item.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded border transition-all text-left group hover:shadow-lg hover:shadow-primary/5",
                                            focus === item.id
                                                ? "bg-primary/10 border-primary text-primary shadow-inner"
                                                : "bg-surface border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded border border-current", focus === item.id ? "bg-primary text-background" : "bg-background")}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-sm">{item.label}</div>
                                            <div className="font-mono text-[10px] opacity-70">{item.sub}</div>
                                        </div>
                                        {focus === item.id && <Check size={16} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>

                            <Button onClick={next} disabled={!focus} className="w-full py-6">
                                CONFIRMAR
                            </Button>
                        </div>
                    )}

                    {step === 'habit' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-mono font-bold text-primary">QUICK WIN: HÁBITO</h2>
                                <p className="text-xs text-muted-foreground">Pequenos passos constantes.</p>
                            </div>
                            <div className="bg-surface/50 p-4 rounded-lg border border-border">
                                <CreateHabitForm
                                    onSubmit={(data) => {
                                        createHabit.mutate(data);
                                        next();
                                    }}
                                    onCancel={() => { }} // decoupled
                                />
                            </div>
                            <div className="text-center">
                                <button onClick={skipStep} className="text-xs text-muted-foreground hover:text-foreground underline decoration-dashed">
                                    Pular por enquanto
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'task' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-mono font-bold text-primary">QUICK WIN: TAREFA</h2>
                                <p className="text-xs text-muted-foreground">O que não pode ser esquecido hoje?</p>
                            </div>
                            <div className="bg-surface/50 p-4 rounded-lg border border-border">
                                <CreateTaskForm
                                    onSubmit={(data) => {
                                        createTask.mutate(data);
                                        next();
                                    }}
                                    onCancel={() => { }} // decoupled
                                />
                            </div>
                            <div className="text-center">
                                <button onClick={skipStep} className="text-xs text-muted-foreground hover:text-foreground underline decoration-dashed">
                                    Pular por enquanto
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'finance' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-mono font-bold text-primary">QUICK WIN: FINANÇAS</h2>
                                <p className="text-xs text-muted-foreground">Registre sua última movimentação.</p>
                            </div>
                            <div className="bg-surface/50 p-4 rounded-lg border border-border">
                                <TransactionForm
                                    onSubmit={(data) => {
                                        createTransaction.mutate(data);
                                        next();
                                    }}
                                    onCancel={skip}
                                />
                            </div>
                            <div className="text-center">
                                <button onClick={skip} className="text-xs text-muted-foreground hover:text-foreground underline decoration-dashed">
                                    Pular por enquanto
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'ready' && (
                        <div className="space-y-8 text-center animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/20 shadow-2xl shadow-green-500/10">
                                <Check size={48} className="text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-mono font-bold text-foreground">SISTEMA ONLINE</h2>
                                <p className="text-muted-foreground font-mono">Você está no comando agora.</p>
                            </div>

                            <div className="bg-surface p-6 rounded-lg border border-border text-left relative overflow-hidden group">
                                <Quote className="absolute top-2 right-2 text-primary/5 opacity-50 w-24 h-24 rotate-12" />
                                <p className="font-serif italic text-muted-foreground relative z-10">
                                    "A simplicidade é o último grau de sofisticação."
                                </p>
                                <p className="text-right text-xs font-mono mt-2 text-primary opacity-70">— Leonardo da Vinci</p>
                            </div>

                            <Button onClick={handleComplete} className="w-full py-6 text-lg font-bold tracking-widest" size="lg">
                                ACESSAR TERMINAL
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
