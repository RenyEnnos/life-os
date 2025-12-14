import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav } from '@/app/layout/navItems';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { cn } from '@/shared/lib/cn';

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

type PreferenceKey = 'emailNotifications' | 'publicProfile' | 'autoFocus';

export default function SettingsPage() {
    const { user } = useAuth();
    const [toggles, setToggles] = useState<Record<PreferenceKey, boolean>>({
        emailNotifications: true,
        publicProfile: false,
        autoFocus: true,
    });

    const [fullName, setFullName] = useState(user?.name || 'Alex Morgan');
    const [username, setUsername] = useState(user?.email?.split('@')[0] || 'alexm');
    const [bio, setBio] = useState('Product Designer focusing on minimal interfaces and deep work productivity.');

    const email = user?.email || 'alex.morgan@focusdashboard.co';

    const preferenceList = useMemo(() => ([
        {
            key: 'emailNotifications' as PreferenceKey,
            title: 'Email Notifications',
            description: 'Receive weekly digests about your productivity stats.',
        },
        {
            key: 'publicProfile' as PreferenceKey,
            title: 'Public Profile',
            description: 'Allow others to see your focus streaks.',
        },
        {
            key: 'autoFocus' as PreferenceKey,
            title: 'Focus Mode Auto-Start',
            description: 'Automatically enter DND when timer starts.',
        },
    ]), []);

    const handleToggle = (key: PreferenceKey) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden">
            <div className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">


                <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-background-dark/80">
                    <div className="w-full lg:w-64 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-900/10 backdrop-blur-md z-20">
                        <div className="p-6 pb-2 hidden lg:block">
                            <h1 className="text-xl font-medium text-white tracking-tight">Settings</h1>
                            <p className="text-xs text-zinc-500 mt-1">Manage your workspace</p>
                        </div>

                        <div className="lg:hidden w-full overflow-x-auto no-scrollbar flex items-center gap-4 px-4 py-4 border-b border-white/5">
                            <button className="whitespace-nowrap px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium border border-white/5">Account</button>
                            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm font-medium">General</button>
                            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm font-medium">Appearance</button>
                            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm font-medium">Integrations</button>
                            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-sm font-medium">Data &amp; Sync</button>
                        </div>

                        <nav className="hidden lg:flex flex-col gap-1 p-4 mt-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-600 px-3 mb-2 font-semibold">Preferences</div>
                            <button className="group relative flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-all">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                General
                            </button>
                            <button className="group relative flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-white rounded-lg bg-white/5 transition-all">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                                <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                                Account
                            </button>
                            <button className="group relative flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-all">
                                <span className="material-symbols-outlined text-[18px]">palette</span>
                                Appearance
                            </button>
                            <button className="group relative flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-all">
                                <span className="material-symbols-outlined text-[18px]">extension</span>
                                Integrations
                            </button>
                            <button className="group relative flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-white/5 transition-all">
                                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                                Data &amp; Sync
                            </button>
                        </nav>

                        <div className="mt-auto p-4 hidden lg:block">
                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 rounded-xl p-4 shadow-lg">
                                <p className="text-xs text-white font-medium mb-1">Upgrade Plan</p>
                                <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">Unlock advanced analytics and unlimited focus sessions.</p>
                                <button className="w-full py-1.5 text-xs bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors">View Plans</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-10 relative">
                        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 animate-[fadeIn_0.4s_ease-out_forwards]">
                            <span className="material-symbols-outlined text-green-500 text-[14px]">check</span>
                            <span className="text-xs text-zinc-500 font-medium">Saved</span>
                        </div>

                        <div className="max-w-5xl mx-auto w-full pb-24 space-y-10 animate-[fadeIn_0.4s_ease-out_forwards]">
                            <section className="flex flex-col gap-8">
                                <div className="bg-glass-surface backdrop-blur-xl border border-glass-border rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                                    <div className="relative shrink-0">
                                        <div
                                            className="w-20 h-20 rounded-full border-2 border-white/10 bg-zinc-800 bg-cover bg-center shadow-2xl"
                                            style={{ backgroundImage: `url('${profileAvatar}')` }}
                                        />
                                        <button className="absolute bottom-0 right-0 w-7 h-7 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">camera_alt</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-start flex-1 gap-1 text-center sm:text-left">
                                        <h2 className="text-xl font-semibold text-white">{fullName}</h2>
                                        <p className="text-sm text-zinc-500 font-light">{email}</p>
                                        <div className="mt-4 flex gap-3">
                                            <button className="px-4 py-2 rounded-lg border border-white/10 text-xs font-medium text-white hover:bg-white/5 transition-colors">Edit Profile</button>
                                            <button className="px-4 py-2 rounded-lg border border-transparent text-xs font-medium text-zinc-400 hover:text-white transition-colors">View Public Page</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-glass-surface backdrop-blur-xl border border-glass-border rounded-2xl p-6 lg:p-8 flex flex-col gap-8 shadow-2xl">
                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-zinc-400 font-medium ml-1">Full Name</label>
                                                <input
                                                    className="glass-input rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all bg-zinc-900/60 border border-white/10"
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-zinc-400 font-medium ml-1">Username</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">@</span>
                                                    <input
                                                        className="glass-input rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-zinc-600 transition-all bg-zinc-900/60 border border-white/10 w-full"
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 md:col-span-2">
                                                <label className="text-xs text-zinc-400 font-medium ml-1">Bio</label>
                                                <textarea
                                                    className="glass-input rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all bg-zinc-900/60 border border-white/10 resize-none"
                                                    rows={3}
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                />
                                                <p className="text-[10px] text-zinc-600 text-right">{bio.length}/250 characters</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-white/5" />

                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">Preferences</h3>
                                        <div className="flex flex-col gap-6">
                                            {preferenceList.map((pref) => (
                                                <div key={pref.key} className="flex items-center justify-between gap-4">
                                                    <div className="flex flex-col gap-1 pr-4">
                                                        <span className="text-sm font-medium text-white">{pref.title}</span>
                                                        <span className="text-xs text-zinc-500">{pref.description}</span>
                                                    </div>
                                                    <label className="flex items-center cursor-pointer relative" htmlFor={pref.key}>
                                                        <input
                                                            className="sr-only peer"
                                                            id={pref.key}
                                                            type="checkbox"
                                                            checked={toggles[pref.key]}
                                                            onChange={() => handleToggle(pref.key)}
                                                        />
                                                        <div className="w-12 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner transition-colors duration-300" />
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 lg:p-8 flex flex-col gap-4 shadow-lg">
                                    <h3 className="text-xs uppercase tracking-widest text-rose-400 font-semibold">Danger Zone</h3>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <p className="text-sm text-zinc-400">Permanently remove your Personal Workspace and all of its contents. This action is not reversible.</p>
                                        <button className="px-4 py-2 rounded-lg border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap">
                                            Delete Workspace
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
