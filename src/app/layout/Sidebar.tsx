import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    Book,
    Target,
    CreditCard,
    Activity,
    GraduationCap,
    Settings,
    LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';

// Menu configuration remains static
const menuItems = [
    { icon: LayoutDashboard, path: '/', label: 'Dashboard' },
    { icon: CheckSquare, path: '/tasks', label: 'Tasks' },
    { icon: Calendar, path: '/calendar', label: 'Calendar' },
    { icon: Book, path: '/journal', label: 'Journal' },
    { icon: Target, path: '/habits', label: 'Habits' },
    { icon: CreditCard, path: '/finances', label: 'Finances' },
    { icon: Activity, path: '/health', label: 'Health' },
    { icon: GraduationCap, path: '/university', label: 'University' },
];

export const Sidebar = () => {
    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            // ATUALIZAÇÃO AQUI: Classes glass-panel e bg-noise aplicadas
            className="fixed left-4 top-4 bottom-4 w-20 flex flex-col items-center justify-between py-6 rounded-2xl glass-panel bg-noise z-50"
        >
            {/* Logo Area */}
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                    <div className="w-5 h-5 bg-zinc-100 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col gap-3 mt-4 w-full px-3">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group relative",
                                // Lógica de estado ativo refinada para o tema Glass
                                isActive
                                    ? "glass-active shadow-lg shadow-black/20"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={22}
                                        strokeWidth={isActive ? 2 : 1.5}
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />
                                    {/* Tooltip simples (opcional, pode ser componente separado) */}
                                    <span className="absolute left-14 bg-surface border border-white/10 px-2 py-1 rounded text-[10px] uppercase tracking-wider text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 w-full px-3">
                <button className="w-12 h-12 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all">
                    <Settings size={22} strokeWidth={1.5} />
                </button>

                {/* User Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 mx-auto" />
            </div>
        </motion.aside>
    );
};
