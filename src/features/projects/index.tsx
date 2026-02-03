import { useState } from 'react';
import { Plus, Target, Clock, Search, Bell, BarChart3 } from 'lucide-react';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAI } from '@/features/ai-assistant/hooks/useAI';
import { clsx } from 'clsx';
import type { Project } from '@/shared/types';
import { Loader } from '@/shared/ui/Loader';
import { ProjectModal } from './components/ProjectModal';
import { SwotAnalysis } from './components/SwotAnalysis';

import { format } from 'date-fns';

type SwotResult = {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
};

export default function ProjectsPage() {
    const { projects, isLoading, createProject, deleteProject } = useProjects();
    const { generateSwot } = useAI();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [swotData, setSwotData] = useState<Record<string, SwotResult>>({});

    const handleGenerateSwot = async (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        try {
            const result = await generateSwot.mutateAsync({
                context: `Project: ${project.title}\nDescription: ${project.description}\nStatus: ${project.status}`
            });
            if (result.swot) {
                const swot = result.swot as SwotResult;
                setSwotData(prev => ({ ...prev, [project.id]: swot }));
                setSelectedProject(project.id); // Open/expand card to show SWOT if we had that UI
            }
        } catch (error) {
            console.error('Failed to generate SWOT', error);
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            deleteProject.mutate(id);
        }
    };

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case 'active': return 'text-primary bg-primary/10 border-primary/20';
            case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'on_hold': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
        }
    };

    const getStatusDot = (status: Project['status']) => {
        switch (status) {
            case 'active': return 'bg-primary';
            case 'completed': return 'bg-emerald-400';
            case 'on_hold': return 'bg-amber-400';
            default: return 'bg-zinc-400';
        }
    };

    const getGradient = (index: number) => {
        const gradients = [
            'bg-emerald-500/20', // active-like
            'bg-amber-500/10',   // hold-like
            'bg-purple-500/15',  // planning-like
            'bg-[#308ce8]/20',   // primary-like
        ];
        return gradients[index % gradients.length];
    };

    // Calculate progress based on deadline ... simple heuristic for now as we lack task data linked here
    const calculateProgress = (project: Project) => {
        if (project.status === 'completed') return 100;
        if (project.status === 'on_hold') return 25;
        // Random deterministic progress based on ID length for demo visual if real data missing
        return (project.id.charCodeAt(0) + project.title.length * 5) % 100;
    };

    return (
        <div className="flex-1 h-full overflow-y-auto relative flex flex-col pb-20">
            {/* Background Effects */}
            <div className="fixed top-[-20%] left-[20%] w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0"></div>

            <header className="w-full px-6 lg:px-10 pt-8 pb-4 flex items-end justify-between animate-enter z-20">
                <div>
                    <h2 className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mb-1">Workspace</h2>
                    <h1 className="text-3xl font-light text-white tracking-tight">Projects Portfolio</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                        <span className="text-xs text-zinc-400">System Healthy</span>
                    </div>
                    <button className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Bell size={20} />
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center py-20 z-10">
                    <Loader text="LOADING PORTFOLIO..." />
                </div>
            ) : (
                <>
                    {/* Timeline Section */}
                    <section className="w-full px-6 lg:px-10 mb-8 animate-enter animate-enter-delay-1 z-10">
                        <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl overflow-hidden relative">
                            <div className="md:hidden p-6 flex flex-col gap-4">
                                <h3 className="text-sm text-zinc-400 uppercase tracking-wider">Timeline Summary</h3>
                                <div className="space-y-3">
                                    {(projects || []).slice(0, 3).map(p => (
                                        <div key={p.id} className="flex justify-between items-center">
                                            <span className="text-zinc-300 text-sm truncate max-w-[150px]">{p.title}</span>
                                            <span className={clsx("text-xs px-2 py-0.5 rounded-full border", getStatusColor(p.status))}>
                                                {p.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden md:block h-32 w-full overflow-x-auto custom-scrollbar relative">
                                <div className="min-w-[800px] h-full p-4 relative">
                                    <div className="flex w-full border-b border-white/5 pb-2 mb-3">
                                        <div className="w-1/3 text-xs text-zinc-500 font-medium uppercase tracking-wide">Previous</div>
                                        <div className="w-1/3 text-xs text-zinc-500 font-medium uppercase tracking-wide pl-4 border-l border-white/5">Current Month</div>
                                        <div className="w-1/3 text-xs text-zinc-500 font-medium uppercase tracking-wide pl-4 border-l border-white/5">Next Month</div>
                                    </div>

                                    <div className="absolute top-10 bottom-0 left-[33.33%] w-px bg-white/5"></div>
                                    <div className="absolute top-10 bottom-0 left-[66.66%] w-px bg-white/5"></div>
                                    <div className="absolute top-0 bottom-0 left-[18%] w-[1px] bg-indigo-500 shadow-[0_0_10px_#6366f1] z-10">
                                        <div className="absolute top-0 -translate-x-1/2 -mt-1 bg-indigo-500 text-[9px] text-white px-1.5 rounded-sm font-bold">TODAY</div>
                                    </div>

                                    <div className="space-y-3 relative z-0">
                                        {(projects || []).slice(0, 3).map((project, idx) => {
                                            const progress = calculateProgress(project);
                                            // Randomize position/width for visual demo if no date data
                                            const left = 5 + (idx * 15);
                                            const width = 20 + (idx * 5);

                                            return (
                                                <div key={project.id} className="relative w-full h-4 flex items-center">
                                                    <div
                                                        className="absolute h-2 rounded-full bg-gradient-to-r from-primary/50 to-primary shadow-glow hover:h-2.5 transition-all cursor-pointer group"
                                                        style={{ left: `${left}%`, width: `${width}%` }}
                                                    >
                                                        <div className="absolute -top-5 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white bg-zinc-800 px-2 py-1 rounded border border-white/10 whitespace-nowrap z-20">
                                                            {project.title} • {progress}%
                                                        </div>
                                                    </div>
                                                    <span className="absolute text-[10px] text-zinc-500 truncate max-w-[100px]" style={{ left: `${left + width + 1}%` }}>
                                                        {project.title}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Projects Grid */}
                    <section className="flex-1 w-full px-6 lg:px-10 pb-10 animate-enter animate-enter-delay-2 z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(projects || []).map((project, idx) => {
                                const progress = calculateProgress(project);
                                const gradient = getGradient(idx);

                                return (
                                    <div
                                        key={project.id}
                                        onClick={() => setSelectedProject(project.id)}
                                        className="group relative flex flex-col h-64 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl overflow-hidden cursor-pointer hover:-translate-y-4 hover:border-white/30 hover:shadow-2xl transition-all duration-500"
                                    >
                                        <div className="project-cover h-1/2 w-full relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 transition-all duration-500">
                                            <div className={clsx("absolute w-40 h-40 blur-[60px] rounded-full", gradient, idx % 2 === 0 ? "top-[-20%] right-[-20%]" : "top-[-10%] left-[-10%]")}></div>
                                            <div className="absolute top-4 left-4">
                                                <span className={clsx("backdrop-blur-md border px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5", getStatusColor(project.status))}>
                                                    <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", getStatusDot(project.status))}></span>
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            {/* Delete Action (Hidden by default, show on hover) */}
                                            <button
                                                onClick={(e) => handleDelete(e, project.id)}
                                                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-red-500/20 text-white/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete Project"
                                            >
                                                <Target size={14} />
                                            </button>
                                        </div>

                                        <div className="h-1/2 p-5 flex flex-col justify-between relative bg-zinc-900/10">
                                            <div>
                                                <h3 className="text-lg font-medium text-zinc-100 tracking-tight mb-1 group-hover:text-primary transition-colors truncate">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                    <Clock size={14} />
                                                    <span>
                                                        {project.deadline
                                                            ? `Due ${format(new Date(project.deadline), 'MMM dd')}`
                                                            : 'No deadline'}
                                                    </span>
                                                    {/* SWOT Trigger */}
                                                    <button
                                                        onClick={(e) => handleGenerateSwot(e, project)}
                                                        className="ml-auto hover:text-primary transition-colors flex items-center gap-1"
                                                    >
                                                        <BarChart3 size={12} /> SWOT
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="w-full relative pt-4">
                                                <div className="w-full h-[1px] bg-zinc-800 overflow-hidden">
                                                    <div
                                                        className={clsx("h-full transition-all duration-1000", idx === 0 ? "bg-emerald-500 group-hover:animate-progress" : "bg-primary")}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="absolute bottom-[-2px] right-0 text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                                                    {progress}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* New Initiative Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="h-64 rounded-2xl border border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center gap-3 text-zinc-600 transition-all duration-300 hover:border-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/50 group"
                            >
                                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 group-hover:bg-zinc-800/50 transition-all">
                                    <Plus size={24} />
                                </div>
                                <span className="text-sm font-medium tracking-tight">New Initiative</span>
                            </button>
                        </div>
                    </section>
                </>
            )}

            {isModalOpen && (
                <ProjectModal onClose={() => setIsModalOpen(false)} onSubmit={createProject.mutate} />
            )}

            {/* SWOT Modal/Overlay can be added here if needed, or displayed within card expansion */}
            {selectedProject && swotData[selectedProject] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedProject(null)}>
                    <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 className="text-primary" />
                                Analysis: {projects?.find(p => p.id === selectedProject)?.title}
                            </h3>
                            <button onClick={() => setSelectedProject(null)} className="text-zinc-400 hover:text-white">✕</button>
                        </div>
                        <SwotAnalysis swot={swotData[selectedProject]} />
                    </div>
                </div>
            )}
        </div>
    );
}
