import React from 'react';

export const HealthPage = () => {
    return (
        <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">

            <div className="flex h-screen w-full">
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto bg-background-dark p-8">
                    {/* Header */}
                    <header className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-1">Health Center</h2>
                            <div className="flex items-center gap-2 text-white/40">
                                <span className="material-symbols-outlined text-sm text-activity-green">watch</span>
                                <span className="text-sm font-medium">Connected to Watch Ultra</span>
                            </div>
                        </div>
                        <button className="glass px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Refresh Vitals
                        </button>
                    </header>
                    {/* Top Vitals Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Heart Rate Widget */}
                        <div className="glass p-6 rounded-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-white/50 text-sm font-medium">Heart Rate</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <h3 className="text-3xl font-black">65</h3>
                                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest">bpm</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-vital-red/10 flex items-center justify-center text-vital-red">
                                    <span className="material-symbols-outlined">favorite</span>
                                </div>
                            </div>
                            <div className="h-24 w-full flex items-end">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                    <path d="M0,30 Q10,10 20,25 T40,15 T60,20 T80,5 T100,25" fill="none" stroke="#f43f5e" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                    <path d="M0,30 Q10,10 20,25 T40,15 T60,20 T80,5 T100,25 L100,40 L0,40 Z" fill="url(#grad-red)" opacity="0.1"></path>
                                    <defs>
                                        <linearGradient id="grad-red" x1="0%" x2="0%" y1="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: "#f43f5e", stopOpacity: "1" }}></stop>
                                            <stop offset="100%" style={{ stopColor: "#f43f5e", stopOpacity: "0" }}></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="mt-4 flex justify-between text-[10px] text-white/30 font-bold uppercase">
                                <span>12 am</span>
                                <span>8 am</span>
                                <span>4 pm</span>
                                <span>Now</span>
                            </div>
                        </div>
                        {/* Sleep Score Widget */}
                        <div className="glass p-6 rounded-lg flex items-center gap-6">
                            <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="#60a5fa" strokeDasharray="251.2" strokeDashoffset="30" strokeWidth="8"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black leading-none">88</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm font-medium">Sleep Score</p>
                                <h3 className="text-xl font-bold mt-1">Good Quality</h3>
                                <div className="flex items-center gap-1.5 mt-2 text-sleep-blue">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="text-sm font-semibold">7h 45m</span>
                                </div>
                            </div>
                        </div>
                        {/* Steps Widget */}
                        <div className="glass p-6 rounded-lg flex items-center gap-6">
                            <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                                    <circle cx="48" cy="48" fill="none" r="40" stroke="#4ade80" strokeDasharray="251.2" strokeDashoffset="40" strokeWidth="8"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="material-symbols-outlined text-activity-green">directions_run</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm font-medium">Daily Steps</p>
                                <h3 className="text-xl font-bold mt-1">8,432</h3>
                                <p className="text-white/30 text-xs font-bold uppercase mt-1">Goal: 10,000</p>
                                <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-activity-green w-[84%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                        {/* Middle Section: Workout Log */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <h4 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Workout Log
                            </h4>
                            <div className="glass rounded-lg overflow-hidden divide-y divide-white/5">
                                {/* Workout Item 1 */}
                                <div className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined">fitness_center</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold">Upper Body Strength</h5>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">timer</span> 1h 10m
                                            </span>
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">local_fire_department</span> 450 kcal
                                            </span>
                                        </div>
                                    </div>
                                    <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                                {/* Workout Item 2 */}
                                <div className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined">running_with_errors</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold">Morning Run</h5>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">timer</span> 25m
                                            </span>
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">route</span> 5km
                                            </span>
                                        </div>
                                    </div>
                                    <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                                {/* Workout Item 3 */}
                                <div className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined">pool</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold">Laps Session</h5>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">timer</span> 45m
                                            </span>
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">waves</span> 1.2km
                                            </span>
                                        </div>
                                    </div>
                                    <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Right Section: Nutrition */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-400">restaurant_menu</span>
                                Nutrition
                            </h4>
                            <div className="glass p-6 rounded-lg flex-1">
                                <div className="text-center mb-8">
                                    <p className="text-white/50 text-sm font-medium">Daily Calories</p>
                                    <h3 className="text-3xl font-black mt-1">1,800 <span className="text-sm font-normal text-white/30">/ 2,400 kcal</span></h3>
                                    <div className="mt-4 h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[75%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {/* Protein */}
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                Protein
                                            </span>
                                            <span>145g <span className="text-white/30 text-xs">/ 180g</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[80%] rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Carbs */}
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-activity-green"></span>
                                                Carbs
                                            </span>
                                            <span>210g <span className="text-white/30 text-xs">/ 250g</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-activity-green w-[84%] rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Fats */}
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                                Fats
                                            </span>
                                            <span>55g <span className="text-white/30 text-xs">/ 70g</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-400 w-[78%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <button className="w-full glass py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                                        Add Log Entry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};
