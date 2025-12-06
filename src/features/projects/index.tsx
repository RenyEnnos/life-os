import { useState } from 'react';
import { Plus, Target, Folder, Clock, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAI } from '@/hooks/useAI';
import { clsx } from 'clsx';
import type { Project } from '@/shared/types';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProjectModal } from './components/ProjectModal';
import { SwotAnalysis } from './components/SwotAnalysis';

export default function ProjectsPage() {
    const { projects, isLoading, createProject, deleteProject } = useProjects();
    const { generateSwot } = useAI();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [swotData, setSwotData] = useState<Record<string, any>>({});
    const [isGeneratingSwot, setIsGeneratingSwot] = useState(false);

    const handleGenerateSwot = async (project: Project) => {
        setIsGeneratingSwot(true);
        try {
            const result = await generateSwot.mutateAsync({
                context: `Project: ${project.title}\nDescription: ${project.description}\nStatus: ${project.status}`
            });
            if (result.swot) {
                setSwotData(prev => ({ ...prev, [project.id]: result.swot }));
            }
        } catch (error) {
            console.error('Failed to generate SWOT', error);
        } finally {
            setIsGeneratingSwot(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            deleteProject.mutate(id);
        }
    };

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'active': return 'text-blue-500 bg-blue-500/10';
            case 'completed': return 'text-green-500 bg-green-500/10';
            case 'on_hold': return 'text-yellow-500 bg-yellow-500/10';
            default: return 'text-muted-foreground bg-muted/10';
        }
    };

    const getPriorityIcon = (priority: Project['priority']) => {
        switch (priority) {
            case 'high': return <AlertCircle size={14} className="text-red-500" />;
            case 'medium': return <Clock size={14} className="text-yellow-500" />;
            case 'low': return <CheckCircle2 size={14} className="text-blue-500" />;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <PageTitle
                title="PROJETOS"
                subtitle="Gestão estratégica e análise de viabilidade."
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus size={18} />
                        NOVO PROJETO
                    </Button>
                }
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader text="LOADING PROJECTS..." />
                </div>
            ) : (
                <>
                    {(!projects || projects.length === 0) ? (
                        <EmptyState
                            icon={Target}
                            title="SEM PROJETOS"
                            description="Nenhum projeto ativo. Defina seus objetivos estratégicos."
                            action={
                                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                                    <Plus size={16} /> CRIAR PROJETO
                                </Button>
                            }
                        />
                    ) : (
                        <div className="grid gap-6">
                            {projects.map((project: Project) => (
                                <Card key={project.id} className={clsx(
                                    "p-6 border-border bg-card transition-all duration-300",
                                    selectedProject === project.id ? "ring-1 ring-primary shadow-[0_0_20px_rgba(13,242,13,0.1)]" : "hover:border-primary/30"
                                )}>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold font-mono text-foreground">{project.title}</h3>
                                                        <span className={clsx("px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider", getStatusColor(project.status))}>
                                                            {project.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm max-w-2xl">{project.description}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleGenerateSwot(project)}
                                                        disabled={isGeneratingSwot}
                                                        className="gap-2"
                                                    >
                                                        <Zap size={14} className={isGeneratingSwot ? "animate-pulse" : ""} />
                                                        ANÁLISE SWOT
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(project.id)}
                                                        className="text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Target size={16} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    {getPriorityIcon(project.priority)}
                                                    <span className="uppercase">{project.priority} PRIORITY</span>
                                                </div>
                                                {project.deadline && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={14} />
                                                        <span>DUE: {new Date(project.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {swotData[project.id] && (
                                                <div className="mt-6 pt-6 border-t border-border">
                                                    <SwotAnalysis swot={swotData[project.id]} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            {isModalOpen && (
                <ProjectModal onClose={() => setIsModalOpen(false)} onSubmit={createProject.mutate} />
            )}
        </div>
    );
}
