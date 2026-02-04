import React from 'react';

const SCHEDULE = [
    { day: 'Mon', code: 'CS 401', time: '10:00 AM - 11:30 AM', active: true },
    { day: 'Tue', code: 'MATH 302', time: '02:00 PM - 03:30 PM', active: false, opacity: 'opacity-60' },
    { day: 'Wed', code: 'CS 401', time: '10:00 AM - 11:30 AM', active: true },
    { day: 'Thu', code: 'ENG 201', time: '09:00 AM - 10:30 AM', active: false }
];

export const ScheduleWidget = () => {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 px-2">Lecture Schedule</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {SCHEDULE.map((slot, idx) => (
                    <div key={idx} className={`glass-panel p-4 min-w-[140px] rounded-lg ${slot.active ? 'border-t-4 border-primary' : ''} ${slot.opacity || ''}`}>
                        <p className="text-zinc-500 text-xs font-bold uppercase">{slot.day}</p>
                        <p className="text-white text-sm font-bold mt-2">{slot.code}</p>
                        <p className="text-zinc-400 text-[10px]">{slot.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
