import React, { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Sparkles, ArrowRight, Loader } from 'lucide-react';
import { aiApi } from '@/features/ai-assistant/api/ai.api';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useToast } from '@/shared/ui/useToast';
import type { Task } from '@/shared/types';

export function QuickCapture() {
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const { createTask } = useTasks();
    const { showToast } = useToast();

    const handleCapture = async () => {
        if (!input.trim()) return;

        setIsThinking(true);
        try {
            const parsed = await aiApi.parseTask(input);
            const taskData: Partial<Task> = {
                title: parsed.title || input,
                description: parsed.description,
                due_date: parsed.due_date || new Date().toISOString(),
                priority: parsed.priority || 'medium',
                tags: parsed.tags || [],
                energy_level: parsed.energy_level,
                time_block: parsed.time_block
            };

            await createTask.mutateAsync(taskData);
            showToast('Task captured!', 'success');
            setInput('');
        } catch (error) {
            console.error('Quick Capture Error:', error);
            showToast('Failed to capture task.', 'error');
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCapture();
        }
    };

    return (
        <Card className="p-1 glass-panel border-purple-500/20 bg-purple-900/5">
            <div className="relative flex items-center">
                <div className="absolute left-3 text-purple-400 animate-pulse-slow">
                    {isThinking ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} />}
                </div>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI to capture task... (e.g. 'Email John tomorrow at 2pm')"
                    className="w-full bg-transparent border-none text-white placeholder-zinc-500 py-3 pl-10 pr-12 focus:ring-0 focus:outline-none text-sm"
                    disabled={isThinking}
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 w-8 h-8 rounded-full hover:bg-purple-500/20 text-purple-300"
                    onClick={handleCapture}
                    disabled={!input.trim() || isThinking}
                >
                    <ArrowRight size={16} />
                </Button>
            </div>
        </Card>
    );
}
