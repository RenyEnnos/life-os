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

        // -------------------------------------------------------------
        // EXPENSE PATTERN
        // Matches: "50 no almoço", "gastei 100 uber", "12.50 coxinhas"
        // -------------------------------------------------------------

        // Regex explanation:
        // ^(?:gastei|paguei)?  -> Optional prefix "gastei" or "paguei" (non-capturing)
        // \s*                  -> Optional spaces
        // (\d+(?:[.,]\d+)?)    -> Capture Group 1: Amount (integers or decimals with . or ,)
        // (?:                  -> Optional Description Group
        //   \s+                -> Required space before description
        //   (?:em|no|na)?      -> Optional preposition "em", "no", "na" (non-capturing)
        //   \s*                -> Optional space
        //   (.*)               -> Capture Group 2: The rest is the category/description
        // )?
        const expenseRegex = /^(?:gastei|paguei)?\s*(\d+(?:[.,]\d+)?)(?:\s+(?:em|no|na)?\s*(.*))?$/;
        const expenseMatch = lowerQuery.match(expenseRegex);

        // Guard: Check length > 2 to avoid triggering on "1" or "10" unless strictly formatted? 
        // Actually "50" is valid, but maybe wait for at least 2 digits or a space?
        // Let's stick to user plan: length > 1 for just number, but usually we want at least a description for context.
        // For now, allow just number if length > 1 (e.g. "12") but prioritize description if present.

        if (expenseMatch && lowerQuery.length > 1) {
            // Additional check: If query is just a number, ensure it's not part of a task like "10 commandments"
            // But Expense takes priority if it starts with number.

            const amount = expenseMatch[1].replace(',', '.');
            const description = expenseMatch[2]?.trim() || 'Geral';

            // If just a number, maybe show generic "Quick Expense"
            // If has description, show fully formatted.

            // Guard: If it looks like a year "2024" or small number "1", maybe skip? 
            // Let's trust the Regex.

            return {
                id: 'quick-expense',
                label: `Registrar: R$ ${amount} (${description})`,
                description: 'Despesa Rápida',
                icon: Wallet,
                group: 'resources',
                shortcut: ['↵'],
                action: () => {
                    console.log(`[Synapse] Creating transaction: ${amount} in ${description}`);
                    // TODO: Connect to finance store
                    navigate('/finances');
                }
            } as SynapseCommand;
        }

        // -------------------------------------------------------------
        // TASK PATTERN
        // Matches: "lembrar de comprar leite", "comprar pão", "todo estudar"
        // -------------------------------------------------------------

        // We want to detect INTENT to capture a task.
        // If it starts with a verb or "todo", it's a task.
        // But also generic text might be a task? 
        // For now, let's keep it slightly structured to avoid noise, OR allow "todo " prefix.
        // AND if it doesn't match commands, maybe show "Create Task: ..." as a fallback?

        // Let's support explicit prefixes + fallback

        const taskPrefixRegex = /^(lembrar\s+(?:de\s+)?|todo\s+|tarefa\s+)/;
        const hasTaskPrefix = taskPrefixRegex.test(lowerQuery);

        // If it has a prefix, definitely a task.
        if (hasTaskPrefix) {
            const taskTitle = lowerQuery.replace(taskPrefixRegex, '').trim();
            if (taskTitle) {
                return {
                    id: 'quick-task',
                    label: `Capturar: "${taskTitle}"`,
                    description: 'Nova Tarefa',
                    icon: CheckSquare,
                    group: 'actions',
                    shortcut: ['↵'],
                    action: () => {
                        console.log(`[Synapse] Creating task: ${taskTitle}`);
                        // TODO: Connect to task store
                        navigate('/tasks');
                    }
                } as SynapseCommand;
            }
        }

        // Fallback for "implicit" task? 
        // If it's not an expense, and not a matching command, and length > 3...
        // Maybe later. For now stick to plan: relaxed regex.

        return null; // Return null if matches nothing
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
