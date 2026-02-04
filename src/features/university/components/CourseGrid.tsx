import React from 'react';

// Mocks - in a real app these would come from props or a query
const COURSES = [
    {
        id: '1',
        name: 'Advanced Algorithms',
        grade: 'A-',
        nextEvent: 'Exam Oct 30',
        icon: 'data_object',
        gradient: 'from-blue-500 to-indigo-600',
        alt: 'Abstract blue geometric pattern for algorithms'
    },
    {
        id: '2',
        name: 'System Design',
        grade: 'B+',
        nextEvent: 'Project Due Nov 2',
        icon: 'account_tree',
        gradient: 'from-emerald-500 to-teal-600',
        alt: 'Abstract green geometric pattern for system design'
    }
];

export const CourseGrid = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-bold text-white">Course Grid</h3>
                <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {COURSES.map(course => (
                    <div key={course.id} className="glass-panel p-5 rounded-lg flex gap-5">
                        <div className={`size-24 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center`} data-alt={course.alt}>
                            <span className="material-symbols-outlined text-4xl text-white/50">{course.icon}</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="text-lg font-bold text-white">{course.name}</h4>
                                <p className="text-primary font-semibold text-sm">Grade: {course.grade}</p>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                <span className="material-symbols-outlined text-sm">event</span>
                                <span>Next: {course.nextEvent}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
