import { Command } from 'cmdk';
import { Search, Wallet, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSynapseStore } from '../../stores/synapseStore';
import { searchCommands, getStaticCommands } from '../../lib/synapse/commands';
import { SYNAPSE_GROUP_LABELS, SYNAPSE_GROUP_ORDER, SynapseCommand } from '../../lib/synapse/types';
import './synapse.css';

/**
 * Synapse Bar - Global Command Palette
 * 
 * The neural interface for Life OS. Accessible from anywhere via Cmd+K.
 * Follows "Glass & Void" design aesthetic.
 */
export function Synapse() {
    const navigate = useNavigate();
    const { isOpen, query, close, toggle, setQuery } = useSynapseStore();

    // Global keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    const handleSelect = useCallback((command: SynapseCommand) => {
        close();
        // Small delay to allow dialog to close before action
        requestAnimationFrame(() => {
            command.action();
        });
    }, [close]);

    // 1. Load static commands with navigation context
    const staticCommands = useMemo(() => getStaticCommands(navigate), [navigate]);

    // 2. Pattern Matching Logic (The "Brain")
    const dynamicCommand = useMemo(() => {
        const lowerQuery = query.toLowerCase().trim();

        // Regex for Quick Expense: "Gastei 50 em X" or just "50 em X"
        // Matches: "gastei 50", "paguei 100 no uber", "50.50 na amazon"
        // Captures: 1=Amount, 2=Category (optional)
        const expenseMatch = lowerQuery.match(/^(?:gastei|paguei)?\s*(\d+(?:[.,]\d+)?)(?:\s+(?:em|no|na)\s+(.*))?$/);

        // Check length > 2 to avoid matching single digits like "1" while typing
        if (expenseMatch && lowerQuery.length > 2) {
            const amount = expenseMatch[1].replace(',', '.');
            const category = expenseMatch[2] || 'Geral';

            return {
                id: 'quick-expense',
                label: `Registrar Gasto: R$ ${amount} (${category})`,
                description: 'Quick transaction via Regex Pattern',
                icon: Wallet,
                group: 'resources',
                shortcut: ['↵'],
                action: () => {
                    console.log(`[Synapse] Creating transaction: ${amount} in ${category}`);
                    // TODO: Connect to actual finance store when available
                    // useFinanceStore.getState().addTransaction(...)
                    navigate('/finances');
                }
            } as SynapseCommand;
        }

        // Regex for Quick Task: "Lembrar de X" or "Todo X"
        if (lowerQuery.startsWith('lembrar ') || lowerQuery.startsWith('todo ')) {
            // Remove prefix: "lembrar de ", "lembrar ", "todo "
            const taskTitle = lowerQuery.replace(/^(lembrar\s+(?:de\s+)?|todo\s+)/, '').trim();

            if (taskTitle) {
                return {
                    id: 'quick-task',
                    label: `Criar Tarefa: "${taskTitle}"`,
                    description: 'Quick task via Regex Pattern',
                    icon: CheckSquare,
                    group: 'actions',
                    shortcut: ['↵'],
                    action: () => {
                        console.log(`[Synapse] Creating task: ${taskTitle}`);
                        // TODO: Connect to actual task store
                        // useTasksStore.getState().addTask(...)
                        navigate('/tasks');
                    }
                } as SynapseCommand;
            }
        }

        return null;
    }, [query, navigate]);

    // Filter commands by query (passing the static list)
    const filteredStaticCommands = searchCommands(query, staticCommands);

    // Combine dynamic command with static results
    // Dynamic command always appears first if it exists
    const filteredCommands = dynamicCommand
        ? [dynamicCommand, ...filteredStaticCommands]
        : filteredStaticCommands;

    // Group commands by category (using the combined list)
    const groupedCommands = SYNAPSE_GROUP_ORDER.reduce((acc, group) => {
        const commands = filteredCommands.filter((cmd) => cmd.group === group);
        if (commands.length > 0) {
            acc[group] = commands;
        }
        return acc;
    }, {} as Record<string, SynapseCommand[]>);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="synapse-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={close}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            top: '25%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            maxWidth: '640px',
                            zIndex: 9999,
                            padding: '0 16px',
                        }}
                    >
                        <Command
                            className="synapse-dialog"
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    close();
                                }
                            }}
                        >
                            {/* Input */}
                            <div className="synapse-input-wrapper">
                                <Search size={18} className="synapse-input-icon" />
                                <Command.Input
                                    className="synapse-input"
                                    placeholder="Type a command or search..."
                                    value={query}
                                    onValueChange={setQuery}
                                    autoFocus
                                />
                            </div>

                            {/* List */}
                            <Command.List className="synapse-list">
                                <Command.Empty className="synapse-empty">
                                    No commands found. Try a different search.
                                </Command.Empty>

                                {Object.entries(groupedCommands).map(([group, commands]) => (
                                    <Command.Group
                                        key={group}
                                        heading={SYNAPSE_GROUP_LABELS[group as keyof typeof SYNAPSE_GROUP_LABELS]}
                                        className="synapse-group"
                                    >
                                        {commands.map((command) => (
                                            <Command.Item
                                                key={command.id}
                                                value={command.label}
                                                onSelect={() => handleSelect(command)}
                                                className="synapse-item"
                                            >
                                                {command.icon && (
                                                    <div className="synapse-item-icon">
                                                        <command.icon size={16} />
                                                    </div>
                                                )}
                                                <div className="synapse-item-content">
                                                    <div className="synapse-item-label">{command.label}</div>
                                                    {command.description && (
                                                        <div className="synapse-item-description">
                                                            {command.description}
                                                        </div>
                                                    )}
                                                </div>
                                                {command.shortcut && (
                                                    <div className="synapse-item-shortcut">
                                                        {command.shortcut.map((key, i) => (
                                                            <kbd key={i}>{key}</kbd>
                                                        ))}
                                                    </div>
                                                )}
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                ))}
                            </Command.List>

                            {/* Footer */}
                            <div className="synapse-footer">
                                <div className="synapse-footer-hints">
                                    <span className="synapse-footer-hint">
                                        <kbd>↑↓</kbd> Navigate
                                    </span>
                                    <span className="synapse-footer-hint">
                                        <kbd>↵</kbd> Select
                                    </span>
                                    <span className="synapse-footer-hint">
                                        <kbd>esc</kbd> Close
                                    </span>
                                </div>
                                <span>Synapse</span>
                            </div>
                        </Command>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Synapse;
