import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav } from '@/app/layout/navItems';
import { useUniversity } from './hooks/useUniversity';
import { CreateCourseModal } from './components/CreateCourseModal';
import type { Assignment, Course } from './types';
import { cn } from '@/shared/lib/cn';
import { Loader } from '@/shared/ui/Loader';

const profileAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI";

const materialIconByPath: Record<string, string> = {
    '/': 'grid_view',
    '/tasks': 'check_circle',
    '/calendar': 'calendar_month',
    '/habits': 'timer',
    '/health': 'monitor_heart',
    '/finances': 'show_chart',
    '/projects': 'folder_open',
    '/journal': 'menu_book',
    '/rewards': 'emoji_events',
    '/university': 'school',
    '/settings': 'settings',
};

const formatCourseCode = (course: Course) => course.id?.toUpperCase() || 'COURSE';

const averageGrade = (courses: Course[]) => {
    if (!courses.length) return 0;
    const total = courses.reduce((acc, c) => acc + (c.grade || 0), 0);
    return Number((total / courses.length).toFixed(2));
};

const columns = [
    { key: 'todo', title: 'To Do', accent: 'text-zinc-500', pill: 'bg-zinc-900 border border-zinc-800' },
    { key: 'in_progress', title: 'In Progress', accent: 'text-accent-knowledge', pill: 'bg-accent-knowledge/10 border border-accent-knowledge/10' },
    { key: 'submitted', title: 'Submitted', accent: 'text-accent-success', pill: 'bg-zinc-900 border border-zinc-800' },
] as const;

export default function UniversityPage() {
    const { courses, assignments, addCourse, removeCourse, isLoading } = useUniversity();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const displayCourses = useMemo(() => courses, [courses]);
    const displayAssignments = useMemo(() => assignments, [assignments]);
    const gpa = averageGrade(displayCourses);

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden">
            <div className="fixed top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-[#8b5cf6]/10 blur-[150px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[0%] w-[600px] h-[600px] rounded-full bg-[#f59e0b]/10 blur-[120px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">


                <main className="flex-1 h-full overflow-y-auto relative p-4 lg:p-10 flex flex-col gap-8 scroll-smooth">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader text="CARREGANDO PAINEL ACADÊMICO..." />
                        </div>
                    ) : (
                        <>
                            <header className="w-full max-w-7xl mx-auto flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase mb-1">Academic Dashboard</h2>
                                    <h1 className="text-4xl font-light text-white tracking-tight">Overview</h1>
                                </div>
                                <div className="hidden md:flex items-center gap-3">
                                    <div className="px-4 py-2 rounded-full bg-glass-surface backdrop-blur-xl border border-white/10 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-zinc-300">Semester Active</span>
                                    </div>
                                    <button
                                        className="px-4 py-2 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/30 text-xs font-medium hover:bg-[#8b5cf6]/20 transition-colors"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Add Course
                                    </button>
                                </div>
                            </header>

                            <section className="w-full max-w-7xl mx-auto">
                                <div className="glass-card rounded-3xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 lg:p-10 flex flex-col md:flex-row gap-8 lg:gap-16 items-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/10 blur-[80px] rounded-full pointer-events-none" />
                                    <div className="flex-shrink-0 relative z-10 flex flex-col justify-center items-start">
                                        <span className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Cumulative Performance</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-7xl lg:text-8xl font-thin tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{gpa.toFixed(1)}</span>
                                            <span className="text-xl font-light text-zinc-400">GPA</span>
                                        </div>
                                        <div className="mt-4 flex gap-4 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> Top 5%</span>
                                            <span className="flex items-center gap-1">{displayCourses.length} Courses</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full z-10">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-sm font-light text-zinc-300">What-If Analysis <span className="text-zinc-600 mx-2">|</span> <span className="text-xs text-zinc-500">Grade Simulator</span></h3>
                                            <button
                                                className="md:hidden text-xs text-[#8b5cf6] border border-[#8b5cf6]/30 px-3 py-1 rounded-full"
                                                onClick={() => setIsModalOpen(true)}
                                            >
                                                Simulate
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            {displayCourses.slice(0, 4).map((course) => (
                                                <div key={course.id} className="grid grid-cols-[80px_1fr_50px] gap-4 items-center">
                                                    <span className="text-xs font-medium text-zinc-400">{formatCourseCode(course)}</span>
                                                    <input
                                                        className="w-full accent-[#8b5cf6]"
                                                        max={100}
                                                        min={0}
                                                        type="range"
                                                        defaultValue={Math.round((course.grade || 0) * 10)}
                                                    />
                                                    <span className="text-xs font-mono text-white text-right">{Math.round((course.grade || 0) * 10)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="w-full max-w-7xl mx-auto">
                                <div className="flex justify-between items-end mb-6 px-2">
                                    <h2 className="text-sm font-light text-zinc-400 uppercase tracking-widest">Knowledge Modules</h2>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                        </button>
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">list</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:pb-0 lg:overflow-visible">
                                    {displayCourses.map((course) => (
                                        <div key={course.id} className="glass-card p-6 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 flex flex-col gap-4 min-w-[260px] snap-center hover:border-white/20 transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-medium text-zinc-400 tracking-wider">
                                                    {formatCourseCode(course)}
                                                </div>
                                                <div className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ backgroundColor: course.color || '#8b5cf6', opacity: 0.75 }} />
                                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: course.color || '#8b5cf6' }} />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <h3 className="text-lg font-light text-white leading-tight">{course.name}</h3>
                                                <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wide">Next: Upcoming Topic</p>
                                            </div>
                                            <div className="mt-auto pt-4">
                                                <div className="flex justify-between text-[10px] text-zinc-400 mb-2">
                                                    <span>Progress</span>
                                                    <span>{Math.round((course.grade || 0) * 10)}%</span>
                                                </div>
                                                <div className="w-full h-[3px] bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${Math.min(100, Math.round((course.grade || 0) * 10))}%`, backgroundColor: course.color || '#8b5cf6' }} />
                                                </div>
                                            </div>
                                            {courses.length > 0 && (
                                                <button
                                                    className="text-[11px] text-zinc-600 hover:text-red-400 text-left transition-colors"
                                                    onClick={() => removeCourse(course.id)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="w-full max-w-7xl mx-auto flex-1 pb-10">
                                <div className="flex justify-between items-end mb-6 px-2">
                                    <h2 className="text-sm font-light text-zinc-400 uppercase tracking-widest">Active Workflow</h2>
                                    <button
                                        className="text-xs text-[#8b5cf6] border border-[#8b5cf6]/30 px-3 py-1 rounded-full hover:bg-[#8b5cf6]/10 transition-colors"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Add Course
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                    {columns.map((col) => (
                                        <div key={col.key} className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between px-2 mb-2">
                                                <span className={cn("text-xs font-medium uppercase tracking-wider", col.accent)}>{col.title}</span>
                                                <span className={cn("text-[10px] px-2 py-0.5 rounded", col.pill)}>{
                                                    displayAssignments.filter((a) => a.status === col.key).length
                                                }</span>
                                            </div>
                                            {displayAssignments.filter((a) => a.status === col.key).map((assignment) => (
                                                <div
                                                    key={assignment.id}
                                                    className={cn(
                                                        "kanban-card bg-zinc-900/50 p-4 rounded-xl border cursor-pointer transition-all duration-300",
                                                        col.key === 'in_progress' ? "border-[#8b5cf6]/30 bg-[#8b5cf6]/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]" : "border-white/5"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className={cn(
                                                            "text-[10px] uppercase px-1.5 py-0.5 rounded",
                                                            col.key === 'in_progress'
                                                                ? "text-[#8b5cf6] bg-[#8b5cf6]/10 border border-[#8b5cf6]/20"
                                                                : "text-zinc-500 bg-zinc-800/50"
                                                        )}>
                                                            {assignment.type}
                                                        </span>
                                                        <span className="material-symbols-outlined text-zinc-600 text-[16px]">more_horiz</span>
                                                    </div>
                                                    <h4 className={cn(
                                                        "text-sm font-normal mb-3",
                                                        col.key === 'submitted' ? "text-zinc-400 line-through decoration-zinc-600" : "text-white"
                                                    )}>
                                                        {assignment.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-[10px]">
                                                        {col.key === 'submitted' ? (
                                                            <div className="flex items-center gap-1.5 text-accent-success">
                                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                                <span className="font-medium uppercase">Graded</span>
                                                            </div>
                                                        ) : (
                                                            <div className={cn(
                                                                "flex items-center gap-1.5",
                                                                col.key === 'in_progress' ? "text-[#f59e0b]" : "text-zinc-500"
                                                            )}>
                                                                <span className="material-symbols-outlined text-[14px]">
                                                                    {col.key === 'in_progress' ? 'schedule' : 'calendar_today'}
                                                                </span>
                                                                <span className="font-medium uppercase">{assignment.due_date || 'Soon'}</span>
                                                            </div>
                                                        )}
                                                        <div className="w-px h-3 bg-zinc-800" />
                                                        <span className="text-[10px] text-zinc-500">{assignment.course_id?.toUpperCase()}</span>
                                                    </div>
                                                    {col.key === 'in_progress' && (
                                                        <div className="mt-3 w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                                            <div className="bg-[#8b5cf6] h-full w-1/2" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>

            {isModalOpen && (
                <CreateCourseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(course) => {
                        addCourse(course);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
