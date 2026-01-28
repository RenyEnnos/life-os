import { Modal } from '@/shared/ui/Modal';
import { useUIStore } from '@/shared/stores/uiStore';
import { JournalEditor } from '@/features/journal/components/JournalEditor';
import { useJournal } from '@/features/journal/hooks/useJournal';
import type { JournalEntry } from '@/shared/types';

export function GlobalModalOrchestrator() {
    const { activeModal, modalData, closeModal } = useUIStore();
    const { createEntry, updateEntry } = useJournal();

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

            {/* TODO: Implement other modals */}
            {/* <Modal open={activeModal === 'action'} onClose={closeModal}>
                <ActionEditor onSave={...} onCancel={closeModal} />
            </Modal> */}
        </>
    );
}
