import { useState } from 'react';
import AccessibilitySettings from './components/AccessibilitySettings';
import IdentityTab from './components/IdentityTab';
import PreferencesTab from './components/PreferencesTab';
import AppearanceTab from './components/AppearanceTab';

type SettingsSection = 'identity' | 'preferences' | 'accessibility' | 'appearance' | 'integrations' | 'data';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('identity');

    const handleSectionChange = (section: SettingsSection) => {
        setActiveSection(section);
    };

    return (
        <div className="dashboard-shell relative h-screen w-full overflow-hidden bg-background-dark/80">
            {/* Background elements */}
            <div className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

            <div className="relative flex h-full w-full overflow-hidden z-10">
                <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
                    {/* Sidebar navigation */}
                    <div className="w-full lg:w-64 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-900/10 backdrop-blur-md z-20">
                        <div className="p-6 pb-2 hidden lg:block">
                            <h1 className="text-xl font-medium text-white tracking-tight">User Hub</h1>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Workspace Control</p>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="lg:hidden w-full overflow-x-auto no-scrollbar flex items-center gap-4 px-4 py-4 border-b border-white/5">
                            {[
                                { id: 'identity', label: 'Identity' },
                                { id: 'preferences', label: 'Preferences' },
                                { id: 'accessibility', label: 'Accessibility' },
                                { id: 'appearance', label: 'Appearance' },
                                { id: 'integrations', label: 'Integrations' },
                                { id: 'data', label: 'Data' }
                            ].map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionChange(section.id as SettingsSection)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                                        activeSection === section.id
                                            ? 'bg-white/5 text-white border border-white/5'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex flex-col gap-1 p-4 mt-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-600 px-3 mb-2 font-semibold">Profile</div>
                            <button
                                onClick={() => handleSectionChange('identity')}
                                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 text-xs rounded-lg transition-all ${
                                    activeSection === 'identity'
                                        ? 'text-white bg-white/5 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                {activeSection === 'identity' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />}
                                <span className={`material-symbols-outlined text-[18px] ${activeSection === 'identity' ? 'text-primary' : ''}`}>badge</span>
                                Identity
                            </button>
                            
                            <div className="text-[10px] uppercase tracking-widest text-zinc-600 px-3 mt-6 mb-2 font-semibold">Settings</div>
                            <button
                                onClick={() => handleSectionChange('preferences')}
                                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 text-xs rounded-lg transition-all ${
                                    activeSection === 'preferences'
                                        ? 'text-white bg-white/5 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                {activeSection === 'preferences' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />}
                                <span className={`material-symbols-outlined text-[18px] ${activeSection === 'preferences' ? 'text-primary' : ''}`}>tune</span>
                                Preferences
                            </button>
                            <button
                                onClick={() => handleSectionChange('accessibility')}
                                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 text-xs rounded-lg transition-all ${
                                    activeSection === 'accessibility'
                                        ? 'text-white bg-white/5 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                {activeSection === 'accessibility' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />}
                                <span className={`material-symbols-outlined text-[18px] ${activeSection === 'accessibility' ? 'text-primary' : ''}`}>accessibility_new</span>
                                Accessibility
                            </button>
                            <button
                                onClick={() => handleSectionChange('appearance')}
                                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 text-xs rounded-lg transition-all ${
                                    activeSection === 'appearance'
                                        ? 'text-white bg-white/5 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">palette</span>
                                Appearance
                            </button>
                            <button
                                onClick={() => handleSectionChange('integrations')}
                                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 text-xs rounded-lg transition-all ${
                                    activeSection === 'integrations'
                                        ? 'text-white bg-white/5 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">extension</span>
                                Integrations
                            </button>
                            <button
                                onClick={() => handleSectionChange('data')}
                                className={`group relative flex items-center gap-3 w-full px-3 py-2.5 text-xs rounded-lg transition-all ${
                                    activeSection === 'data'
                                        ? 'text-white bg-white/5 font-medium'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                                Data &amp; Sync
                            </button>
                        </nav>

                        <div className="mt-auto p-4 hidden lg:block">
                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 rounded-xl p-4 shadow-lg">
                                <p className="text-[10px] text-white font-medium mb-1 uppercase tracking-wider">Upgrade Plan</p>
                                <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">Unlock advanced analytics and unlimited focus sessions.</p>
                                <button className="w-full py-1.5 text-[10px] bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-widest">View Plans</button>
                            </div>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-10 relative custom-scrollbar">
                        <div className="max-w-4xl mx-auto w-full pb-24 space-y-10">
                            {activeSection === 'identity' && <IdentityTab />}
                            {activeSection === 'preferences' && <PreferencesTab />}
                            {activeSection === 'accessibility' && <AccessibilitySettings />}
                            {activeSection === 'appearance' && <AppearanceTab />}

                            {['integrations', 'data'].includes(activeSection) && (
                                <section className="flex flex-col items-center justify-center gap-4 py-20 animate-[fadeIn_0.4s_ease-out_forwards]">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-2">
                                        <span className="material-symbols-outlined text-3xl text-zinc-600">construction</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Coming Soon</h2>
                                    <p className="text-sm text-zinc-500 max-w-xs text-center leading-relaxed">
                                        The {activeSection} controls are being calibrated for peak performance.
                                    </p>
                                </section>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
