import React, { useState } from 'react';
import { useUniversity } from '../hooks/useUniversity';
import { CreateCourseModal } from './CreateCourseModal';
import { Plus, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const CourseGrid = () => {
    const { courses, addCourse, isLoading } = useUniversity();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return <div className="animate-pulse grid grid-cols-2 gap-6">
            {[1, 2].map(i => <div key={i} className="h-32 bg-zinc-900/50 rounded-lg" />)}
        </div>;
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <GraduationCap className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-white">Minhas Matérias</h3>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-2"
                >
                    <Plus size={16} /> Adicionar Matéria
                </Button>
            </div>

            {!courses?.length ? (
                <div className="glass-panel p-12 rounded-2xl border-dashed flex flex-col items-center justify-center text-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p className="text-white font-medium">Nenhuma matéria cadastrada</p>
                        <p className="text-zinc-500 text-sm mt-1">Comece adicionando suas matérias do semestre.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="mt-2">ADICIONAR PRIMEIRA MATÉRIA</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="glass-panel p-5 rounded-2xl flex gap-5 group hover:border-primary/30 transition-all duration-300">
                            <div 
                                className="size-24 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg"
                                style={{ backgroundColor: `${course.color}20` }}
                            >
                                <div 
                                    className="absolute inset-0 opacity-20"
                                    style={{ backgroundColor: course.color }}
                                />
                                <BookOpen className="relative z-10" size={32} style={{ color: course.color }} />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{course.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-primary font-mono text-sm font-bold">
                                            {course.grade ? `Média: ${course.grade.toFixed(1)}` : 'Sem nota'}
                                        </span>
                                        {course.professor && (
                                            <>
                                                <span className="text-zinc-700">•</span>
                                                <span className="text-zinc-500 text-xs truncate max-w-[120px]">{course.professor}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
                                    <Calendar size={12} className="text-zinc-600" />
                                    <span>{course.schedule || 'Horário não definido'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateCourseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={addCourse}
            />
        </section>
    );
};
