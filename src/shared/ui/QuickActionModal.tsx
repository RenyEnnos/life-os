import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Book, ListTodo, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';

const springTransition = {
    type: "spring" as const,
    damping: 20,
    stiffness: 300,
    mass: 0.8
};

interface QuickActionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QuickActionModal({ isOpen, onClose }: QuickActionModalProps) {
    const navigate = useNavigate();

    const handleAction = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        transition={springTransition}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={springTransition}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[70] w-full max-w-sm px-4"
                    >
                        <div className="bg-surface/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-lg font-bold text-white mb-6 text-center font-mono tracking-wider">
                                NOVA AÇÃO
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <MagneticButton
                                    onClick={() => handleAction('/tasks?action=create')}
                                    className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary p-4 rounded-xl flex items-center justify-center gap-3 group"
                                >
                                    <ListTodo className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">NOVA TAREFA</span>
                                </MagneticButton>

                                <MagneticButton
                                    onClick={() => handleAction('/habits?action=create')}
                                    className="w-full bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary p-4 rounded-xl flex items-center justify-center gap-3 group"
                                >
                                    <CheckSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">NOVO HÁBITO</span>
                                </MagneticButton>

                                <MagneticButton
                                    onClick={() => handleAction('/journal?action=create')}
                                    className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 p-4 rounded-xl flex items-center justify-center gap-3 group"
                                >
                                    <Book className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">NOVO DIÁRIO</span>
                                </MagneticButton>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
