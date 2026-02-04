import React from 'react';

const ASSIGNMENTS = [
    {
        id: '1',
        title: 'Read Chapter 4: Graph Theory',
        course: 'Advanced Algorithms',
        priority: 'High Priority',
        priorityColor: 'text-primary/80',
        barColor: 'bg-primary',
        action: 'Study Now',
        actionStyle: 'bg-primary/10 text-primary'
    },
    {
        id: '2',
        title: 'Submit P-Set 3',
        course: 'Discrete Mathematics',
        priority: 'Due Tomorrow',
        priorityColor: 'text-red-400/80',
        barColor: 'bg-zinc-700',
        action: 'Mark Done',
        actionStyle: 'bg-zinc-800 text-zinc-400'
    }
];

export const AssignmentList = () => {
    return (
        <section className="col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-white">Assignments</h3>
                <span className="text-zinc-500 text-xs">Pending ({ASSIGNMENTS.length})</span>
            </div>
            <div className="glass-panel rounded-lg overflow-hidden">
                {ASSIGNMENTS.map((assignment, index) => (
                    <div key={assignment.id} className={`flex items-center justify-between p-4 ${index !== ASSIGNMENTS.length - 1 ? 'border-b border-white/5' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-1 h-10 ${assignment.barColor} rounded-full`}></div>
                            <div>
                                <h5 className="text-white font-medium">{assignment.title}</h5>
                                <p className="text-zinc-500 text-xs">{assignment.course} • <span className={`${assignment.priorityColor} font-medium`}>{assignment.priority}</span></p>
                            </div>
                        </div>
                        <button className={`px-4 py-2 ${assignment.actionStyle} text-xs font-bold rounded-full`}>{assignment.action}</button>
                    </div>
                ))}
            </div>
        </section>
    );
};
