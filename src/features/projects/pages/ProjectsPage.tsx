import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectModal } from '../components/ProjectModal';
import { Loader } from '@/shared/ui/Loader';
import type { Project } from '@/shared/types';

const STATUS_COLUMNS: { key: Project['status']; label: string }[] = [
  { key: 'active', label: 'To Do / Active' },
  { key: 'on_hold', label: 'On Hold' },
  { key: 'completed', label: 'Done' },
];

const PRIORITY_COLORS: Record<Project['priority'], string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-orange-500/20 text-orange-400',
  low: 'bg-green-500/20 text-green-400',
};

export const ProjectsPage = () => {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived'>('active');
  const [view, setView] = useState<'board' | 'list'>('board');

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <Loader text="LOADING PROJECTS..." />
      </div>
    );
  }

  const allProjects = projects || [];
  const filteredProjects = statusFilter === 'active'
    ? allProjects.filter(p => p.status !== 'completed')
    : allProjects.filter(p => p.status === 'completed');

  const getColumnProjects = (status: Project['status']) =>
    filteredProjects.filter(p => p.status === status);

  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      <div className="flex h-screen w-full">
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="p-8 pb-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-black tracking-tight">Projects</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setView(v => v === 'board' ? 'list' : 'board')}
                  className="flex items-center justify-center rounded-xl h-10 px-4 bg-[#293038] text-white text-sm font-bold hover:bg-[#343d47] transition-colors"
                >
                  <span className="material-symbols-outlined mr-2 text-sm">filter_list</span>
                  {view === 'board' ? 'List View' : 'Board View'}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
                >
                  <span className="material-symbols-outlined mr-2 text-sm">add</span>
                  New Project
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex gap-8">
                <button
                  onClick={() => setView('board')}
                  className={`flex flex-col items-center justify-center border-b-[3px] gap-1 pb-3 px-2 transition-colors ${view === 'board' ? 'border-primary text-white' : 'border-transparent text-[#9dabb8] hover:text-white'}`}
                >
                  <span className="material-symbols-outlined" style={view === 'board' ? { fontVariationSettings: "'FILL' 1" } : {}}>view_column</span>
                  <p className="text-sm font-bold tracking-tight">Board</p>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex flex-col items-center justify-center border-b-[3px] gap-1 pb-3 px-2 transition-colors ${view === 'list' ? 'border-primary text-white' : 'border-transparent text-[#9dabb8] hover:text-white'}`}
                >
                  <span className="material-symbols-outlined">format_list_bulleted</span>
                  <p className="text-sm font-bold tracking-tight">List</p>
                </button>
              </div>
              <div className="flex h-10 w-48 items-center justify-center rounded-xl bg-[#18181b] p-1 border border-white/5">
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${statusFilter === 'active' ? 'bg-[#293038] text-white' : 'text-[#9dabb8] hover:text-white'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('archived')}
                  className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-xs font-bold transition-colors ${statusFilter === 'archived' ? 'bg-[#293038] text-white' : 'text-[#9dabb8] hover:text-white'}`}
                >
                  Archived
                </button>
              </div>
            </div>
          </header>

          {view === 'board' ? (
            <section className="flex-1 flex gap-6 p-8 pt-2 overflow-x-auto custom-scrollbar">
              {STATUS_COLUMNS.map(col => {
                const colProjects = getColumnProjects(col.key);
                return (
                  <div key={col.key} className="min-w-[320px] flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#9dabb8]">
                        {col.label} ({colProjects.length})
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      {colProjects.map(project => (
                        <div
                          key={project.id}
                          className="p-4 rounded-xl glass-effect bg-glass-card border border-white/5 hover:border-white/20 cursor-pointer group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_COLORS[project.priority]}`}>
                              {project.priority}
                            </span>
                            <button
                              onClick={() => deleteProject.mutate(project.id)}
                              className="material-symbols-outlined text-transparent group-hover:text-white/40 text-sm transition-colors"
                            >
                              delete
                            </button>
                          </div>
                          <h4 className={`text-white font-semibold mb-2 ${project.status === 'completed' ? 'line-through decoration-white/20' : ''}`}>
                            {project.title}
                          </h4>
                          {project.description && (
                            <p className="text-[#9dabb8] text-xs mb-2 line-clamp-2">{project.description}</p>
                          )}
                          {project.deadline && (
                            <div className="flex items-center gap-2 text-[#9dabb8]">
                              <span className="material-symbols-outlined text-xs">calendar_month</span>
                              <span className="text-[11px]">Due {new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            {project.status !== 'active' && (
                              <button
                                onClick={() => updateProject.mutate({ id: project.id, updates: { status: 'active' } })}
                                className="text-[10px] text-primary hover:underline"
                              >
                                Mark Active
                              </button>
                            )}
                            {project.status !== 'completed' && (
                              <button
                                onClick={() => updateProject.mutate({ id: project.id, updates: { status: 'completed' } })}
                                className="text-[10px] text-green-400 hover:underline"
                              >
                                Complete
                              </button>
                            )}
                            {project.status !== 'on_hold' && (
                              <button
                                onClick={() => updateProject.mutate({ id: project.id, updates: { status: 'on_hold' } })}
                                className="text-[10px] text-orange-400 hover:underline"
                              >
                                Hold
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {colProjects.length === 0 && (
                        <div className="py-10 text-center border border-dashed border-white/5 rounded-xl">
                          <p className="text-[#9dabb8] text-xs">No projects</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          ) : (
            <section className="flex-1 p-8 pt-2 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-3">
                {filteredProjects.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-[#9dabb8] text-sm">No projects found</p>
                  </div>
                )}
                {filteredProjects.map(project => (
                  <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl glass-effect bg-glass-card border border-white/5 hover:border-white/20 group">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_COLORS[project.priority]}`}>
                      {project.priority}
                    </span>
                    <h4 className={`flex-1 text-white font-semibold ${project.status === 'completed' ? 'line-through decoration-white/20' : ''}`}>
                      {project.title}
                    </h4>
                    {project.deadline && (
                      <span className="text-[11px] text-[#9dabb8]">Due {new Date(project.deadline).toLocaleDateString()}</span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#9dabb8] uppercase">{project.status}</span>
                    <button
                      onClick={() => deleteProject.mutate(project.id)}
                      className="material-symbols-outlined text-transparent group-hover:text-white/40 text-sm transition-colors"
                    >
                      delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {isModalOpen && (
        <ProjectModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {
            createProject.mutate(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
