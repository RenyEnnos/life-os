import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ListTodo,
  CalendarClock,
  Flame,
  HeartPulse,
  Wallet2,
  FolderKanban,
  BookOpen,
  Trophy,
  GraduationCap,
  Settings,
} from 'lucide-react';

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Tarefas', path: '/tasks', icon: ListTodo },
  { label: 'Calendário', path: '/calendar', icon: CalendarClock },
  { label: 'Hábitos', path: '/habits', icon: Flame },
  { label: 'Saúde', path: '/health', icon: HeartPulse },
  { label: 'Finanças', path: '/finances', icon: Wallet2 },
  { label: 'Projetos', path: '/projects', icon: FolderKanban },
  { label: 'Jornal', path: '/journal', icon: BookOpen },
  { label: 'Recompensas', path: '/rewards', icon: Trophy },
  { label: 'Universidade', path: '/university', icon: GraduationCap },
];

export const secondaryNav: NavItem[] = [
  { label: 'Configurações', path: '/settings', icon: Settings },
];

// Compact list for the mobile dock (avoid overcrowding)
export const mobileNav: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Tarefas', path: '/tasks', icon: ListTodo },
  { label: 'Calendário', path: '/calendar', icon: CalendarClock },
  { label: 'Hábitos', path: '/habits', icon: Flame },
  { label: 'Saúde', path: '/health', icon: HeartPulse },
  { label: 'Finanças', path: '/finances', icon: Wallet2 },
  { label: 'Projetos', path: '/projects', icon: FolderKanban },
];
