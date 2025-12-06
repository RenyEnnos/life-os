import { useState } from 'react';
import { CourseCard } from './components/CourseCard';
import { AssignmentKanban } from './components/AssignmentKanban';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { CreateCourseModal } from './components/CreateCourseModal';
import { useUniversity } from './hooks/useUniversity';
import { Button } from '@/shared/ui/Button';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Plus } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/shared/ui/premium/BentoGrid';
import { Course } from './types';

export default function UniversityPage() {
    const { courses, assignments, addCourse, removeCourse, isLoading } = useUniversity();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddCourse = (newCourse: Omit<Course, 'id' | 'user_id'>) => {
        addCourse(newCourse);
    };

    return (
        <div className="space-y-8 pb-20 fade-in animate-in duration-500">
            <PageTitle
                title="UNIVERSIDADE"
                subtitle="Acompanhe notas, entregas e progresso acadêmico."
                action={
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary text-black hover:bg-primary/90">
                        <Plus size={18} />
                        ADICIONAR MATÉRIA
                    </Button>
                }
            />

            <CreateCourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddCourse}
            />

            {/* Courses Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight">Semestre Atual</h2>
                </div>

                {!isLoading && courses.length > 0 ? (
                    <BentoGrid className="auto-rows-[180px]">
                        {courses.map((course, i) => (
                            <BentoGridItem
                                key={course.id}
                                className={i === 0 || i === 3 ? "md:col-span-2" : ""}
                            >
                                <CourseCard course={course} onDelete={() => removeCourse(course.id)} />
                            </BentoGridItem>
                        ))}
                    </BentoGrid>
                ) : (
                    !isLoading && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                            <p className="text-zinc-500 mb-2">Nenhuma matéria adicionada.</p>
                            <Button variant="link" onClick={() => setIsModalOpen(true)} className="text-primary">Adicione sua primeira matéria</Button>
                        </div>
                    )
                )}
            </section>

            {/* Assignment Kanban */}
            <section className="h-[500px]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight">Quadro de Entregas</h2>
                    <span className="text-xs text-zinc-500 font-mono">*Demonstrativo (funcionalidade em desenvolvimento)</span>
                </div>
                <AssignmentKanban assignments={assignments} />
            </section>

            {/* What-If Simulator */}
            <section className="max-w-xl mx-auto pb-10">
                <WhatIfSimulator courses={courses} />
            </section>
        </div>
    );
}
