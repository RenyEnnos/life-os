import React from 'react';
import { useUniversity } from '../hooks/useUniversity';
import { useGradeCalculation } from '../hooks/useGradeCalculation';
import { TrendingUp, Award, BarChart3, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export const GradeAnalytics = () => {
    const { assignments, courses, isLoading } = useUniversity();
    const { calculateGlobalGPA, calculateCourseGrade } = useGradeCalculation(assignments);

    const gpa = calculateGlobalGPA();
    
    // Performance label based on GPA
    const getPerformanceInfo = (val: number) => {
        if (val >= 9.0) return { label: 'Excelente', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
        if (val >= 7.5) return { label: 'Bom', color: 'text-primary', bg: 'bg-primary/10' };
        if (val >= 6.0) return { label: 'Satisfatório', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
        return { label: 'Atenção', color: 'text-red-400', bg: 'bg-red-500/10' };
    };

    const performance = getPerformanceInfo(gpa);

    if (isLoading) {
        return <div className="space-y-6 animate-pulse">
            <div className="h-48 bg-zinc-900/50 rounded-2xl" />
            <div className="h-64 bg-zinc-900/50 rounded-2xl" />
        </div>;
    }

    return (
        <section className="space-y-6">
            {/* GPA Card */}
            <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden shadow-2xl border-white/5 bg-zinc-950/40">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award size={80} className="text-primary" />
                </div>
                
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] mb-4">Média Global (GPA)</p>
                <h2 className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">
                    {gpa > 0 ? gpa.toFixed(1) : '—'}
                </h2>
                
                <div className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-6 border border-white/5",
                    performance.color,
                    performance.bg
                )}>
                    {gpa > 0 ? (
                        <>
                            <TrendingUp size={12} />
                            <span>{performance.label}</span>
                        </>
                    ) : (
                        <span>Nenhuma nota registrada</span>
                    )}
                </div>
            </div>

            {/* Course Averages Panel */}
            <div className="glass-panel p-6 rounded-3xl border-white/5 bg-zinc-950/40">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="text-primary" size={18} />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Desempenho por Matéria</h4>
                    </div>
                </div>

                <div className="space-y-5">
                    {!courses?.length ? (
                        <div className="py-8 text-center text-zinc-600 text-xs italic">
                            Adicione matérias para ver estatísticas
                        </div>
                    ) : (
                        courses.slice(0, 5).map(course => {
                            const grade = calculateCourseGrade(course.id);
                            return (
                                <div key={course.id} className="space-y-2 group">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                        <span className="text-zinc-400 group-hover:text-white transition-colors truncate max-w-[140px]">{course.name}</span>
                                        <span className={cn(
                                            "font-mono",
                                            grade && grade >= 7 ? "text-emerald-400" : "text-primary"
                                        )}>
                                            {grade ? grade.toFixed(1) : '—'}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                            style={{ 
                                                width: `${grade ? (grade / 10) * 100 : 0}%`,
                                                backgroundColor: course.color || '#3b82f6'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {courses.length > 5 && (
                    <button className="w-full text-center text-zinc-600 text-[10px] font-bold uppercase mt-6 hover:text-primary transition-colors">
                        Ver todas as {courses.length} matérias
                    </button>
                )}
            </div>

            {/* Advice/Action Card */}
            <div className="glass-panel p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4 group hover:bg-primary/10 transition-all cursor-help">
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">Dica Acadêmica</p>
                    <p className="text-zinc-500 text-[10px] leading-relaxed">
                        Mantenha uma média acima de 8.5 para se qualificar para programas de intercâmbio.
                    </p>
                </div>
            </div>
        </section>
    );
};
