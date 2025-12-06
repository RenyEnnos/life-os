import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Course } from '../types';
import { Book, Clock, GraduationCap } from 'lucide-react';
import { animate } from 'animejs';
import { cn } from '@/shared/lib/cn';

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Mock progress calculation (since we might not have all assignments loaded here yet)
    // In a real app, this would be passed down or calculated from a store
    const progress = 75; // Example: 75% complete

    useEffect(() => {
        // Animate card entry
        if (cardRef.current) {
            animate(cardRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                ease: 'outExpo', // v4 syntax uses 'ease' not 'easing' usually, and names might differ. 'outExpo' is standard.
                delay: 100 // simplified delay
            });
        }

        // Animate progress bar
        if (progressRef.current) {
            animate(progressRef.current, {
                width: [`0%`, `${progress}%`],
                duration: 1200,
                ease: 'outQuart',
                delay: 400
            });
        }
    }, [progress]);

    return (
        <div ref={cardRef}>
            <Card
                className={cn(
                    "cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden",
                    "bg-zinc-900/50 border-zinc-800"
                )}
                onClick={onClick}
            >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: course.color }} />

                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                            {course.name}
                        </CardTitle>
                        {course.grade !== undefined && (
                            <div className={cn(
                                "px-2 py-1 rounded text-xs font-bold font-mono",
                                course.grade >= 7 ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                            )}>
                                Avg: {course.grade}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <GraduationCap size={16} />
                            <span>{course.professor || 'No Professor'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{course.schedule || 'Top Deadline'}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                ref={progressRef}
                                className="h-full rounded-full"
                                style={{ backgroundColor: course.color || '#3b82f6', width: '0%' }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
