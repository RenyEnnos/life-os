import React, { useRef, useEffect } from 'react';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { Course } from '../types';
import { Book, Clock, GraduationCap, Trash2 } from 'lucide-react';
// @ts-ignore
import anime from 'animejs';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
    onDelete?: (id: string) => void;
}

export function CourseCard({ course, onClick, onDelete }: CourseCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Mock progress calculation
    const progress = 75;

    useEffect(() => {
        if (progressRef.current) {
            anime({
                targets: progressRef.current,
                width: [`0%`, `${progress}%`],
                duration: 1200,
                easing: 'easeOutQuart',
                delay: 400
            });
        }
    }, [progress]);

    return (
        <div ref={cardRef} className="h-full">
            <MagicCard
                className="h-full p-0 overflow-hidden cursor-pointer group"
                gradientColor={course.color || '#3b82f6'}
                onClick={onClick}
            >
                {/* Color accents */}
                <div className="absolute top-0 left-0 w-full h-1 z-10" style={{ backgroundColor: course.color }} />

                <div className="p-6 relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1" title={course.name}>
                            {course.name}
                        </h3>

                        <div className="flex gap-2 items-center">
                            {course.grade !== undefined && (
                                <div className={cn(
                                    "px-2 py-1 rounded text-xs font-bold font-mono border",
                                    course.grade >= 7
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                )}>
                                    Média: {course.grade}
                                </div>
                            )}

                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(course.id);
                                    }}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                                <GraduationCap size={16} className="text-zinc-600" />
                                <span className='line-clamp-1'>{course.professor || 'Sem Professor'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-zinc-600" />
                                <span>{course.schedule || 'Horário indefinido'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-1">
                        <div className="flex justify-between text-xs text-zinc-500 font-mono">
                            <span>PROGRESSO</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                ref={progressRef}
                                className="h-full rounded-full"
                                style={{ backgroundColor: course.color || '#3b82f6', width: '0%' }}
                            />
                        </div>
                    </div>
                </div>
            </MagicCard>
        </div>
    );
}
