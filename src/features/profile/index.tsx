import { useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { cn } from '@/shared/lib/cn';

const profileAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI";

type Badge = { icon: string; label: string; color?: string };

export default function ProfilePage() {
    const { user } = useAuth();
    const [bio, setBio] = useState("Building digital cathedrals for the modern era. Focused on minimalist design and high-performance systems.");
    const fullName = user?.name || "Alex Morgan";
    const email = user?.email || "alex.morgan@focusdashboard.co";
    const username = user?.email ? user.email.split('@')[0] : "alexm_builder";

    const stats = useMemo(() => ({
        level: 42,
        tier: "Gold Tier",
        currentXp: 2400,
        nextXp: 5000,
        streak: 14,
        totalFocus: "842h",
        weeklyGain: "+12h this week",
    }), []);

    const badges: Badge[] = [
        { icon: 'star', label: 'Pioneer', color: 'text-amber-300' },
        { icon: 'local_fire_department', label: 'Flame Keeper', color: 'text-orange-400' },
        { icon: 'psychology', label: 'Deep Focus', color: 'text-blue-400' },
    ];

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden">
            

            <div className="relative flex h-full w-full overflow-hidden z-10">


                <main className="flex-1 h-full overflow-y-auto relative p-4 lg:p-10 flex flex-col gap-10 custom-scrollbar">
                    <header className="w-full max-w-6xl mx-auto flex justify-between items-end animate-enter">
                        <div>
                            <h2 className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mb-1">Identity System</h2>
                            <h1 className="text-4xl font-light text-white tracking-tight">User Identity & Legacy</h1>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">share</span>
                                Share Profile
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">settings</span>
                                Settings
                            </button>
                        </div>
                    </header>

                    <section className="w-full max-w-6xl mx-auto animate-enter animate-enter-delay-1">
                        <div className="group relative w-full rounded-3xl border border-white/5 bg-zinc-900/30 p-8 lg:p-12 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/40 overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <div className="relative cursor-pointer">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-900 border-2 border-white/10 relative overflow-hidden shadow-[0_0_0_2px_rgba(5,5,5,1),0_0_0_4px_rgba(48,140,232,0.3),0_0_30px_rgba(48,140,232,0.2)]">
                                        <img
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                            src={user?.avatar_url || profileAvatar}
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-yellow-400 shadow-lg" title="Premium Member">
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter">{fullName}</h2>
                                        <span className="border border-purple-500/30 bg-purple-500/10 text-purple-300 uppercase tracking-widest text-[10px] py-1 px-3 rounded-full font-medium">
                                            Architect
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 text-sm mb-4 font-mono tracking-wide">@{username}</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {badges.map((badge) => (
                                            <div
                                                key={badge.label}
                                                className="h-10 px-4 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                                            >
                                                <span className={cn("material-symbols-outlined text-[18px]", badge.color || "text-zinc-300")}>{badge.icon}</span>
                                                <span className="text-xs text-zinc-300">{badge.label}</span>
                                            </div>
                                        ))}
                                        <button className="h-10 w-10 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center transition-all text-zinc-500 hover:text-white">
                                            <span className="material-symbols-outlined text-[20px]">add</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden lg:flex flex-col items-end justify-center gap-2 min-w-[140px]">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-600">Latest Unlock</span>
                                    <div className="p-3 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-white/10 shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-yellow-500 text-3xl drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">military_tech</span>
                                    </div>
                                    <span className="text-xs text-zinc-400">Master Strategist</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-enter animate-enter-delay-2">
                        <MetricCard
                            title="Experience"
                            icon="hotel_class"
                            badge="Gold Tier"
                            primary={`${stats.level} Lvl`}
                            secondary="Gold Tier"
                            barPercent={Math.min(100, Math.round((stats.currentXp / stats.nextXp) * 100))}
                            prefixLeft={`${stats.currentXp} XP`}
                            prefixRight={`${stats.nextXp} XP`}
                            glowColor="bg-yellow-500/10"
                        />
                        <MetricCard
                            title="Momentum"
                            icon="local_fire_department"
                            badge="Current Streak"
                            primary={`${stats.streak} Days`}
                            secondary="Current Streak"
                            ringPercent={stats.streak}
                            glowColor="bg-orange-500/10"
                            iconColor="text-orange-500/70"
                        />
                        <MetricCard
                            title="Total Focus"
                            icon="timelapse"
                            badge="Lifetime"
                            primary={stats.totalFocus}
                            secondary={stats.weeklyGain}
                            sparkLine
                            glowColor="bg-primary/10"
                            iconColor="text-primary"
                        />
                    </section>

                    <section className="w-full max-w-6xl mx-auto flex-1 pb-10 animate-enter animate-enter-delay-3">
                        <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="material-symbols-outlined text-zinc-500">lock_open</span>
                                <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">Data Vault</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="col-span-1 md:col-span-2 group">
                                    <label className="block text-xs text-zinc-600 uppercase tracking-wider mb-2">Bio / Mission</label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full bg-transparent border border-transparent rounded-lg text-zinc-300 text-lg font-light resize-none focus:ring-0 p-2 -ml-2 transition-all placeholder-zinc-700 hover:bg-zinc-800/40 focus:bg-zinc-800/50 focus:border-white/10"
                                            rows={2}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                        <div className="absolute top-2 right-2 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </div>
                                    </div>
                                </div>

                                <VaultField label="Base of Operations" icon="location_on" value="San Francisco, CA" />
                                <VaultField label="Digital Uplink" icon="link" value="alexmorgan.design" valueClass="text-primary hover:underline cursor-pointer" />
                                <VaultField label="Code Repository" icon="code" value="github.com/alexm_builds" />
                                <VaultField label="Contact" icon="mail" value={email} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

function MetricCard(props: {
    title: string;
    icon: string;
    badge: string;
    primary: string;
    secondary: string;
    barPercent?: number;
    ringPercent?: number;
    sparkLine?: boolean;
    glowColor?: string;
    iconColor?: string;
    prefixLeft?: string;
    prefixRight?: string;
}) {
    const {
        title,
        icon,
        badge,
        primary,
        secondary,
        barPercent,
        ringPercent,
        sparkLine,
        glowColor = 'bg-primary/10',
        iconColor = 'text-level-gold',
        prefixLeft,
        prefixRight,
    } = props;

    return (
        <div className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col justify-between overflow-hidden hover:border-white/20 transition-all duration-300 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start z-10">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{title}</span>
                <span className={cn("material-symbols-outlined", iconColor)}>{icon}</span>
            </div>
            <div className="mt-6 z-10">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light text-white tracking-tighter">{primary}</span>
                    <span className="text-sm text-zinc-500">{badge}</span>
                </div>
                <span className="text-xs text-zinc-500 block mt-1">{secondary}</span>
                {typeof barPercent === 'number' && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-zinc-500 mb-2 font-mono">
                            <span>{prefixLeft || ''}</span>
                            <span>{prefixRight || ''}</span>
                        </div>
                        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-level-gold/60 to-level-gold rounded-full relative shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                style={{ width: `${barPercent}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                    </div>
                )}
                {typeof ringPercent === 'number' && (
                    <div className="mt-4 flex items-center gap-4">
                        <div className="h-16 w-16 relative flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                                <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${ringPercent}, 100`} strokeLinecap="round" strokeWidth="3" />
                            </svg>
                        </div>
                    </div>
                )}
                {sparkLine && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0 64 L10 50 L30 55 L50 30 L70 40 L90 10 L100 25 L120 5 L140 20 L160 0 L180 30 L200 10 L220 40 L240 20 L300 64 Z" fill="url(#gradient-blue)" />
                            <defs>
                                <linearGradient id="gradient-blue" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#308ce8', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#308ce8', stopOpacity: 0 }} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                )}
            </div>
            <div className={cn("absolute -right-10 -bottom-10 w-32 h-32 blur-[50px] rounded-full pointer-events-none transition-all duration-500", glowColor)} />
        </div>
    );
}

function VaultField({ label, icon, value, valueClass }: { label: string; icon: string; value: string; valueClass?: string }) {
    return (
        <div className="group">
            <label className="block text-xs text-zinc-600 uppercase tracking-wider mb-2">{label}</label>
            <div className="relative flex items-center">
                <span className="material-symbols-outlined text-zinc-600 mr-2 text-[20px]">{icon}</span>
                <input
                    className={cn(
                        "w-full bg-transparent border border-transparent rounded-lg text-zinc-300 text-base font-normal focus:ring-0 p-2 -ml-2 transition-all placeholder-zinc-700 hover:bg-zinc-800/40 focus:bg-zinc-800/50 focus:border-white/10",
                        valueClass
                    )}
                    type="text"
                    value={value}
                    readOnly
                />
                <div className="absolute top-2 right-2 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </div>
            </div>
        </div>
    );
}
