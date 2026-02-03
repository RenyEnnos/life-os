import { Modal } from '@/shared/ui/Modal';
import { useUIStore } from '@/shared/stores/uiStore';
import { JournalEditor } from '@/features/journal/components/JournalEditor';
import { useJournal } from '@/features/journal/hooks/useJournal';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useHabits } from '@/features/habits/hooks/useHabits';
import type { JournalEntry, Task, Project } from '@/shared/types';

export function GlobalModalOrchestrator() {
    const { activeModal, modalData, closeModal } = useUIStore();
    const { createEntry, updateEntry } = useJournal();
    const { createTask, updateTask } = useTasks();
    const { createProject } = useProjects();
    const { createHabit } = useHabits();

    const handleJournalSave = async (data: Partial<JournalEntry>) => {
        try {
            const journalData = modalData as JournalEntry | null;
            if (journalData?.id) {
                await updateEntry.mutateAsync({ id: journalData.id, updates: data });
            } else {
                await createEntry.mutateAsync(data);
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save via orchestrator", error);
        }
    };

    const handleActionSave = async (data: Partial<Task>) => {
        try {
            const taskData = modalData as Task | null;
            if (taskData?.id) {
                await updateTask.mutateAsync({ id: taskData.id, updates: data });
            } else {
                await createTask.mutateAsync(data);
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save action via orchestrator", error);
        }
    };

    const handleMissionSave = async (data: Partial<Project>) => {
        try {
            await createProject.mutateAsync(data);
            closeModal();
        } catch (error) {
            console.error("Failed to save mission via orchestrator", error);
        }
    };

    const handleRitualSave = async (data: {
        title: string;
        description?: string;
        routine: 'morning' | 'afternoon' | 'evening' | 'any';
        type: 'binary' | 'numeric';
        goal: number;
    }) => {
        try {
            await createHabit.mutateAsync(data);
            closeModal();
        } catch (error) {
            console.error("Failed to save ritual via orchestrator", error);
        }
    };

    return (
        <>
            {/* Journal Modal */}
            <Modal
                open={activeModal === 'journal'}
                onClose={closeModal}
                title={modalData ? "Editar Entrada" : "Nova Entrada"}
                className="w-full h-full md:max-w-4xl md:h-[85vh] p-0 md:p-6"
            >
                {activeModal === 'journal' && (
                    <JournalEditor
                        entry={(modalData as JournalEntry | null) ?? undefined}
                        onSave={handleJournalSave}
                        onCancel={closeModal}
                    />
                )}
            </Modal>

            {/* Action (Task) Modal */}
            <Modal
                open={activeModal === 'action'}
                onClose={closeModal}
                title={modalData ? "Editar Ação" : "Nova Ação"}
                className="w-full md:max-w-2xl p-0"
            >
                {activeModal === 'action' && (
                    <div className="p-6">
                        <input
                            type="text"
                            placeholder="Título da tarefa"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono mb-4"
                            defaultValue={(modalData as Task | null)?.title}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    await handleActionSave({ title: (e.target as HTMLInputElement).value });
                                }
                            }}
                        />
                        <div className="flex gap-2">
                            <button onClick={closeModal} className="flex-1 bg-surface border border-border p-2 rounded text-foreground font-mono">CANCELAR</button>
                            <button onClick={async () => {
                                const input = document.querySelector('input[placeholder="Título da tarefa"]') as HTMLInputElement;
                                await handleActionSave({ title: input.value });
                            }} className="flex-1 bg-primary text-background p-2 rounded font-mono">SALVAR</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Mission (Project) Modal */}
            <Modal
                open={activeModal === 'mission'}
                onClose={closeModal}
                title="Nova Missão"
                className="w-full md:max-w-2xl p-0"
            >
                {activeModal === 'mission' && (
                    <div className="p-6">
                        <input
                            type="text"
                            placeholder="Nome do projeto"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono mb-4"
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    await handleMissionSave({ title: (e.target as HTMLInputElement).value, status: 'active' });
                                }
                            }}
                        />
                        <textarea
                            placeholder="Descrição e objetivos"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono h-24 resize-none mb-4"
                        />
                        <div className="flex gap-2">
                            <button onClick={closeModal} className="flex-1 bg-surface border border-border p-2 rounded text-foreground font-mono">CANCELAR</button>
                            <button onClick={async () => {
                                const input = document.querySelector('input[placeholder="Nome do projeto"]') as HTMLInputElement;
                                const textarea = document.querySelector('textarea[placeholder="Descrição e objetivos"]') as HTMLTextAreaElement;
                                await handleMissionSave({ title: input.value, description: textarea.value, status: 'active' });
                            }} className="flex-1 bg-primary text-background p-2 rounded font-mono">CRIAR</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Ritual (Habit) Modal */}
            <Modal
                open={activeModal === 'ritual'}
                onClose={closeModal}
                title="Novo Ritual"
                className="w-full md:max-w-2xl p-0"
            >
                {activeModal === 'ritual' && (
                    <div className="p-6">
                        <input
                            type="text"
                            placeholder="Nome do hábito"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono mb-4"
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    await handleRitualSave({ title: (e.target as HTMLInputElement).value, routine: 'any', type: 'binary', goal: 1 });
                                }
                            }}
                        />
                        <textarea
                            placeholder="Descrição"
                            className="w-full bg-surface border border-border rounded p-2 text-foreground font-mono h-16 resize-none mb-4"
                        />
                        <div className="flex gap-2">
                            <button onClick={closeModal} className="flex-1 bg-surface border border-border p-2 rounded text-foreground font-mono">CANCELAR</button>
                            <button onClick={async () => {
                                const input = document.querySelector('input[placeholder="Nome do hábito"]') as HTMLInputElement;
                                const textarea = document.querySelector('textarea[placeholder="Descrição"]') as HTMLTextAreaElement;
                                await handleRitualSave({ title: input.value, description: textarea.value, routine: 'any', type: 'binary', goal: 1 });
                            }} className="flex-1 bg-primary text-background p-2 rounded font-mono">CRIAR</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Search Modal */}
            <Modal
                open={activeModal === 'search'}
                onClose={closeModal}
                title="Buscar"
                className="w-full md:max-w-3xl p-0"
            >
                {activeModal === 'search' && (
                    <div className="p-6">
                        <input
                            type="text"
                            placeholder="Buscar tarefas, projetos, hábitos, finanças, diário..."
                            className="w-full bg-surface border border-border rounded p-3 text-foreground font-mono mb-4"
                            autoFocus
                        />
                        <div className="text-center text-muted-foreground py-8">
                            <p>Pressione Ctrl+K para abrir o comando</p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
