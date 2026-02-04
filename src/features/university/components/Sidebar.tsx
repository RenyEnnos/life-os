import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="w-64 glass-panel m-4 rounded-xl flex flex-col justify-between p-6 h-[calc(100vh-2rem)]">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary size-10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">school</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-base font-bold leading-none">LifeOS</h1>
                        <p className="text-zinc-500 text-xs mt-1">University Edition</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-primary/20 text-primary cursor-pointer">
                        <span className="material-symbols-outlined fill-1">dashboard</span>
                        <p className="text-sm font-medium">Dashboard</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">book_4</span>
                        <p className="text-sm font-medium">Courses</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">assignment</span>
                        <p className="text-sm font-medium">Assignments</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">monitoring</span>
                        <p className="text-sm font-medium">Grades</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <p className="text-sm font-medium">Schedule</p>
                    </div>
                </nav>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all w-full">
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Log Out</span>
            </button>
        </aside>
    );
};
