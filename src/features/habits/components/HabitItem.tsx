import { Check } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Habit } from '../types';
import { clsx } from 'clsx';

interface HabitItemProps {
    habit: Habit;
    completed: boolean;
    onToggle: () => void;
}

export function HabitItem({ habit, completed, onToggle }: HabitItemProps) {
    return (
        <Card className={clsx(
            "p-4 flex items-center justify-between transition-all duration-300",
            completed ? "bg-primary/10 border-primary/30" : "bg-card border-border hover:border-primary/50"
        )}>
            <div>
                <h3 className={clsx(
                    "font-mono font-bold text-lg",
                    completed ? "text-primary line-through opacity-70" : "text-foreground"
                )}>
                    {habit.title}
                </h3>
                {habit.description && (
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                        {habit.description}
                    </p>
                )}
            </div>

            <Button
                variant={completed ? "primary" : "outline"}
                size="icon"
                className={clsx(
                    "rounded-full w-12 h-12 border-2",
                    completed ? "bg-primary text-background border-primary" : "border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary"
                )}
                onClick={onToggle}
            >
                {completed ? <Check size={24} strokeWidth={3} /> : <div className="w-4 h-4 rounded-full bg-current opacity-20" />}
            </Button>
        </Card>
    );
}
