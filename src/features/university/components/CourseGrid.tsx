import { useState } from 'react';
import { useUniversity } from '../hooks/useUniversity';
import { useGradeCalculation } from '../hooks/useGradeCalculation';
import { CreateCourseModal } from './CreateCourseModal';
import { CourseCard } from './CourseCard';
import { Plus, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const CourseGrid = () => {
    const { courses, assignments, addCourse, removeCourse, isLoading } = useUniversity();
    const { calculateProgress } = useGradeCalculation(assignments);
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
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            progress={calculateProgress(course.id)}
                            onDelete={removeCourse}
                        />
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
