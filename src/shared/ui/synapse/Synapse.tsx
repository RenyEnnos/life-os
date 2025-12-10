import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import { useSynapseStore } from '../../stores/synapseStore';
import { searchCommands } from '../../lib/synapse/commands';
import { SYNAPSE_GROUP_LABELS, SYNAPSE_GROUP_ORDER, SynapseCommand } from '../../lib/synapse/types';
import './synapse.css';

/**
 * Synapse Bar - Global Command Palette
 * 
 * The neural interface for Life OS. Accessible from anywhere via Cmd+K.
 * Follows "Glass & Void" design aesthetic.
 */
export function Synapse() {
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

    // Filter commands by query
    const filteredCommands = searchCommands(query);

    // Group commands by category
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
