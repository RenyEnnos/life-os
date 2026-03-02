import { useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';

type PreferenceKey = 'emailNotifications' | 'publicProfile' | 'autoFocus';

export default function PreferencesTab() {
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
        <section className="flex flex-col gap-8 animate-[fadeIn_0.4s_ease-out_forwards]">
            <div className="bg-glass-surface backdrop-blur-xl border border-glass-border rounded-2xl p-6 lg:p-8 flex flex-col gap-8 shadow-2xl">
                <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-6">Workspace Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-zinc-400 font-medium ml-1">Display Name</label>
                            <input
                                className="glass-input rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all bg-zinc-900/60 border border-white/10"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-zinc-400 font-medium ml-1">Workspace Handle</label>
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
                    </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-6">Operational Preferences</h3>
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
                                    <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner transition-colors duration-300" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 lg:p-8 flex flex-col gap-4 shadow-lg">
                <h3 className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-zinc-400 leading-relaxed">Permanently remove your Personal Workspace and all of its contents. This action is not reversible.</p>
                    <button className="px-4 py-2 rounded-lg border border-red-500/30 text-[10px] font-medium text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap uppercase tracking-widest">
                        Delete Workspace
                    </button>
                </div>
            </div>
        </section>
    );
}
