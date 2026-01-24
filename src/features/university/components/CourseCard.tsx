import { useRef } from 'react';
import { MagicCard } from '@/shared/ui/premium/MagicCard';
import { BorderBeam } from '@/shared/ui/premium/BorderBeam';
import { Course } from '../types';
import { Clock, GraduationCap, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';
import { AnimatedCircularProgressBar } from '@/shared/ui/premium/AnimatedCircularProgressBar';

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
    onDelete?: (id: string) => void;
}

export function CourseCard({ course, onClick, onDelete }: CourseCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Mock progress calculation
    const progress = 75;

    return (
        <div ref={cardRef} className="h-full relative group">
            <div className="absolute inset-0 z-0 rounded-xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <BorderBeam
                    size={200}
                    duration={8}
                    delay={2}
                    colorFrom={course.color || '#3b82f6'}
                    colorTo={course.color ? `${course.color}00` : '#3b82f600'}
                />
            </div>

            <MagicCard
                className="h-full p-0 overflow-hidden cursor-pointer relative z-10"
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
                                    aria-label="Excluir curso"
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
                                <span className='line-clamp-1'>{course.schedule || 'Horário indefinido'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-xs text-zinc-500 font-mono text-left">PROGRESSO</div>
                            <div className="text-lg font-bold text-white">{progress}%</div>
                        </div>
                        <div className="h-12 w-12">
                            <AnimatedCircularProgressBar
                                max={100}

                                value={progress}
                                gaugePrimaryColor={course.color || '#3b82f6'}
                                gaugeSecondaryColor="rgba(255,255,255,0.1)"
                            />
                        </div>
                    </div>
                </div>
            </MagicCard>
        </div>
    );
}
