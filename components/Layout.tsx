import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Tasks & Calendar', path: '/tasks', icon: 'calendar_month' },
    { label: 'Habits', path: '/habits', icon: 'check_circle' },
    { label: 'Health', path: '/health', icon: 'favorite' },
    { label: 'Finances', path: '/finance', icon: 'account_balance_wallet' },
    { label: 'Journal', path: '/journal', icon: 'auto_stories' },
    { label: 'Rewards', path: '/rewards', icon: 'military_tech' }, // Life Score
    { label: 'Settings', path: '/settings', icon: 'settings' },
];

const SidebarItem: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => (
    <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 border-l-2 ${
            isActive
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-transparent text-white/80 hover:bg-white/5 hover:text-white'
        }`}
    >
        <span 
            className="material-symbols-outlined" 
            style={{ fontVariationSettings: isActive || item.activeIcon ? "'FILL' 1" : "'FILL' 0" }}
        >
            {item.icon}
        </span>
        <p className="text-sm font-medium leading-normal font-display">{item.label}</p>
    </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-background-dark text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-[#224922] bg-[#102310] flex-shrink-0">
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-6">
                        {/* Profile Snippet */}
                        <div className="flex items-center gap-3 p-2 pb-6 border-b border-[#224922]">
                            <div 
                                className="bg-center bg-no-repeat bg-cover rounded-sm size-10 ring-1 ring-primary/50"
                                style={{ backgroundImage: 'url("https://picsum.photos/200")' }}
                            ></div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-base font-bold font-display">Dev User</h1>
                                <p className="text-primary text-xs font-mono">user@life-os.dev</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <SidebarItem 
                                    key={item.path} 
                                    item={item} 
                                    isActive={location.pathname === item.path} 
                                />
                            ))}
                        </nav>
                    </div>

                    {/* Footer / Logout */}
                    <div className="flex flex-col gap-1 border-t border-[#224922] pt-4">
                         <button className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-colors group">
                            <span className="material-symbols-outlined group-hover:animate-pulse">logout</span>
                            <p className="text-sm font-medium leading-normal font-display">System Shutdown</p>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
             {/* Note: Ideally this would toggle a mobile drawer, but keeping simple for this iteration */}
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative scroll-smooth">
                {/* Decorative Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: 'linear-gradient(#0df20d 1px, transparent 1px), linear-gradient(90deg, #0df20d 1px, transparent 1px)', 
                        backgroundSize: '40px 40px' 
                    }}>
                </div>
                
                <div className="relative z-10 p-4 lg:p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
