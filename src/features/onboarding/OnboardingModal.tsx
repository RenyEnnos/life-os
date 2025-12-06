import { useState } from 'react';
import { Check, ArrowRight, Target, Heart, DollarSign } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'welcome' | 'focus' | 'ready';

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [step, setStep] = useState<Step>('welcome');
    const [focus, setFocus] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 'welcome') setStep('focus');
        else if (step === 'focus') setStep('ready');
        else onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg p-0 overflow-hidden border-primary/50 shadow-[0_0_50px_rgba(13,242,13,0.1)]">
                <div className="p-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                <div className="p-8">
                    {step === 'welcome' && (
                        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                                <div className="w-12 h-12 bg-primary rounded-sm animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-mono font-bold text-primary tracking-widest">LIFE OS v1.0</h2>
                                <p className="text-muted-foreground font-mono">Sistema Operacional Pessoal.</p>
                            </div>
                            <p className="text-sm font-mono text-foreground/80 leading-relaxed">
                                Painel de controle centralizado. Interface brutalista para gestão de alta performance.
                            </p>
                            <Button onClick={handleNext} className="w-full gap-2 group">
                                INICIAR SETUP <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    )}

                    {step === 'focus' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-mono font-bold text-foreground">DEFINIR FOCO PRIMÁRIO</h2>
                                <p className="text-xs font-mono text-muted-foreground">Personalização inicial do ambiente.</p>
                            </div>

                            <div className="grid gap-3">
                                <button
                                    onClick={() => setFocus('productivity')}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded border transition-all text-left group",
                                        focus === 'productivity'
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-surface border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="p-2 bg-background rounded border border-current">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-sm">PRODUTIVIDADE</div>
                                        <div className="font-mono text-[10px] opacity-70">Execução e Rotinas</div>
                                    </div>
                                    {focus === 'productivity' && <Check size={16} className="ml-auto" />}
                                </button>

                                <button
                                    onClick={() => setFocus('health')}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded border transition-all text-left group",
                                        focus === 'health'
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-surface border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="p-2 bg-background rounded border border-current">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-sm">BIO-RITMO</div>
                                        <div className="font-mono text-[10px] opacity-70">Métricas Biológicas</div>
                                    </div>
                                    {focus === 'health' && <Check size={16} className="ml-auto" />}
                                </button>

                                <button
                                    onClick={() => setFocus('finances')}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded border transition-all text-left group",
                                        focus === 'finances'
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-surface border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="p-2 bg-background rounded border border-current">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-sm">CAPITAL</div>
                                        <div className="font-mono text-[10px] opacity-70">Gestão de Recursos</div>
                                    </div>
                                    {focus === 'finances' && <Check size={16} className="ml-auto" />}
                                </button>
                            </div>

                            <Button onClick={handleNext} disabled={!focus} className="w-full">
                                CONFIRMAR
                            </Button>
                        </div>
                    )}

                    {step === 'ready' && (
                        <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                <Check size={32} className="text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-mono font-bold text-foreground">SISTEMA INICIALIZADO</h2>
                                <p className="text-muted-foreground font-mono">Ambiente configurado e pronto para uso.</p>
                            </div>

                            <div className="bg-surface p-4 rounded border border-border text-left space-y-2">
                                <p className="font-mono text-xs text-muted-foreground uppercase">PROTOCOLOS INICIAIS:</p>
                                <ul className="space-y-2 font-mono text-sm">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        Definir primeiro Hábito
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        Registrar Tarefa prioritária
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        Analisar Dashboard
                                    </li>
                                </ul>
                            </div>

                            <Button onClick={onClose} className="w-full" size="lg">
                                ACESSAR TERMINAL
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-surface p-2 flex justify-center gap-1 border-t border-border">
                    <div className={cn("w-2 h-2 rounded-full transition-colors", step === 'welcome' ? "bg-primary" : "bg-border")} />
                    <div className={cn("w-2 h-2 rounded-full transition-colors", step === 'focus' ? "bg-primary" : "bg-border")} />
                    <div className={cn("w-2 h-2 rounded-full transition-colors", step === 'ready' ? "bg-primary" : "bg-border")} />
                </div>
            </Card>
        </div>
    );
}
