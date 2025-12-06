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
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';
import ThemeToggle from '@/shared/ui/ThemeToggle';

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
            "fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-50 transition-transform transition-colors transition-all duration-300 md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight font-sans">Life OS</h1>
                    <p className="text-xs text-mutedForeground mt-1 font-sans">v1.0.0</p>
                </div>
                <button onClick={onClose} className="md:hidden text-mutedForeground hover:text-foreground">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 transition-colors transition-all duration-300">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => onClose?.()}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 font-sans text-sm ${isActive
                                ? 'bg-muted text-foreground border border-border'
                                : 'text-mutedForeground hover:bg-muted hover:text-foreground border border-transparent'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="mb-3 flex justify-between items-center">
                    <span className="text-xs text-mutedForeground font-sans">Tema</span>
                    <ThemeToggle inline />
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-mutedForeground hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut size={18} />
                    Encerrar Sessão
                </Button>
            </div>
        </aside>
    );
}
