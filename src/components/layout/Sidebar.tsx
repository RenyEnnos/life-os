import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Repeat,
    Book,
    Heart,
    DollarSign,
    Briefcase,
    Trophy,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { logout } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Hábitos', path: '/habits', icon: Repeat },
        { label: 'Tarefas', path: '/tasks', icon: CheckSquare },
        { label: 'Diário', path: '/journal', icon: Book },
        { label: 'Saúde', path: '/health', icon: Heart },
        { label: 'Finanças', path: '/finances', icon: DollarSign },
        { label: 'Projetos', path: '/projects', icon: Briefcase },
        { label: 'Recompensas', path: '/rewards', icon: Trophy },
        { label: 'Configurações', path: '/settings', icon: Settings },
    ];

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-50 transition-transform duration-300 md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary tracking-widest font-mono glow-text">
                        LIFE OS
                    </h1>
                    <p className="text-xs text-gray-500 mt-1 font-mono">v1.0.0 // SYSTEM_ACTIVE</p>
                </div>
                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-primary">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => onClose?.()}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md transition-all font-mono text-sm group ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/50 shadow-[0_0_10px_rgba(13,242,13,0.1)]'
                                : 'text-gray-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 border border-transparent'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-400 hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut size={18} />
                    Encerrar Sessão
                </Button>
            </div>
        </aside>
    );
}
