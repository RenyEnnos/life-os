import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav } from '@/app/layout/navItems';

const materialIconByPath: Record<string, string> = {
    '/': 'grid_view',
    '/tasks': 'check_circle',
    '/calendar': 'timer',
    '/habits': 'timer',
    '/health': 'monitor_heart',
    '/finances': 'show_chart',
    '/projects': 'folder_open',
    '/journal': 'menu_book',
    '/rewards': 'emoji_events',
    '/university': 'school',
    '/settings': 'settings',
};

export default function DashboardPage() {
    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-zinc-200 font-display selection:bg-primary/30 selection:text-white">
            {/* Decorative Glows */}
            <div className="fixed top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col w-24 h-full border-r border-white/5 bg-zinc-900/20 backdrop-blur-xl py-8 items-center gap-8 z-20">
                    <div className="mb-4">
                        <NavLink
                            to="/"
                            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/10 shadow-lg hover:border-primary/40 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white/80" style={{ fontSize: 20 }}>all_inclusive</span>
                        </NavLink>
                    </div>

                    <nav className="flex flex-col gap-6 w-full px-4">
                        {primaryNav.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => (
                                    isActive
                                        ? "group flex items-center justify-center p-3 rounded-xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(48,140,232,0.2)] transition-all"
                                        : "group flex items-center justify-center p-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                )}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                                    {materialIconByPath[item.path] || 'apps'}
                                </span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto flex flex-col gap-6 w-full px-4">
                        {secondaryNav.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => (
                                    isActive
                                        ? "group flex items-center justify-center p-3 rounded-xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(48,140,232,0.2)] transition-all"
                                        : "group flex items-center justify-center p-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                )}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                                    {materialIconByPath[item.path] || 'settings'}
                                </span>
                            </NavLink>
                        ))}
                        <NavLink
                            to="/profile"
                            className="w-10 h-10 rounded-full bg-center bg-cover border border-white/10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                            style={{
                                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI')"
                            }}
                        />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 h-full overflow-y-auto p-4 lg:p-8 relative">
                    <header className="flex justify-between items-end mb-8 pl-2">
                        <div>
                            <h2 className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-1">Good Morning</h2>
                            <h1 className="text-3xl lg:text-4xl font-light text-white tracking-tight">Focus Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-400 text-sm backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                System Optimal
                            </div>
                        </div>
                    </header>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 lg:grid-rows-4 gap-6 h-auto lg:h-[calc(100vh-180px)] min-h-[800px]">
                        {/* 1. Identity & Level (Top Left) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                            <div className="flex items-center gap-4 z-10">
                                <div className="w-16 h-16 rounded-full p-[2px] border border-white/10 bg-gradient-to-br from-zinc-800 to-black">
                                    <div
                                        className="w-full h-full rounded-full bg-cover bg-center grayscale contrast-125"
                                        data-alt="User profile portrait in grayscale"
                                        style={{
                                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDW0nS9wE5ojjemFy7PjLHZ7iACDPAQVlSACLvUSLXvjYsvlm_e2cIruMSJJc15M-Q7mOV6ddqyd5zw8PItbsXnSDBpEuy4NIWPfS45BqePFRecRX7tZEW37JjwJbm-b0MGG_I3JdOpdblWi5Y8rHO4Rfgon5_zQTf5rnf9pjIVA8DjtKbhnnEPHCKrMMxX83PDEUdSMaUJwBNQFLa0psQDiqDwd_vAuZ7R-MGEu8_cvVi_FhlUBuqFpzzozzA81Z2we8XYumvNZM0')"
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-medium text-white tracking-tight">Alex V.</h3>
                                    <span className="text-xs text-primary font-medium tracking-wider uppercase">Architect Lvl. 42</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 z-10">
                                <span className="text-3xl font-light text-white tracking-tighter">85%</span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">To Next Lvl</span>
                                <div className="w-24 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-white/80 w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Current Focus Timer (Top Center - Large) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                            <div className="flex justify-between items-start z-10">
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Current Session</span>
                                    <h3 className="text-lg font-light text-white">Deep Work</h3>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400">
                                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 my-4 z-10">
                                <div className="text-6xl lg:text-7xl font-thin text-white tracking-tighter tabular-nums font-display">
                                    01:45:00
                                </div>
                                <div className="text-zinc-500 text-sm font-light tracking-wide">Focus Phase</div>
                            </div>
                            <div className="flex gap-3 z-10">
                                <button type="button" className="flex-1 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-colors">Pause</button>
                                <button type="button" className="px-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">stop</span>
                                </button>
                            </div>

                            {/* Progress Ring decoration */}
                            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] opacity-10 pointer-events-none" viewBox="0 0 100 100">
                                <circle className="text-white" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="0.5" />
                                <circle className="text-white rotate-[-90deg] origin-center" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset="70" strokeWidth="1" />
                            </svg>
                        </div>

                        {/* 3. São Paulo Weather (Top Right) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex items-center justify-between group">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-zinc-500 uppercase tracking-widest">São Paulo</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-light text-white tracking-tighter">24°</span>
                                    <span className="text-zinc-400 font-light">Clear</span>
                                </div>
                            </div>
                            <div className="w-16 h-16 flex items-center justify-center text-primary/80 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[48px] font-thin">sunny</span>
                            </div>
                        </div>

                        {/* 4. Today's Mission (Middle Left - Tall) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-3 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col relative">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs text-zinc-500 uppercase tracking-widest">Today's Mission</span>
                                <span className="text-xs text-zinc-600">3/8</span>
                            </div>
                            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {/* Active Item */}
                                <label className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="relative flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 appearance-none rounded border border-zinc-600 bg-transparent checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 transition-all"
                                        />
                                        <span className="material-symbols-outlined absolute top-1 left-0 pointer-events-none opacity-0 peer-checked:opacity-100 text-white text-[20px]">check</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-sm font-medium leading-tight group-hover:text-primary transition-colors">Review quarterly goals</p>
                                        <span className="text-zinc-500 text-xs">High Priority • 30m</span>
                                    </div>
                                </label>

                                {/* Normal Item */}
                                <label className="group flex gap-4 p-4 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer">
                                    <div className="relative flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 appearance-none rounded border border-zinc-700 bg-transparent checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-zinc-300 text-sm font-normal leading-tight">Client meeting preparation</p>
                                        <span className="text-zinc-600 text-xs">Project Alpha • 1h</span>
                                    </div>
                                </label>

                                {/* Normal Item */}
                                <label className="group flex gap-4 p-4 rounded-xl border border-transparent hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer">
                                    <div className="relative flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 appearance-none rounded border border-zinc-700 bg-transparent checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-zinc-300 text-sm font-normal leading-tight">Read 20 pages</p>
                                        <span className="text-zinc-600 text-xs">Learning • 45m</span>
                                    </div>
                                </label>

                                {/* Completed Item */}
                                <label className="group flex gap-4 p-4 rounded-xl border border-transparent opacity-50 hover:opacity-100 transition-all cursor-pointer">
                                    <div className="relative flex items-start pt-1">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="peer h-5 w-5 appearance-none rounded border border-zinc-700 bg-transparent checked:border-zinc-500 checked:bg-zinc-600 focus:ring-0 focus:ring-offset-0 transition-all"
                                        />
                                        <span className="material-symbols-outlined absolute top-1 left-0 pointer-events-none opacity-0 peer-checked:opacity-100 text-white text-[20px]">check</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-zinc-500 text-sm font-normal leading-tight line-through decoration-zinc-600">Morning meditation</p>
                                        <span className="text-zinc-700 text-xs">Done at 07:00</span>
                                    </div>
                                </label>
                            </div>
                            <button type="button" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-white/10 text-zinc-500 text-xs uppercase tracking-wide hover:border-white/20 hover:text-white transition-all">
                                <span className="material-symbols-outlined text-[16px]">add</span> Add Task
                            </button>
                        </div>

                        {/* 5. Neural Resonance (Middle Center) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative">
                            <div className="flex justify-between items-start z-10">
                                <span className="text-xs text-zinc-500 uppercase tracking-widest">Neural Resonance</span>
                                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                {/* Abstract wave visual */}
                                <div className="flex items-end gap-1 h-12">
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-4 animate-[pulse_1s_ease-in-out_infinite]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-8 animate-[pulse_1.2s_ease-in-out_infinite_0.1s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-12 animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-6 animate-[pulse_1.5s_ease-in-out_infinite_0.3s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-10 animate-[pulse_1.1s_ease-in-out_infinite_0.4s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-5 animate-[pulse_0.9s_ease-in-out_infinite_0.5s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-8 animate-[pulse_1.3s_ease-in-out_infinite_0.6s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-3 animate-[pulse_1s_ease-in-out_infinite_0.7s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-6 animate-[pulse_1.4s_ease-in-out_infinite_0.8s]" />
                                    <div className="w-1 bg-indigo-400/80 rounded-full h-9 animate-[pulse_1.1s_ease-in-out_infinite_0.9s]" />
                                </div>
                            </div>
                            <div className="z-10 mt-8">
                                <p className="text-zinc-300 text-sm font-light">Peak cognitive flow detected.</p>
                                <p className="text-zinc-500 text-xs mt-1">Suggested break in 45m.</p>
                            </div>
                        </div>

                        {/* 6. Markets (Middle Right) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest">Markets</span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-xl text-white font-medium tracking-tight">SPX</span>
                                        <span className="text-sm text-green-400/80">+1.24%</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-zinc-600">show_chart</span>
                            </div>
                            <div className="h-12 w-full mt-4 flex items-end gap-[2px]">
                                {/* Fake Sparkline */}
                                <div className="flex-1 bg-zinc-800/50 h-[20%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[30%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[25%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[40%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[50%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[45%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[60%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[55%] rounded-t-sm" />
                                <div className="flex-1 bg-zinc-800/50 h-[70%] rounded-t-sm" />
                                <div className="flex-1 bg-primary/40 h-[85%] rounded-t-sm shadow-[0_0_10px_rgba(48,140,232,0.3)]" />
                            </div>
                        </div>

                        {/* 7. Achievements (Bottom Middle) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-center">
                            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Achievements</span>
                            <div className="flex justify-between items-center px-2">
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600/20 to-yellow-900/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Streak</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[20px]">psychology</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Focus</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Health</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[20px]">lock</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Locked</span>
                                </div>
                            </div>
                        </div>

                        {/* 8. Quick Stats / Mini (Bottom Right) */}
                        <div className="glass-card md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-2xl bg-glass-surface backdrop-blur-xl border border-white/10 p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-zinc-500 uppercase tracking-widest">Efficiency</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-light text-white tracking-tight">92<span className="text-sm">%</span></span>
                                    <span className="text-xs text-zinc-500">Weekly Avg</span>
                                </div>
                            </div>
                            <div className="w-20 h-20 relative flex items-center justify-center">
                                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                                    <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-primary drop-shadow-[0_0_5px_rgba(48,140,232,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="92, 100" strokeWidth="3" />
                                </svg>
                                <span className="material-symbols-outlined absolute text-zinc-500 text-[18px]">speed</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
