import { useState } from 'react';
import { Plus, Trash2, Folder, Target, Shield, Zap, AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/hooks/useProjects';
import { useAI } from '@/hooks/useAI';
import { clsx } from 'clsx';

export default function ProjectsPage() {
    const { projects, isLoading, createProject, deleteProject } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="PROJETOS & ESTRATÉGIA"
                subtitle="Gestão estratégica e análise SWOT."
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus size={18} />
                        NOVO PROJETO
                    </Button>
                }
            />

            {isLoading ? (
                <div className="text-center py-20 text-muted-foreground font-mono animate-pulse">
                    CARREGANDO PROJETOS...
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Projects List */}
                    <div className="md:col-span-1 space-y-4">
                        {!projects?.length ? (
                            <EmptyState
                                icon={Target}
                                title="SEM PROJETOS"
                                description="Nenhum projeto estratégico definido. Inicie o planejamento."
                                action={
                                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                                        <Plus size={16} /> NOVO PROJETO
                                    </Button>
                                }
                            />
                        ) : (
                            projects.map((p: any) => (
                                <div
                                    key={p.id}
                                    className={clsx(
                                        "p-4 rounded border cursor-pointer transition-all",
                                        selectedProject === p.id
                                            ? "bg-primary/10 border-primary"
                                            : "bg-card border-border hover:border-primary/50"
                                    )}
                                    onClick={() => setSelectedProject(p.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Folder size={20} className={selectedProject === p.id ? "text-primary" : "text-muted-foreground"} />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Excluir projeto?')) deleteProject.mutate(p.id);
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                    <h3 className="font-bold font-mono text-foreground">{p.name}</h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-1 line-clamp-2">{p.description}</p>
                                    <div className="flex gap-2 mt-3">
                                        {p.area_of_life && (
                                            <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted-foreground uppercase border border-border">
                                                {p.area_of_life}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* SWOT Analysis Area */}
                    <div className="md:col-span-2">
                        {selectedProject ? (
                            <SwotAnalysis projectId={selectedProject} projectName={projects.find((p: any) => p.id === selectedProject)?.name} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground font-mono border border-dashed border-border rounded-lg p-10 bg-card/50">
                                <Target size={48} className="mb-4 opacity-20" />
                                <p>Nenhum projeto selecionado. Carregue um contexto.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ProjectModal onClose={() => setIsModalOpen(false)} onSubmit={createProject.mutate} />
            )}
        </div>
    );
}

function SwotAnalysis({ projectId, projectName }: { projectId: string, projectName: string }) {
    const { useSwot } = useProjects();
    const { swot, loadingSwot, addSwot, deleteSwot } = useSwot(projectId);
    const { generateSwot } = useAI();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateSwot = async () => {
        setIsGenerating(true);
        try {
            const result = await generateSwot.mutateAsync({ context: `Project: ${projectName}` });
            if (result.swot) {
                Object.entries(result.swot).forEach(([category, items]) => {
                    // Map AI keys to our keys (strengths -> strength)
                    const map: Record<string, string> = {
                        strengths: 'strength',
                        weaknesses: 'weakness',
                        opportunities: 'opportunity',
                        threats: 'threat'
                    };
                    const mappedCategory = map[category];
                    if (mappedCategory && Array.isArray(items)) {
                        items.forEach((content: string) => {
                            addSwot.mutate({ category: mappedCategory, content });
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Failed to generate SWOT', error);
            alert('Falha ao gerar SWOT com IA. Verifique os logs.');
        } finally {
            setIsGenerating(false);
        }
    };

    const quadrants = [
        { id: 'strength', title: 'FORÇAS', icon: <Shield size={18} className="text-green-500" />, color: 'border-green-500/20 bg-green-500/5' },
        { id: 'weakness', title: 'FRAQUEZAS', icon: <AlertTriangle size={18} className="text-red-500" />, color: 'border-red-500/20 bg-red-500/5' },
        { id: 'opportunity', title: 'OPORTUNIDADES', icon: <Zap size={18} className="text-yellow-500" />, color: 'border-yellow-500/20 bg-yellow-500/5' },
        { id: 'threat', title: 'AMEAÇAS', icon: <AlertTriangle size={18} className="text-orange-500" />, color: 'border-orange-500/20 bg-orange-500/5' },
    ];

    return (
        <Card className="p-6 border-border bg-card h-full">
            <h3 className="font-mono font-bold text-lg mb-6 flex items-center gap-2">
                <Target size={20} className="text-primary" />
                ANÁLISE SWOT: {projectName}
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto gap-2 text-xs"
                    onClick={handleGenerateSwot}
                    disabled={isGenerating}
                >
                    <Zap size={14} className={isGenerating ? "animate-pulse" : ""} />
                    {isGenerating ? 'GERANDO...' : 'GERAR COM IA'}
                </Button>
            </h3>

            {loadingSwot ? (
                <div className="text-center py-10 animate-pulse">CARREGANDO MATRIZ...</div>
            ) : (
                <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)]">
                    {quadrants.map(q => (
                        <div key={q.id} className={clsx("p-4 rounded border flex flex-col", q.color)}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 font-mono font-bold text-sm">
                                    {q.icon}
                                    {q.title}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                        const content = prompt(`Adicionar ${q.title}:`);
                                        if (content) addSwot.mutate({ category: q.id, content });
                                    }}
                                >
                                    <Plus size={14} />
                                </Button>
                            </div>
                            <div className="space-y-2 flex-1 overflow-y-auto">
                                {swot?.filter((s: any) => s.category === q.id).map((item: any) => (
                                    <div key={item.id} className="group flex items-start justify-between text-xs font-mono bg-background/50 p-2 rounded border border-transparent hover:border-border">
                                        <span>{item.content}</span>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive ml-2"
                                            onClick={() => deleteSwot.mutate(item.id)}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}

function ProjectModal({ onClose, onSubmit }: any) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [area, setArea] = useState('Pessoal');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm p-6 bg-background border-primary/20">
                <h3 className="font-bold font-mono text-lg mb-4 text-primary">NOVO PROJETO</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome do Projeto"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <textarea
                        placeholder="Descrição / Objetivo"
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono h-24 resize-none"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <select
                        className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono"
                        value={area}
                        onChange={e => setArea(e.target.value)}
                    >
                        <option value="Pessoal">Pessoal</option>
                        <option value="Profissional">Profissional</option>
                        <option value="Acadêmico">Acadêmico</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Financeiro">Financeiro</option>
                    </select>
                    <div className="flex gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">CANCELAR</Button>
                        <Button onClick={() => {
                            onSubmit({ name, description, area_of_life: area, active: true });
                            onClose();
                        }} className="flex-1">SALVAR</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
